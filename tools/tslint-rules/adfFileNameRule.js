"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lint = require("tslint");
class Rule extends Lint.Rules.AbstractRule {
    apply(sourceFile) {
        return this.applyWithWalker(new AdfFileName(sourceFile, this.getOptions()));
    }
}
Rule.metadata = {
    ruleName: 'adf-file-name',
    type: 'maintainability',
    description: `Enforce consistent name avoid prefix`,
    descriptionDetails: `See more at https://angular.io/styleguide#style-05-13.`,
    rationale: `Consistent conventions make it easy to quickly identify files when you search with autocomplete.`,
    options: null,
    optionsDescription: "Not configurable.",
    typescriptOnly: true,
};
Rule.FAILURE_STRING = 'The name of the File should not start with ADF Alfresco or Activiti prefix ';
Rule.FAILURE_STRING_UNDERSCORE = 'The name of the File should not have _ in the name but you can use - prefer the kebab case';
exports.Rule = Rule;
class AdfFileName extends Lint.RuleWalker {
    visitSourceFile(node) {
        var whiteList = ['activiti-alfresco.service.ts', 'activiti-alfresco.service.spec.ts',
            'alfresco-api.service.ts', 'alfresco-api.service.spects'];
        var fileName = this.getFilename();
        var fileNameReg = /^(alfresco|activiti|adf|activity)/ig;
        var filenameMatch = fileNameReg.exec(fileName);
        var isWhiteListName = whiteList.find((currentWhiteListName) => {
            return currentWhiteListName === fileName;
        });
        if (filenameMatch && !isWhiteListName) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + fileName));
            super.visitSourceFile(node);
        }
        if (fileName.indexOf('_') >= 0) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING_UNDERSCORE + fileName));
            super.visitSourceFile(node);
        }
    }
    getFilename() {
        const filename = this.getSourceFile().fileName;
        const lastSlash = filename.lastIndexOf('/');
        if (lastSlash > -1) {
            return filename.substring(lastSlash + 1);
        }
        return filename;
    }
}
