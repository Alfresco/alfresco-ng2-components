import * as fs from 'fs';
import * as path from 'path';
import * as program from 'commander';

import {
    SGStringProblem, sgErrorMessages, rules
} from './li18nt/server/src/SGStyleRules';


program
.usage(" <source>")
.parse(process.argv);

if (program.args.length === 0) {
    console.log('Error: source file "en.json" must be provided');
    process.exit();
}

let text = fs.readFileSync(path.resolve(program.args[0]), 'utf8');

let lines = text.split(/\r?\n/g);
let messages: SGStringProblem[] = [];

lines.forEach((line, index) => {
    rules.forEach(rule => {
        let newProblems = rule(line, index);
        messages.push(...newProblems);
    });
});

messages.forEach(message => {
    console.log(`Line ${message.lineNum} (${message.startCharPos}-${message.endCharPos}): ${sgErrorMessages[message.messageCode]}`)
});