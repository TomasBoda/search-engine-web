
export interface DatasetDocument {
    text: string;
}

export type DocumentID = string;

export type Term = string;

export interface Document extends DatasetDocument {
    id: DocumentID;
    terms: Term[];
    freqs: { [key: Term]: number; };
    vector: Vector<number>;
}

export type Vector<T> = T[];

export interface DocumentDistance {
    id: DocumentID;
    distance: number;
}