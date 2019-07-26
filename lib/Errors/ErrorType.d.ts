import { Option } from 'space-lift';
import { edit } from "../Edit/MetricLcs";
import { CharUtil } from "../charstream";
import CharStream = CharUtil.CharStream;
export interface ErrorType {
    rootCause(): Option<ErrorType>;
    explanation(): string;
    minEdit(input: string, expectedStr: string): edit[];
    expectedStr(): string;
    edit: number;
    modString: CharStream;
}
