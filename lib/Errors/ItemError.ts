import { Option, Some, None, tuple} from 'space-lift';
import { ErrorType } from "./ErrorType";
import { edit } from "../Edit/MetricLcs";
import { CharUtil } from "../charstream"
import CharStream = CharUtil.CharStream;
import { totalmem } from 'os';
import { AbstractError } from './AbstractError';

export class ItemError extends AbstractError{

    constructor() {
        super();
        this._editDistance = 1;

    }

    get expectedStr() : string{
        return " ";
    } 
    
    explanation() {
        return "something";
    }

    toString() : string {
        return "ItemError"; 
    }
}