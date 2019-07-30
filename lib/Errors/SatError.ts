import { Option, Some, None, tuple} from 'space-lift';
import { ErrorType } from "./ErrorType";
import { edit } from "../Edit/MetricLcs";
import { CharUtil } from "../charstream"
import CharStream = CharUtil.CharStream;
import { totalmem } from 'os';
import { AbstractError } from './AbstractError';
import { Primitives } from '../primitives';
import Success = Primitives.Success;

export class SatError extends AbstractError<CharStream> {

    constructor(rootCauses : ErrorType<CharStream>[], editDistance : number, success : Success<CharStream>) {
        super();
        this._editDistance = editDistance;
        this._success = Some(success);
    }

    explanation() {
        return "sat";
    }

    toString() {
        return "SatError";
    }
}