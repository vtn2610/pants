import { Option } from 'space-lift';
import { CharUtil } from "../charstream";
import CharStream = CharUtil.CharStream;
export interface ErrorType {
    getTotalEdit(): number;
    cause: ErrorType;
    rootCause(): Option<ErrorType>;
    explanation(): string;
    expectedStr(): string;
    edit: number;
    modString: CharStream;
}
