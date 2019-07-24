"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
class SatError {
    constructor(expectedStr, editDistance) {
        this._expectedStr = expectedStr;
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
    get errors() {
        return this._expectedStr;
    }
    explanation() {
        return "";
    }
    minEdit(input, expectedStr) {
        return [];
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