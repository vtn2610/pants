"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
const MetricLcs_1 = require("../Edit/MetricLcs");
class ItemError {
    constructor(editDistance, modifiedString) {
        this._editDistance = editDistance;
        this._modifiedString = modifiedString;
    }
    get modString() { return this._modifiedString; }
    set modString(s) { this._modifiedString = s; }
    get edit() { return this._editDistance; }
    set edit(d) { this._editDistance = d; }
    rootCause() {
        return space_lift_1.None;
    }
    explanation() {
        return "";
    }
    minEdit(input, expectedStr) {
        return MetricLcs_1.metriclcs(input, expectedStr);
    }
    expectedStr() {
        return "0";
    }
    toString() {
        return "ItemError";
    }
}
exports.ItemError = ItemError;
//# sourceMappingURL=ItemError.js.map