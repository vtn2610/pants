import { Option, Some, None, tuple} from 'space-lift';
import { ErrorType } from "./ErrorType";
import { edit } from "../Edit/MetricLcs";

export class SatError implements ErrorType {
    private _expectedStr : string[];
    public _editDistance : number;

    constructor(expectedStr : string[], editDistance : number) {
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

    get errors() : string[] {
        return this._expectedStr;
    }

    explanation() {
        return "";
    }

    minEdit(input: string, expectedStr: string) : edit[] {
        return [];
    }

    expectedStr(): string{
        return this._expectedStr[0];
    }

    toString() {
        return "SatError -> " + this._expectedStr; 
    }
}