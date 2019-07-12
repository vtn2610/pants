import { Option, Some, None, tuple} from 'space-lift';
import { ErrorType } from "./ErrorType";

export class CharError implements ErrorType {
    private _expectedChar : string;

    constructor(expectedChar : string) {
        this._expectedChar = expectedChar;
    }

    rootCause() : Option<ErrorType> {
        return None;
    }

    explanation() {
        return "character " + " ' " + this._expectedChar + " ' "; 
    }

    toString() : string {
        return "CharError -> " + " ' " + this._expectedChar + " ' "; 
    }
}