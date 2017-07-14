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
exports.__esModule = true;
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
        rationale: "Consistent conventions make it easy to quickly identify files when you search with autocomplte.",
        options: null,
        optionsDescription: "Not configurable.",
        typescriptOnly: true
    };
    Rule.FAILURE_STRING = 'The name of the File  should not start with ADF Alfresco or Activiti prefix.';
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
// The walker takes care of all the work.
var AdfFileName = (function (_super) {
    __extends(AdfFileName, _super);
    function AdfFileName() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AdfFileName.prototype.visitSourceFile = function (node) {
        var fileNameReg = /^(alfresco|activiti|adf|activity)/ig;
        var filenameMatch = fileNameReg.exec(this.getFilename());
        if (filenameMatch) {
            console.log(this.getFilename());
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
            // call the base version of this visitor to actually parse this node
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
