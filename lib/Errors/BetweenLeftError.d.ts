import { Option } from 'space-lift';
import { ErrorType } from "./ErrorType";
import { edit } from "../Edit/MetricLcs";
import { CharUtil } from "../charstream";
import CharStream = CharUtil.CharStream;
export declare class BetweenLeftError implements ErrorType {
    private _rootCause;
    _editDistance: number;
    _modifiedString: CharStream;
    constructor(rootCause: ErrorType, editDistance: number, modifiedString: CharStream);
    modString: CharStream;
    edit: number;
    rootCause(): Option<ErrorType>;
    explanation(): string;
    minEdit(input: string, expectedStr: string): edit[];
    expectedStr(): string;
    toString(): string;
}
