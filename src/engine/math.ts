import { Vector } from "./model";

export namespace DocumentMath {
    
    function dotProduct(vector1: Vector<number>, vector2: Vector<number>): number {
        let product = 0;
    
        for (let i = 0; i < vector1.length; i++) {
            product += vector1[i] * vector2[i];
        }
    
        return product;
    }
    
    function magnitude(vector: Vector<number>): number {
        let sum = 0;
    
        for (let i = 0; i < vector.length; i++) {
            sum += vector[i] * vector[i];
        }
    
        return Math.sqrt(sum);
    }
    
    export function cosineSimilarity(vector1: Vector<number>, vector2: Vector<number>): number {
        return dotProduct(vector1, vector2) / (magnitude(vector1) * magnitude(vector2));
    }
}