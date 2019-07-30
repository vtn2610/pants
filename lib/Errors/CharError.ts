import { Option, Some, None, tuple} from 'space-lift';
import { ErrorType } from "./ErrorType";
import { edit } from "../Edit/MetricLcs";
import { CharUtil } from "../charstream"
import CharStream = CharUtil.CharStream;
import { totalmem } from 'os';
import { AbstractError } from './AbstractError';
import { Primitives } from '../primitives';
import Success = Primitives.Success;

export class CharError extends AbstractError<CharStream> {

    private _expectedChar : string;

    constructor(rootCauses : ErrorType<CharStream>[], editDistance : number, success : Success<CharStream>, expectedChar : string) {
        super();
        this._editDistance = editDistance;
        this._success = Some(success);
        this._expectedChar = expectedChar;
    }

    explanation() {
        return "character " + " ' " + this._expectedChar + " ' "; 
    }

    toString() : string {
        return "CharError -> " + " ' " + this._expectedChar + " ' "; 
    }
}