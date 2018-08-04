import * as path from 'path';
import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as minimatch from 'minimatch';

/** License banner that is placed at the top of every public TypeScript file. */
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


/** TSLint fix that can be used to add the license banner easily. */
const tslintFix = Lint.Replacement.appendText(0, licenseBanner + '\n\n');

/**
 * Rule that walks through all TypeScript files of public packages and shows failures if a
 * file does not have the license banner at the top of the file.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: Lint.IRuleMetadata = {
        ruleName: 'adf-license-banner',
        type: 'maintainability',
        description: ``,
        descriptionDetails: ``,
        rationale: ``,
        options: null,
        optionsDescription: `Not configurable.`,
        typescriptOnly: true,
    };

    static FAILURE_STRING: string = 'Missing license header in this TypeScript ' +
        'file Every TypeScript file of the library needs to have the Alfresco license banner at the top.';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(
            new ADFLicenseBannerRule(sourceFile,
                this.getOptions()));
    }
}

class ADFLicenseBannerRule extends Lint.RuleWalker {

    /** Whether the walker should check the current source file. */
    private _enabled: boolean;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);

        // Globs that are used to determine which files to lint.
        const fileGlobs = options.ruleArguments;

        // Relative path for the current TypeScript source file.
        const relativeFilePath = path.relative(process.cwd(), sourceFile.fileName);
        // Whether the file should be checked at all.
        this._enabled = fileGlobs.some(p => minimatch(relativeFilePath, p));
    }

    visitSourceFile(sourceFile: ts.SourceFile) {
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
