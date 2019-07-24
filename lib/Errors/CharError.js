"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
const MetricLcs_1 = require("../Edit/MetricLcs");
class CharError {
    constructor(expectedChar, editDistance) {
        this._expectedChar = expectedChar;
        this._editDistance = editDistance;
    }
    getEdit() {
        return this._editDistance;
    }
    setEdit(d) {
        this._editDistance = d;
    }
    rootCause() {
        return space_lift_1.None;
    }
    explanation() {
        return "character " + " ' " + this._expectedChar + " ' ";
    }
    minEdit(input, expectedStr) {
        return MetricLcs_1.metriclcs(input, expectedStr);
    }
    expectedStr() {
        return this._expectedChar;
    }
    toString() {
        return "CharError -> " + " ' " + this._expectedChar + " ' ";
    }
}
exports.CharError = CharError;
//# sourceMappingURL=CharError.js.map