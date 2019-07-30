import { Option, Some, None, tuple} from 'space-lift';
import { ErrorType } from "./ErrorType";
import { edit } from "../Edit/MetricLcs";
import { CharUtil } from "../charstream"
import CharStream = CharUtil.CharStream;
import { totalmem } from 'os';
import { AbstractError } from './AbstractError';
import { Primitives } from '../primitives';
import Success = Primitives.Success;

export class BetweenRightError<T> extends AbstractError<T> {

    constructor(rootCauses : ErrorType<T>[], editDistance : number, success : Success<T>) {
        super();
        this._editDistance = editDistance;
        this._success = Some(success);
    }

    explanation() : string {
        return "left";
    }

    toString() {
        return "BetweenRightError -> " + this._rootCauses; 
    }
}