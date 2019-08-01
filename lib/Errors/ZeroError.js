"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractError_1 = require("./AbstractError");
class ZeroError extends AbstractError_1.AbstractError {
    get expectedStr() {
        return "";
    }
    explanation() {
        return "zero";
    }
    toString() {
        return "ZeroError";
    }
}
exports.ZeroError = ZeroError;
//# sourceMappingURL=ZeroError.js.map