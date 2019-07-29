import { Option } from 'space-lift';
import { CharUtil } from "../charstream";
import CharStream = CharUtil.CharStream;
export interface ErrorType {
    cause: ErrorType;
    rootCause(): Option<ErrorType>;
    explanation(): string;
    expectedStr(): string;
    edit: number;
    modString: CharStream;
}
