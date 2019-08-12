"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
<<<<<<< HEAD
const AbstractError_1 = require("./AbstractError");
class DigitError extends AbstractError_1.AbstractError {
    constructor(rootCauses, editDistance) {
        super();
        this._editDistance = editDistance;
        this._rootCauses = space_lift_1.Some(rootCauses);
    }
    get expectedStr() {
        return "0";
=======
const MetricLcs_1 = require("../Edit/MetricLcs");
class DigitError {
    rootCause() {
        return space_lift_1.None;
>>>>>>> master
    }
    explanation() {
        return "number";
    }
<<<<<<< HEAD
=======
    minEdit(input, expectedStr) {
        return MetricLcs_1.metriclcs(input, expectedStr);
    }
    expectedStr() {
        return "0";
    }
>>>>>>> master
    toString() {
        return "DigitError";
    }
}
exports.DigitError = DigitError;
//# sourceMappingURL=DigitError.js.map