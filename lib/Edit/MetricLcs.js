"use strict";
/*
 * Return the LCS (Longest Common Subsequence) Distance between two strings s1 and s2
 * The distance is a metric, and is the value (s1-lcs) + (s2 - lcs)
 * Can also return the sequence of edits with insertions preceding deletions
 * sorted by position, as well as the LCS string itself
 *
 * @param s1 the first string
 * @param s2 the second string
 */
Object.defineProperty(exports, "__esModule", { value: true });
function metriclcs(s1, s2) {
    let s1_length = s1.length;
    let s2_length = s2.length;
    let x = s1.split("");
    let y = s2.split("");
    //init array
    let c = [];
    for (let i = 0; i <= s1_length; i++) {
        let row = [];
        c.push(row);
        for (let j = 0; j <= s2_length; j++) {
            c[i].push(0);
        }
    }
    for (let i = 1; i <= s1_length; i++) {
        for (let j = 1; j <= s2_length; j++) {
            c[i][j] = (x[i - 1] == y[j - 1]) ? (c[i - 1][j - 1] + 1) : Math.max(c[i][j - 1], c[i - 1][j]);
        }
    }
    return diff(c, x, y, s1_length, s2_length, Array());
}
exports.metriclcs = metriclcs;
function backtrack(c, s1, s2, i, j, edits) {
    if (i == 0 || j == 0) {
        return edits;
    }
    if (s1[i] == s2[j]) {
        edits.push(s1[i]);
        return backtrack(c, s1, s2, i - 1, j - 1, edits);
    }
    if (c[i][j - 1] > c[i - 1][j]) {
        return backtrack(c, s1, s2, i, j - 1, edits);
    }
    return backtrack(c, s1, s2, i - 1, j, edits);
}
function diff(c, s1, s2, i, j, edits) {
    if (i > 0 && j > 0 && s1[i - 1] === s2[j - 1]) {
        diff(c, s1, s2, i - 1, j - 1, edits);
    }
    else if (i > 0 && (j == 0 || c[i][j - 1] <= c[i - 1][j])) {
        diff(c, s1, s2, i - 1, j, edits);
        edits.push({ sign: false, char: s1[i - 1], pos: (i - 1) });
    }
    else if (j > 0 && (i == 0 || c[i][j - 1] > c[i - 1][j])) {
        diff(c, s1, s2, i, j - 1, edits);
        edits.push({ sign: true, char: s2[j - 1], pos: (j - 1) });
    }
    return edits;
}
let a = "ar_";
let b = "var";
console.log(metriclcs(a, b));
let c = "kittena";
let d = "sittinb";
console.log(metriclcs(c, d));
//# sourceMappingURL=MetricLcs.js.map