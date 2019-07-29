import { ErrorType } from "./ErrorType";
import { Option } from "space-lift";
import { edit } from "../Edit/MetricLcs";
import { CharUtil } from "../charstream";
import CharStream = CharUtil.CharStream;
export declare class DigitError implements ErrorType {
    _editDistance: number;
    _modifiedString: CharStream;
    private _rootCause;
    constructor(editDistance: number, modifiedString: CharStream, rootCause?: ErrorType);
    cause: ErrorType;
    getTotalEdit(): number;
    modString: CharStream;
    edit: number;
    rootCause(): Option<ErrorType>;
    explanation(): string;
    minEdit(input: string, expectedStr: string): edit[];
    expectedStr(): string;
    toString(): string;
}
