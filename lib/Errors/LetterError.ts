import { ErrorType } from "./ErrorType";
import { Option, Some, None } from "space-lift";
import { metriclcs, edit } from "../Edit/MetricLcs";
import { CharUtil } from "../charstream"
import CharStream = CharUtil.CharStream;

export class LetterError implements ErrorType {
    public _editDistance : number;
    public _modifiedString: CharStream;
    private _rootCause : ErrorType | undefined;

    constructor(editDistance : number, modifiedString: CharStream, rootCause? : ErrorType) {
        this._editDistance = editDistance;
        this._modifiedString = modifiedString;
        this._rootCause = rootCause;
    }

    set cause(newCause : ErrorType) {
        this._rootCause = newCause;
    }

    getTotalEdit() : number {
        let total = this.edit;
        let rootCause = this.rootCause();
        if (rootCause.isDefined()) {
            total += rootCause.get().getTotalEdit()
        }
        return total;
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
        if (this._rootCause == undefined) {
            return None;
        } else {
            return Some(this._rootCause);
        }
    }

    explanation() {
        return "letter";
    }

    minEdit(input: string, expectedStr: string) : edit[] {
        return metriclcs(input, expectedStr);
    }

    expectedStr() : string {
        return "a" ;
    }

    toString() : string {
        return "LetterError"; 
    }
}