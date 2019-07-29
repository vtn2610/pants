"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
const MetricLcs_1 = require("../Edit/MetricLcs");
class StringError {
    constructor(expectedStr, editDistance, modifiedString, rootCause) {
        this._expectedStr = expectedStr;
        this._editDistance = editDistance;
        this._modifiedString = modifiedString;
        this._rootCause = rootCause;
    }
    set cause(newCause) {
        this._rootCause = newCause;
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
        if (this._rootCause == undefined) {
            return space_lift_1.None;
        }
        else {
            return space_lift_1.Some(this._rootCause);
        }
    }
    explanation() {
        return "string " + " ' " + this._expectedStr + " ' ";
    }
    minEdit(input, expectedStr) {
        return MetricLcs_1.metriclcs(input, expectedStr);
    }
    expectedStr() {
        return this._expectedStr;
    }
    toString() {
        return "StringError -> " + " ' " + this._expectedStr + " ' ";
    }
}
exports.StringError = StringError;
//# sourceMappingURL=StringError.js.map