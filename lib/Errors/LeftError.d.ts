import { ErrorType } from "./ErrorType";
import { CharUtil } from "../charstream";
import CharStream = CharUtil.CharStream;
import { AbstractError } from './AbstractError';
export declare class LeftError extends AbstractError {
    constructor(rootCauses: ErrorType[], modStream: CharStream, editDistance: number);
    readonly expectedStr: string;
    explanation(): string;
    toString(): string;
}
