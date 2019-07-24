import { Option, Some, None, tuple} from 'space-lift';
import { ErrorType } from "./ErrorType";
import { metriclcs, edit } from "../Edit/MetricLcs";

export class CharError implements ErrorType {
    private _expectedChar : string;
    public _editDistance : number;

    constructor(expectedChar : string, editDistance : number) {
        this._expectedChar = expectedChar;
        this._editDistance = editDistance;
    }

    getEdit(): number {
        return this._editDistance;
    }

    setEdit(d: number): void{
        this._editDistance = d;
    }

    rootCause() : Option<ErrorType> {
        return None;
    }

    explanation() {
        return "character " + " ' " + this._expectedChar + " ' "; 
    }

    minEdit(input: string, expectedStr: string) : edit[] {
        return metriclcs(input, expectedStr);
    }

    expectedStr() : string {
        return this._expectedChar;
    }

    toString() : string {
        return "CharError -> " + " ' " + this._expectedChar + " ' "; 
    }
}