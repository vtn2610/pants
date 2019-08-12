"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
const AbstractError_1 = require("./AbstractError");
class LeftError extends AbstractError_1.AbstractError {
    constructor(rootCauses, modStream, editDistance) {
        super();
        this._rootCauses = space_lift_1.Some(rootCauses);
        this._editDistance = editDistance;
        this._modStream = modStream;
    }
    get expectedStr() {
        if (this._rootCauses.isDefined()) {
            return this._rootCauses.get()[0].expectedStr;
        }
        else {
            throw new Error("no expected String");
        }
    }
    explanation() {
        return "left";
    }
    toString() {
        return "LeftError";
    }
}
exports.LeftError = LeftError;
//# sourceMappingURL=LeftError.js.map