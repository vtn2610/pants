"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
class BetweenRightError {
    constructor(rootCause, editDistance, modifiedString) {
        this._rootCause = rootCause;
        this._editDistance = editDistance;
        this._modifiedString = modifiedString;
    }
    get modString() { return this._modifiedString; }
    set modString(s) { this._modifiedString = s; }
    get edit() {
        return this._editDistance;
    }
    set edit(d) {
        this._editDistance = d;
    }
    rootCause() {
        return space_lift_1.Some(this._rootCause);
    }
    explanation() {
        return "right part";
    }
    minEdit(input, expectedStr = "") {
        return this._rootCause.minEdit(input, expectedStr);
    }
    expectedStr() {
        return ")";
    }
    toString() {
        return "BetweenRightError -> " + this._rootCause;
    }
}
exports.BetweenRightError = BetweenRightError;
//# sourceMappingURL=BetweenRightError.js.map