<<<<<<< HEAD
import { AbstractError } from './AbstractError';
export declare class ItemError extends AbstractError {
    constructor();
    readonly expectedStr: string;
    explanation(): string;
=======
import { ErrorType } from "./ErrorType";
import { Option } from "space-lift";
export declare class ItemError implements ErrorType {
    rootCause(): Option<ErrorType>;
    explanation(): string;
    minEdit(input: string, expectedStr: string): number;
    expectedStr(): string;
>>>>>>> master
    toString(): string;
}
