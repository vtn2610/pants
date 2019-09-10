import { CharUtil } from "./charstream";
import CharStream = CharUtil.CharStream;
import { ErrorType } from "./Errors/ErrorType";
import { edit } from "./Edit/Levenshtein";
export declare namespace Primitives {
    class EOFMark {
        private static _instance;
        private constructor();
        static readonly Instance: EOFMark;
    }
    const EOF: EOFMark;
    /**
     * Represents an Errors composition function.
     */
    interface EComposer {
        (f: ErrorType): ErrorType;
    }
    /**
     * Represents a successful parse.
     */
    class Success<T> {
        tag: "success";
        inputstream: CharStream;
        result: T;
        /**
         * Returns an object representing a successful parse.
         * @param istream The remaining string.
         * @param res The result of the parse
         */
        constructor(istream: CharStream, res: T);
    }
    /**
     * Represents a failed parse.
     */
    class Failure {
        tag: "failure";
        error_pos: number;
        errors: ErrorType[];
        /**
         * Returns an object representing a failed parse.
         *
         * @param error_pos The position of the parsing failure in istream
         * @param error The error message for the failure
         */
        constructor(error_pos: number, errors: ErrorType[]);
    }
    /**
     * Union type representing a successful or failed parse.
     */
    type Outcome<T> = Success<T> | Failure;
    /**
     * Generic type of a parser.
     */
    interface IParser<T> {
        (inputstream: CharStream): Outcome<T>;
    }
    /**
     * result succeeds without consuming any input, and returns v.
     * @param v The result of the parse.
     */
    function result<T>(v: T): IParser<T>;
    /**
     * zero fails without consuming any input.
     * @param expecting the error message.
     */
    function zero<T>(expecting: string): IParser<T>;
    function minEdit(input: string, expectedStr: string): edit[];
    /**
     * item successfully consumes the first character if the input
     * string is non-empty, otherwise it fails. When it fails, it
     * returns an ItemError with edit distance 1.
     */
    function item(): (istream: CharUtil.CharStream) => Failure | Success<CharUtil.CharStream>;
    /**
     * bind is a curried function that takes a parser p and returns
     * a function that takes a parser f which returns the composition
     * of p and f.  If _any_ of the parsers fail, the original inputstream
     * is returned in the Failure object (i.e., bind backtracks).
     * @param p A parser
     */
    function bind<T, U>(p: IParser<T>): (f: (t: T) => IParser<U>) => (istream: CharUtil.CharStream) => Outcome<U>;
    function delay<T>(p: IParser<T>): () => IParser<T>;
    /**
     * seq is a curried function that takes a parser p, a parser q,
     * and a function f. It applies p to the input, passing the
     * remaining input stream to q; q is then applied.  The function
     * f takes the result of p and q, as a tuple, and returns
     * a single result. There are four total combinations of parser fails
     * and successes.
     *
     * Case 1. Both p and q succeed: We return a successful parse.
     *
     * Case 2. p fails but q succeeds: We fix the inputstream for p,
     * and parse the modified input with q. Since q succeeds, we return
     * a SeqError that wraps p's Error.
     *
     * Case 3. p succeeds but q fails: We fix the inputstream for q,
     * and return a SeqError wrapping q's Error.
     *
     * Case 4. Both p and q fail: We fix the inputstream for both p
     * and q, and return a SeqError wrapping both p's and q's Errors
     *
     * @param p A parser
     */
    function seq<T, U, V>(p: IParser<T>): (q: IParser<U>) => (f: (e: [T, U]) => V) => (istream: CharUtil.CharStream) => Failure | Success<V>;
    /**
     * sat takes a predicate and yields a parser that consumes a
     * single character if the character satisfies the predicate,
     * otherwise it fails. If sat fails, then it determines whether
     * the failure was from a missing character or incorrect
     * character. If missing, it inserts a character, and if incorrect,
     * it replaces a character.
     */
    function sat(char_class: string[]): IParser<CharStream>;
    /**
     * char takes a character and yields a parser that consume
     * that character. The returned parser succeeds if the next
     * character in the input stream is c, otherwise it fails.
     * If it fails, it decides whether it fails from a missing
     * character or StringError, and fixes accordingly
     * @param c
     */
    function char(c: string, edit?: edit, strMode?: boolean): IParser<CharStream>;
    function lower_chars(): string[];
    function upper_chars(): string[];
    /**
     * letter returns a parser that consumes a single alphabetic
     * character, from a-z, regardless of case. If it fails, it
     * decides whether or not to insert or replace based on the edit
     * distance.
     */
    function letter(): IParser<CharStream>;
    /**
     * digit returns a parser that consumes a single numeric
     * character, from 0-9.  Note that the type of the result
     * is a string, not a number. If it fails, it
     * decides whether or not to insert or replace based on the edit
     * distance.
     */
    function digit(): IParser<CharStream>;
    /**
     * upper returns a parser that consumes a single character
     * if that character is uppercase.
     */
    function upper(): IParser<CharStream>;
    /**
     * lower returns a parser that consumes a single character
     * if that character is lowercase.
     */
    function lower(): IParser<CharStream>;
    /**
     * choice specifies an ordered choice between two parsers,
     * p1 and p2. The returned parser will first apply
     * parser p1.  If p1 succeeds, p1's Outcome is returned.
     * If p1 fails, p2 is applied and the Outcome of p2 is returned.
     * If both parsers fail, then we choose the failure that can
     * be fixed with the minimum number of edits, and return
     * that parser.
     *
     * @param p1 A parser.
     */
    function choice<T>(p1: IParser<T>): (p2: IParser<T>) => IParser<T>;
    /**
     * Like choice, but chooses from multiple possible parsers
     * Example usage: choices(p1, p2, p3)
     *
     * @param parsers An array of parsers to try
     */
    function choices<T>(...parsers: IParser<T>[]): IParser<T>;
    /**
     * appfun allows the user to apply a function f to
     * the result of a parser p, assuming that p is successful.
     * @param p A parser.  This is the same as the |>>
     * function from FParsec.
     */
    function appfun<T, U>(p: IParser<T>): (f: (t: T) => U) => (istream: CharUtil.CharStream) => Failure | Success<U>;
    /**
     * failAppfun allows the user to apply a function f to
     * the result of a parser p, assuming that p fails.
     * @param p A parser.
     */
    function failAppfun<T>(p: IParser<T>): (f: (fail: Failure) => Failure) => (istream: CharUtil.CharStream) => Outcome<T>;
    /**
     * many repeatedly applies the parser p until p fails. many always
     * succeeds, even if it matches nothing.
     * many tries to guard against an infinite loop by raising an exception
     * if p succeeds without changing the parser state.
     * @param p The parser to try
     */
    function many<T>(p: IParser<T>): IParser<T[]>;
    /**
     * many1 repeatedly applies the parser p until p fails. many1 must
     * succeed at least once.  many1 tries to guard against an infinite
     * loop by raising an exception if p succeeds without changing the
     * parser state.
     * @param p The parser to try
     */
    function many1<T>(p: IParser<T>): (istream: CharUtil.CharStream) => Failure | Success<T[]>;
    /**
     * str yields a parser for the given string. It first calculates
     * the number of edits needed to fix the string given what is
     * expected, and then incrementally uses char to fix the string
     * @param s A string
     */
    function str(s: string): IParser<CharStream>;
    /**
     * Returns a parser that succeeds only if the end of the
     * input has been reached.
     */
    function eof(): IParser<EOFMark>;
    /**
     * fresult returns a parser that applies the parser p,
     * and if p succeeds, returns the value x.
     * @param p a parser
     */
    function fresult<T, U>(p: IParser<T>): (x: U) => (istream: CharUtil.CharStream) => Outcome<U>;
    /**
     * left returns a parser that applies the parser p,
     * then the parser q, and if both are successful,
     * returns the result of p.
     * @param p a parser
     */
    function left<T, U>(p: IParser<T>): (q: IParser<U>) => (istream: CharUtil.CharStream) => Failure | Success<T>;
    /**
     * right returns a parser that applies the parser p,
     * then the parser q, and if both are successful,
     * returns the result of q.
     * @param p a parser
     */
    function right<T, U>(p: IParser<T>): (q: IParser<U>) => (istream: CharUtil.CharStream) => Failure | Success<U>;
    /**
     * between returns a parser that applies the parser
     * popen, p, and pclose in sequence, and if all are
     * successful, returns the result of p.
     * @param popen the first parser
     */
    function between<T, U, V>(popen: IParser<T>): (pclose: IParser<U>) => (p: IParser<V>) => IParser<V>;
    /**
     * The debug parser takes a parser p and a debug string,
     * printing the debug string as a side-effect before
     * applying p to the input.
     * @param p a parser
     */
    function debug<T>(p: IParser<T>): (label: string) => (istream: CharUtil.CharStream) => Outcome<T>;
    /**
     * nl matches and returns a newline.
     */
    function nl(): IParser<CharStream>;
    /**
     * ws matches zero or more of the following whitespace characters:
     * ' ', '\t', '\n', or '\r\n'
     * ws returns matched whitespace in a single CharStream result.
     * Note: ws NEVER fails
     */
    function ws(): IParser<CharStream>;
    /**
     * ws1 matches one or more of the following whitespace characters:
     * ' ', '\t', '\n', or '\r\n'
     * ws1 returns matched whitespace in a single CharStream result.
     */
    function ws1(): IParser<CharStream>;
    function strSat(strs: string[]): IParser<CharStream>;
}
