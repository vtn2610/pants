The Problem:
This summer, we tried to develop a system that would create more readable error messages. In many modern programming languages, the error reported by the compiler is often very elementary, generally pointing to a location in the code and providing vague explanations that are often unclear to beginner programmers.


Our Approach:
We decided to build this system within a parser, which is a program that analyzes a string of symbols and converts them to an abstract syntax tree, given a grammar. Since syntax errors are strings of symbols that do not follow the given grammar, the parser can already easily deduce failures in syntax. We decided to build in an error system within the parser that:
1. Fixes a failing program as it parses by inserting, deleting, or replacing characters,
2. Records the failure in an Error object and composes multiple errors across the entire program as more failures are detected,
3. Calculates the edit distance for each fix made to the program so that the fixes with the minimum edit distance are reported as the most likely fixes to the program.
Since the edit distance is recorded for every fix, when the parser reaches a choice between multiple parsers, it branches out and continues parsing with each parser in the choice, and ultimately returns the choice with the minimum edit distance.


Edit distance between strings are calculated using Levenshtein distance, and we use a variant of the Wagner Fischer algorithm to keep track of the minimum edits needed at every step. We then return the list of edits from left to right, and the parser applies each edit until the program successfully parses. We weight the operations for calculating edit distance as 1 for insertions and deletions, and 2 for replacements to maintain a metric. For atomic parsers, we simply check whether we are inserting or replacing, and apply an edit distance accordingly.


After the program finishes parsing, we currently return the final Error object, which contains pointers to every other Error object created during the parsing phase, and the total edit distance of the minimum edit fixes. 


Progress:
We have implemented the parse-and-fix mechanism within every parser. The fixing primarily occurs in the char parser, and other parsers that require fixing mechanisms either have them built-in or call on char itself to fix. Thus, every primitive parser, if used properly in a defined grammar, then the code will correctly fix failures it encounters.


Testing Metric:
We created a small mini-parser that included the parsers for AssignParser, PlusOp, MinusOp, ListParser, FooParser, and BetweenParser. We tested our parser using many combinations of these parsers, including testing them individually and using choice. We comprehensively tested every parser with the 9 potential failing positions and operations: insertion, deletion, and replacement at the beginning, middle, and end of each inputstream. We check if the edit distance makes sense, and if the final error returned was the correct error. Our testing mechanism is quite rudimentary, and hopefully using testing suites on a more robust programming language will be more efficient and catch more bugs.


Next Steps:
1. Translator: Develop a translator that can convert the error stream into a readable error message that can variably be more specific as a teaching aid. The error trace is now represented as a tree, thus tree traversal algorithm will be necessary to read in these errors, ignoring the combinators’ errors (i.e. SeqError, LeftError, RightError, BetweenError), and concatenating the primitive parsers’ errors (i.e. CharError, StringError, LetterError, DigitError). The simplest way would be to develop string concatenations, but we can see how a more data-driven approach given the large error streams could be very effective and tailored to different audiences.
2. Implementation: Redesign the SWELL parser to use our new primitive parsers. This will require significant and careful refactoring, but it should not deviate too much from SWELL’s current parser.
3. Time/Space Optimization: Currently the edit distance is being calculated for every branch until the minimal edit distance is returned. The cost for this performance is high (O(m^n), where m is the maximum number of branches (in choices), and n is the length of the program.) To reduce this runtime, We should implement a heuristic in choice that stops a branching parse if the edit distance exceeds that of the previous minimum edit distance. This will reduce the worst case to the length of the minimum parse.
4. Time/Space Optimization: In strSat, we currently run the minimum edit algorithm for every element in the satisfiability array, which takes O(kmn), where k is the length of the satisfiability array, and m and n are the lengths of the strings. An optimization could be to use a trie so that the performance would instead be O(kn), a much faster search.
