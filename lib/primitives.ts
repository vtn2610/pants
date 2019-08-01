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
import { BetweenLeftError } from "./Errors/BetweenLeftError";
import { BetweenRightError } from "./Errors/BetweenRightError";
import { BindError } from "./Errors/BindError";
import { ZeroError } from "./Errors/ZeroError";
import { SeqError } from "./Errors/SeqError";
import { EOFError } from "./Errors/EOFError";
import { GenericError } from "./Errors/GenericError";
import { None, Some, Option } from "space-lift";
import { metriclcs, edit } from "./Edit/MetricLcs";
import { parser } from "marked";

export namespace Primitives {

    function id<T>(t : T) : T{
        return t;
    }

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

        /**
     * failParser takes a Failure and returns a parser guaranteed to fail
     * @param fail Failure<T>
     */
    export function failParser<T>(fail: Failure): IParser<T> {
        return (istream: CharStream) => {
            return fail;
        }
    }

    export function minEdit(input : string, expectedStr : string) {
        return metriclcs(input, expectedStr);
    }

    /**
     * expect tries to apply the given parser and returns the result of that parser
     * if it succeeds, otherwise it replaces the current stream with a stream with
     * modified code given a correct edit, and tries again.
     *
     * @param parser The parser to try
     * @param f A function that produces a new Errors given an existing Errors
     */
    export function expect<T>(parser: IParser<T>) : (f: EComposer) => IParser<T> {
        return (f: EComposer) => {
            return (istream: CharStream) => {
                let outcome: Outcome<T> = parser(istream);
                switch (outcome.tag) {
                    case "success":
                        return outcome;
                    case "failure":
                        let fail: Failure = outcome;
                        let errors : ErrorType[] = fail.errors;

                        let newErrors : ErrorType[] = errors.map(e => {
                            //computes the size of the substring required for LCS
                            let windowSize = e.expectedStr.length;

                            //the actual substring inside window
                            let inputBound = istream.input.substring(fail.error_pos, fail.error_pos + windowSize);

                            //the set of edits returned via LCS
                            let editsSet = minEdit(inputBound, e.expectedStr);

                            //the corrected stream and edit distance after applying edits within window
                            let edits : [number,CharStream] = editParse(parser, istream, e.edit, windowSize, fail.error_pos, fail.error_pos, editsSet);

                            //set edit distance and modified stream in error object, and advance start pos
                            e.edit = edits[0];
                            e.modStream = edits[1].seek(windowSize);
                            
                            //apply error composition
                            return f(e);
                        });
                        return new Failure(istream.startpos, newErrors);
                }
            }
        };
    }

