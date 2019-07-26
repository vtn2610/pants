import { ErrorType } from "./ErrorType";
import { Option } from "space-lift";
import { edit } from "../Edit/MetricLcs";
import { CharUtil } from "../charstream";
import CharStream = CharUtil.CharStream;
export declare class LetterError implements ErrorType {
    _editDistance: number;
    _modifiedString: CharStream;
    constructor(editDistance: number, modifiedString: CharStream);
    modString: CharStream;
    edit: number;
    rootCause(): Option<ErrorType>;
    explanation(): string;
    minEdit(input: string, expectedStr: string): edit[];
    expectedStr(): string;
    toString(): string;
}
