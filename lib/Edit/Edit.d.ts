import { ErrorType } from "../Errors/ErrorType";
export declare class Edit {
    private _input;
    private _error;
    private _prevEdit;
    constructor(input: string, error: ErrorType, prevEdit?: number);
}
