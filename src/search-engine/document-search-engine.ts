import Papa from "papaparse";
import { DocumentProcessor } from "./document-processor";
import { stemmer } from "stemmer";
import { DocumentIndexer } from "./document-indexer";
import { DocumentMath } from "./math";
import { DatasetDocument, DocumentDistance } from "./model";
import { DocumentID, Document, Term } from "./model";
import { SearchEngine } from "./library/search-engine";

export class DocumentSearchEngine extends SearchEngine<DocumentID, Document, Term> {

    constructor() {
        super(new DocumentProcessor(stemmer), new DocumentIndexer());
    }

    public async process(filename: string) {
        const datasetDocuments: DatasetDocument[] = await this.loadDataset(filename);

        // process documents & build vocabulary & build collection
        const termSet: Set<Term> = new Set();

        const documents: Document[] = datasetDocuments.map((datasetDocument: DatasetDocument) => {
            const document: Document = this.processor.process(datasetDocument.text);

            for (const term of document.terms) {
                termSet.add(term);
            }

            this.collection.set(document.id, document);
            return document;
        });

        // sort vocabulary lexicografically
        this.vocabulary = Array.from(termSet).sort((a, b) => a.localeCompare(b));

        // builds index
        this.indexer.buildIndex(this.vocabulary, documents);

        // vectorize documents
        documents.forEach((document: Document) => {
            this.vocabulary.forEach((term: Term) => {
                const weight = this.getTermWeight(term, document);
                document.vector.push(weight);
            });
        });
    }

    public search(query: string, count = 5): Document[] {
        // build query document
        const queryDocument: Document = this.generateQueryDocument(query);

        // retrieve relevant documents
        const relevantDocumentIds: Set<DocumentID> = new Set();

        queryDocument.terms.forEach((term: Term) => {
            this.indexer.getInvertedIndex(term).forEach((id: DocumentID) => {
                relevantDocumentIds.add(id);
            })
        });

        const relevantDocuments: Document[] = Array.from(relevantDocumentIds).map((id: DocumentID) => this.collection.get(id));

        // calculate similarity
        const distances: DocumentDistance[] = relevantDocuments.map((document: Document) => ({
            id: document.id,
            distance: DocumentMath.cosineSimilarity(queryDocument.vector, document.vector),
        }));

        // rank & filter relevant documents
        const results: DocumentDistance[] = distances
            .filter(value => value.distance !== 0)
            .sort((a, b) => b.distance - a.distance)
            .slice(0, count);

        return results.map(({ id }) => this.collection.get(id));
    }

    public getDocumentById(id: DocumentID): Document | undefined {
        return this.collection.get(id);
    }

    public isLoaded(): boolean {
        return this.collection.size > 0;
    }

    private generateQueryDocument(query: string): Document {
        const document: Document = this.processor.process(query);

        this.vocabulary.forEach((term: Term) => {
            const weight = this.getTermWeight(term, document);
            document.vector.push(weight);
        });

        return document;
    }

    private getTermWeight(term: Term, document: Document): number {
        const tf = (document.freqs[term] ?? 0) / document.terms.length;
        const df = this.indexer.getFrequency(term);
        const idf = Math.log2(this.collection.size / (1 + df));
        const tfidf = tf * idf;
        return tfidf;
    } 

    private async loadDataset(filename: string): Promise<DatasetDocument[]> {
        const documents: DatasetDocument[] = [];

        const response = await fetch(filename);
        const content = await response.text();
        const parsed = Papa.parse(content, { header: true, skipEmptyLines: true, dynamicTyping: true });

        for (let i = 0; i < parsed.data.length; i++) {
            const { text } = parsed.data[i] as { label: number; text: string; };
            documents.push({ text });
        }

        return documents;
    }
}