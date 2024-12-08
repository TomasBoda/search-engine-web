import { stemmer } from "stemmer";
import { Vector } from "./model";

export class Processor {

    public static getProcessedWords(text: string): string[] {
        const words: string[] = text.match(/\b\w+(?:\.\w+)?\b/g) || [];
        return words
            .filter((word: string) => word.match(/\d/g) === null)
            .map((word: string) => word.toLowerCase())
            .filter((word: string) => word.match(/\b(?:a|an|the|this|that|these|those|some|few|all|any|each|every|much|many|several|i|me|my|mine|you|your|yours|he|him|his|she|her|hers|it|its|we|us|our|ours|they|them|their|theirs|one|ones|someone|anyone|everyone|no\ one|of|in|to|for|with|on|at|by|about|from|into|over|under|up|down|off|out|near|between|among|against|through|during|before|after|above|below|toward|upon|across|along|within|without|and|or|but|nor|so|yet|for|if|while|although|because|as|since|unless|until|when|where|whereas|be|am|is|are|was|were|being|been|have|has|had|do|does|did|can|could|will|would|shall|should|may|might|must|also|too|not|just|only|even|more|most|very|really|now|then|there|here|such|than|both|either|neither|each|every|much|many|other|another|again|always|never)\b/) === null)
            .filter((word: string) => word.length !== 1)
            .map((word: string) => stemmer(word));
    }

    public static getVocabulary(words: string[]): Set<string> {
        const vocabulary: Set<string> = new Set<string>();
        words.forEach((word: string) => vocabulary.add(word));
        return vocabulary;
    }

    public static getVector(words: string[], vocabulary: Set<string>): Vector<number> {
        const frequencyTable: { [key: string]: number } = {};
        Array.from(vocabulary).sort((w1, w2) => w1.localeCompare(w2)).forEach((word: string) => frequencyTable[word] = 0);
        words.forEach((word: string) => frequencyTable[word] = frequencyTable[word] + 1);
        
        const vector: Vector<number> = [];
        const frequencies = Object.keys(frequencyTable).sort((w1, w2) => w1.localeCompare(w2));
        
        for (const key in frequencies) {
            vector.push(frequencyTable[key]);
        }

        return vector;
    }
}