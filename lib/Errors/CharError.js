"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
const AbstractError_1 = require("./AbstractError");
class CharError extends AbstractError_1.AbstractError {
    constructor(rootCauses, editDistance, expectedChar) {
        super();
        this._editDistance = editDistance;
        this._expectedChar = expectedChar;
        this._rootCauses = space_lift_1.Some(rootCauses);
    }
    get expectedStr() {
        return this._expectedChar;
    }
    explanation() {
        return "character " + " ' " + this._expectedChar + " ' ";
    }
    toString() {
        return "CharError -> " + " ' " + this._expectedChar + " ' ";
    }
}
exports.CharError = CharError;
//# sourceMappingURL=CharError.js.map