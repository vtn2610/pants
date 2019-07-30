import { ErrorType } from "./ErrorType";
import { Option, Some, None } from "space-lift";
import { metriclcs, edit } from "../Edit/MetricLcs";
import { CharUtil } from "../charstream"
import CharStream = CharUtil.CharStream;

export class BindError implements ErrorType {
    public _editDistance : number;
    public _modifiedString: CharStream;
    private _rootCauses : ErrorType[] | undefined;
    
    constructor(editDistance : number, modifiedString: CharStream, rootCauses? : ErrorType[]) {
        this._editDistance = editDistance;
        this._modifiedString = modifiedString;
        this._rootCauses = rootCauses;
    }

    set causes(newCause : ErrorType[]) {
        this._rootCauses = newCause;
    }

    // getTotalEdit() : number {
    //     let total = this.edit;
    //     let rootCause = this.rootCause();
    //     if (rootCause.isDefined()) {
    //         total += rootCause.get().getTotalEdit()
    //     }
    //     return total;
    // }

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

    explanation() : string {
        return "";
    }

    expectedStr() : string {
        return "" ;
    }

    toString() : string {
        return "BindError"; 
    }
}