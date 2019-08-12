"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
const AbstractError_1 = require("./AbstractError");
class GenericError extends AbstractError_1.AbstractError {
    constructor(rootCauses, editDistance) {
        super();
        this._editDistance = editDistance;
        this._rootCauses = space_lift_1.Some(rootCauses);
    }
    get expectedStr() {
        return " ";
    }
    explanation() {
        return "unknown";
    }
    toString() {
        return "GenericError";
    }
}
exports.GenericError = GenericError;
//# sourceMappingURL=GenericError.js.map