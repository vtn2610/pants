import { ErrorType } from "./ErrorType";
import { Option } from "space-lift";
import { CharUtil } from "../charstream";
import CharStream = CharUtil.CharStream;
export declare abstract class AbstractError implements ErrorType {
    protected _editDistance: number;
    protected _rootCauses: Option<ErrorType[]>;
    protected _modStream: CharStream;
    causes: ErrorType[];
    abstract expectedStr: string;
    edit: number;
    modStream: CharStream;
}
