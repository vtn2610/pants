import { ErrorType } from "./ErrorType";
import { Option } from "space-lift";
import { CharUtil } from "../charstream";
import CharStream = CharUtil.CharStream;
export declare class ItemError implements ErrorType {
    _editDistance: number;
    _modifiedString: CharStream;
    constructor(editDistance: number, modifiedString: CharStream);
    cause: ErrorType;
    modString: CharStream;
    edit: number;
    rootCause(): Option<ErrorType>;
    expectedStr(): string;
    explanation(): string;
    toString(): string;
}
