import * as path from 'path';
import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as minimatch from 'minimatch';
import *  as fs from 'fs';

/**
 * Rule that walks through all TypeScript files of public packages and shows failures if a
 * file does not have the license banner at the top of the file.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: Lint.IRuleMetadata = {
        ruleName: 'adf-enterprise-license-banner',
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
            new ADFEnterpriseLicenseBannerRule(sourceFile,
                this.getOptions()));
    }
}

class ADFEnterpriseLicenseBannerRule extends Lint.RuleWalker {

    /** Whether the walker should check the current source file. */
    private _enabled: boolean;
    private licensePath: string;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);

        // Globs that are used to determine which files to lint.
        const fileGlobs = options.ruleArguments;
        this.licensePath = options.ruleArguments[1];

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
        const licenseBanner = fs.readFileSync(this.licensePath,'utf8');
        const licenseCommentPos = fileContent.indexOf(licenseBanner);

        const tslintFix = Lint.Replacement.appendText(0, licenseBanner + '\n\n');
        if (licenseCommentPos !== 0) {
            return this.addFailureAt(0, 0, Rule.FAILURE_STRING, tslintFix);
        }

        super.visitSourceFile(sourceFile);
    }
}
