import { Option, Some, None, tuple} from 'space-lift';
import { ErrorType } from "./ErrorType";
import { edit } from "../Edit/MetricLcs";
import { CharUtil } from "../charstream"
import CharStream = CharUtil.CharStream;
import { totalmem } from 'os';

export class BetweenLeftError implements ErrorType {
    private _rootCauses : ErrorType[];
    public _editDistance : number;
    public _modifiedString: CharStream;   

    constructor(rootCauses : ErrorType[], editDistance : number, modifiedString : CharStream) {
        this._rootCauses = rootCauses;
        this._editDistance = editDistance;
        this._modifiedString = modifiedString;
    }

    // getTotalEdit() : number {
    //     let total = this.edit;
    //     let rootCause = this.rootCause();
    //     if (rootCause.isDefined()) {
    //         total += rootCause.get().getTotalEdit()
    //     }
    //     return total;
    // }

    set causes(newCause : ErrorType[]) {
        this._rootCauses = newCause;
    }

    get modString(){return this._modifiedString;}
    
    set modString(s : CharStream){this._modifiedString = s;}
    
    get edit(): number {
        return this._editDistance;
    }

    set edit(d: number){
        this._editDistance = d;
    }

    rootCauses() : Option<ErrorType[]> {
        if (this._rootCauses == undefined) {
            return None;
        } else {
            return Some(this._rootCauses);
        }
    }

    expectedStr() : string {
        return "(";
    }

    explanation() : string {
        return "left";
    }

    toString() {
        return "BetweenLeftError -> " + this._rootCauses;
    }
}