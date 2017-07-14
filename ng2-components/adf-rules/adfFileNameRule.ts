import * as ts from "typescript";
import * as Lint from "tslint";

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        ruleName: 'adf-file-name',
        type: 'maintainability',
        description: `Enforce consistent name avoid prefix`,
        descriptionDetails: `See more at https://angular.io/styleguide#style-05-13.`,
        rationale: `Consistent conventions make it easy to quickly identify files when you search with autocomplte.`,
        options: null,
        optionsDescription: "Not configurable.",
        typescriptOnly: true,
    };

    public static FAILURE_STRING =  'The name of the File  should not start with ADF Alfresco or Activiti prefix.';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new AdfFileName(sourceFile, this.getOptions()));
    }
}

// The walker takes care of all the work.
class AdfFileName extends Lint.RuleWalker {
    public visitSourceFile(node: ts.SourceFile) {

        var fileNameReg = /^(alfresco|activiti|adf|activity)/ig;
        var filenameMatch = fileNameReg.exec(this.getFilename());

        if(filenameMatch) {
            console.log(this.getFilename());

            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));

            // call the base version of this visitor to actually parse this node
            super.visitSourceFile(node);
        }
    }

    private getFilename(): string {
        const filename = this.getSourceFile().fileName;
        const lastSlash = filename.lastIndexOf('/');
        if (lastSlash > -1) {
            return filename.substring(lastSlash + 1);
        }
        return filename;
    }
}
