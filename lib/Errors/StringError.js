"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
const AbstractError_1 = require("./AbstractError");
class StringError extends AbstractError_1.AbstractError {
    constructor(rootCauses, expectedStr) {
        super();
        this._expectedStr = expectedStr;
        this._rootCauses = space_lift_1.Some(rootCauses);
    }
    get expectedStr() {
        return this._expectedStr;
    }
    explanation() {
        return "character " + " ' " + this._expectedStr + " ' ";
    }
    toString() {
        return "CharError -> " + " ' " + this._expectedStr + " ' ";
    }
}
exports.StringError = StringError;
//# sourceMappingURL=StringError.js.map