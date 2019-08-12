"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
<<<<<<< HEAD
const AbstractError_1 = require("./AbstractError");
class StringError extends AbstractError_1.AbstractError {
    constructor(rootCauses, expectedStr) {
        super();
        this._expectedStr = expectedStr;
        this._rootCauses = space_lift_1.Some(rootCauses);
    }
    get expectedStr() {
        return this._expectedStr;
    }
    explanation() {
        return "character " + " ' " + this._expectedStr + " ' ";
    }
    toString() {
        return "CharError -> " + " ' " + this._expectedStr + " ' ";
=======
const MetricLcs_1 = require("../Edit/MetricLcs");
class StringError {
    constructor(expectedStr) {
        this._expectedStr = expectedStr;
    }
    rootCause() {
        return space_lift_1.None;
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
>>>>>>> master
    }
}
exports.StringError = StringError;
//# sourceMappingURL=StringError.js.map