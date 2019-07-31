import { ErrorType } from "./ErrorType";
import { Option, Some, None } from "space-lift";
import { metriclcs, edit } from "../Edit/MetricLcs";
import { CharUtil } from "../charstream"
import CharStream = CharUtil.CharStream;
import { Primitives } from '../primitives';
import Success = Primitives.Success;

export abstract class AbstractError implements ErrorType {
    protected _editDistance : number = 0;
    protected _rootCauses : Option<ErrorType[]> = None;

    get causes() : ErrorType[] {
        if (this._rootCauses.isDefined()) {
            return this._rootCauses.get();
        } else {
            throw new Error("Rootcause is not defined");
        }
    }

    set causes(newCauses : ErrorType[]) {
        this._rootCauses = Some(newCauses)
    }

    abstract expectedStr: string;
    
    get edit(): number {
        return this._editDistance;
    }

    set edit(d: number){
        this._editDistance = d;
    }

    abstract modStream : CharStream;
    
}