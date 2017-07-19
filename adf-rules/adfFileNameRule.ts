import * as ts from "typescript";
import * as Lint from "tslint";


export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        ruleName: 'adf-file-name',
        type: 'maintainability',
        description: `Enforce consistent name avoid prefix`,
        descriptionDetails: `See more at https://angular.io/styleguide#style-05-13.`,
        rationale: `Consistent conventions make it easy to quickly identify files when you search with autocomplete.`,
        options: null,
        optionsDescription: "Not configurable.",
        typescriptOnly: true,
    };

    public static FAILURE_STRING =  'The name of the File should not start with ADF Alfresco or Activiti prefix ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new AdfFileName(sourceFile, this.getOptions()));
    }
}

// The walker takes care of all the work.
class AdfFileName extends Lint.RuleWalker {
    public visitSourceFile(node: ts.SourceFile) {
        var whiteList = ['activiti-content.component.ts', 'activiti-alfresco.service.ts', 'activiti-content-service.ts',
        'alfresco-api.service.ts', 'alfresco-settings.service.ts', 'alfresco-content.service.ts',
            'activiti-content.component.spec.ts', 'activiti-alfresco.service.spec.ts', 'activiti-content-service.spec.ts',
            'alfresco-api.service.spec.ts', 'alfresco-settings.service.spec.ts', 'alfresco-content.service.spec.ts',
            'activiti-content.service.spec.ts', 'activiti-content.service.ts'];

        var fileName = this.getFilename();

        var fileNameReg = /^(alfresco|activiti|adf|activity)/ig;
        var filenameMatch = fileNameReg.exec(fileName);

        var isWhiteListName = whiteList.find((currentWhiteListName)=>{
            return currentWhiteListName === fileName;
        });

        if (filenameMatch && !isWhiteListName) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + fileName));
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
