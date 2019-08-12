import { Option, Some, None, tuple} from 'space-lift';
import { ErrorType } from "./ErrorType";
import { edit } from "../Edit/MetricLcs";
import { CharUtil } from "../charstream"
import CharStream = CharUtil.CharStream;
import { totalmem } from 'os';
import { AbstractError } from './AbstractError';
import { Primitives } from '../primitives';
import Success = Primitives.Success;

export class ZeroError extends AbstractError {

    get expectedStr() : string{
        return "";
    } 

    explanation() {
        return "zero";
    }

    toString() : string {
        return "ZeroError"; 
    }
}