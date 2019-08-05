import { AbstractError } from './AbstractError';
export declare class SatError extends AbstractError {
    private _expectedChars;
    constructor(editDistance: number, expectedChars: string[]);
    readonly expectedStr: string;
    explanation(): string;
    toString(): string;
}
