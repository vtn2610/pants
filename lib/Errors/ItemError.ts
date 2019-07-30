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

    set causes(newCause : ErrorType[]) {
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

    get edit(): number {return this._editDistance;}

    set edit(d : number){this._editDistance = d;}

    rootCauses() : Option<ErrorType[]> {
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