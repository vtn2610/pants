import { Option, Some, None, tuple} from 'space-lift';
import { ErrorType } from "./ErrorType";
import { edit } from "../Edit/MetricLcs";
import { CharUtil } from "../charstream"
import CharStream = CharUtil.CharStream;
import { totalmem } from 'os';
import { AbstractError } from './AbstractError';
import { Primitives } from '../primitives';
import Success = Primitives.Success;

export class SeqError<T> extends AbstractError<T> {

    constructor(rootCauses : ErrorType<T>[], editDistance : number, success : Success<T>) {
        super();
        this._editDistance = editDistance;
        this._success = Some(success);
    }

    get expectedStr() : string{
        if (this._rootCauses.isDefined()) {
            return this._rootCauses.get()[0].expectedStr
        } else {
            throw new Error("no expected String")
        }
    } 
    
    explanation() {
        return "bind";
    }

    toString() : string {
        return "BindError"; 
    }
}