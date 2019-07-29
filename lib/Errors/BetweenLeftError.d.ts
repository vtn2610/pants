import { Option } from 'space-lift';
import { ErrorType } from "./ErrorType";
import { CharUtil } from "../charstream";
import CharStream = CharUtil.CharStream;
export declare class BetweenLeftError implements ErrorType {
    private _rootCause;
    _editDistance: number;
    _modifiedString: CharStream;
    constructor(rootCause: ErrorType, editDistance: number, modifiedString: CharStream);
    cause: ErrorType;
    modString: CharStream;
    edit: number;
    rootCause(): Option<ErrorType>;
    expectedStr(): string;
    explanation(): string;
    toString(): string;
}
