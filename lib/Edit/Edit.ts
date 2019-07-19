import { ErrorType } from "../Errors/ErrorType";
import { StringError,CharError, DigitError, ItemError, LetterError, SatError,
         WSError, BetweenLeftError, BetweenRightError } from "../Errors/ErrorIndex";


export class Edit {
    private _input: string;
    private _error: ErrorType;
    private _prevEdit: number;

    constructor(input: string, error: ErrorType, prevEdit: number = 0){
        this._input = input;
        this._error = error;
        this._prevEdit = prevEdit;
    }
}
