import { ErrorType } from "./ErrorType";
import { AbstractError } from './AbstractError';
export declare class StringError extends AbstractError {
    private _expectedStr;
    constructor(rootCauses: ErrorType[], expectedStr: string);
    readonly expectedStr: string;
    explanation(): string;
    toString(): string;
}
