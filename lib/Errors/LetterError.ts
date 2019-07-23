import { ErrorType } from "./ErrorType";
import { Option, Some, None } from "space-lift";
import { metriclcs } from "../Edit/MetricLcs";

export class LetterError implements ErrorType {

    rootCause() : Option<ErrorType> {
        return None;
    }

    explanation() {
        return "letter";
    }

    minEdit(input: string, expectedStr: string) : string[] {
        return metriclcs(input, expectedStr);
    }

    expectedStr() : string {
        return "a" ;
    }

    toString() : string {
        return "LetterError"; 
    }
}