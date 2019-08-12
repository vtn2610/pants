import { ErrorType } from "./ErrorType";
import { AbstractError } from './AbstractError';
export declare class WSError extends AbstractError {
    constructor(rootCauses: ErrorType[], editDistance: number);
    readonly expectedStr: string;
    explanation(): string;
    toString(): string;
}
