import { CharUtil } from "./charstream";
import CharStream = CharUtil.CharStream;
import { ErrorType } from "./Errors/ErrorType";
import { ItemError } from "./Errors/ItemError";
import { CharError } from "./Errors/CharError";
import { SatError } from "./Errors/SatError";
import { DigitError } from "./Errors/DigitError";
import { LetterError } from "./Errors/LetterError";
import { WSError } from "./Errors/WSError";
import { StringError } from "./Errors/StringError";
import { LeftError } from "./Errors/LeftError";
import { RightError } from "./Errors/RightError";
import { BindError } from "./Errors/BindError";
import { ZeroError } from "./Errors/ZeroError";
import { SeqError } from "./Errors/SeqError";
import { EOFError } from "./Errors/EOFError";
import { GenericError } from "./Errors/GenericError";
import { None, Some, Option } from "space-lift";
import { levenshtein, edit } from "./Edit/Levenshtein";
import { parser } from "marked";
import { BetweenRightError } from "../lib/Errors/BetweenRightError";
import { BetweenLeftError } from "../lib/Errors/BetweenLeftError";

export namespace Primitives {

    /**
     * function that finds the minimum of an array of objects
     * via a number parameter in each object
     */
    function argMin<T>(ts : T[], f : (t : T) => number) : T {
        let element = ts[0];
        for (let i = 1; i < ts.length; i++){
            if (f(ts[i]) < f(element)){
                element = ts[i];
            }
        }
        return element;
    }

    export class EOFMark {
        private static _instance: EOFMark;
        private constructor() { }
        public static get Instance() {
            return this._instance || (this._instance = new this());
        }
    }
    export const EOF = EOFMark.Instance;

    /**
     * Represents an Errors composition function.
     */
    export interface EComposer {
        (f: ErrorType): ErrorType;
    } 

    /**
     * Represents a successful parse.
     */
    export class Success<T> {
        tag: "success" = "success";
        inputstream: CharStream;
        result: T;

        /**
         * Returns an object representing a successful parse.
         * @param istream The remaining string.
         * @param res The result of the parse
         */
        constructor(istream: CharStream, res: T) {
            this.inputstream = istream;
            this.result = res;
        }
    }

    /**
     * Represents a failed parse.
     */
    export class Failure {
        tag: "failure" = "failure";
        error_pos: number;
        errors: ErrorType[];

        /**
         * Returns an object representing a failed parse.
         *
         * @param error_pos The position of the parsing failure in istream
         * @param error The error message for the failure
         */
        constructor(
            error_pos: number,
            errors: ErrorType[]
        ) {
            this.error_pos = error_pos;
            this.errors = errors;
        }
    }

    /**
     * Union type representing a successful or failed parse.
     */
    export type Outcome<T> = Success<T> | Failure;

    /**
     * Generic type of a parser.
     */
    export interface IParser<T> {
        (inputstream: CharStream): Outcome<T>
    }

    /**
     * result succeeds without consuming any input, and returns v.
     * @param v The result of the parse.
     */
    export function result<T>(v: T): IParser<T> {
        return (istream) => {
            return new Success<T>(istream, v);
        }
    }

    /**
     * zero fails without consuming any input.
     * @param expecting the error message.
     */
    export function zero<T>(expecting: string): IParser<T> {
        return (istream) => {
            return new Failure(istream.startpos, [new ZeroError()]);
        }
    }

    export function minEdit(input : string, expectedStr : string) {
        return levenshtein(input, expectedStr);
    }

    /**
     * item successfully consumes the first character if the input
     * string is non-empty, otherwise it fails. When it fails, it 
     * returns an ItemError with edit distance 1.
     */
    export function item() {
        return (istream: CharStream) => {
            if (istream.isEmpty()) {
                //On Failure, the edit distance must be 1, which is
                //set inside ItemError constructor
                let e = new ItemError();
                e.modStream = new CharStream(istream.input, istream.startpos);
                return new Failure(istream.startpos, [e]);
            } else {
                let remaining = istream.tail(); // remaining string;
                let res = istream.head(); // result of parse;
                return new Success(remaining, res);
            }
        }
    }

