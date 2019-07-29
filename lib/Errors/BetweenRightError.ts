import { Option, Some, None, tuple} from 'space-lift';
import { ErrorType } from "./ErrorType";
import { edit } from "../Edit/MetricLcs";
import { CharUtil } from "../charstream";
import CharStream = CharUtil.CharStream;

export class BetweenRightError implements ErrorType {
    private _rootCause : ErrorType;
    public _editDistance : number;
    public _modifiedString: CharStream;
    
    constructor(rootCause : ErrorType, editDistance : number,  modifiedString: CharStream) {
        this._rootCause = rootCause;
        this._editDistance = editDistance;
        this._modifiedString = modifiedString;
    }
    
    set cause(newCause : ErrorType) {
        this._rootCause = newCause;
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

    explanation() : string {
        return "right part";
    }

    expectedStr() : string {
        return this._rootCause.expectedStr();
    }

    toString() {
        return "BetweenRightError -> " + this._rootCause; 
    }
}