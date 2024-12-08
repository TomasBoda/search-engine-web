
export type Dictionary = string[];

export type InvertedIndexMap = {
    [key: string]: number[]
};

export type RelevancyMap = {
    index: number;
    relevancy: number;
};

export type Vector<T> = T[];