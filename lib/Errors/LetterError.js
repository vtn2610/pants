"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
<<<<<<< HEAD
const AbstractError_1 = require("./AbstractError");
class LetterError extends AbstractError_1.AbstractError {
    constructor(rootCauses, editDistance) {
        super();
        this._editDistance = editDistance;
        this._rootCauses = space_lift_1.Some(rootCauses);
    }
    get expectedStr() {
        return "a";
=======
const jslevenshtein = require('js-levenshtein');
const metriclcs = require('metric-lcs');
class LetterError {
    rootCause() {
        return space_lift_1.None;
>>>>>>> master
    }
    explanation() {
        return "letter";
    }
<<<<<<< HEAD
=======
    minEdit(input, expectedStr) {
        return metriclcs(input, expectedStr);
    }
    expectedStr() {
        return " ";
    }
>>>>>>> master
    toString() {
        return "LetterError";
    }
}
exports.LetterError = LetterError;
//# sourceMappingURL=LetterError.js.map