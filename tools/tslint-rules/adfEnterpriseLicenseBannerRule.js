"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const Lint = require("tslint");
const minimatch = require("minimatch");
const fs = require("fs");
class Rule extends Lint.Rules.AbstractRule {
    apply(sourceFile) {
        return this.applyWithWalker(new ADFEnterpriseLicenseBannerRule(sourceFile, this.getOptions()));
    }
}
Rule.metadata = {
    ruleName: 'adf-enterprise-license-banner',
    type: 'maintainability',
    description: ``,
    descriptionDetails: ``,
    rationale: ``,
    options: null,
    optionsDescription: `Not configurable.`,
    typescriptOnly: true,
};
Rule.FAILURE_STRING = 'Missing license header in this TypeScript ' +
    'file Every TypeScript file of the library needs to have the Alfresco license banner at the top.';
exports.Rule = Rule;
class ADFEnterpriseLicenseBannerRule extends Lint.RuleWalker {
    constructor(sourceFile, options) {
        super(sourceFile, options);
        const fileGlobs = options.ruleArguments;
        this.licensePath = options.ruleArguments[1];
        const relativeFilePath = path.relative(process.cwd(), sourceFile.fileName);
        this._enabled = fileGlobs.some(p => minimatch(relativeFilePath, p));
    }
    visitSourceFile(sourceFile) {
        if (!this._enabled) {
            return;
        }
        const fileContent = sourceFile.getFullText();
        const licenseBanner = fs.readFileSync(this.licensePath, 'utf8');
        const licenseCommentPos = fileContent.indexOf(licenseBanner);
        const tslintFix = Lint.Replacement.appendText(0, licenseBanner + '\n\n');
        if (licenseCommentPos !== 0) {
            return this.addFailureAt(0, 0, Rule.FAILURE_STRING, tslintFix);
        }
        super.visitSourceFile(sourceFile);
    }
}
