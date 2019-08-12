import { ErrorType } from "./ErrorType";
import { AbstractError } from './AbstractError';
export declare class CharError extends AbstractError {
    private _expectedChar;
    constructor(rootCauses: ErrorType[], editDistance: number, expectedChar: string);
    readonly expectedStr: string;
    explanation(): string;
    toString(): string;
}
