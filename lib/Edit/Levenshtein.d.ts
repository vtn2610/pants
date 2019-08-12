export declare type edit = {
    sign: number;
    char: string;
    pos: number;
};
export declare function levenshtein(s1: string, s2: string): edit[];
