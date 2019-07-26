import { ErrorType } from "./ErrorType";
import { Option, Some, None } from "space-lift";
import { metriclcs, edit } from "../Edit/MetricLcs";

export class DigitError implements ErrorType {
    public _editDistance : number;
    private _rootCause : ErrorType | undefined;

    constructor(editDistance : number, rootCause? : ErrorType) {
        this._editDistance = editDistance;
        this._rootCause = rootCause;
    }

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
        return "number";
    }

    minEdit(input: string, expectedStr: string) : edit[] {
        return metriclcs(input, expectedStr);
    }

    expectedStr() : string {
        return "0" ;
    }

    toString() : string {
        return "DigitError"; 
    }
}