import { Dictionary, DocumentID, InvertedIndexMap, ProcessedDocument, Term, TermFreqMap } from "./model";

export abstract class DocumentIndexerModule {

    protected invertedIndexMap: InvertedIndexMap = {};
    protected termDocumentFreqMap: TermFreqMap = {};

    public abstract buildIndex(dictionary: Dictionary, documents: ProcessedDocument[]): void;

    public getIndexedTerm(term: Term): number {
        return this.termDocumentFreqMap[term];
    }

    public getInvertedIndex(term: Term): DocumentID[] {
        return this.invertedIndexMap[term];
    }
}