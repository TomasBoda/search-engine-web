import { ProcessedDocument } from "./model";

export abstract class DocumentProcessorModule {

    public abstract processDocument(text: string): ProcessedDocument;
}