import { Dictionary } from "./search-engine";

export class Document {

    public id: number;

    public label: number;
    public content: string;

    public dictionary: Dictionary = [];

    public words: string[] = [];
    public frequencies: { [key: string]: number } = {};
    public vector: number[] = [];

    constructor(id: number, label: number, content: string) {
        this.id = id;
        this.label = label;
        this.content = content;
    }
}