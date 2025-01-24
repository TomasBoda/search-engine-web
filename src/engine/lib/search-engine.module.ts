import { DocumentIndexerModule } from "./document-indexer.module";
import { DocumentProcessorModule } from "./document-processor.module";
import { Dictionary, DocumentID, ProcessedDocument } from "./model";

export abstract class SearchEngineModule {

    protected documentProcessor: DocumentProcessorModule;
    protected documentIndexer: DocumentIndexerModule;

    protected dictionary: Dictionary = [];
    protected documents: Map<DocumentID, ProcessedDocument> = new Map();

    constructor(documentProcessor: DocumentProcessorModule, documentIndexer: DocumentIndexerModule) {
        this.documentProcessor = documentProcessor;
        this.documentIndexer = documentIndexer;
    }

    public abstract initialize(filename: string): Promise<void>;

    public abstract search(query: string, count: number): ProcessedDocument[];
}