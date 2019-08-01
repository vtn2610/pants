import { Option, Some, None, tuple} from 'space-lift';
import { ErrorType } from "./ErrorType";
import { edit } from "../Edit/MetricLcs";
import { CharUtil } from "../charstream"
import CharStream = CharUtil.CharStream;
import { totalmem } from 'os';
import { AbstractError } from './AbstractError';
import { Primitives } from '../primitives';
import Success = Primitives.Success;

export class SatError extends AbstractError {

    private _expectedChars : string[];
    
    constructor(editDistance : number, expectedChars : string[]) {
        super();
        this._expectedChars = expectedChars;
        this._editDistance = editDistance;
    }

    get expectedStr() : string{
        //TODO: replace arbitrary choice with function
        return this._expectedChars[0];
    } 

    explanation() {
        return "sat";
    }

    toString() {
        return "SatError";
    }
}