import { Option, Some, None, tuple} from 'space-lift';
import { ErrorType } from "./ErrorType";
import { edit, metriclcs } from "../Edit/MetricLcs";

export class SatError implements ErrorType {
    private _expectedStr : string[];

    constructor(expectedStr : string[]) {
        this._expectedStr = expectedStr;
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
        return metriclcs(input, expectedStr);
    }

    expectedStr(): string{
        return this._expectedStr[0];
    }

    toString() {
        return "SatError -> " + this._expectedStr; 
    }
}