    /**
     * item successfully consumes the first character if the input
     * string is non-empty, otherwise it fails.
     */
    export function item() {
        return (istream: CharStream) => {
            if (istream.isEmpty()) {
                //On Failure, the edit distance must be 1, which is
                //set inside ItemError constructor
                return new Failure(istream.startpos, [new ItemError()]);
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
            function _bind<T, U>(p: IParser<T>) {
                return (f: (t: T) => IParser<U>) => {
                    return (istream: CharStream) => {
                        let r = p(istream);
                        switch (r.tag) {
                            case "success":
                                let o: Outcome<U> = f(r.result)(r.inputstream);
                                switch (o.tag) {
                                    case "success":
                                    // case 1: both parsers succeed
                                        return o;
                                    default: // note: backtracks, returning original istream
                                    // case 2: parser 1 succeeds, 2 fails
                                        let o2 : Outcome<U>= new Failure(o.error_pos, o.errors);
                                        return o2;
                                }
                            case "failure":
                                //apply parser again with modified inputstream;
                                const flatMap = (f : any, arr : any[]) => arr.reduce((x, y) => [...x, ...f(y)], [])
                                let errors : ErrorType[] = flatMap((e : ErrorType) => {
                                    let r2 = p(e.modStream);
                                    switch (r2.tag){
                                        case "success":
                                            return [e];
                                        default:
                                            return r2.errors;
                                    }
                                }, r.errors);
                                return new Failure(r.error_pos, errors);
                        }
                    }
                }
            }
            return _bind<T,U>(p)(f)
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
     * a single result.
     * @param p A parser
     * 
     */

    export function seq<T, U, V>(p: IParser<T>) {
        return (q: IParser<U>) => {
            return (f: (e: [T, U]) => V) => {
                let firstFailed = false;
                let secondFailed = false;
                let qDoer = (x : T) => {
                    let q1 = bind<U, V>(q)((y) => {
                        let tup: [T, U] = [x, y];
                        return result<V>(f(tup));
                    });
                    let q2 = failAppfun(q1)((f : Failure) => { 
                        secondFailed = true;
                        let minError = argMin(f.errors, e => e.edit);
                        let e2 = new SeqError(f.errors, minError.modStream, minError.edit,firstFailed,secondFailed);
                        return new Failure(e2.modStream.startpos, [e2]);
                    });
                    return q2;
                };
                let p1 = bind<T, V>(p)(qDoer);
                let p2 = failAppfun(p1)((f : Failure) => { 
                    if (secondFailed){
                        //TODO: arbitrary modified stream
                        let minError = argMin(f.errors, e => e.edit);
                        //We know this parse cannot fail because we have
                        //modified the input stream
                        let o2 = failAppfun(p1)(f2 => {
                            //both p and q fail
                            let minError2 = argMin(f2.errors, e => e.edit);
                            firstFailed = true;
                            let e = new SeqError(f.errors.concat(f2.errors), minError.modStream, 
                                minError.edit + minError2.edit,firstFailed,secondFailed);
                            return new Failure(e.modStream.startpos, [e]);
                        })(minError.modStream);
                        switch (o2.tag){
                            case "success":
                                //p failed, q succeed, so return p's failure
                                return f;
                            default:
                                //both p and q fail
                                return o2;
                        }
                    } else {
                        //p succeeded, q failed
                        return f;
                    }
                });
                return p2;
            }
        };
    }

    /**
     * sat takes a predicate and yields a parser that consumes a
     * single character if the character satisfies the predicate,
     * otherwise it fails.
     */
    export function sat(char_class: string[]): IParser<CharStream> {
        let f = (x: CharStream) => {
            return (char_class.indexOf(x.toString()) > -1)
                ? result(x)
                //If item succeeds but character is wrong, then the edit distance is
                //2 due to deletion then insertion of correct character
                : (istream: CharStream) => new Failure(istream.startpos - 1, [new SatError(2,char_class)]);
        };
        let b = bind<CharStream, CharStream>(item())(f);
        //If item fails, then we insert the correct character,
        //which is edit distance 1
        return failAppfun(b)(f => {
            return new Failure(f.error_pos, [new SatError(1,char_class)]);
        });
    }

    /**
     * char takes a character and yields a parser that consume
     * that character. The returned parser succeeds if the next
     * character in the input stream is c, otherwise it fails.
     * @param c
     */
    export function char(c: string): IParser<CharStream> {
        if (c.length != 1) {
            throw new Error("char parser takes a string of length 1 (i.e., a char)");
        }
        return failAppfun(sat([c]))(f => {
            let e = new CharError(f.errors,f.errors[0].edit,c);
            e.modStream = e.modStream.replaceCharAt(f.error_pos,c);
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
     * character, from a-z, regardless of case.
     */
    export function letter(): IParser<CharStream> {
        let parser : IParser<CharStream> = sat(lower_chars().concat(upper_chars()));
        return expect(parser)((e : ErrorType) => new LetterError(e.causes, e.edit));
    }

    /**
     * digit returns a parser that consumes a single numeric
     * character, from 0-9.  Note that the type of the result
     * is a string, not a number.
     */
    export function digit(): IParser<CharStream> {
        let parser : IParser<CharStream> = sat(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
        return expect(parser)((e : ErrorType) => new DigitError(e.causes, e.edit));
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
     *
     * An exception is when an outcome is a critical failure,
     * that outcome is immediately returned.
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
                                return new Failure(errorpos, allErrors);
                        }
                }
            };
        };
    }

    /**
     * Like choice, but chooses from multiple possible parsers
     * First considers the farthest failing error, and if there
     * are multiple, calculate longest common subsequence for each choice, 
     * and returns the maximum LCS
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
    //performs the force parse, and returns ultimately the LCS length
    export function editParse2<T>(p: IParser<T>, istream : CharStream, LCS: number, windowSize : number, orgErrorPos : number, curErrorPos : number, edits: edit[]): [number,CharStream] {
        if (curErrorPos - orgErrorPos < windowSize) {
            let o = p(istream);
            switch (o.tag) {
                case "success":
                    break; //Keep parsing with next parser
                case "failure":
                    let e = <Failure> o;
                    let str = istream.input;
                    curErrorPos = e.error_pos;
                    let newEdit : string = "";
                    console.log(edits);
                    if (edits.length !== 0) {
                        let curEdit : edit | undefined = edits.shift();
                        // case of insertion
                        if (curEdit !== undefined && curEdit.sign === true) { 
                            if (edits[0] !== undefined && edits[0].pos == curEdit.pos && edits[0].sign === false) {
                                // case of replacement
                                let replace = edits.shift();
                                console.log(curEdit.char + " changed letter");
                                if (replace !== undefined) str = str.substring(0, curErrorPos + curEdit.pos) + curEdit.char + str.substring(curErrorPos + curEdit.pos + 1);
                                LCS += 2;
                            } else {

                            str = str.substring(0, curErrorPos + curEdit.pos) + curEdit.char + str.substring(curErrorPos + curEdit.pos);
                            for (let item of edits) {
                                item.pos++;
                            }
                            LCS++;
                        }

                        // case of deletion
                        } else if (curEdit !== undefined && curEdit.sign === false) {
                            str = str.substring(0, curErrorPos + curEdit.pos) + str.substring(curErrorPos + curEdit.pos + 1);
                            for (let item of edits) {
                                item.pos--;
                            }
                            LCS++;
                        }
                    }
                    
                    return editParse(p, new CharStream(str), LCS, newEdit.length, orgErrorPos, curErrorPos, edits);
                    //calculate LCS, replace istream, and call LCSParse on same parser
            }
        } 
        return [LCS, istream];
    }

    export let editParsecount = 0;

    //performs the force parse, and returns ultimately the LCS length
    export function editParse<T>(p: IParser<T>, istream : CharStream, LCS: number, windowSize : number, orgErrorPos : number, curErrorPos : number, edits: edit[]): [number,CharStream] {
        editParsecount++;
        let o = p(istream);
        let string = istream.input;
        switch (o.tag) {
            case "success":
                break; //Keep parsing with next parser
            case "failure":
                let e = <Failure> o;
                curErrorPos = e.error_pos;
                //let maxEdit : number = edits.length;
                while (edits.length > 0) {
                    let curEdit : edit | undefined = edits.shift();
                    // case of insertion
                    if (curEdit !== undefined && curEdit.sign === true) { 
                        if (edits[0] !== undefined && edits[0].pos == curEdit.pos && edits[0].sign === false) {
                            // case of replacement
                            let replace = edits.shift();
                            if (replace !== undefined) string = string.substring(0, curErrorPos + curEdit.pos) + curEdit.char + string.substring(curErrorPos + curEdit.pos + 1);
                                LCS += 2;
                        } else {
                            string = string.substring(0, curErrorPos + curEdit.pos) + curEdit.char + string.substring(curErrorPos + curEdit.pos);
                            for (let item of edits) {
                                item.pos++;
                            }
                            LCS++;
                            windowSize++;
                        }
                    // case of deletion
                    } else if (curEdit !== undefined && curEdit.sign === false) {
                        string = string.substring(0, curErrorPos + curEdit.pos) + string.substring(curErrorPos + curEdit.pos + 1);
                        for (let item of edits) {
                            item.pos--;
                        }
                        LCS++;
                        windowSize--;
                    }
                    if (p(new CharStream(string)).tag == "success") {break}
                }        
            }
        return [LCS, new CharStream(string)];
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
     * succeeds, even if it matches nothing or if an outcome is critical.
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
            return seq<T, T[], T[]>(expect(p)((e: ErrorType) => e))(many<T>(p))(tup => {
                let hd: T = tup["0"];
                let tl: T[] = tup["1"];
                tl.unshift(hd);
                return tl;
            })(istream);
        };
    }

    /**
     * str yields a parser for the given string.
     * @param s A string
     */
    export function str(s: string): IParser<CharStream> {
        function _str(s :string): IParser<CharStream> {
            let chars: string[] = s.split("");
            let p = result(new CharStream(""));
            let f = (tup: [CharStream, CharStream]) => tup[0].concat(tup[1]);
            for (let c of chars) {
                p = seq<CharStream, CharStream, CharStream>(p)(char(c))(f);
            }
            return p;
        }
        return expect<CharStream>(_str(s))(e => new StringError([e], s));
    }

    /**
     * Returns a parser that succeeds only if the end of the
     * input has been reached.
     */
    export function eof(): IParser<EOFMark> {
        return (istream: CharStream) => {
            return istream.isEOF() ? new Success(istream, EOF) : new Failure(istream.startpos, [new EOFError()]);
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
            return (istream: CharStream) => {
                return bind<T, T>(p)((t: T) => fresult<U, T>(q)(t))(istream);
            }
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
            return (istream: CharStream) => {
                return bind<T, U>(p)(_ => q)(istream);
            }
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
                let l: IParser<V> = left<V, U>(p)(expect(pclose)(
                    (e : ErrorType) => {
                        return new BetweenRightError(e.causes, e.edit)
                    }
                ));

                let r: IParser<V> = right<T, V>(expect(popen)(
                    (e : ErrorType) => new BetweenLeftError(e.causes, e.edit)
                ))(l);
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
            let o = expect(many1(wschars))((e: ErrorType) => new WSError(e.causes, e.edit))(istream);
            switch (o.tag) {
                case "success":
                    return new Success(o.inputstream, CharStream.concat(o.result));
                case "failure":
                    return o;
            }
        }
    }

    /**
     * nl matches and returns a newline.
     */
    export function nl(): IParser<CharStream> {
        return choice(str("\n"))(str("\r\n"));
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
            return new Failure(istream.startpos, [new StringError([],"")]);
        }
    }
}
