"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const Lint = require("tslint");
const minimatch = require("minimatch");
const licenseBanner = `/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */`;
const tslintFix = Lint.Replacement.appendText(0, licenseBanner + '\n\n');
class Rule extends Lint.Rules.AbstractRule {
    apply(sourceFile) {
        return this.applyWithWalker(new ADFLicenseBannerRule(sourceFile, this.getOptions()));
    }
}
Rule.metadata = {
    ruleName: 'adf-license-banner',
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
class ADFLicenseBannerRule extends Lint.RuleWalker {
    constructor(sourceFile, options) {
        super(sourceFile, options);
        const fileGlobs = options.ruleArguments;
        const relativeFilePath = path.relative(process.cwd(), sourceFile.fileName);

        this._enabled = fileGlobs.some(p => minimatch(relativeFilePath, p));

    }
    visitSourceFile(sourceFile) {
        if (!this._enabled) {
            return;
        }
        const fileContent = sourceFile.getFullText();
        const licenseCommentPos = fileContent.indexOf(licenseBanner);
        if (licenseCommentPos !== 0) {
            return this.addFailureAt(0, 0, Rule.FAILURE_STRING, tslintFix);
        }
        super.visitSourceFile(sourceFile);
    }
}
