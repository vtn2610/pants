"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractError_1 = require("./AbstractError");
class SatError extends AbstractError_1.AbstractError {
    constructor(editDistance, expectedChars) {
        super();
        this._expectedChars = expectedChars;
        this._editDistance = editDistance;
    }
    get expectedStr() {
        //TODO: replace arbitrary choice with function
        return this._expectedChars[0];
    }
    explanation() {
        return "sat";
    }
    toString() {
        return "SatError";
    }
}
exports.SatError = SatError;
//# sourceMappingURL=SatError.js.map