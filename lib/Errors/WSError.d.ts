import { ErrorType } from "./ErrorType";
import { Option } from "space-lift";
import { CharUtil } from "../charstream";
import CharStream = CharUtil.CharStream;
export declare class WSError implements ErrorType {
    _editDistance: number;
    _modifiedString: CharStream;
    private _rootCause;
    constructor(editDistance: number, modifiedString: CharStream, rootCause?: ErrorType);
    cause: ErrorType;
    modString: CharStream;
    edit: number;
    rootCause(): Option<ErrorType>;
    explanation(): string;
    expectedStr(): string;
    toString(): string;
}
