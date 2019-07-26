import { Option, Some, None, tuple} from 'space-lift';
import { ErrorType } from "./ErrorType";
import { metriclcs, edit } from "../Edit/MetricLcs";

export class CharError implements ErrorType {
    private _expectedChar : string;
    public _editDistance : number;
    private _rootCause : ErrorType | undefined;

    constructor(expectedChar : string, editDistance : number, rootCause? : ErrorType) {
        this._expectedChar = expectedChar;
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