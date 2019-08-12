"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
const charstream_1 = require("../charstream");
var CharStream = charstream_1.CharUtil.CharStream;
class AbstractError {
    constructor() {
        this._editDistance = 0;
        this._rootCauses = space_lift_1.None;
        this._modStream = new CharStream("");
    }
    get causes() {
        if (this._rootCauses.isDefined()) {
            return this._rootCauses.get();
        }
        else {
            throw new Error("Rootcause is not defined");
        }
    }
    set causes(newCauses) {
        this._rootCauses = space_lift_1.Some(newCauses);
    }
    get edit() {
        return this._editDistance;
    }
    set edit(d) {
        this._editDistance = d;
    }
    get modStream() {
        return this._modStream;
    }
    set modStream(s) {
        this._modStream = s;
    }
}
exports.AbstractError = AbstractError;
//# sourceMappingURL=AbstractError.js.map