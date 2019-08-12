"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
<<<<<<< HEAD
const AbstractError_1 = require("./AbstractError");
class SatError extends AbstractError_1.AbstractError {
    constructor(editDistance, expectedChars) {
        super();
        this._expectedChars = expectedChars;
        this._editDistance = editDistance;
    }
    get expectedStr() {
        //TODO: replace arbitrary choice with function
        return this._expectedChars[0];
    }
    explanation() {
        return "sat";
    }
    toString() {
        return "SatError";
=======
const space_lift_1 = require("space-lift");
class SatError {
    constructor(expectedStr) {
        this._expectedStr = expectedStr;
    }
    rootCause() {
        return space_lift_1.None;
    }
    get errors() {
        return this._expectedStr;
    }
    explanation() {
        return "";
    }
    minEdit(input, expectedStr) {
        return 0;
    }
    expectedStr() {
        return "";
    }
    toString() {
        return "SatError -> " + this._expectedStr;
>>>>>>> master
    }
}
exports.SatError = SatError;
//# sourceMappingURL=SatError.js.map