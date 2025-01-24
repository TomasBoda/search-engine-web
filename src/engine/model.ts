
export interface DatasetDocument {
    text: string;
}

export type DocumentID = string;

export interface ProcessedDocument {
    id: DocumentID;
    text: string;
    terms: Term[];
    freqs: TermFreqMap;
    vector: Vector<number>;
}

export type Term = string;

export type Vector<T> = T[];

export type TermFreqMap = {
    [key: Term]: number;
}

export type InvertedIndexMap = {
    [key: Term]: DocumentID[];
};

export type DocumentDistance = {
    id: DocumentID;
    distance: number;
}

export type Dictionary = Term[];