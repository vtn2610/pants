"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
class ItemError {
    constructor(editDistance, modifiedString) {
        this._editDistance = editDistance;
        this._modifiedString = modifiedString;
    }
    set cause(newCause) {
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
    get edit() { return this._editDistance; }
    set edit(d) { this._editDistance = d; }
    rootCause() {
        return space_lift_1.None;
    }
    expectedStr() {
        return " ";
    }
    explanation() {
        return "";
    }
    toString() {
        return "ItemError";
    }
}
exports.ItemError = ItemError;
//# sourceMappingURL=ItemError.js.map