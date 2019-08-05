import { ErrorType } from "./ErrorType";
import { CharUtil } from "../charstream";
import CharStream = CharUtil.CharStream;
import { AbstractError } from './AbstractError';
export declare class SeqError extends AbstractError {
    protected _firstFailed: boolean;
    protected _secondFailed: boolean;
    constructor(rootCauses: ErrorType[], modStream: CharStream, editDistance: number, firstFailed: boolean, secondFailed: boolean);
    readonly firstFailed: boolean;
    readonly secondFailed: boolean;
    readonly expectedStr: string;
    explanation(): string;
    toString(): string;
}
