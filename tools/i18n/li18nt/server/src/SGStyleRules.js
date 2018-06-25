"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SGStringProblem = /** @class */ (function () {
    function SGStringProblem(messageCode, lineNum, startCharPos, endCharPos) {
        this.messageCode = messageCode;
        this.lineNum = lineNum;
        this.startCharPos = startCharPos;
        this.endCharPos = endCharPos;
    }
    return SGStringProblem;
}());
exports.SGStringProblem = SGStringProblem;
exports.sgErrorMessages = {
    'SG0001': 'Polite words are not recommended for UI text',
    'SG0002': 'Avoid using interjections in UI text ("oops", "yeah", "wow")',
    'SG0003': 'Avoid exclamations ("!")',
    'SG0004': 'Avoid unusual punctuation marks (";", "~", "^")',
    'SG0005': 'Don\'t use the ampersand ("&") as a replacement for "and"',
    'SG0006': 'Write numbers using digits instead of words',
    'SG0007': 'Contractions ("can\'t", "won\'t" "isn\'t") are usually better than the equivalent phrase',
    'SG0008': 'Leave out trademark and copyright symbols',
    'SG0009': 'Avoid abbreviations for common phrases ("etc", "e.g.")'
};
exports.rules = [
    sg0001, sg0002, sg0003, sg0004, sg0005, sg0006, sg0007, sg0008, sg0009
];
function sg0001(line, lineNum) {
    // Use global regex to allow repeated searching from the end of the
    // previous match.
    var checkWords = /\b(please|thanks|thank you|sorry)\b/gi;
    return checkForRegExpMatches(checkWords, line, lineNum, "SG0001");
}
function sg0002(line, lineNum) {
    var checkWords = /\b(whoops|oops|wow|yeah|hey|oh|aw)\b/gi;
    return checkForRegExpMatches(checkWords, line, lineNum, "SG0002");
}
function sg0003(line, lineNum) {
    var checkWords = /!+/gi;
    return checkForRegExpMatches(checkWords, line, lineNum, "SG0003");
}
function sg0004(line, lineNum) {
    var checkWords = /[;~\^]+/gi;
    return checkForRegExpMatches(checkWords, line, lineNum, "SG0004");
}
function sg0005(line, lineNum) {
    var checkWords = /&+/gi;
    return checkForRegExpMatches(checkWords, line, lineNum, "SG0005");
}
function sg0006(line, lineNum) {
    var checkWords = /\b(two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand)\b/gi;
    return checkForRegExpMatches(checkWords, line, lineNum, "SG0006");
}
function sg0007(line, lineNum) {
    var checkWords = /\b(cannot|do not|will not|have not|is not|should not|you are|we will)\b/gi;
    return checkForRegExpMatches(checkWords, line, lineNum, "SG0007");
}
function sg0008(line, lineNum) {
    var checkWords = /[\u00a9\u00ae\u2122]+/gi;
    return checkForRegExpMatches(checkWords, line, lineNum, "SG0008");
}
function sg0009(line, lineNum) {
    var checkWords = /\b(etc|e\.g\.|eg|i\.e\.|ie|n\.b\.|nb)\b/gi;
    return checkForRegExpMatches(checkWords, line, lineNum, "SG0009");
}
function checkForRegExpMatches(re, line, lineNum, ruleName) {
    var problems = [];
    var matchInfo = re.exec(line);
    while (matchInfo) {
        problems.push(new SGStringProblem(ruleName, lineNum, matchInfo.index, matchInfo.index + matchInfo[0].length));
        matchInfo = re.exec(line);
    }
    return problems;
}
