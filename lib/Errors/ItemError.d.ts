import { AbstractError } from './AbstractError';
export declare class ItemError extends AbstractError {
    constructor();
    readonly expectedStr: string;
    explanation(): string;
    toString(): string;
}
