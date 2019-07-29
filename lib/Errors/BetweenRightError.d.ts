import { Option } from 'space-lift';
import { ErrorType } from "./ErrorType";
import { CharUtil } from "../charstream";
import CharStream = CharUtil.CharStream;
export declare class BetweenRightError implements ErrorType {
    private _rootCause;
    _editDistance: number;
    _modifiedString: CharStream;
    constructor(rootCause: ErrorType, editDistance: number, modifiedString: CharStream);
    getTotalEdit(): number;
    cause: ErrorType;
    modString: CharStream;
    edit: number;
    rootCause(): Option<ErrorType>;
    explanation(): string;
    expectedStr(): string;
    toString(): string;
}
