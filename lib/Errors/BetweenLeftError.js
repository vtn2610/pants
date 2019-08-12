"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
<<<<<<< HEAD
const AbstractError_1 = require("./AbstractError");
class BetweenLeftError extends AbstractError_1.AbstractError {
    constructor(rootCauses, editDistance) {
        super();
        this._editDistance = editDistance;
        this._rootCauses = space_lift_1.Some(rootCauses);
    }
    get expectedStr() {
        if (this._rootCauses.isDefined()) {
            return this._rootCauses.get()[0].expectedStr;
        }
        else {
            throw new Error("no expected String");
        }
=======
class BetweenLeftError {
    constructor(rootCause) {
        this._rootCause = rootCause;
    }
    rootCause() {
        return space_lift_1.Some(this._rootCause);
>>>>>>> master
    }
    explanation() {
        return "left";
    }
<<<<<<< HEAD
    toString() {
        return "BetweenLeftError -> " + this._rootCauses;
=======
    minEdit(input, expectedStr) {
        return this._rootCause.minEdit(input, expectedStr);
    }
    expectedStr() {
        return "(";
    }
    toString() {
        return "BetweenLeftError -> " + this._rootCause;
>>>>>>> master
    }
}
exports.BetweenLeftError = BetweenLeftError;
//# sourceMappingURL=BetweenLeftError.js.map