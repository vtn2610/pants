<<<<<<< HEAD
import { ErrorType } from "./ErrorType";
import { AbstractError } from './AbstractError';
export declare class BetweenRightError extends AbstractError {
    constructor(rootCauses: ErrorType[], editDistance: number);
    readonly expectedStr: string;
    explanation(): string;
=======
import { Option } from 'space-lift';
import { ErrorType } from "./ErrorType";
export declare class BetweenRightError implements ErrorType {
    private _rootCause;
    constructor(rootCause: ErrorType);
    rootCause(): Option<ErrorType>;
    explanation(): string;
    minEdit(input: string, expectedStr?: string): number;
    expectedStr(): string;
>>>>>>> master
    toString(): string;
}
