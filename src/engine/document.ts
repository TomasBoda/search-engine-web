import { Vector } from "./math";
import { DocumentID, FrequencyMap, Term } from "./model";

export class Document {

    public id: DocumentID;
    public content: string;

    public terms: Term[] = [];
    public frequencyMap: FrequencyMap = {};
    public vector: Vector<number> = [];

    constructor(id: DocumentID, content: string) {
        this.id = id;
        this.content = content;
    }
}