"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
const MetricLcs_1 = require("../Edit/MetricLcs");
class SatError {
    constructor(expectedStr, editDistance) {
        this._expectedStr = expectedStr;
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
    get errors() {
        return this._expectedStr;
    }
    explanation() {
        return "";
    }
    minEdit(input, expectedStr) {
        return MetricLcs_1.metriclcs(input, expectedStr);
    }
    expectedStr() {
        return this._expectedStr[0];
    }
    toString() {
        return "SatError -> " + this._expectedStr;
    }
}
exports.SatError = SatError;
//# sourceMappingURL=SatError.js.map