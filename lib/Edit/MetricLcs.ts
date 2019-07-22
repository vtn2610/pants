import { string } from "space-lift/commonjs/object/is";

/*
 * Return the length of Longest Common Subsequence (LCS) between strings s1 and s2.
 * Also returns the sequence of edits, starting with insertion, then deletions
 * sorted by position
 * 
 * @param s1 the first string
 * @param s2 the second string
 */

export function metriclcs(s1: string, s2: string): string[] {
    let s1_length: number = s1.length;
    let s2_length: number = s2.length;
    let x: string[] = s1.split("");
    let y: string[] = s2.split("");
    //init array
    let c : Array<number[]> = [];
    for (let i = 0; i <= s1_length; i++) {
      let row : number[] = []; 
      c.push(row);
      for (let j = 0; j <= s2_length; j++) {
        c[i].push(0);
      }
    }

    for (let i = 1; i <= s1_length; i++) {
      for (let j = 1; j <= s2_length; j++) {
        c[i][j] = (x[i-1] == y[j-1]) ? (c[i - 1][j - 1] + 1) : Math.max(c[i][j - 1], c[i - 1][j]);
      }
    }
    return diff(c, x, y, s1_length, s2_length, []);
  }

  function backtrack(c: number[][], s1: string[], s2: string[], i: number, j: number, edits: string[]): string[] {
    if (i == 0 || j == 0){
      return edits;
    }
    if (s1[i] == s2[j]){
      edits.push(s1[i]);
      return backtrack(c, s1, s2, i-1, j-1, edits)
    }
    if (c[i][j-1] > c[i-1][j]){
      return backtrack(c, s1, s2, i, j-1, edits)
    }
    return backtrack(c, s1, s2, i-1, j, edits)
  }

  function diff(c: number[][], s1: string[], s2: string[], i: number, j: number, edits: string[]): string[]{
    if (i > 0 && j > 0 && s1[i-1] === s2[j-1]){
      diff(c, s1, s2, i-1, j-1, edits);
    }
    else if (i > 0 && (j == 0 || c[i][j-1] <= c[i-1][j])){
      diff(c, s1, s2, i-1, j, edits);
      edits.push("-" + s1[i-1]);
    }
    else if ( j > 0 && (i == 0 || c[i][j-1] > c[i-1][j])){
      diff(c, s1, s2, i, j-1, edits);
      edits.push("+" + s2[j-1]);
    }
    return edits;
  }

  let a = "ar_";
  let b = "var";
  console.log(metriclcs(a,b))
  let c = "kittena";
  let d = "sittinb";
  console.log(metriclcs(c,d))
