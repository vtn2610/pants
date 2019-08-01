"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
const AbstractError_1 = require("./AbstractError");
class LetterError extends AbstractError_1.AbstractError {
    constructor(rootCauses, editDistance) {
        super();
        this._editDistance = editDistance;
        this._rootCauses = space_lift_1.Some(rootCauses);
    }
    get expectedStr() {
        return "a";
    }
    explanation() {
        return "letter";
    }
    toString() {
        return "LetterError";
    }
}
exports.LetterError = LetterError;
//# sourceMappingURL=LetterError.js.map