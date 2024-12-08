import Papa from "papaparse";
import { Document } from "./document";
import { Processor } from "./processor";
import { cosineSimilarity } from "./math";
import { Dictionary, InvertedIndexMap, RelevancyMap } from "./model";

export class SearchEngine {

    private documents: Document[] = [];
    private dictionary: Dictionary = [];
    private invertedIndexMap: InvertedIndexMap = {};

    public isLoaded(): boolean {
        return this.documents.length > 0;
    }

    public getDocuments(): Document[] {
        return this.documents;
    }

    public search(query: string, count?: number): Document[] {
        const queryDocument: Document = this.generateQueryDocument(query);
        const relevantDocuments: Document[] = this.getRelevantDocuments(queryDocument);

        const relevancyTable: RelevancyMap[] = this.getRelevancyTable(queryDocument, relevantDocuments);

        const results: RelevancyMap[] = relevancyTable
            .sort((a, b) => b.relevancy - a.relevancy)
            .slice(0, count)
            .filter(value => value.relevancy !== 0);

        const resultDocuments: Document[] = [];

        results.forEach((result: RelevancyMap) => {
            resultDocuments.push(relevantDocuments[result.index]);
        });

        return resultDocuments;
    }

    public async processDocuments() {
        await this.processWords();

        this.dictionary = this.generateDictionary();

        await this.generateFrequencyTables();
        await this.generateDocumentVectors();

        this.invertedIndexMap = this.generateInvertedIndexMap();
    }

    private async processWords() {
        const labels: string[] = [ "politics", "sport", "technology", "entertainment", "business" ];

        this.documents.forEach((document: Document) => {
            document.words = Processor.getProcessedWords(document.content);
            
            for (let i =  0; i < 10; i++) {
                document.words.push(labels[document.label]);
            }
        });
    }

    private async generateFrequencyTables() {
        this.documents.forEach((document: Document) => {
            document.words.forEach((word: string) => {
                document.frequencies[word] = document.frequencies[word] + 1 || 1;
            });
        });
    }

    private async generateDocumentVectors() {
        this.documents.forEach((document: Document) => {
            this.dictionary.forEach((word: string) => {
                document.vector.push(document.frequencies[word] ?? 0);
            });
        });
    }

    private getRelevancyTable(queryDocument: Document, relevantDocuments: Document[]): RelevancyMap[] {
        const relevantDocumentVectors = relevantDocuments.map((document: Document) => document.vector);

        const relevancyTable: RelevancyMap[] = relevantDocumentVectors.map((documentVector, index: number) => ({
            index: index,
            relevancy: cosineSimilarity(queryDocument.vector, documentVector)
        }));

        return relevancyTable;
    }

    private getRelevantDocuments(queryDocument: Document): Document[] {
        let relevantDocuments: Document[] = [];

        queryDocument.words.forEach((word: string) => {
            if (this.invertedIndexMap[word] === undefined) {
                return;
            }

            const relevantDocumentsToWord = this.invertedIndexMap[word].map(i => this.documents[i]);
            relevantDocuments = relevantDocuments.concat(relevantDocumentsToWord);
        });

        const uniqueMap = new Map<number, Document>();

        relevantDocuments.forEach((document: Document) => {
            if (uniqueMap.get(document.id) !== undefined) {
                return;
            }

            uniqueMap.set(document.id, document);
        });

        relevantDocuments = Array.from(uniqueMap.values());
        return relevantDocuments;
    }

    private generateQueryDocument(query: string): Document {
        const queryDocument: Document = new Document(0, 0, query);

        // extract words from document
        queryDocument.words = Processor.getProcessedWords(queryDocument.content);

        // generate frequency table
        queryDocument.words.forEach((word: string) => {
            queryDocument.frequencies[word] = queryDocument.frequencies[word] + 1 || 1;
        });

        this.dictionary.forEach((word: string) => {
            if (queryDocument.frequencies[word] === undefined) {
                queryDocument.vector.push(0);
            } else {
                queryDocument.vector.push(queryDocument.frequencies[word]);
            }
        });

        return queryDocument;
    }

    private generateInvertedIndexMap(): InvertedIndexMap {
        const invertedIndexMap: { [key: string]: number[] } = {};

        this.dictionary.forEach((word: string) => {
            const relevantDocumentIds: number[] = [];

            this.documents.forEach((document: Document) => {
                if (document.frequencies[word] !== undefined) {
                    relevantDocumentIds.push(document.id);
                }
            });

            invertedIndexMap[word] = relevantDocumentIds;
        });

        return invertedIndexMap;
    }

    private generateDictionary(): Dictionary {
        const wordSet = new Set<string>();

        this.documents.forEach((document: Document) => {
            document.words.forEach((word: string) => {
                wordSet.add(word);
            });
        });

        const dictionary: Dictionary = Array.from(wordSet);
        dictionary.sort(this.lexicalSort);
        
        return dictionary;
    }

    private lexicalSort(value1: string, value2: string): number {
        return value1.localeCompare(value2);
    }

    public async loadCsvDataset(filename: string) {
        const response = await fetch(filename);
        const content = await response.text();
        
        const parsed = Papa.parse(content, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
        });

        for (let i = 0; i < parsed.data.length; i++) {
            const { label, text } = parsed.data[i] as { label: number; text: string; };
            this.documents.push(new Document(i, label, text));
        }
    }
}