import { Option, Some, None, tuple} from 'space-lift';
import { ErrorType } from "./ErrorType";
import { edit } from "../Edit/MetricLcs";
import { CharUtil } from "../charstream"
import CharStream = CharUtil.CharStream;
import { totalmem } from 'os';

export class BetweenLeftError implements ErrorType {
    private _rootCause : ErrorType;
    public _editDistance : number;
    public _modifiedString: CharStream;   

    constructor(rootCause : ErrorType, editDistance : number, modifiedString : CharStream) {
        this._rootCause = rootCause;
        this._editDistance = editDistance;
        this._modifiedString = modifiedString;
    }

    getTotalEdit() : number {
        let total = this.edit;
        let rootCause = this.rootCause();
        if (rootCause.isDefined()) {
            total += rootCause.get().getTotalEdit()
        }
        return total;
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

    expectedStr() : string {
        return this._rootCause.expectedStr();
    }

    explanation() : string {
        return "left";
    }

    toString() {
        return "BetweenLeftError -> " + this._rootCause;
    }
}