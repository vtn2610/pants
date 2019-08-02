"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractError_1 = require("./AbstractError");
class EOFError extends AbstractError_1.AbstractError {
    get expectedStr() {
        return "eof";
    }
    explanation() {
        return "eof";
    }
    toString() {
        return "EOFError";
    }
}
exports.EOFError = EOFError;
//# sourceMappingURL=EOFError.js.map