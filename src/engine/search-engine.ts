import Papa from "papaparse";
import { DocumentProcessor } from "./document-processor";
import { stemmer } from "stemmer";
import { DocumentIndexer } from "./document-indexer";
import { DocumentMath } from "./math";
import { DatasetDocument, Dictionary, DocumentDistance, DocumentID, ProcessedDocument, Term } from "./model";

export class SearchEngine {

    private documentProcessor: DocumentProcessor;
    private documentIndexer: DocumentIndexer;

    private dictionary: Dictionary = [];
    private documents: Map<DocumentID, ProcessedDocument> = new Map();

    constructor() {
        this.documentProcessor = new DocumentProcessor(stemmer);
        this.documentIndexer = new DocumentIndexer();
    }

    public async initialize(filename: string) {
        const documents: DatasetDocument[] = await this.loadCsvDataset(filename);

        const termSet: Set<Term> = new Set();

        const processedDocuments: ProcessedDocument[] = documents.map((document: DatasetDocument) => {
            const processedDocument: ProcessedDocument = this.documentProcessor.processDocument(document.text);

            for (const term of processedDocument.terms) {
                termSet.add(term);
            }

            return processedDocument;
        });

        this.dictionary = Array.from(termSet);

        this.documentIndexer.buildIndex(this.dictionary, processedDocuments);

        // vectorize documents
        processedDocuments.forEach((document: ProcessedDocument) => {
            this.dictionary.forEach((term: Term) => {
                const tf = (document.freqs[term] ?? 0) / document.terms.length;
                const df = this.documentIndexer.getIndexedTerm(term);
                const idf = Math.log2(processedDocuments.length / (1 + df));
                const tfidf = tf * idf;

                const weight = tfidf;
                document.vector.push(weight);
            });

            this.documents.set(document.id, document);
        });
    }

    public search(query: string, count = 5): ProcessedDocument[] {
        const queryDocument: ProcessedDocument = this.generateQueryDocument(query);

        const relevantDocumentIds: Set<DocumentID> = new Set();

        queryDocument.terms.forEach((term: Term) => {
            this.documentIndexer.getInvertedIndex(term).forEach((id: DocumentID) => {
                relevantDocumentIds.add(id);
            })
        });

        const relevantDocuments: ProcessedDocument[] = Array.from(relevantDocumentIds).map((id: DocumentID) => {
            return this.documents.get(id);
        });

        const distances: DocumentDistance[] = relevantDocuments.map((document: ProcessedDocument) => ({
            id: document.id,
            distance: DocumentMath.cosineSimilarity(queryDocument.vector, document.vector),
        }));

        const results: DocumentDistance[] = distances
            .filter(value => value.distance !== 0)
            .sort((a, b) => b.distance - a.distance)
            .slice(0, count);

        return results.map(({ id }) => this.documents.get(id));
    }

    public getDocumentById(id: DocumentID): ProcessedDocument | undefined {
        return this.documents.get(id);
    }

    public isLoaded(): boolean {
        return this.documents.size > 0;
    }

    private generateQueryDocument(query: string): ProcessedDocument {
        const document: ProcessedDocument = this.documentProcessor.processDocument(query);

        this.dictionary.forEach((term: Term) => {
            const tf = (document.freqs[term] ?? 0) / document.terms.length;
            const df = this.documentIndexer.getIndexedTerm(term);
            const idf = Math.log2(this.documents.size / (1 + df));
            const tfidf = tf * idf;

            const weight = tfidf;
            document.vector.push(weight);
        });

        return document;
    }

    private async loadCsvDataset(filename: string): Promise<DatasetDocument[]> {
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