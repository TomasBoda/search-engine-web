import Papa from "papaparse";
import { Document } from "./document";
import { cosineSimilarity } from "./math";
import { Dictionary, InvertedIndexMap, RelevancyMap, FrequencyMap, Term, DocumentID } from "./model";
import { stemmer } from "stemmer";

export class SearchEngine {

    private documents: Document[] = [];
    private dictionary: Dictionary = [];
    private invertedIndexMap: InvertedIndexMap = {};
    private termDocumentFrequencyMap: FrequencyMap = {};

    public processDocuments(): void {
        this.processTerms();
        this.generateDictionary();
        this.generateFrequencyMaps();
        this.generateTermDocumentFrequencyMap();
        this.generateDocumentVectors();
        this.generateInvertedIndexMap();
    }

    private processTerms(): void {
        this.documents.forEach((document: Document) => {
            document.terms = this.getProcessedTerms(document.content);
        });
    }

    private generateFrequencyMaps(): void {
        this.documents.forEach((document: Document) => {
            document.terms.forEach((term: Term) => {
                const frequencies: number | undefined = document.frequencyMap[term];
                const newFrequencies: number = frequencies === undefined ? 1 : frequencies + 1;
                document.frequencyMap[term] = newFrequencies;
            });
        });
    }

    private generateTermDocumentFrequencyMap(): void {
        this.dictionary.forEach((term: Term) => {
            this.termDocumentFrequencyMap[term] = 0;

            this.documents.forEach((document: Document) => {
                if (document.frequencyMap[term] !== undefined) {
                    this.termDocumentFrequencyMap[term] = this.termDocumentFrequencyMap[term] + 1;
                }
            });
        });
    }

    private generateDocumentVectors(): void {
        this.documents.forEach((document: Document) => {
            this.dictionary.forEach((term: Term) => {
                const weight = this.getTermWeight(document, term);
                document.vector.push(weight);
            });
        });
    }

    private getTermWeight(document: Document, term: string): number {
        const tf = (document.frequencyMap[term] ?? 0) / document.terms.length;
        const df = this.termDocumentFrequencyMap[term];
        const idf = Math.log2(this.documents.length / (1 + df));
        const tfidf = tf * idf;

        return tfidf;
    }

    private generateInvertedIndexMap(): void {
        const invertedIndexMap: InvertedIndexMap = {};

        this.dictionary.forEach((term: Term) => {
            const relevantDocumentIds: DocumentID[] = [];

            this.documents.forEach((document: Document) => {
                if (document.frequencyMap[term] !== undefined) {
                    relevantDocumentIds.push(document.id);
                }
            });

            invertedIndexMap[term] = relevantDocumentIds;
        });

        this.invertedIndexMap = invertedIndexMap;
    }

    public search(query: string, count?: number): Document[] {
        const queryDocument: Document = this.generateQueryDocument(query);
        const relevantDocuments: Document[] = this.getRelevantDocuments(queryDocument);

        const relevancyTable: RelevancyMap[] = this.getRelevancyTable(queryDocument, relevantDocuments);

        const results: RelevancyMap[] = relevancyTable
            .sort((a, b) => b.relevancy - a.relevancy)
            .filter(value => value.relevancy !== 0)
            .slice(0, count);

        const resultDocuments: Document[] = results.map(result => this.documents.find(document => document.id === result.id));

        return resultDocuments;
    }

    private getRelevancyTable(queryDocument: Document, relevantDocuments: Document[]): RelevancyMap[] {
        return relevantDocuments.map((document: Document) => ({
            id: document.id,
            relevancy: cosineSimilarity(queryDocument.vector, document.vector)
        }))
    }

    private getRelevantDocuments(queryDocument: Document): Document[] {
        const relevantDocumentIds = new Set<DocumentID>();

        queryDocument.terms.forEach((term: Term) => {
            if (this.invertedIndexMap[term] !== undefined) {
                this.invertedIndexMap[term].forEach((id: DocumentID) => relevantDocumentIds.add(id));
            }
        });

        const relevantDocuments: Document[] = Array.from(relevantDocumentIds).map((id: DocumentID) => this.documents.find((document: Document) => document.id === id));

        return relevantDocuments;
    }

    private generateQueryDocument(query: string): Document {
        const document: Document = new Document(0, query);

        document.terms = this.getProcessedTerms(document.content);

        document.terms.forEach((term: Term) => {
            const frequencies: number | undefined = document.frequencyMap[term];
            const newFrequencies: number = frequencies === undefined ? 1 : frequencies + 1;
            document.frequencyMap[term] = newFrequencies;
        });

        this.dictionary.forEach((term: Term) => {
            const weight = this.getTermWeight(document, term);
            document.vector.push(weight);
        });

        return document;
    }

    private generateDictionary(): void {
        const terms = new Set<string>();

        this.documents.forEach((document: Document) => {
            document.terms.forEach((term: Term) => {
                terms.add(term);
            });
        });

        const dictionary: Dictionary = Array.from(terms);
        dictionary.sort((term1: Term, term2: Term) => term1.localeCompare(term2));
        
        this.dictionary = dictionary;
    }

    public isLoaded(): boolean {
        return this.documents.length > 0;
    }

    public getDocuments(): Document[] {
        return this.documents;
    }

    private getProcessedTerms(text: string): Term[] {
        const terms: string[] = text.match(/\b\w+(?:\.\w+)?\b/g) || [];
        return terms
            .filter((term: Term) => term.match(/\d/g) === null)
            .map((term: Term) => term.toLowerCase())
            .filter((term: Term) => term.match(/\b(?:a|an|the|this|that|these|those|some|few|all|any|each|every|much|many|several|i|me|my|mine|you|your|yours|he|him|his|she|her|hers|it|its|we|us|our|ours|they|them|their|theirs|one|ones|someone|anyone|everyone|no\ one|of|in|to|for|with|on|at|by|about|from|into|over|under|up|down|off|out|near|between|among|against|through|during|before|after|above|below|toward|upon|across|along|within|without|and|or|but|nor|so|yet|for|if|while|although|because|as|since|unless|until|when|where|whereas|be|am|is|are|was|were|being|been|have|has|had|do|does|did|can|could|will|would|shall|should|may|might|must|also|too|not|just|only|even|more|most|very|really|now|then|there|here|such|than|both|either|neither|each|every|much|many|other|another|again|always|never)\b/) === null)
            .filter((term: Term) => term.length !== 1)
            .map((term: Term) => stemmer(term));
    }

    public async loadCsvDataset(filename: string) {
        this.documents = [];

        const response = await fetch(filename);
        const content = await response.text();
        
        const parsed = Papa.parse(content, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
        });

        for (let i = 0; i < parsed.data.length; i++) {
            const { text } = parsed.data[i] as { label: number; text: string; };
            const document = new Document(i, text);
            this.documents.push(document);
        }
    }
}