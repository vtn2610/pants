<<<<<<< HEAD
import { ErrorType } from "./ErrorType";
import { AbstractError } from './AbstractError';
export declare class StringError extends AbstractError {
    private _expectedStr;
    constructor(rootCauses: ErrorType[], expectedStr: string);
    readonly expectedStr: string;
    explanation(): string;
=======
import { Option } from 'space-lift';
import { ErrorType } from "./ErrorType";
export declare class StringError implements ErrorType {
    _expectedStr: string;
    constructor(expectedStr: string);
    rootCause(): Option<ErrorType>;
    explanation(): string;
    minEdit(input: string, expectedStr: string): number;
    expectedStr(): string;
>>>>>>> master
    toString(): string;
}
