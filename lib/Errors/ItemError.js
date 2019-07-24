"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
const MetricLcs_1 = require("../Edit/MetricLcs");
class ItemError {
    constructor(editDistance) {
        this._editDistance = editDistance;
    }
    getEdit() {
        return 1;
    }
    setEdit(d) {
        this._editDistance = d;
    }
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
        return " ";
    }
    toString() {
        return "ItemError";
    }
}
exports.ItemError = ItemError;
//# sourceMappingURL=ItemError.js.map