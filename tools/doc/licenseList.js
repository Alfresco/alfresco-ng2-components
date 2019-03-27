var path = require('path');
var fs = require('fs');

var checker = require('license-checker');
var ejs = require('ejs');
var program = require('commander');
var spdxCodes = require('spdx-license-list');

var startPath = path.resolve('.');
var templatePath = path.resolve(__dirname, 'templates', 'licensePage.ejs');


const nonStandardLicenses = {
    "public domain": "PDDL-1.0",
    "apache": "Apache-2.0",
    "bsd": "BSD-2-Clause"
}

const missingRepos = {
    "@alfresco/adf-testing": "https://github.com/Alfresco/alfresco-ng2-components",
    "@webassemblyjs/helper-api-error": "https://github.com/xtuc/webassemblyjs",
    "@webassemblyjs/helper-fsm": "https://github.com/xtuc/webassemblyjs",
    "@webassemblyjs/ieee754": "https://github.com/xtuc/webassemblyjs",
    "@webassemblyjs/leb128": "https://github.com/xtuc/webassemblyjs",
    "adf-tslint-rules": "https://github.com/Alfresco/alfresco-ng2-components",
    "adf-monaco-extension": "https://github.com/eromano/aca-monaco-extension",
    "indexof": "https://github.com/component/indexof",
    "rxjs-compat": "https://github.com/ReactiveX/rxjs/tree/master/compat",
}

program
.usage('<versionNumber>')
.parse(process.argv);

console.log(`Checking ${startPath}`);

checker.init({
    start: startPath,
    production: true,
    failOn: "GPL"
}, function(err, packages) {
    if (err) {
        console.log(err);
    } else {
        //console.log(JSON.stringify(packages));

        for (var packageName in packages) {
            var pack = packages[packageName];
            pack['licenseExp'] = pack['licenses']
            .replace(/\*/, '')
            .replace(/[a-zA-Z0-9\-\.]+/g, match => {
                var lowerMatch = match.toLowerCase();

                if ((lowerMatch !== 'and') && (lowerMatch !== 'or') && (lowerMatch !== 'with')) {
                    return licenseWithMDLinks(match);
                } else {
                    return match;
                }
            });

            if (!pack['repository']) {
                var lastAtSignPos = packageName.lastIndexOf('@');
                var mainName = packageName.substring(0, lastAtSignPos);

                if (missingRepos[mainName]) {
                    pack['repository'] = missingRepos[mainName];
                }
            }
        }

        ejs.renderFile(templatePath, {packages: packages, projVersion: program.args[0]}, {}, (err, mdText) => {
            if (err) {
                console.log(err);
            } else {
                //console.log(mdText);
                var licenseFilePath = path.resolve('.', 'docs', 'license-info', `license-info-${program.args[0]}.md`)
                fs.writeFileSync(licenseFilePath, mdText);
                console.log(`Wrote license list at ${licenseFilePath}`);
            }
        });
    }
});


function licenseWithMDLinks(licenseExp) {
    var licenseUrl = '';

    if (spdxCodes[licenseExp] && spdxCodes[licenseExp]['url']) {
        licenseUrl = spdxCodes[licenseExp]['url'];
    } else {
        var substituteLicString = nonStandardLicenses[licenseExp.toLowerCase()];

        if (spdxCodes[substituteLicString] && spdxCodes[substituteLicString]['url']) {
            licenseUrl = spdxCodes[substituteLicString]['url'];
        }
    }

    if (licenseUrl) {
        return `[${licenseExp}](${licenseUrl})`;
    } else {
        return licenseExp;
    }
}
