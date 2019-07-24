import { Option } from 'space-lift';
import { ErrorType } from "./ErrorType";
import { edit } from "../Edit/MetricLcs";
export declare class CharError implements ErrorType {
    private _expectedChar;
    _editDistance: number;
    constructor(expectedChar: string, editDistance: number);
    edit: number;
    rootCause(): Option<ErrorType>;
    explanation(): string;
    minEdit(input: string, expectedStr: string): edit[];
    expectedStr(): string;
    toString(): string;
}
