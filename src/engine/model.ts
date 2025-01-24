import { DocumentID } from "./lib";

export interface DatasetDocument {
    text: string;
}

export interface DocumentDistance {
    id: DocumentID;
    distance: number;
}