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
var sprintf_js_1 = require("sprintf-js");
var walkerFactory_1 = require("codelyzer/walkerFactory/walkerFactory");
var walkerFn_1 = require("codelyzer/walkerFactory/walkerFn");
var function_1 = require("codelyzer/util/function");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.invalidName = function (className) {
        var whiteList = ['ActivitiContentComponent', 'ActivitiForm'];
        var classNameReg = /^(alfresco|activiti|adf|activity)/ig;
        var classNameMatch = classNameReg.exec(className);
        var isWhiteListName = whiteList.find(function (currentWhiteListName) {
            return currentWhiteListName === className;
        });
        if (classNameMatch && !isWhiteListName) {
            return true;
        }
        return false;
    };
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(Rule.walkerBuilder(sourceFile, this.getOptions()));
    };
    Rule.metadata = {
        ruleName: 'adf-class-name',
        type: 'maintainability',
        description: "Enforce consistent name avoid prefix",
        descriptionDetails: "See more at https://angular.io/styleguide#style-05-13.",
        rationale: "Consistent conventions make it easy to quickly identify class when you search with autocomplete.",
        options: null,
        optionsDescription: "Not configurable.",
        typescriptOnly: true,
    };
    Rule.FAILURE_STRING = 'The name of the class should not start with ADF Alfresco or Activiti prefix ';
    Rule.walkerBuilder = walkerFn_1.all(walkerFn_1.validateComponent(function (meta, suffixList) {
        return function_1.Maybe.lift(meta.controller)
            .fmap(function (controller) { return controller.name; })
            .fmap(function (name) {
            var className = name.text;
            if (Rule.invalidName(className)) {
                return [new walkerFactory_1.Failure(name, sprintf_js_1.sprintf(Rule.FAILURE_STRING + className, className, suffixList))];
            }
        });
    }));
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
