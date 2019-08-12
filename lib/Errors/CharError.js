"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
<<<<<<< HEAD
const AbstractError_1 = require("./AbstractError");
class CharError extends AbstractError_1.AbstractError {
    constructor(rootCauses, editDistance, expectedChar) {
        super();
        this._editDistance = editDistance;
        this._expectedChar = expectedChar;
        this._rootCauses = space_lift_1.Some(rootCauses);
    }
    get expectedStr() {
        return this._expectedChar;
=======
const MetricLcs_1 = require("../Edit/MetricLcs");
class CharError {
    constructor(expectedChar) {
        this._expectedChar = expectedChar;
    }
    rootCause() {
        return space_lift_1.None;
>>>>>>> master
    }
    explanation() {
        return "character " + " ' " + this._expectedChar + " ' ";
    }
<<<<<<< HEAD
=======
    minEdit(input, expectedStr) {
        return MetricLcs_1.metriclcs(input, expectedStr);
    }
    expectedStr() {
        return this._expectedChar;
    }
>>>>>>> master
    toString() {
        return "CharError -> " + " ' " + this._expectedChar + " ' ";
    }
}
exports.CharError = CharError;
//# sourceMappingURL=CharError.js.map