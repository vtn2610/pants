import { Option } from 'space-lift';
import { edit } from "../Edit/MetricLcs";
export interface ErrorType {
    rootCause(): Option<ErrorType>;
    explanation(): string;
    minEdit(input: string, expectedStr: string): edit[];
    expectedStr(): string;
    edit: number;
}
