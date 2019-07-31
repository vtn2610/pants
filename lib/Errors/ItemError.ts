import { Option, Some, None, tuple} from 'space-lift';
import { ErrorType } from "./ErrorType";
import { edit } from "../Edit/MetricLcs";
import { CharUtil } from "../charstream"
import CharStream = CharUtil.CharStream;
import { totalmem } from 'os';
import { AbstractError } from './AbstractError';

export class ItemError extends AbstractError{

    constructor(rootCauses : ErrorType[], editDistance : number) {
        super();
        this._editDistance = editDistance;
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