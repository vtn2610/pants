import { ErrorType } from "./ErrorType";
import { Option, Some, None } from "space-lift";
import { metriclcs, edit } from "../Edit/MetricLcs";
import { CharUtil } from "../charstream"
import CharStream = CharUtil.CharStream;
import { Primitives } from '../primitives';
import Success = Primitives.Success;

export abstract class AbstractError<T> implements ErrorType<T> {
    protected _editDistance : number = 0;
    protected _success : Option<Success<T>> = None;
    protected _rootCauses : Option<ErrorType<T>[]> = None;

    get success() : Success<T> {
        if (this._success.isDefined()) {
            return this._success.get();
        } else {
            throw new Error("Success is not defined");
        }
    }

    set success(newSuccess : Success<T>) {
        this._success = Some(newSuccess);
    }

    get causes() : ErrorType<T>[] {
        if (this._rootCauses.isDefined()) {
            return this._rootCauses.get();
        } else {
            throw new Error("Rootcause is not defined");
        }
    }

    set causes(newCauses : ErrorType<T>[]) {
        this._rootCauses = Some(newCauses)
    }
    
    abstract explanation() : string
    
    abstract expectedStr: string
    
    get edit(): number {
        return this._editDistance;
    }

    set edit(d: number){
        this._editDistance = d;
    }

    get modString() : CharStream {
        if (this._success.isDefined()) {
            return this._success.get().inputstream;
        } else {
            throw new Error("Success is not defined");
        }
    }
}