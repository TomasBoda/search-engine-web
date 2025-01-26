import { DocumentID, Document, Term } from "./model";
import { Indexer } from "./library/indexer";
import { Vocabulary } from "./library/search-engine";

export class DocumentIndexer extends Indexer<DocumentID, Document, Term> {

    public buildIndex(vocabulary: Vocabulary<Term>, documents: Document[]): void {
        this.buildTermDocumentFreqs(vocabulary, documents);
        this.buildInvertedIndex(vocabulary, documents);
    }

    private buildTermDocumentFreqs(vocabulary: Vocabulary<Term>, documents: Document[]): void {
        this.frequencyMap.clear();

        vocabulary.forEach((term: Term) => {
            this.frequencyMap.set(term, 0);

            documents.forEach((document: Document) => {
                if (document.freqs[term] !== undefined) {
                    this.frequencyMap.set(term, this.frequencyMap.get(term) + 1);
                }
            });
        });
    }

    private buildInvertedIndex(vocabulary: Vocabulary<Term>, documents: Document[]): void {
        this.invertedIndex.clear();

        vocabulary.forEach((term: Term) => {
            const relevantDocumentIds: DocumentID[] = [];

            documents.forEach((document: Document) => {
                if (document.freqs[term] !== undefined) {
                    relevantDocumentIds.push(document.id);
                }
            });

            this.invertedIndex.set(term, relevantDocumentIds);
        });
    }
}