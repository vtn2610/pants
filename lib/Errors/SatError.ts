import { Option, Some, None, tuple} from 'space-lift';
import { ErrorType } from "./ErrorType";
import { edit, metriclcs } from "../Edit/MetricLcs";
import { CharUtil } from "../charstream"
import CharStream = CharUtil.CharStream;

export class SatError implements ErrorType {
    private _expectedStr : string[];
    public _editDistance : number;
    public _modifiedString : CharStream;

    constructor(expectedStr : string[], editDistance : number, modifiedString : CharStream) {
        this._expectedStr = expectedStr;
        this._editDistance = editDistance;
        this._modifiedString = modifiedString
    }
    set cause(newCause : ErrorType) {
    }

    get modString(){return this._modifiedString;}
    
    set modString(s : CharStream){this._modifiedString = s;}

    get edit(): number {
        return this._editDistance;
    }

    set edit(d: number){
        this._editDistance = d;
    }

    rootCause() : Option<ErrorType> {
        return None;
    }

    get errors() : string[] {
        return this._expectedStr;
    }

    explanation() {
        return "";
    }

    expectedStr(): string{
        return this._expectedStr[0];
    }

    toString() {
        return "SatError -> " + this._expectedStr; 
    }
}