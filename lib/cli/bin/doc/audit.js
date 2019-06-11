#!/usr/bin/env node

var shell = require('shelljs');
var cmd = "npm audit --json";
var ejs = require('ejs');
var path = require('path');
var fs = require('fs');

var templatePath = path.resolve(__dirname, 'templates', 'auditPage.ejs');


try {
    var jsonAudit = shell.exec(cmd, {silent:true});
} catch(err) {
    console.error('error'+ err);
}

var packageJson = JSON.parse(fs.readFileSync(path.resolve('./','package.json')));

ejs.renderFile(templatePath, {
    jsonAudit: JSON.parse(jsonAudit),
    projVersion: packageJson.version,
    projName: packageJson.description
}, {}, (err, mdText) => {
    if (err) {
        console.log(err);
    } else {
        fs.writeFileSync(`audit-info-${packageJson.version}.md`, mdText);
        console.log(`Wrote Audit`);
    }
});

