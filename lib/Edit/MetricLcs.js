"use strict";
<<<<<<< HEAD
/*
 * Return the LCS (Longest Common Subsequence) Distance between two strings s1 and s2
 * The distance is a metric, and is the value (s1-lcs) + (s2 - lcs)
 * Can also return the sequence of edits with insertions preceding deletions
 * sorted by position, as well as the LCS string itself
=======
Object.defineProperty(exports, "__esModule", { value: true });
const jslevenshtein = require('js-levenshtein');
/*
 * Return the length of Longest Common Subsequence (LCS) between strings s1
 * and s2.
 * Inspired by https://github.com/tdebatty/java-string-similarity/blob/1afdc76eef523b144c73be3c3fc7df88f93fe9b7/src/main/java/info/debatty/java/stringsimilarity/LongestCommonSubsequence.java
>>>>>>> master
 *
 * @param s1 the first string
 * @param s2 the second string
 */
<<<<<<< HEAD
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
/*
let a = "ar_";
let b = "var";
console.log(metriclcs(a,b))
let c = "kittena";
let d = "sittinb";
console.log(metriclcs(c,d))
*/ 
=======
function metriclcs(s1, s2) {
    const s1_length = s1.length;
    const s2_length = s2.length;
    const x = s1.split("");
    const y = s2.split("");
    //init array
    const c = Array(s1_length + 1).fill(Array(s2_length + 1).fill(0));
    for (let i = 1; i <= s1_length; i++) {
        for (let j = 1; j <= s2_length; j++) {
            c[i][j] = x[i - 1] === y[j - 1] ? c[i - 1][j - 1] + 1 : Math.max(c[i][j - 1], c[i - 1][j]);
        }
    }
    return c[s1_length][s2_length];
}
exports.metriclcs = metriclcs;
/*
let a = "this is a short sentence and this is a long sentence and this is a medium sentence Naive implementation based on wikipedia article on Wagner-Fischer Algorithm and text in Skiena pdfpdppdfad df Returns a new CharStream representing the head of the input at the current position.  Throws an exception if the CharStream isempty. asdfasdfoefjawepqoepkmvjcxnaikmlsdjfkmewa fkdfmadsf oewa f w49r23rmr p sat takes a predicate and yields a parser that consumes a* single character if the character satisfies the predicate,* otherwise it fails.fgsdgsfd sdfgsfgsfdgsdgdf=a-0g-e-34t=wr-gwreg ggg3gseg4g30w4g-irojg4gokwij43g gj 3-ko3rfw3r gjw3ij pjw3gwjg w43gjw4 g-93wjw-34g9-w43 jg4-w g-wjg-wjg4-w4gjw-3 g-94wjg-wj4-w4 gjg-jg-wjgw3g-jg rg34u 34h89t9gh0rghgrkgfgm m mdkandf pjff"
let b = "recursively finds the optimum string associated with a dynamic programming table Performs one instance of a levenshtein calculation given two strings, and returns the dynamic programming table Returns true if the input at the current position is empty. Notethat a CharStream at the end of the input contains an emptystring but that an empty string may not be the end-of-file (i.e.,isEOF is false). choice specifies an ordered choice between two parsers,* p1 and p2. The returned parser will first apply* parser p1.  If p1 succeeds, p1's Outcome is returned.* If p1 fails, p2 is applied and the Outcome of p2 is returned.** An exception is when an outcome is a critical failure,* that outcome is immediately returned.4 t0q34t9q-u4 -q=9gq3u43wu4-34g=3g39= gq3 g3g4g q4"
console.log("string length: " + a.length);
console.time("metric")
console.log("metric: " + metriclcs(b, a));
console.timeEnd("metric")
console.time("jsl")
console.log("jsl: " + jslevenshtein(b, a));
console.timeEnd("jsl")
*/
>>>>>>> master
//# sourceMappingURL=MetricLcs.js.map