import { Collection, Vocabulary } from "./search-engine";

export type InvertedIndex<ID, Element> = Map<Element, ID[]>;
export type FrequencyMap<Element> = Map<Element, number>;

export abstract class Indexer<ID, Object, Element> {

    protected invertedIndex: InvertedIndex<ID, Element> = new Map();
    protected frequencyMap: FrequencyMap<Element> = new Map();

    public abstract buildIndex(vocabulary: Vocabulary<Element>, elements: Object[]): void;

    public getInvertedIndex(element: Element): ID[] {
        return this.invertedIndex.get(element) ?? [];
    }

    public getFrequency(element: Element): number {
        return this.frequencyMap.get(element) ?? 0;
    }
}