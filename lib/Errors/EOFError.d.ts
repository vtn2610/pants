import { AbstractError } from './AbstractError';
export declare class EOFError extends AbstractError {
    readonly expectedStr: string;
    explanation(): string;
    toString(): string;
}