    /**
     * bind is a curried function that takes a parser p and returns
     * a function that takes a parser f which returns the composition
     * of p and f.  If _any_ of the parsers fail, the original inputstream
     * is returned in the Failure object (i.e., bind backtracks).
     * @param p A parser
     */
    export function bind<T, U>(p: IParser<T>) {
        return (f: (t: T) => IParser<U>) => {
            return (istream: CharStream) => {
                let r = p(istream);
                switch (r.tag) {
                    case "success":
                        let o = f(r.result)(r.inputstream);
                        switch (o.tag) {
                            case "success":
                                break;
                            case "failure": // note: backtracks, returning original istream
                                return new Failure(o.error_pos, o.errors);
                        }
                        return o;
                    case "failure":
                        return new Failure(r.error_pos, r.errors);
                }
            }
        }
    }

    export function delay<T>(p: IParser<T>) {
        return () => p;
    }

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

    export function seq<T, U, V>(p: IParser<T>) {
        return (q: IParser<U>) => {
            return (f: (e: [T, U]) => V) => {
                return (istream: CharStream) => {
                    let o1 = p(istream);
                    switch (o1.tag){
                        case "success":
                            let o2 = q(o1.inputstream);
                            switch(o2.tag){
                                //p and q succeed
                                case "success":
                                    return new Success<V>(o2.inputstream, f([o1.result, o2.result]));
                                //p succeeds and q fails
                                default:
                                    let minError = argMin(o2.errors, e => e.edit);
                                    let e = new SeqError(o2.errors, minError.modStream, minError.edit, false, true)
                                    return new Failure(o2.error_pos, [e]);
                            }
                        default:
                            let minError2 = argMin(o1.errors, e => e.edit);
                            //parse q with modified istream if p fails
                            let o3 = q(minError2.modStream);
                            switch (o3.tag){
                                case "success":
                                    //p fails but q succeeds
                                    let e = new SeqError(o1.errors, o3.inputstream, minError2.edit, true, false);
                                    return new Failure(o1.error_pos, [e]);
                                default:
                                    //both p and q fail
                                    let minError3 = argMin(o3.errors, e => e.edit);
                                    let e3 = new SeqError(o3.errors.concat(o1.errors), minError3.modStream, minError3.edit + minError2.edit, true, true)
                                    return new Failure(o1.error_pos, [e3])      
                            }
                    }
                }
            }
        };
    }

    /**
     * sat takes a predicate and yields a parser that consumes a
     * single character if the character satisfies the predicate,
     * otherwise it fails. If sat fails, then it determines whether
     * the failure was from a missing character or incorrect 
     * character. If missing, it inserts a character, and if incorrect,
     * it replaces a character.
     */
    export function sat(char_class: string[]): IParser<CharStream> {
        return (istream: CharStream) => {
            let o1 = item()(istream);
            switch (o1.tag){
                //If item fails, then we insert the correct character
                //which is edit distance 1
                case "failure":
                    let e = new SatError(1,char_class);
                    let minError = argMin(o1.errors, e => e.edit);
                    e.modStream = minError.modStream;
                    return new Failure(o1.error_pos, [e])

                default:
                    let f = (x: CharStream) => {
                        return (char_class.indexOf(x.toString()) > -1)
                            ? result(x)
                            //If item succeeds but character is wrong, then the edit distance is
                            //2 due to deletion then insertion of correct character
                            : (istream: CharStream) => {
                                let e = new SatError(2,char_class);
                                let istream2 = new CharStream(istream.input, istream.startpos-1)
                                e.modStream = istream2;
                                return new Failure(istream2.startpos, [e])
                            };
                    };
                return bind<CharStream, CharStream>(item())(f)(istream);
            }
        }
    }

