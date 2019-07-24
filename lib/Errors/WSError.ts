import { ErrorType } from "./ErrorType";
import { Option, Some, None } from "space-lift";
import { metriclcs, edit } from "../Edit/MetricLcs";

export class WSError implements ErrorType {
    public _editDistance : number;

    constructor(editDistance : number) {
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
        return "white space";
    }

    minEdit(input: string, expectedStr: string) : edit[] {
        return metriclcs(input, expectedStr);
    }

    expectedStr() : string {
        return " " ;
    }

    toString() : string {
        return "WSError"; 
    }
}