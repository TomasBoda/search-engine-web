import { Dictionary, DocumentID, InvertedIndexMap, ProcessedDocument, Term, TermFreqMap } from "./model";

export class DocumentIndexer {

    private invertedIndexMap: InvertedIndexMap = {};
    private termDocumentFreqMap: TermFreqMap = {};

    public buildIndex(dictionary: Dictionary, documents: ProcessedDocument[]): void {
        this.buildTermDocumentFreqs(dictionary, documents);
        this.buildInvertedIndex(dictionary, documents);
    }

    public getIndexedTerm(term: Term): number {
        return this.termDocumentFreqMap[term];
    }

    public getInvertedIndex(term: Term): DocumentID[] {
        return this.invertedIndexMap[term];
    }

    private buildTermDocumentFreqs(dictionary: Dictionary, documents: ProcessedDocument[]): void {
        this.termDocumentFreqMap = {};

        dictionary.forEach((term: Term) => {
            this.termDocumentFreqMap[term] = 0;

            documents.forEach((document: ProcessedDocument) => {
                if (document.freqs[term] !== undefined) {
                    this.termDocumentFreqMap[term] = this.termDocumentFreqMap[term] + 1;
                }
            });
        });
    }

    private buildInvertedIndex(dictionary: Dictionary, documents: ProcessedDocument[]): void {
        this.invertedIndexMap = {};

        dictionary.forEach((term: Term) => {
            const relevantDocumentIds: DocumentID[] = [];

            documents.forEach((document: ProcessedDocument) => {
                if (document.freqs[term] !== undefined) {
                    relevantDocumentIds.push(document.id);
                }
            });

            this.invertedIndexMap[term] = relevantDocumentIds;
        });
    }
}