    /**
     * char takes a character and yields a parser that consume
     * that character. The returned parser succeeds if the next
     * character in the input stream is c, otherwise it fails.
     * If it fails, it decides whether it fails from a missing
     * character or StringError, and fixes accordingly
     * @param c
     */
    export function char(c: string, edit : edit = {sign: 2, char : c, pos : 0}, strMode : boolean = false): IParser<CharStream> {
        if (c.length != 1) {
            throw new Error("char parser takes a string of length 1 (i.e., a char)");
        }
        return failAppfun(sat([c]))(f => {
            let e = new CharError(f.errors, 0, edit.char);
            let minError = argMin(f.errors, e => e.edit);
            if (!strMode && minError.edit == 1) edit.sign = 1; //CharError -> SatError -> ItemError
            
            if (edit.sign == 0) { // delete
                e.modStream = minError.modStream.deleteCharAt(f.error_pos, edit.char);
                e.edit = 1;
            } else if (edit.sign == 1) { // insert and consume char
                e.modStream = minError.modStream.insertCharAt(f.error_pos, edit.char);
                e.edit = 1;
            } else if (edit.sign == 2) { // replace and consume char (default)
                e.modStream = minError.modStream.replaceCharAt(f.error_pos, edit.char);
                e.edit = 2;
            }
            return new Failure(f.error_pos, [e]);
        });
    }

    export function lower_chars() {
        return 'abcdefghijklmnopqrstuvwxyz'.split('');
    }

    export function upper_chars() {
        return 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');
    }

    /**
     * letter returns a parser that consumes a single alphabetic
     * character, from a-z, regardless of case. If it fails, it
     * decides whether or not to insert or replace based on the edit
     * distance.
     */
    export function letter(): IParser<CharStream> {
        let parser : IParser<CharStream> = sat(lower_chars().concat(upper_chars()));
        return failAppfun(parser)((f : Failure) => {
            let minError = argMin(f.errors, e => e.edit);
            let e = new LetterError(f.errors, minError.edit)
            if (minError.edit == 1) {
                e.modStream = minError.modStream.insertCharAt(f.error_pos, e.expectedStr);
            } else {
                e.modStream = minError.modStream.replaceCharAt(f.error_pos, e.expectedStr);
            }
            return new Failure(f.error_pos, [e])
        });
    }

