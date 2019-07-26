import { Option, Some, None, tuple} from 'space-lift';
import { ErrorType } from "./ErrorType";
import { edit } from "../Edit/MetricLcs";
import { CharUtil } from "../charstream"
import CharStream = CharUtil.CharStream;

export class BetweenLeftError implements ErrorType {
    private _rootCause : ErrorType;
    public _editDistance : number;
    public _modifiedString: CharStream;   

    constructor(rootCause : ErrorType, editDistance : number, modifiedString : CharStream) {
        this._rootCause = rootCause;
        this._editDistance = editDistance;
        this._modifiedString = modifiedString;
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
        return Some(this._rootCause);
    }

    explanation() : string {
        return "left";
    }

    minEdit(input: string, expectedStr: string) : edit[] {
        return this._rootCause.minEdit(input, expectedStr);
    }

    expectedStr() : string {
        return "(" ;
    }

    toString() {
        return "BetweenLeftError -> " + this._rootCause;
    }
}