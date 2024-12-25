
export type DocumentID = number;

export type Term = string;

export type Dictionary = Term[];

export type FrequencyMap = {
    [key: Term]: number;
}

export type InvertedIndexMap = {
    [key: Term]: DocumentID[];
};

export type RelevancyMap = {
    id: DocumentID;
    relevancy: number;
};