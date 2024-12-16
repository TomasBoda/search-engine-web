# Document Search Engine

This project introduces a web-based document search engine.

## Dataset
The dataset is downloaded from [Kaggle](https://www.kaggle.com/datasets/sunilthite/text-document-classification-dataset/data).

The dataset contains 2225 rows, each containing a `label` attribute representing document category (politics, sport, technology, entertainment, business) and a `text` attribute with the document content.

## Search Engine
The search engine is a vector model based on the bag-of-features paradigm. In the preprocessing phase, the individual words from all documents are processed, stemmed and added to a shared vocabulary (vector space). Then, each document is vectorized. The values of the vectors represent frequencies of individual words in the document. The input query is also transformed to a document and vectorized to the same vector space on each search. The search engine uses the cosine similarity function together with an inverted index map to search for relevant documents to the search query.

### Document
Document is an object containing the raw input data as well as the processed vector data.

```ts
export class Document {

    public id: number;
    public label: number;
    public content: string;

    public words: string[] = [];
    public frequencies: { [key: string]: number } = {};
    public vector: Vector<number> = [];
}
```

### Processor
One of the main methods of the processor is the `processDocuments` method. It first processes all words in all documents, then generates a dictionary so that the documents operate on the same vector space. Then, it generates a frequency table, document vectors and finally an inverted index map.
```ts
async function processDocuments() {
    await this.processWords();

    this.dictionary = this.generateDictionary();

    await this.generateFrequencyTables();
    await this.generateDocumentVectors();

    this.invertedIndexMap = this.generateInvertedIndexMap();
}
```

The second most important method of the processor is the `search` method. It generates and processes a document based on the query string, then searches for relevant documents.
```ts
function search(query: string, count?: number): Document[] {
    const queryDocument: Document = this.generateQueryDocument(query);
    const relevantDocuments: Document[] = this.getRelevantDocuments(queryDocument);

    const relevancyTable: RelevancyMap[] = this.getRelevancyTable(queryDocument, relevantDocuments);

    const results: RelevancyMap[] = relevancyTable
        .sort((a, b) => b.relevancy - a.relevancy)
        .slice(0, count)
        .filter(value => value.relevancy !== 0);

    const resultDocuments: Document[] = [];

    results.forEach((result: RelevancyMap) => {
        resultDocuments.push(relevantDocuments[result.index]);
    });

    return resultDocuments;
}
```

### Cosine Similarity
The cosine similarity function is used to rank documents based on the relevancy (distance) of the query document to other documents. It uses the document vectors to calculate their distances.

```ts
export function dotProduct(vector1: number[], vector2: number[]) {
    let product = 0;

    for (let i = 0; i < vector1.length; i++) {
        product += vector1[i] * vector2[i];
    }
    return product;
}

export function magnitude(vector: number[]) {
    let sum = 0;

    for (let i = 0; i < vector.length; i++) {
        sum += vector[i] * vector[i];
    }
    return Math.sqrt(sum);
}

export function cosineSimilarity(vector1: number[], vector2: number[]) {
    return dotProduct(vector1, vector2) / (magnitude(vector1) * magnitude(vector2));
}
```

## TODO
- downweigh common words (occuring in many documents) for better search functionality