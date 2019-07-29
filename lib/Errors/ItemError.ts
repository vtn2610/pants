import { ErrorType } from "./ErrorType";
import { Option, Some, None } from "space-lift";
import { metriclcs, edit } from "../Edit/MetricLcs";
import { CharUtil } from "../charstream"
import CharStream = CharUtil.CharStream;

export class ItemError implements ErrorType {
    public _editDistance : number;
    public _modifiedString: CharStream;

    constructor(editDistance : number, modifiedString: CharStream) {
        this._editDistance = editDistance;
        this._modifiedString = modifiedString;
    }

    set cause(newCause : ErrorType) {
    }

    get modString(){return this._modifiedString;}
    
    set modString(s : CharStream){this._modifiedString = s;}

    get edit(): number {return this._editDistance;}

    set edit(d : number){this._editDistance = d;}

    rootCause() : Option<ErrorType> {
        return None;
    }

    expectedStr() : string {
        return " ";
    }

    explanation() {
        return "";
    }

    toString() : string {
        return "ItemError"; 
    }
}