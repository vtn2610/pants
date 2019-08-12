"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
<<<<<<< HEAD
const AbstractError_1 = require("./AbstractError");
class ItemError extends AbstractError_1.AbstractError {
    constructor() {
        super();
        this._editDistance = 1;
    }
    get expectedStr() {
        return " ";
    }
    explanation() {
        return "something";
=======
const space_lift_1 = require("space-lift");
const MetricLcs_1 = require("../Edit/MetricLcs");
class ItemError {
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
        return "";
>>>>>>> master
    }
    toString() {
        return "ItemError";
    }
}
exports.ItemError = ItemError;
//# sourceMappingURL=ItemError.js.map