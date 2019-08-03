"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractError_1 = require("./AbstractError");
class ItemError extends AbstractError_1.AbstractError {
    constructor() {
        super();
        this._editDistance = 1;
    }
    get expectedStr() {
        return " ";
    }
    explanation() {
        return "something";
    }
    toString() {
        return "ItemError";
    }
}
exports.ItemError = ItemError;
//# sourceMappingURL=ItemError.js.map