"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
const MetricLcs_1 = require("../Edit/MetricLcs");
class LetterError {
    constructor(editDistance, modifiedString, rootCause) {
        this._editDistance = editDistance;
        this._modifiedString = modifiedString;
        this._rootCause = rootCause;
    }
    set cause(newCause) {
        this._rootCause = newCause;
    }
    getTotalEdit() {
        let total = this.edit;
        let rootCause = this.rootCause();
        if (rootCause.isDefined()) {
            total += rootCause.get().getTotalEdit();
        }
        return total;
    }
    get modString() { return this._modifiedString; }
    set modString(s) { this._modifiedString = s; }
    get edit() {
        return this._editDistance;
    }
    set edit(d) {
        this._editDistance = d;
    }
    rootCause() {
        if (this._rootCause == undefined) {
            return space_lift_1.None;
        }
        else {
            return space_lift_1.Some(this._rootCause);
        }
    }
    explanation() {
        return "letter";
    }
    minEdit(input, expectedStr) {
        return MetricLcs_1.metriclcs(input, expectedStr);
    }
    expectedStr() {
        return "a";
    }
    toString() {
        return "LetterError";
    }
}
exports.LetterError = LetterError;
//# sourceMappingURL=LetterError.js.map