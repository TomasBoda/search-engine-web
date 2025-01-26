import { Indexer } from "./indexer";
import { Processor } from "./processor";

export type Vocabulary<Element> = Element[];
export type Collection<ID, Object> = Map<ID, Object>;

export abstract class SearchEngine<ID, Object, Element> {

    protected processor: Processor<Object>;
    protected indexer: Indexer<ID, Object, Element>;

    protected vocabulary: Vocabulary<Element> = [];
    protected collection: Collection<ID, Object> = new Map();

    constructor(processor: Processor<Object>, indexer: Indexer<ID, Object, Element>) {
        this.processor = processor;
        this.indexer = indexer;
    }

    public abstract process(filename: string): Promise<void>;

    public abstract search(query: string, limit: number): Object[];
}