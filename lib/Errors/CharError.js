"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
class CharError {
    constructor(expectedChar, editDistance, modifiedString) {
        this._expectedChar = expectedChar;
        this._editDistance = editDistance;
        this._modifiedString = modifiedString;
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
        return "character " + " ' " + this._expectedChar + " ' ";
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