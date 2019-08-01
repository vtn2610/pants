import { Option, Some, None, tuple} from 'space-lift';
import { ErrorType } from "./ErrorType";
import { edit } from "../Edit/MetricLcs";
import { CharUtil } from "../charstream"
import CharStream = CharUtil.CharStream;
import { totalmem } from 'os';
import { AbstractError } from './AbstractError';
import { Primitives } from '../primitives';
import Success = Primitives.Success;

export class SeqError extends AbstractError {
    protected _firstFailed = true;
    protected _secondFailed = true;

    constructor(rootCauses : ErrorType[], modStream : CharStream, editDistance : number, firstFailed : boolean, secondFailed : boolean) {
        super();
        this._firstFailed = firstFailed;
        this._secondFailed = secondFailed;
        this._rootCauses = Some(rootCauses);
        this._editDistance = editDistance;
        this._modStream = modStream;
    }

    get firstFailed(){
        return this._firstFailed;
    }
    get secondFailed(){
        return this._secondFailed;
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
        return "SeqError"; 
    }
}