    /**
     * digit returns a parser that consumes a single numeric
     * character, from 0-9.  Note that the type of the result
     * is a string, not a number. If it fails, it
     * decides whether or not to insert or replace based on the edit
     * distance.
     */
    export function digit(): IParser<CharStream> {
        let parser : IParser<CharStream> = sat(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
        return failAppfun(parser)((f : Failure) => {
            let minError = argMin(f.errors, e => e.edit);
            let e = new DigitError(f.errors, minError.edit)
            if (minError.edit == 1) {
                e.modStream = minError.modStream.insertCharAt(f.error_pos, e.expectedStr);
            } else {
                e.modStream = minError.modStream.replaceCharAt(f.error_pos, e.expectedStr);
            }
            return new Failure(f.error_pos, [e])
        });
    }

    /**
     * upper returns a parser that consumes a single character
     * if that character is uppercase.
     */
    export function upper(): IParser<CharStream> {
        return sat(upper_chars());
    }

    /**
     * lower returns a parser that consumes a single character
     * if that character is lowercase.
     */
    export function lower(): IParser<CharStream> {
        return sat(lower_chars());
    }

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
    export function choice<T>(p1: IParser<T>): (p2: IParser<T>) => IParser<T> {
        return (p2: IParser<T>) => {
            return (istream: CharStream) => {
                let o1 = p1(istream);
                switch (o1.tag) {
                    case "success":
                        return o1;
                    default:
                        let o2 = p2(istream);
                        switch (o2.tag) {
                            case "success":
                                return o2;
                            default:
                                //Get the errors arrays from both failures
                                let o1Errors = o1.errors;
                                let o2Errors = o2.errors;
                                let allErrors = o1Errors.concat(o2Errors);

                                //TODO: replace with selection function
                                //this is an arbitrary choice, for now
                                let errorpos = Math.min(...allErrors.map(e => e.modStream.startpos));
                                let minError = argMin(allErrors, e => e.edit);
                                return new Failure(errorpos, [minError]);
                        }
                }
            };
        };
    }

    /**
     * Like choice, but chooses from multiple possible parsers
     * Example usage: choices(p1, p2, p3)
     *
     * @param parsers An array of parsers to try
     */
    export function choices<T>(...parsers: IParser<T>[]): IParser<T> {
        if (parsers.length == 0) {
            throw new Error("Error: choices must have a non-empty array.");
        }
        return (parsers.length > 1)
            ? choice<T>(parsers[0])(choices<T>(...parsers.slice(1)))
            : parsers[0];
        
    }
        
    /**
     * appfun allows the user to apply a function f to
     * the result of a parser p, assuming that p is successful.
     * @param p A parser.  This is the same as the |>>
     * function from FParsec.
     */
    export function appfun<T, U>(p: IParser<T>) {
        return (f: (t: T) => U) => {
            return (istream: CharStream) => {
                let o = p(istream);
                switch (o.tag) {
                    case "success":
                        return new Success<U>(o.inputstream, f(o.result));
                    case "failure":
                        return o;
                }
            }
        }
    }

    /**
     * failAppfun allows the user to apply a function f to
     * the result of a parser p, assuming that p fails.
     * @param p A parser.
     */
    export function failAppfun<T>(p: IParser<T>) {
        return (f: (fail: Failure) => Failure) => {
            return (istream: CharStream) => {
                let o = p(istream);
                switch (o.tag) {
                    case "success":
                        return o;
                    default:
                        return f(o);
                }
            }
        }
    }

    /**
     * many repeatedly applies the parser p until p fails. many always
     * succeeds, even if it matches nothing.
     * many tries to guard against an infinite loop by raising an exception
     * if p succeeds without changing the parser state.
     * @param p The parser to try
     */
    export function many<T>(p: IParser<T>): IParser<T[]> {
        return (istream: CharStream) => {
            let istream2 = istream;
            let outputs: T[] = [];
            let succeeds = true;
            while (!istream2.isEmpty() && succeeds) {
                let o = p(istream2);
                switch (o.tag) {
                    case "success":
                        if (istream2 == o.inputstream) {
                            throw new Error("Parser loops infinitely.");
                        }
                        istream2 = o.inputstream;
                        outputs.push(o.result);
                        break;
                    case "failure":
                        succeeds = false;
                        break;
                }
            }
            return new Success(istream2, outputs);
        }
    }

    /**
     * many1 repeatedly applies the parser p until p fails. many1 must
     * succeed at least once.  many1 tries to guard against an infinite
     * loop by raising an exception if p succeeds without changing the
     * parser state.
     * @param p The parser to try
     */
    export function many1<T>(p: IParser<T>) {
        return (istream: CharStream) => {
            return seq<T, T[], T[]>(p)(many<T>(p))(tup => {
                let hd: T = tup["0"];
                let tl: T[] = tup["1"];
                tl.unshift(hd);
                return tl;
            })(istream);
        };
    }

    /**
     * str yields a parser for the given string. It first calculates
     * the number of edits needed to fix the string given what is 
     * expected, and then incrementally uses char to fix the string
     * @param s A string
     */
    export function str(s: string): IParser<CharStream> {
        return (istream : CharStream) => {
            let input = istream.input.substr(istream.startpos, istream.startpos + s.length);
            let window = s.length;
            let edits = minEdit(input, s);
            let p = result(new CharStream(""));
            let f = (tup: [CharStream, CharStream]) => tup[0].concat(tup[1]);
            let edit : undefined | edit = edits.shift();
            for (let i = 0; i < window; i++) { //edits to be fixed <= windowSize
                if (edit != undefined && i == edit.pos) { // fail and fix
                    //TODE: edge case: double characters Ex: ellipse and elipse
                    p = seq<CharStream, CharStream, CharStream>(p)(char(s[i], edit, true))(f);
                    if (edit.sign == 0) --i;  //delete case
                    if (edit.sign == 1 && i < input.length) { //insert case
                        for (let edit of edits) ++edit.pos;
                    } 
                    edit = edits.shift();
                } else { // succeed
                    p = seq<CharStream, CharStream, CharStream>(p)(char(s[i], {sign: 2, char : s[i], pos : 0}, true))(f);
                }
            }
            let outcome = p(istream);
            switch (outcome.tag) {
                case "success":
                    return outcome;
                default:
                    let e = new StringError(outcome.errors, s);
                    let minError = argMin(outcome.errors, e => e.edit);
                    e.edit = minError.edit;
                    e.modStream = minError.modStream;
                    return new Failure(istream.startpos, [e]);
            }
        }
    }

    /**
     * Returns a parser that succeeds only if the end of the
     * input has been reached.
     */
    export function eof(): IParser<EOFMark> {
        return (istream: CharStream) => {
            if (istream.isEOF()) {
                return new Success(istream, EOF);
            } 
            let e = new EOFError();
            let newInput = istream.input.substr(0, istream.startpos);
            e.modStream = new CharStream(newInput, istream.startpos, istream.startpos);
            //Effectively replacing with ws to avoid degenerate behavior
            //TODO Does not get interpreted in choice correctly
            e.edit = 2*(istream.input.length - newInput.length);
            return new Failure(istream.startpos, [e]);
        }
    }

    /**
     * fresult returns a parser that applies the parser p,
     * and if p succeeds, returns the value x.
     * @param p a parser
     */
    export function fresult<T, U>(p: IParser<T>) {
        return (x: U) => {
            return (istream: CharStream) => {
                return bind<T, U>(p)((t: T) => result(x))(istream);
            }
        }
    }

    /**
     * left returns a parser that applies the parser p,
     * then the parser q, and if both are successful,
     * returns the result of p.
     * @param p a parser
     */
    export function left<T, U>(p: IParser<T>) {
        return (q: IParser<U>) => {
            return failAppfun(seq<T,U,T>(p)(q)(tup => tup[0]))(f => {
                let minError = argMin(f.errors, e => e.edit);
                let e = new LeftError(minError.causes, minError.modStream, minError.edit);
                return new Failure(f.error_pos, [e])  
            })
        }
    }

    /**
     * right returns a parser that applies the parser p,
     * then the parser q, and if both are successful,
     * returns the result of q.
     * @param p a parser
     */
    export function right<T, U>(p: IParser<T>) {
        return (q: IParser<U>) => {
            return failAppfun(seq<T,U,U>(p)(q)(tup => tup[1]))(f => {
                let minError = argMin(f.errors, e => e.edit);
                let e = new RightError(minError.causes, minError.modStream, minError.edit);
                return new Failure(f.error_pos, [e])  
            })
        }
    }

    /**
     * between returns a parser that applies the parser
     * popen, p, and pclose in sequence, and if all are
     * successful, returns the result of p.
     * @param popen the first parser
     */
    export function between<T, U, V>(popen: IParser<T>): (pclose: IParser<U>) => (p: IParser<V>) => IParser<V> {
        return (pclose: IParser<U>) => {
            return (p: IParser<V>) => {
                let l: IParser<V> = failAppfun(left<V, U>(p)(pclose))((f : Failure) => {
                    let minError = argMin(f.errors, e => e.edit);
                    let e = new BetweenRightError(minError.causes, minError.edit);
                    e.modStream = minError.modStream;
                    return new Failure(f.error_pos, [e]);
                });
                let r: IParser<V> = failAppfun(right<T, V>(popen)(l))((f : Failure) => {
                    let minError = argMin(f.errors, e => e.edit);
                    let e = new BetweenLeftError(minError.causes, minError.edit);
                    e.modStream = minError.modStream;
                    return new Failure(f.error_pos, [e]);
                });
                return r;
            }
        }
    }

    /**
     * The debug parser takes a parser p and a debug string,
     * printing the debug string as a side-effect before
     * applying p to the input.
     * @param p a parser
     */
    export function debug<T>(p: IParser<T>) {
        return (label: string) => {
            return (istream: CharStream) => {
                ("apply: " + label + ", startpos: " + istream.startpos + ", endpos: " + istream.endpos);
                let o = p(istream);
                switch (o.tag) {
                    case "success":
                        console.log("success: " + label + ", startpos: " + istream.startpos + ", endpos: " + istream.endpos);
                        break;
                    case "failure":
                        console.log("failure: " + label + ", startpos: " + istream.startpos + ", endpos: " + istream.endpos);
                        break;
                }
                return o;
            }
        }
    }

    let wschars: IParser<CharStream> = choice(sat([' ', "\t"]))(nl());

    /**
     * nl matches and returns a newline.
     */
    export function nl(): IParser<CharStream> {
        return sat(["\n","\r\n"]);
        //choice(sat(["\n"]))(sat(["\r\n"]));
    }

    /**
     * ws matches zero or more of the following whitespace characters:
     * ' ', '\t', '\n', or '\r\n'
     * ws returns matched whitespace in a single CharStream result.
     * Note: ws NEVER fails
     */
    export function ws(): IParser<CharStream> {
        return (istream: CharStream) => {
            let o = many(wschars)(istream);
            switch (o.tag) {
                case "success":
                    return new Success(o.inputstream, CharStream.concat(o.result));
                default:
                    return o;
            }
        }
    }

    /**
     * ws1 matches one or more of the following whitespace characters:
     * ' ', '\t', '\n', or '\r\n'
     * ws1 returns matched whitespace in a single CharStream result.
     */
    export function ws1(): IParser<CharStream> {
        return (istream: CharStream) => {
            let o = (wschars)(istream);
            switch (o.tag) {
                case "success":
                    let o2 = <Success<CharStream[]>>many(wschars)(istream)
                    return new Success(o.inputstream, CharStream.concat([o.result].concat(o2.result)));
                case "failure":
                    let minError = argMin(o.errors, e => e.edit);
                    let e = new WSError(o.errors, 1);
                    e.modStream = minError.modStream.insertCharAt(o.error_pos, e.expectedStr);
                    let o3 = <Success<CharStream[]>>many(wschars)(e.modStream);
                    e.modStream = o3.inputstream;
                    return new Failure(o.error_pos, [e]);
            }
        }
    }

    function groupBy<T, U>(list: T[], keyGetter: (e: T) => U): Map<U, T[]> {
        let m: Map<U, T[]> = new Map<U, T[]>();
        list.forEach((item) => {
            const key = keyGetter(item);
            if (!m.has(key)) {
                m.set(key, []);
            }
            let collection = m.get(key)!;
            collection.push(item);
        });
        return m;
    }

    export function strSat(strs: string[]): IParser<CharStream> {
        // sort strings first by length, and then lexicograpically;
        // slice() called here so as not to modify original array
        let smap = groupBy(strs, s => s.length);
        let sizes: number[] = [];
        // find size classes;
        // also sort each set of equivalent-length values
        smap.forEach((vals: string[], key: number, m: Map<number, string[]>) => {
            sizes.push(key);
            vals.sort();
        });
        sizes.sort().reverse();

        return (istream: CharStream) => {
            // start with the smallest size class
            for (let peekIndex = 0; peekIndex < sizes.length; peekIndex++) {
                // for each size class, try matching all of
                // the strings; if one is found, return the
                // appropriate CharStream; if not, fail.
                let peek = istream.peek(sizes[peekIndex]);
                let tail = istream.seek(sizes[peekIndex]);
                let candidates = smap.get(sizes[peekIndex])!;
                for (let cIndex = 0; cIndex < candidates.length; cIndex++) {
                    if (candidates[cIndex] === peek.toString()) {
                        return new Success(tail, peek);
                    }
                }
            }
            let minStr = argMin(strs, (str : string) => {
                let input = istream.input.substr(istream.startpos, istream.startpos + str.length);
                return minEdit(input, str).length;
            });
            let input = istream.input.substr(istream.startpos, istream.startpos + minStr.length);
            console.log(minEdit(input, minStr))
            return str(minStr)(istream);
        }
    }
}
