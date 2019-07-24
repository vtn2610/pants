"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
const MetricLcs_1 = require("../Edit/MetricLcs");
class DigitError {
    constructor(editDistance) {
        this._editDistance = editDistance;
    }
    get edit() {
        return this._editDistance;
    }
    set edit(d) {
        this._editDistance = d;
    }
    rootCause() {
        return space_lift_1.None;
    }
    explanation() {
        return "number";
    }
    minEdit(input, expectedStr) {
        return MetricLcs_1.metriclcs(input, expectedStr);
    }
    expectedStr() {
        return "0";
    }
    toString() {
        return "DigitError";
    }
}
exports.DigitError = DigitError;
//# sourceMappingURL=DigitError.js.map