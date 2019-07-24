import { Option, Some, None, tuple} from 'space-lift';
import { ErrorType } from "./ErrorType";
import { metriclcs, edit } from "../Edit/MetricLcs";

export class StringError implements ErrorType {
    public _expectedStr : string;
    public _editDistance : number;

    constructor(expectedStr : string, editDistance : number) {
        this._expectedStr = expectedStr;
        this._editDistance = editDistance;
    }

    get edit(): number {
        return this._editDistance;
    }

    set edit(d: number){
        this._editDistance = d;
    }

    rootCause() : Option<ErrorType> {
        return None;
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