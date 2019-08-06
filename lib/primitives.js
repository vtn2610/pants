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
const MetricLcs_1 = require("./Edit/MetricLcs");
var Primitives;
(function (Primitives) {
    function id(t) {
        return t;
    }
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
    /**
 * failParser takes a Failure and returns a parser guaranteed to fail
 * @param fail Failure<T>
 */
    function failParser(fail) {
        return (istream) => {
            return fail;
        };
    }
    Primitives.failParser = failParser;
    function minEdit(input, expectedStr) {
        return MetricLcs_1.metriclcs(input, expectedStr);
    }
    Primitives.minEdit = minEdit;
    /**
     * expect tries to apply the given parser and returns the result of that parser
     * if it succeeds, otherwise it replaces the current stream with a stream with
     * modified code given a correct edit, and tries again.
     *
     * @param parser The parser to try
     * @param f A function that produces a new Errors given an existing Errors
     */
    function expect(parser) {
        return (f) => {
            return (istream) => {
                let outcome = parser(istream);
                switch (outcome.tag) {
                    case "success":
                        return outcome;
                    case "failure":
                        let fail = outcome;
                        let errors = fail.errors;
                        let newErrors = errors.map(e => {
                            //computes the size of the substring required for LCS
                            let windowSize = e.expectedStr.length;
                            //the actual substring inside window
                            let inputBound = istream.input.substring(fail.error_pos, fail.error_pos + windowSize);
                            //the set of edits returned via LCS
                            let editsSet = minEdit(inputBound, e.expectedStr);
                            //the corrected stream and edit distance after applying edits within window
                            let edits = editParse(parser, istream, e.edit, windowSize, fail.error_pos, fail.error_pos, editsSet);
                            //set edit distance and modified stream in error object, and advance start pos
                            e.edit = edits[0];
                            e.modStream = edits[1].seek(windowSize);
                            //apply error composition
                            return f(e);
                        });
                        return new Failure(istream.startpos, newErrors);
                }
            };
        };
    }
    Primitives.expect = expect;
    /**
     * item successfully consumes the first character if the input
     * string is non-empty, otherwise it fails.
     */
    function item() {
        return (istream) => {
            if (istream.isEmpty()) {
                //On Failure, the edit distance must be 1, which is
                //set inside ItemError constructor
                let e = new ItemError_1.ItemError();
                e.modStream = new CharStream(istream.input + " ", istream.startpos + 1);
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
    function bind2(p) {
        return (f) => {
            function _bind(p) {
                return (f) => {
                    return (istream) => {
                        let r = p(istream);
                        switch (r.tag) {
                            case "success":
                                let o = f(r.result)(r.inputstream);
                                switch (o.tag) {
                                    case "success":
                                        // case 1: both parsers succeed
                                        return o;
                                    default: // note: backtracks, returning original istream
                                        // case 2: parser 1 succeeds, 2 fails
                                        let o2 = new Failure(o.error_pos, o.errors);
                                        return o2;
                                }
                            case "failure":
                                //apply parser again with modified inputstream;
                                const flatMap = (f, arr) => arr.reduce((x, y) => [...x, ...f(y)], []);
                                let errors = flatMap((e) => {
                                    //re-parsed with modified input, first parser must succeed
                                    let r2 = p(e.modStream);
                                    if (r2 instanceof Success) {
                                        let o2 = f(r2.result)(r2.inputstream);
                                        switch (o2.tag) {
                                            case "success":
                                                return e;
                                            default:
                                                return o2.errors;
                                        }
                                    }
                                    else {
                                        //should never happen
                                        return r2.errors;
                                    }
                                }, r.errors);
                                return new Failure(r.error_pos, errors);
                        }
                    };
                };
            }
            return _bind(p)(f);
        };
    }
    Primitives.bind2 = bind2;
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
     * a single result.
     * @param p A parser
     *
     */
    function seq2(p) {
        return (q) => {
            return (f) => {
                let firstFailed = false;
                let secondFailed = false;
                let qDoer = (x) => {
                    let q1 = bind(q)((y) => {
                        let tup = [x, y];
                        return result(f(tup));
                    });
                    let q2 = failAppfun(q1)((f) => {
                        secondFailed = true;
                        let minError = argMin(f.errors, e => e.edit);
                        let e2 = new SeqError_1.SeqError(f.errors, minError.modStream, minError.edit, firstFailed, secondFailed);
                        return new Failure(e2.modStream.startpos, [e2]);
                    });
                    return q2;
                };
                let p1 = bind(p)(qDoer);
                //failAppfun only parses if p1 fails
                let p2 = failAppfun(p1)((f) => {
                    //both p and q fail
                    if (secondFailed) {
                        //TODO: arbitrary modified stream
                        let minError = argMin(f.errors, e => e.edit);
                        //We know this parse cannot fail because we have
                        //modified the input stream
                        let o2 = failAppfun(p1)(f2 => {
                            //retest with fixed input to check if the failure is due to q
                            let minError2 = argMin(f2.errors, e => e.edit);
                            firstFailed = true;
                            let e = new SeqError_1.SeqError(f.errors.concat(f2.errors), minError.modStream, minError.edit + minError2.edit, firstFailed, secondFailed);
                            return new Failure(e.modStream.startpos, [e]);
                        })(minError.modStream);
                        switch (o2.tag) {
                            case "success":
                                //p failed, q succeed, so return p's failure
                                return f;
                            default:
                                //both p and q fail
                                return o2;
                        }
                    }
                    else {
                        //p failed, q succeeded
                        return f;
                    }
                });
                return p2;
            };
        };
    }
    Primitives.seq2 = seq2;
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
     * otherwise it fails.
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
                                let o3 = item()(istream2);
                                e.modStream = o3.inputstream;
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
     * @param c
     */
    function char(c) {
        if (c.length != 1) {
            throw new Error("char parser takes a string of length 1 (i.e., a char)");
        }
        return failAppfun(sat([c]))(f => {
            let e = new CharError_1.CharError(f.errors, f.errors[0].edit, c);
            //console.log(f);
            e.modStream = f.errors[0].modStream.replaceCharAt(f.error_pos, c);
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
     * character, from a-z, regardless of case.
     */
    function letter() {
        let parser = sat(lower_chars().concat(upper_chars()));
        return failAppfun(parser)((f) => {
            let e = new LetterError_1.LetterError(f.errors, f.errors[0].edit);
            e.modStream = f.errors[0].modStream.replaceCharAt(f.error_pos, e.expectedStr);
            return new Failure(f.error_pos, [e]);
        });
    }
    Primitives.letter = letter;
    /**
     * digit returns a parser that consumes a single numeric
     * character, from 0-9.  Note that the type of the result
     * is a string, not a number.
     */
    function digit() {
        let parser = sat(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
        return failAppfun(parser)((f) => {
            let e = new DigitError_1.DigitError(f.errors, f.errors[0].edit);
            e.modStream = f.errors[0].modStream.replaceCharAt(f.error_pos, e.expectedStr);
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
     *
     * An exception is when an outcome is a critical failure,
     * that outcome is immediately returned.
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
                                return new Failure(errorpos, allErrors);
                        }
                }
            };
        };
    }
    Primitives.choice = choice;
    /**
     * Like choice, but chooses from multiple possible parsers
     * First considers the farthest failing error, and if there
     * are multiple, calculate longest common subsequence for each choice,
     * and returns the maximum LCS
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
    //performs the force parse, and returns ultimately the LCS length
    function editParse2(p, istream, LCS, windowSize, orgErrorPos, curErrorPos, edits) {
        if (curErrorPos - orgErrorPos < windowSize) {
            let o = p(istream);
            switch (o.tag) {
                case "success":
                    break; //Keep parsing with next parser
                case "failure":
                    let e = o;
                    let str = istream.input;
                    curErrorPos = e.error_pos;
                    let newEdit = "";
                    console.log(edits);
                    if (edits.length !== 0) {
                        let curEdit = edits.shift();
                        // case of insertion
                        if (curEdit !== undefined && curEdit.sign === true) {
                            if (edits[0] !== undefined && edits[0].pos == curEdit.pos && edits[0].sign === false) {
                                // case of replacement
                                let replace = edits.shift();
                                console.log(curEdit.char + " changed letter");
                                if (replace !== undefined)
                                    str = str.substring(0, curErrorPos + curEdit.pos) + curEdit.char + str.substring(curErrorPos + curEdit.pos + 1);
                                LCS += 2;
                            }
                            else {
                                str = str.substring(0, curErrorPos + curEdit.pos) + curEdit.char + str.substring(curErrorPos + curEdit.pos);
                                for (let item of edits) {
                                    item.pos++;
                                }
                                LCS++;
                            }
                            // case of deletion
                        }
                        else if (curEdit !== undefined && curEdit.sign === false) {
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
    Primitives.editParse2 = editParse2;
    Primitives.editParsecount = 0;
    //performs the force parse, and returns ultimately the LCS length
    function editParse(p, istream, LCS, windowSize, orgErrorPos, curErrorPos, edits) {
        Primitives.editParsecount++;
        let o = p(istream);
        let string = istream.input;
        switch (o.tag) {
            case "success":
                break; //Keep parsing with next parser
            case "failure":
                let e = o;
                curErrorPos = e.error_pos;
                //let maxEdit : number = edits.length;
                while (edits.length > 0) {
                    let curEdit = edits.shift();
                    // case of insertion
                    if (curEdit !== undefined && curEdit.sign === true) {
                        if (edits[0] !== undefined && edits[0].pos == curEdit.pos && edits[0].sign === false) {
                            // case of replacement
                            let replace = edits.shift();
                            if (replace !== undefined)
                                string = string.substring(0, curErrorPos + curEdit.pos) + curEdit.char + string.substring(curErrorPos + curEdit.pos + 1);
                            LCS += 2;
                        }
                        else {
                            string = string.substring(0, curErrorPos + curEdit.pos) + curEdit.char + string.substring(curErrorPos + curEdit.pos);
                            for (let item of edits) {
                                item.pos++;
                            }
                            LCS++;
                            windowSize++;
                        }
                        // case of deletion
                    }
                    else if (curEdit !== undefined && curEdit.sign === false) {
                        string = string.substring(0, curErrorPos + curEdit.pos) + string.substring(curErrorPos + curEdit.pos + 1);
                        for (let item of edits) {
                            item.pos--;
                        }
                        LCS++;
                        windowSize--;
                    }
                    if (p(new CharStream(string)).tag == "success") {
                        break;
                    }
                }
        }
        return [LCS, new CharStream(string)];
    }
    Primitives.editParse = editParse;
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
     * succeeds, even if it matches nothing or if an outcome is critical.
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
     * str yields a parser for the given string.
     * @param s A string
     */
    function str(s) {
        return (istream) => {
            let chars = s.split("");
            let p = result(new CharStream(""));
            let f = (tup) => tup[0].concat(tup[1]);
            for (let c of chars) {
                p = seq(p)(char(c))(f);
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
            return istream.isEOF() ? new Success(istream, Primitives.EOF) : new Failure(istream.startpos, [new EOFError_1.EOFError()]);
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
                let l = left(p)(pclose);
                let r = right(popen)(l);
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
     * ws matches zero or more of the following whitespace characters:
     * ' ', '\t', '\n', or '\r\n'
     * ws returns matched whitespace in a single CharStream result.
     * Note: ws NEVER fails
     */
    function ws() {
        return (istream) => {
            let o = many(char(" "))(istream);
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
            let o = many1(char(" "))(istream);
            switch (o.tag) {
                case "success":
                    return new Success(o.inputstream, CharStream.concat(o.result));
                case "failure":
                    let e = new WSError_1.WSError(o.errors, o.errors[0].edit);
                    e.modStream = e.causes[0].modStream;
                    return new Failure(o.error_pos, [e]);
            }
        };
    }
    Primitives.ws1 = ws1;
    /**
     * nl matches and returns a newline.
     */
    function nl() {
        return choice(str("\n"))(str("\r\n"));
    }
    Primitives.nl = nl;
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
            return new Failure(istream.startpos, [new StringError_1.StringError([], "")]);
        };
    }
    Primitives.strSat = strSat;
})(Primitives = exports.Primitives || (exports.Primitives = {}));
//# sourceMappingURL=primitives.js.map