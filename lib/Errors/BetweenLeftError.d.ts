import { Option } from 'space-lift';
import { ErrorType } from "./ErrorType";
import { edit } from "../Edit/MetricLcs";
export declare class BetweenLeftError implements ErrorType {
    private _rootCause;
    _editDistance: number;
    constructor(rootCause: ErrorType, editDistance: number);
    getEdit(): number;
    setEdit(d: number): void;
    rootCause(): Option<ErrorType>;
    explanation(): string;
    minEdit(input: string, expectedStr: string): edit[];
    expectedStr(): string;
    toString(): string;
}
