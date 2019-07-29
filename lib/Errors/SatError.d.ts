import { Option } from 'space-lift';
import { ErrorType } from "./ErrorType";
import { CharUtil } from "../charstream";
import CharStream = CharUtil.CharStream;
export declare class SatError implements ErrorType {
    private _expectedStr;
    _editDistance: number;
    _modifiedString: CharStream;
    constructor(expectedStr: string[], editDistance: number, modifiedString: CharStream);
    cause: ErrorType;
    modString: CharStream;
    edit: number;
    rootCause(): Option<ErrorType>;
    readonly errors: string[];
    explanation(): string;
    expectedStr(): string;
    toString(): string;
}
