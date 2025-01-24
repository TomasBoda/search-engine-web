import { Dictionary, DocumentID, ProcessedDocument, Term, DocumentIndexerModule } from "./lib";

export class DocumentIndexer extends DocumentIndexerModule {

    public buildIndex(dictionary: Dictionary, documents: ProcessedDocument[]): void {
        this.buildTermDocumentFreqs(dictionary, documents);
        this.buildInvertedIndex(dictionary, documents);
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