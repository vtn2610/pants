import { Option } from 'space-lift';
import { ErrorType } from "./ErrorType";
import { edit } from "../Edit/MetricLcs";
export declare class SatError implements ErrorType {
    private _expectedStr;
    _editDistance: number;
    constructor(expectedStr: string[], editDistance: number);
    getEdit(): number;
    setEdit(d: number): void;
    rootCause(): Option<ErrorType>;
    readonly errors: string[];
    explanation(): string;
    minEdit(input: string, expectedStr: string): edit[];
    expectedStr(): string;
    toString(): string;
}
