"use strict";
//Naive implementation based on wikipedia article on Wagner-Fischer Algorithm
//and text in Skiena
Object.defineProperty(exports, "__esModule", { value: true });
function levenshtein(s1, s2) {
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
    //edge cases for comparing with empty string
    for (let i = 0; i <= s1_length; i += 1) {
        c[i][0] = i;
    }
    for (let j = 0; j <= s2_length; j += 1) {
        c[0][j] = j;
    }
    for (let i = 1; i <= s1_length; i++) {
        for (let j = 1; j <= s2_length; j++) {
            const sub = x[i - 1] == y[j - 1] ? 0 : 2;
            c[i][j] = Math.min(c[i - 1][j] + 1, c[i][j - 1] + 1, c[i - 1][j - 1] + sub);
        }
    }
    return diff(c, x, y, s1_length, s2_length, Array());
}
exports.levenshtein = levenshtein;
/*
0 is delete
1 is insert
2 is replace
*/
function diff(c, s1, s2, i, j, edits) {
    if (i > 0 && j > 0) {
        if (s1[i - 1] == s2[j - 1]) {
            diff(c, s1, s2, i - 1, j - 1, edits);
        }
        else {
            if (c[i - 1][j] < c[i][j - 1]) {
                diff(c, s1, s2, i - 1, j, edits);
                edits.push({ sign: 0, char: s1[i - 1], pos: (i - 1) });
            }
            else if (c[i - 1][j] == c[i][j - 1] && c[i - 1][j - 1] < c[i][j - 1] && c[i - 1][j - 1] < c[i - 1][j]) {
                diff(c, s1, s2, i - 1, j - 1, edits);
                edits.push({ sign: 2, char: s2[j - 1], pos: (i - 1) });
            }
            else {
                diff(c, s1, s2, i, j - 1, edits);
                edits.push({ sign: 1, char: s2[j - 1], pos: (j - 1) });
            }
        }
    }
    if (i == 0 && j > 0) {
        diff(c, s1, s2, 0, j - 1, edits);
        edits.push({ sign: 1, char: s2[j - 1], pos: (j - 1) });
    }
    else if (i > 0 && j == 0) {
        diff(c, s1, s2, i - 1, 0, edits);
        edits.push({ sign: 0, char: s1[i - 1], pos: (i - 1) });
    }
    return edits;
}
//# sourceMappingURL=Levenshtein.js.map