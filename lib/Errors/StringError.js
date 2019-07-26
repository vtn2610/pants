"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
const MetricLcs_1 = require("../Edit/MetricLcs");
class StringError {
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