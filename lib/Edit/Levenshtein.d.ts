<<<<<<< HEAD
export declare type edit = {
    sign: number;
    char: string;
    pos: number;
};
export declare function levenshtein(s1: string, s2: string): edit[];
=======
export declare function levenshteinDist(a: string, b: string): number;
export declare function levenshteinTable(a: string, b: string): number[][];
export declare function levenshteinString(table: string[][]): string;
>>>>>>> master
