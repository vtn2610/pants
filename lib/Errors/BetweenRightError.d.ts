import { Option } from 'space-lift';
import { ErrorType } from "./ErrorType";
import { edit } from "../Edit/MetricLcs";
export declare class BetweenRightError implements ErrorType {
    private _rootCause;
    _editDistance: number;
    constructor(rootCause: ErrorType, editDistance: number);
    edit: number;
    rootCause(): Option<ErrorType>;
    explanation(): string;
    minEdit(input: string, expectedStr?: string): edit[];
    expectedStr(): string;
    toString(): string;
}
