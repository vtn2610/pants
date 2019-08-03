import { ErrorType } from "./ErrorType";
import { AbstractError } from './AbstractError';
export declare class BetweenRightError extends AbstractError {
    constructor(rootCauses: ErrorType[], editDistance: number);
    readonly expectedStr: string;
    explanation(): string;
    toString(): string;
}
