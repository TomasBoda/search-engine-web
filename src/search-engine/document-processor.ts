import uuid4 from "uuid4";
import { DocumentID, Document, Term } from "./model";
import { Processor } from "./library/processor";

export class DocumentProcessor extends Processor<Document> {

    private stemmer: (term: string) => string;

    constructor(stemmer: (term: string) => string) {
        super();
        this.stemmer = stemmer;
    }

    public process(text: string): Document {
        const id: DocumentID = uuid4();
        const terms: Term[] = this.processTerms(text);
        const freqs: { [key: Term]: number; } = {};

        // build term frequencies
        for (const term of terms) {
            const freq: number = freqs[term] === undefined ? 1 : freqs[term] + 1;
            freqs[term] = freq;
        }

        return { id, text, terms, freqs, vector: [] };
    }

    private processTerms(text: string): Term[] {
        const terms: string[] = text.match(/\b\w+(?:\.\w+)?\b/g) || [];
        return terms
            // filter numbers
            .filter((term: Term) => term.match(/\d/g) === null)
            // to lower case
            .map((term: Term) => term.toLowerCase())
            // filter unnecessary terms
            .filter((term: Term) => term.match(/\b(?:a|an|the|this|that|these|those|some|few|all|any|each|every|much|many|several|i|me|my|mine|you|your|yours|he|him|his|she|her|hers|it|its|we|us|our|ours|they|them|their|theirs|one|ones|someone|anyone|everyone|no\ one|of|in|to|for|with|on|at|by|about|from|into|over|under|up|down|off|out|near|between|among|against|through|during|before|after|above|below|toward|upon|across|along|within|without|and|or|but|nor|so|yet|for|if|while|although|because|as|since|unless|until|when|where|whereas|be|am|is|are|was|were|being|been|have|has|had|do|does|did|can|could|will|would|shall|should|may|might|must|also|too|not|just|only|even|more|most|very|really|now|then|there|here|such|than|both|either|neither|each|every|much|many|other|another|again|always|never)\b/) === null)
            // filter one-letter terms
            .filter((term: Term) => term.length !== 1)
            // stem terms
            .map((term: Term) => this.stemmer(term));
    }
}