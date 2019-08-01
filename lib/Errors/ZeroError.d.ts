import { AbstractError } from './AbstractError';
export declare class ZeroError extends AbstractError {
    readonly expectedStr: string;
    explanation(): string;
    toString(): string;
}
