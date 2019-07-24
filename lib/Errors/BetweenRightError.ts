import { Option, Some, None, tuple} from 'space-lift';
import { ErrorType } from "./ErrorType";
import { edit } from "../Edit/MetricLcs";

export class BetweenRightError implements ErrorType {
    private _rootCause : ErrorType;
    public _editDistance : number;
    
    constructor(rootCause : ErrorType, editDistance : number) {
        this._rootCause = rootCause;
        this._editDistance = editDistance;
    }

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
        return "right part";
    }

    minEdit(input: string, expectedStr: string = "") : edit[] {
        return this._rootCause.minEdit(input, expectedStr);
    }

    expectedStr() : string {
        return ")" ;
    }

    toString() {
        return "BetweenRightError -> " + this._rootCause; 
    }
}