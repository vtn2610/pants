import { Option, Some, None, tuple} from 'space-lift';
import { ErrorType } from "./ErrorType";
import { edit } from "../Edit/MetricLcs";
import { CharUtil } from "../charstream"
import CharStream = CharUtil.CharStream;
import { totalmem } from 'os';
import { AbstractError } from './AbstractError';
import { Primitives } from '../primitives';
import Success = Primitives.Success;

export class RightError extends AbstractError {

    constructor(rootCauses : ErrorType[], modStream : CharStream, editDistance : number) {
        super();
        this._rootCauses = Some(rootCauses);
        this._editDistance = editDistance;
        this._modStream = modStream;
    }

    get expectedStr() : string{
        if (this._rootCauses.isDefined()) {
            return this._rootCauses.get()[0].expectedStr
        } else {
            throw new Error("no expected String")
        }
    } 
    
    explanation() {
        return "right";
    }

    toString() : string {
        return "RightError"; 
    }
}