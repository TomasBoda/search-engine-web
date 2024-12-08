
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