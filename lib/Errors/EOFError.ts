import { Option, Some, None, tuple} from 'space-lift';
import { ErrorType } from "./ErrorType";
import { edit } from "../Edit/MetricLcs";
import { CharUtil } from "../charstream"
import CharStream = CharUtil.CharStream;
import { totalmem } from 'os';
import { AbstractError } from './AbstractError';

export class EOFError extends AbstractError {

    get expectedStr() : string{
        return "eof";
    } 
    
    explanation() {
        return "eof";
    }

    toString() : string {
        return "EOFError"; 
    }
}