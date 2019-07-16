import { ErrorType } from "./ErrorType";
import { Option } from "space-lift";
export declare class LetterError implements ErrorType {
    rootCause(): Option<ErrorType>;
    explanation(): string;
    minEdit(input: string, expectedStr: string): number;
    expectedStr(): string;
    toString(): string;
}