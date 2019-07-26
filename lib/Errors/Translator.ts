import { Option, Some, None } from 'space-lift';
import { ErrorType, ItemError, CharError, SatError, DigitError,
         LetterError, WSError, StringError, BetweenLeftError, BetweenRightError } from "./ErrorIndex";
import { CharUtil } from "../charstream"
import CharStream = CharUtil.CharStream;

export class Translator {
    private _errorType : ErrorType;
    constructor(errorType : ErrorType) {
        this._errorType = errorType;
    }

    toString() : string {
        let result : string = "Hey, you're missing ";
        let finger : ErrorType = this._errorType;
        do {
            result += finger.explanation();
            result += " ";
            finger = finger.rootCause().getOrElse(new ItemError(0, new CharStream("")));
        } while (finger.rootCause().isDefined())
        result += finger.explanation();

        return result
    }
}