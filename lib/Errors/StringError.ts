import { Option, Some, None, tuple} from 'space-lift';
import { ErrorType } from "./ErrorType";
import { metriclcs, edit } from "../Edit/MetricLcs";
import { CharUtil } from "../charstream"
import CharStream = CharUtil.CharStream;

export class StringError implements ErrorType {
    public _expectedStr : string;
    public _editDistance : number;
    public _modifiedString: CharStream;
    private _rootCauses : ErrorType[] | undefined;

    constructor(expectedStr : string, editDistance : number, modifiedString: CharStream, rootCauses? : ErrorType[]) {
        this._expectedStr = expectedStr;
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
        return "string " + " ' " + this._expectedStr + " ' "; 
    }

    minEdit(input: string, expectedStr: string) : edit[] {
        return metriclcs(input, expectedStr);
    }

    expectedStr() : string {
        return this._expectedStr;
    }

    toString() {
        return "StringError -> " + " ' " + this._expectedStr + " ' "; 
    }
}