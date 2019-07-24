import { ErrorType } from "./ErrorType";
import { Option } from "space-lift";
import { edit } from "../Edit/MetricLcs";
export declare class WSError implements ErrorType {
    _editDistance: number;
    constructor(editDistance: number);
    getEdit(): number;
    setEdit(d: number): void;
    rootCause(): Option<ErrorType>;
    explanation(): string;
    minEdit(input: string, expectedStr: string): edit[];
    expectedStr(): string;
    toString(): string;
}
