import { Option, Some, None, tuple} from 'space-lift';
import { ErrorType } from "./ErrorType";
import { edit } from "../Edit/MetricLcs";
import { CharUtil } from "../charstream"
import CharStream = CharUtil.CharStream;
import { totalmem } from 'os';
import { AbstractError } from './AbstractError';
import { Primitives } from '../primitives';
import Success = Primitives.Success;

export class CharError extends AbstractError {

    private _expectedChar : string;

    constructor(rootCauses : ErrorType[], editDistance : number, expectedChar : string) {
        super();
        this._editDistance = editDistance;
        this._expectedChar = expectedChar;
        this._rootCauses = Some(rootCauses);
    }

    get expectedStr() : string{
        return this._expectedChar
    }

    explanation() {
        return "character " + " ' " + this._expectedChar + " ' "; 
    }

    toString() : string {
        return "CharError -> " + " ' " + this._expectedChar + " ' "; 
    }
}