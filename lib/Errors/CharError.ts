import { Option, Some, None, tuple} from 'space-lift';
import { ErrorType } from "./ErrorType";
import { metriclcs, edit } from "../Edit/MetricLcs";
import { CharUtil } from "../charstream"
import CharStream = CharUtil.CharStream;

export class CharError implements ErrorType {
    private _expectedChar : string;
    private _rootCause : ErrorType | undefined;
    public _editDistance : number;
    public _modifiedString: CharStream;

    constructor(expectedChar : string, editDistance : number, modifiedString: CharStream) {
        this._expectedChar = expectedChar;
        this._editDistance = editDistance;
        this._modifiedString = modifiedString;
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
        return "character " + " ' " + this._expectedChar + " ' "; 
    }

    expectedStr() : string {
        return this._expectedChar;
    }

    toString() : string {
        return "CharError -> " + " ' " + this._expectedChar + " ' "; 
    }
}