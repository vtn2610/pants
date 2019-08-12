import { ErrorType } from "./ErrorType";
<<<<<<< HEAD
import { AbstractError } from './AbstractError';
export declare class WSError extends AbstractError {
    constructor(rootCauses: ErrorType[], editDistance: number);
    readonly expectedStr: string;
    explanation(): string;
=======
import { Option } from "space-lift";
export declare class WSError implements ErrorType {
    rootCause(): Option<ErrorType>;
    explanation(): string;
    minEdit(input: string, expectedStr: string): number;
    expectedStr(): string;
>>>>>>> master
    toString(): string;
}
