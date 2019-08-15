"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const charstream_1 = require("./charstream");
var CharStream = charstream_1.CharUtil.CharStream;
const ItemError_1 = require("./Errors/ItemError");
const CharError_1 = require("./Errors/CharError");
const SatError_1 = require("./Errors/SatError");
const DigitError_1 = require("./Errors/DigitError");
const LetterError_1 = require("./Errors/LetterError");
const WSError_1 = require("./Errors/WSError");
const StringError_1 = require("./Errors/StringError");
const LeftError_1 = require("./Errors/LeftError");
const RightError_1 = require("./Errors/RightError");
const ZeroError_1 = require("./Errors/ZeroError");
const SeqError_1 = require("./Errors/SeqError");
const EOFError_1 = require("./Errors/EOFError");
const Levenshtein_1 = require("./Edit/Levenshtein");
const BetweenRightError_1 = require("../lib/Errors/BetweenRightError");
const BetweenLeftError_1 = require("../lib/Errors/BetweenLeftError");
var Primitives;
(function (Primitives) {
    /**
     * function that finds the minimum of an array of objects
     * via a number parameter in each object
     */
    function argMin(ts, f) {
        let element = ts[0];
        for (let i = 1; i < ts.length; i++) {
            if (f(ts[i]) < f(element)) {
                element = ts[i];
            }
        }
        return element;
    }
    class EOFMark {
        constructor() { }
        static get Instance() {
            return this._instance || (this._instance = new this());
        }
    }
    Primitives.EOFMark = EOFMark;
    Primitives.EOF = EOFMark.Instance;
    /**
     * Represents a successful parse.
     */
    class Success {
        /**
         * Returns an object representing a successful parse.
         * @param istream The remaining string.
         * @param res The result of the parse
         */
        constructor(istream, res) {
            this.tag = "success";
            this.inputstream = istream;
            this.result = res;
        }
    }
    Primitives.Success = Success;
    /**
     * Represents a failed parse.
     */
    class Failure {
        /**
         * Returns an object representing a failed parse.
         *
         * @param error_pos The position of the parsing failure in istream
         * @param error The error message for the failure
         */
        constructor(error_pos, errors) {
            this.tag = "failure";
            this.error_pos = error_pos;
            this.errors = errors;
        }
    }
    Primitives.Failure = Failure;
    /**
     * result succeeds without consuming any input, and returns v.
     * @param v The result of the parse.
     */
    function result(v) {
        return (istream) => {
            return new Success(istream, v);
        };
    }
    Primitives.result = result;
    /**
     * zero fails without consuming any input.
     * @param expecting the error message.
     */
    function zero(expecting) {
        return (istream) => {
            return new Failure(istream.startpos, [new ZeroError_1.ZeroError()]);
        };
    }
    Primitives.zero = zero;
    function minEdit(input, expectedStr) {
        return Levenshtein_1.levenshtein(input, expectedStr);
    }
    Primitives.minEdit = minEdit;
    /**
     * item successfully consumes the first character if the input
     * string is non-empty, otherwise it fails. When it fails, it
     * returns an ItemError with edit distance 1.
     */
    function item() {
        return (istream) => {
            if (istream.isEmpty()) {
                //On Failure, the edit distance must be 1, which is
                //set inside ItemError constructor
                let e = new ItemError_1.ItemError();
                e.modStream = new CharStream(istream.input, istream.startpos);
                return new Failure(istream.startpos, [e]);
            }
            else {
                let remaining = istream.tail(); // remaining string;
                let res = istream.head(); // result of parse;
                return new Success(remaining, res);
            }
        };
    }
    Primitives.item = item;
    /**
     * bind is a curried function that takes a parser p and returns
     * a function that takes a parser f which returns the composition
     * of p and f.  If _any_ of the parsers fail, the original inputstream
     * is returned in the Failure object (i.e., bind backtracks).
     * @param p A parser
     */
    function bind(p) {
        return (f) => {
            return (istream) => {
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
            };
        };
    }
    Primitives.bind = bind;
    function delay(p) {
        return () => p;
    }
    Primitives.delay = delay;
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
    function seq(p) {
        return (q) => {
            return (f) => {
                return (istream) => {
                    let o1 = p(istream);
                    switch (o1.tag) {
                        case "success":
                            let o2 = q(o1.inputstream);
                            switch (o2.tag) {
                                //p and q succeed
                                case "success":
                                    return new Success(o2.inputstream, f([o1.result, o2.result]));
                                //p succeeds and q fails
                                default:
                                    let minError = argMin(o2.errors, e => e.edit);
                                    let e = new SeqError_1.SeqError(o2.errors, minError.modStream, minError.edit, false, true);
                                    return new Failure(o2.error_pos, [e]);
                            }
                        default:
                            let minError2 = argMin(o1.errors, e => e.edit);
                            if (minError2.edit > (istream.input.length * 2)) {
                                let stop = new SeqError_1.SeqError(o1.errors, minError2.modStream, minError2.edit, true, true);
                                return new Failure(o1.error_pos, [stop]);
                            }
                            //parse q with modified istream if p fails
                            let o3 = q(minError2.modStream);
                            switch (o3.tag) {
                                case "success":
                                    //p fails but q succeeds
                                    let e = new SeqError_1.SeqError(o1.errors, o3.inputstream, minError2.edit, true, false);
                                    return new Failure(o1.error_pos, [e]);
                                default:
                                    //both p and q fail
                                    let minError3 = argMin(o3.errors, e => e.edit);
                                    let e3 = new SeqError_1.SeqError(o3.errors.concat(o1.errors), minError3.modStream, minError3.edit + minError2.edit, true, true);
                                    return new Failure(o1.error_pos, [e3]);
                            }
                    }
                };
            };
        };
    }
    Primitives.seq = seq;
    /**
     * sat takes a predicate and yields a parser that consumes a
     * single character if the character satisfies the predicate,
     * otherwise it fails. If sat fails, then it determines whether
     * the failure was from a missing character or incorrect
     * character. If missing, it inserts a character, and if incorrect,
     * it replaces a character.
     */
    function sat(char_class) {
        return (istream) => {
            let o1 = item()(istream);
            switch (o1.tag) {
                //If item fails, then we insert the correct character
                //which is edit distance 1
                case "failure":
                    let e = new SatError_1.SatError(1, char_class);
                    let minError = argMin(o1.errors, e => e.edit);
                    e.modStream = minError.modStream;
                    return new Failure(o1.error_pos, [e]);
                default:
                    let f = (x) => {
                        return (char_class.indexOf(x.toString()) > -1)
                            ? result(x)
                            //If item succeeds but character is wrong, then the edit distance is
                            //2 due to deletion then insertion of correct character
                            : (istream) => {
                                let e = new SatError_1.SatError(2, char_class);
                                let istream2 = new CharStream(istream.input, istream.startpos - 1);
                                e.modStream = istream2;
                                return new Failure(istream2.startpos, [e]);
                            };
                    };
                    return bind(item())(f)(istream);
            }
        };
    }
    Primitives.sat = sat;
    /**
     * char takes a character and yields a parser that consume
     * that character. The returned parser succeeds if the next
     * character in the input stream is c, otherwise it fails.
     * If it fails, it decides whether it fails from a missing
     * character or StringError, and fixes accordingly
     * @param c
     */
    function char(c, edit = { sign: 2, char: c, pos: 0 }, strMode = false) {
        if (c.length != 1) {
            throw new Error("char parser takes a string of length 1 (i.e., a char)");
        }
        return failAppfun(sat([c]))(f => {
            let e = new CharError_1.CharError(f.errors, 0, edit.char);
            let minError = argMin(f.errors, e => e.edit);
            if (!strMode && minError.edit == 1)
                edit.sign = 1; //CharError -> SatError -> ItemError
            if (edit.sign == 0) { // delete
                e.modStream = minError.modStream.deleteCharAt(f.error_pos, edit.char);
                e.edit = 1;
            }
            else if (edit.sign == 1) { // insert and consume char
                e.modStream = minError.modStream.insertCharAt(f.error_pos, edit.char);
                e.edit = 1;
            }
            else if (edit.sign == 2) { // replace and consume char (default)
                if (minError.modStream.input.charAt(f.error_pos) == "\n") {
                    e.modStream = minError.modStream.insertCharAt(f.error_pos, edit.char);
                    e.edit = 1;
                }
                else {
                    e.modStream = minError.modStream.replaceCharAt(f.error_pos, edit.char);
                    e.edit = 2;
                }
            }
            return new Failure(f.error_pos, [e]);
        });
    }
    Primitives.char = char;
    function lower_chars() {
        return 'abcdefghijklmnopqrstuvwxyz'.split('');
    }
    Primitives.lower_chars = lower_chars;
    function upper_chars() {
        return 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');
    }
    Primitives.upper_chars = upper_chars;
    /**
     * letter returns a parser that consumes a single alphabetic
     * character, from a-z, regardless of case. If it fails, it
     * decides whether or not to insert or replace based on the edit
     * distance.
     */
    function letter() {
        let parser = sat(lower_chars().concat(upper_chars()));
        return failAppfun(parser)((f) => {
            let minError = argMin(f.errors, e => e.edit);
            let e = new LetterError_1.LetterError(f.errors, minError.edit);
            if (minError.edit == 1) {
                e.modStream = minError.modStream.insertCharAt(f.error_pos, e.expectedStr);
            }
            else {
                e.modStream = minError.modStream.replaceCharAt(f.error_pos, e.expectedStr);
            }
            return new Failure(f.error_pos, [e]);
        });
    }
    Primitives.letter = letter;
    /**
     * digit returns a parser that consumes a single numeric
     * character, from 0-9.  Note that the type of the result
     * is a string, not a number. If it fails, it
     * decides whether or not to insert or replace based on the edit
     * distance.
     */
    function digit() {
        let parser = sat(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
        return failAppfun(parser)((f) => {
            let minError = argMin(f.errors, e => e.edit);
            let e = new DigitError_1.DigitError(f.errors, minError.edit);
            if (minError.edit == 1) {
                e.modStream = minError.modStream.insertCharAt(f.error_pos, e.expectedStr);
            }
            else {
                e.modStream = minError.modStream.replaceCharAt(f.error_pos, e.expectedStr);
            }
            return new Failure(f.error_pos, [e]);
        });
    }
    Primitives.digit = digit;
    /**
     * upper returns a parser that consumes a single character
     * if that character is uppercase.
     */
    function upper() {
        return sat(upper_chars());
    }
    Primitives.upper = upper;
    /**
     * lower returns a parser that consumes a single character
     * if that character is lowercase.
     */
    function lower() {
        return sat(lower_chars());
    }
    Primitives.lower = lower;
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
    function choice(p1) {
        return (p2) => {
            return (istream) => {
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
    Primitives.choice = choice;
    /**
     * Like choice, but chooses from multiple possible parsers
     * Example usage: choices(p1, p2, p3)
     *
     * @param parsers An array of parsers to try
     */
    function choices(...parsers) {
        if (parsers.length == 0) {
            throw new Error("Error: choices must have a non-empty array.");
        }
        return (parsers.length > 1)
            ? choice(parsers[0])(choices(...parsers.slice(1)))
            : parsers[0];
    }
    Primitives.choices = choices;
    /**
     * appfun allows the user to apply a function f to
     * the result of a parser p, assuming that p is successful.
     * @param p A parser.  This is the same as the |>>
     * function from FParsec.
     */
    function appfun(p) {
        return (f) => {
            return (istream) => {
                let o = p(istream);
                switch (o.tag) {
                    case "success":
                        return new Success(o.inputstream, f(o.result));
                    case "failure":
                        return o;
                }
            };
        };
    }
    Primitives.appfun = appfun;
    /**
     * failAppfun allows the user to apply a function f to
     * the result of a parser p, assuming that p fails.
     * @param p A parser.
     */
    function failAppfun(p) {
        return (f) => {
            return (istream) => {
                let o = p(istream);
                switch (o.tag) {
                    case "success":
                        return o;
                    default:
                        return f(o);
                }
            };
        };
    }
    Primitives.failAppfun = failAppfun;
    /**
     * many repeatedly applies the parser p until p fails. many always
     * succeeds, even if it matches nothing.
     * many tries to guard against an infinite loop by raising an exception
     * if p succeeds without changing the parser state.
     * @param p The parser to try
     */
    function many(p) {
        return (istream) => {
            let istream2 = istream;
            let outputs = [];
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
        };
    }
    Primitives.many = many;
    /**
     * many1 repeatedly applies the parser p until p fails. many1 must
     * succeed at least once.  many1 tries to guard against an infinite
     * loop by raising an exception if p succeeds without changing the
     * parser state.
     * @param p The parser to try
     */
    function many1(p) {
        return (istream) => {
            return seq(p)(many(p))(tup => {
                let hd = tup["0"];
                let tl = tup["1"];
                tl.unshift(hd);
                return tl;
            })(istream);
        };
    }
    Primitives.many1 = many1;
    /**
     * str yields a parser for the given string. It first calculates
     * the number of edits needed to fix the string given what is
     * expected, and then incrementally uses char to fix the string
     * @param s A string
     */
    function str(s) {
        return (istream) => {
            let input = istream.input.substring(istream.startpos, istream.startpos + s.length);
            let window = s.length;
            let edits = minEdit(input, s);
            let p = result(new CharStream(""));
            let f = (tup) => tup[0].concat(tup[1]);
            let edit = edits.shift();
            for (let i = 0; i < window; i++) { //edits to be fixed <= windowSize
                if (edit != undefined && i == edit.pos) { // fail and fix
                    let c = String.fromCharCode((s[i].charCodeAt(0) + 1) % 256); //garanteed to fail in case of double characters
                    p = seq(p)(char(c, edit, true))(f);
                    if (edit.sign == 0)
                        --i; //delete case
                    if (edit.sign == 1 && i < input.length) { //insert case
                        for (let edit of edits)
                            ++edit.pos;
                    }
                    edit = edits.shift();
                }
                else { // succeed
                    p = seq(p)(char(s[i], { sign: 2, char: s[i], pos: 0 }, true))(f);
                }
            }
            let outcome = p(istream);
            switch (outcome.tag) {
                case "success":
                    return outcome;
                default:
                    let e = new StringError_1.StringError(outcome.errors, s);
                    let minError = argMin(outcome.errors, e => e.edit);
                    e.edit = minError.edit;
                    e.modStream = minError.modStream;
                    return new Failure(istream.startpos, [e]);
            }
        };
    }
    Primitives.str = str;
    /**
     * Returns a parser that succeeds only if the end of the
     * input has been reached.
     */
    function eof() {
        return (istream) => {
            if (istream.isEOF()) {
                return new Success(istream, Primitives.EOF);
            }
            let e = new EOFError_1.EOFError();
            let newInput = istream.input.substring(0, istream.startpos);
            e.modStream = new CharStream(newInput, istream.startpos, istream.startpos);
            //Effectively replacing with ws to avoid degenerate behavior
            //TODO Does not get interpreted in choice correctly
            e.edit = 2 * (istream.input.length - newInput.length);
            return new Failure(istream.startpos, [e]);
        };
    }
    Primitives.eof = eof;
    /**
     * fresult returns a parser that applies the parser p,
     * and if p succeeds, returns the value x.
     * @param p a parser
     */
    function fresult(p) {
        return (x) => {
            return (istream) => {
                return bind(p)((t) => result(x))(istream);
            };
        };
    }
    Primitives.fresult = fresult;
    /**
     * left returns a parser that applies the parser p,
     * then the parser q, and if both are successful,
     * returns the result of p.
     * @param p a parser
     */
    function left(p) {
        return (q) => {
            return failAppfun(seq(p)(q)(tup => tup[0]))(f => {
                let minError = argMin(f.errors, e => e.edit);
                let e = new LeftError_1.LeftError(minError.causes, minError.modStream, minError.edit);
                return new Failure(f.error_pos, [e]);
            });
        };
    }
    Primitives.left = left;
    /**
     * right returns a parser that applies the parser p,
     * then the parser q, and if both are successful,
     * returns the result of q.
     * @param p a parser
     */
    function right(p) {
        return (q) => {
            return failAppfun(seq(p)(q)(tup => tup[1]))(f => {
                let minError = argMin(f.errors, e => e.edit);
                let e = new RightError_1.RightError(minError.causes, minError.modStream, minError.edit);
                return new Failure(f.error_pos, [e]);
            });
        };
    }
    Primitives.right = right;
    /**
     * between returns a parser that applies the parser
     * popen, p, and pclose in sequence, and if all are
     * successful, returns the result of p.
     * @param popen the first parser
     */
    function between(popen) {
        return (pclose) => {
            return (p) => {
                let l = failAppfun(left(p)(pclose))((f) => {
                    let minError = argMin(f.errors, e => e.edit);
                    let e = new BetweenRightError_1.BetweenRightError(minError.causes, minError.edit);
                    e.modStream = minError.modStream;
                    return new Failure(f.error_pos, [e]);
                });
                let r = failAppfun(right(popen)(l))((f) => {
                    let minError = argMin(f.errors, e => e.edit);
                    let e = new BetweenLeftError_1.BetweenLeftError(minError.causes, minError.edit);
                    e.modStream = minError.modStream;
                    return new Failure(f.error_pos, [e]);
                });
                return r;
            };
        };
    }
    Primitives.between = between;
    /**
     * The debug parser takes a parser p and a debug string,
     * printing the debug string as a side-effect before
     * applying p to the input.
     * @param p a parser
     */
    function debug(p) {
        return (label) => {
            return (istream) => {
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
            };
        };
    }
    Primitives.debug = debug;
    let wschars = choice(sat([' ', "\t"]))(nl());
    /**
     * nl matches and returns a newline.
     */
    function nl() {
        return sat(["\n", "\r\n"]);
        //choice(sat(["\n"]))(sat(["\r\n"]));
    }
    Primitives.nl = nl;
    /**
     * ws matches zero or more of the following whitespace characters:
     * ' ', '\t', '\n', or '\r\n'
     * ws returns matched whitespace in a single CharStream result.
     * Note: ws NEVER fails
     */
    function ws() {
        return (istream) => {
            let o = many(wschars)(istream);
            switch (o.tag) {
                case "success":
                    return new Success(o.inputstream, CharStream.concat(o.result));
                default:
                    return o;
            }
        };
    }
    Primitives.ws = ws;
    /**
     * ws1 matches one or more of the following whitespace characters:
     * ' ', '\t', '\n', or '\r\n'
     * ws1 returns matched whitespace in a single CharStream result.
     */
    function ws1() {
        return (istream) => {
            let o = (wschars)(istream);
            switch (o.tag) {
                case "success":
                    let o2 = many(wschars)(istream);
                    return new Success(o.inputstream, CharStream.concat([o.result].concat(o2.result)));
                case "failure":
                    let minError = argMin(o.errors, e => e.edit);
                    let e = new WSError_1.WSError(o.errors, 1);
                    e.modStream = minError.modStream.insertCharAt(o.error_pos, e.expectedStr);
                    let o3 = many(wschars)(e.modStream);
                    e.modStream = o3.inputstream;
                    return new Failure(o.error_pos, [e]);
            }
        };
    }
    Primitives.ws1 = ws1;
    function groupBy(list, keyGetter) {
        let m = new Map();
        list.forEach((item) => {
            const key = keyGetter(item);
            if (!m.has(key)) {
                m.set(key, []);
            }
            let collection = m.get(key);
            collection.push(item);
        });
        return m;
    }
    function strSat(strs) {
        // sort strings first by length, and then lexicograpically;
        // slice() called here so as not to modify original array
        let smap = groupBy(strs, s => s.length);
        let sizes = [];
        // find size classes;
        // also sort each set of equivalent-length values
        smap.forEach((vals, key, m) => {
            sizes.push(key);
            vals.sort();
        });
        sizes.sort().reverse();
        return (istream) => {
            // start with the smallest size class
            for (let peekIndex = 0; peekIndex < sizes.length; peekIndex++) {
                // for each size class, try matching all of
                // the strings; if one is found, return the
                // appropriate CharStream; if not, fail.
                let peek = istream.peek(sizes[peekIndex]);
                let tail = istream.seek(sizes[peekIndex]);
                let candidates = smap.get(sizes[peekIndex]);
                for (let cIndex = 0; cIndex < candidates.length; cIndex++) {
                    if (candidates[cIndex] === peek.toString()) {
                        return new Success(tail, peek);
                    }
                }
            }
            let minStr = argMin(strs, (str) => {
                let input = istream.input.substring(istream.startpos, istream.startpos + str.length);
                return minEdit(input, str).length;
            });
            //let input = istream.input.substring(istream.startpos, istream.startpos + minStr.length);
            //console.log(minEdit(input, minStr))
            return str(minStr)(istream);
        };
    }
    Primitives.strSat = strSat;
})(Primitives = exports.Primitives || (exports.Primitives = {}));
//# sourceMappingURL=primitives.js.map