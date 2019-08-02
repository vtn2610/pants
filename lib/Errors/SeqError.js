"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
const AbstractError_1 = require("./AbstractError");
class SeqError extends AbstractError_1.AbstractError {
    constructor(rootCauses, modStream, editDistance, firstFailed, secondFailed) {
        super();
        this._firstFailed = true;
        this._secondFailed = true;
        this._firstFailed = firstFailed;
        this._secondFailed = secondFailed;
        this._rootCauses = space_lift_1.Some(rootCauses);
        this._editDistance = editDistance;
        this._modStream = modStream;
    }
    get firstFailed() {
        return this._firstFailed;
    }
    get secondFailed() {
        return this._secondFailed;
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
        return "bind";
    }
    toString() {
        return "SeqError";
    }
}
exports.SeqError = SeqError;
//# sourceMappingURL=SeqError.js.map