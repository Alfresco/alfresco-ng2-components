"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var program = require("commander");
var SGStyleRules_1 = require("./li18nt/server/src/SGStyleRules");
program
    .usage(" <source>")
    .parse(process.argv);
if (program.args.length === 0) {
    console.log('Error: source file "en.json" must be provided');
    process.exit();
}
var text = fs.readFileSync(path.resolve(program.args[0]), 'utf8');
var lines = text.split(/\r?\n/g);
var messages = [];
lines.forEach(function (line, index) {
    SGStyleRules_1.rules.forEach(function (rule) {
        var newProblems = rule(line, index);
        messages.push.apply(messages, newProblems);
    });
});
messages.forEach(function (message) {
    console.log("Line " + message.lineNum + " (" + message.startCharPos + "-" + message.endCharPos + "): " + SGStyleRules_1.sgErrorMessages[message.messageCode]);
});
