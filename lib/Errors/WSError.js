"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
<<<<<<< HEAD
const AbstractError_1 = require("./AbstractError");
class WSError extends AbstractError_1.AbstractError {
    constructor(rootCauses, editDistance) {
        super();
        this._editDistance = editDistance;
        this._rootCauses = space_lift_1.Some(rootCauses);
    }
    get expectedStr() {
        return " ";
=======
const MetricLcs_1 = require("../Edit/MetricLcs");
class WSError {
    rootCause() {
        return space_lift_1.None;
>>>>>>> master
    }
    explanation() {
        return "white space";
    }
<<<<<<< HEAD
=======
    minEdit(input, expectedStr) {
        return MetricLcs_1.metriclcs(input, expectedStr);
    }
    expectedStr() {
        return " ";
    }
>>>>>>> master
    toString() {
        return "WSError";
    }
}
exports.WSError = WSError;
//# sourceMappingURL=WSError.js.map