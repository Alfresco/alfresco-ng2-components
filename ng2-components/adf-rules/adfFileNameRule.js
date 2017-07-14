"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Lint = require("tslint");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new AdfFileName(sourceFile, this.getOptions()));
    };
    Rule.metadata = {
        ruleName: 'adf-file-name',
        type: 'maintainability',
        description: "Enforce consistent name avoid prefix",
        descriptionDetails: "See more at https://angular.io/styleguide#style-05-13.",
        rationale: "Consistent conventions make it easy to quickly identify files when you search with autocomplete.",
        options: null,
        optionsDescription: "Not configurable.",
        typescriptOnly: true,
    };
    Rule.FAILURE_STRING = 'The name of the File should not start with ADF Alfresco or Activiti prefix ';
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var AdfFileName = (function (_super) {
    __extends(AdfFileName, _super);
    function AdfFileName() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AdfFileName.prototype.visitSourceFile = function (node) {
        var whiteList = ['activiti-content.component.ts', 'activiti-alfresco.service.ts', 'activiti-content-service.ts',
            'alfresco-api.service.ts', 'alfresco-settings.service.ts', 'alfresco-content.service.ts', 'alfresco-authentication.service.ts',
            'alfresco-translation.service.ts', 'alfresco-translate-loader.service.ts', 'alfresco-translation.service.ts',
            'activiti-content.component.spec.ts', 'activiti-alfresco.service.spec.ts', 'activiti-content-service.spec.ts',
            'alfresco-api.service.spec.ts', 'alfresco-settings.service.spec.ts', 'alfresco-content.service.spec.ts', 'alfresco-authentication.service.spec.ts',
            'alfresco-translation.service.spec.ts', 'alfresco-translate-loader.service.spec.ts', 'alfresco-translation.service.spec.ts',
            'alfresco-translate-loader.spec.ts', 'activiti-content.service.spec.ts'];
        var fileName = this.getFilename();
        var fileNameReg = /^(alfresco|activiti|adf|activity)/ig;
        var filenameMatch = fileNameReg.exec(fileName);
        var isWhiteListName = whiteList.find(function (currentWhiteListName) {
            return currentWhiteListName === fileName;
        });
        if (filenameMatch && !isWhiteListName) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + fileName));
            _super.prototype.visitSourceFile.call(this, node);
        }
    };
    AdfFileName.prototype.getFilename = function () {
        var filename = this.getSourceFile().fileName;
        var lastSlash = filename.lastIndexOf('/');
        if (lastSlash > -1) {
            return filename.substring(lastSlash + 1);
        }
        return filename;
    };
    return AdfFileName;
}(Lint.RuleWalker));
