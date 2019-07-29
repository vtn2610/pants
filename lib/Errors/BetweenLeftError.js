"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
class BetweenLeftError {
    constructor(rootCause, editDistance, modifiedString) {
        this._rootCause = rootCause;
        this._editDistance = editDistance;
        this._modifiedString = modifiedString;
    }
    getTotalEdit() {
        let total = this.edit;
        let rootCause = this.rootCause();
        if (rootCause.isDefined()) {
            total += rootCause.get().getTotalEdit();
        }
        return total;
    }
    set cause(newCause) {
        this._rootCause = newCause;
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
    expectedStr() {
        return this._rootCause.expectedStr();
    }
    explanation() {
        return "left";
    }
    toString() {
        return "BetweenLeftError -> " + this._rootCause;
    }
}
exports.BetweenLeftError = BetweenLeftError;
//# sourceMappingURL=BetweenLeftError.js.map