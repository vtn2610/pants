import { Option } from 'space-lift';
import { ErrorType } from "./ErrorType";
import { CharUtil } from "../charstream";
import CharStream = CharUtil.CharStream;
export declare class CharError implements ErrorType {
    private _expectedChar;
    private _rootCause;
    _editDistance: number;
    _modifiedString: CharStream;
    constructor(expectedChar: string, editDistance: number, modifiedString: CharStream);
    cause: ErrorType;
    modString: CharStream;
    edit: number;
    rootCause(): Option<ErrorType>;
    explanation(): string;
    expectedStr(): string;
    toString(): string;
}
