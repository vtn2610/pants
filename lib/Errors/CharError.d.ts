<<<<<<< HEAD
import { ErrorType } from "./ErrorType";
import { AbstractError } from './AbstractError';
export declare class CharError extends AbstractError {
    private _expectedChar;
    constructor(rootCauses: ErrorType[], editDistance: number, expectedChar: string);
    readonly expectedStr: string;
    explanation(): string;
=======
import { Option } from 'space-lift';
import { ErrorType } from "./ErrorType";
export declare class CharError implements ErrorType {
    private _expectedChar;
    constructor(expectedChar: string);
    rootCause(): Option<ErrorType>;
    explanation(): string;
    minEdit(input: string, expectedStr: string): number;
    expectedStr(): string;
>>>>>>> master
    toString(): string;
}
