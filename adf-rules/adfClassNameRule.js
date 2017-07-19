"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lint = require("tslint");
const sprintf_js_1 = require("sprintf-js");
const walkerFactory_1 = require("codelyzer/walkerFactory/walkerFactory");
const walkerFn_1 = require("codelyzer/walkerFactory/walkerFn");
const function_1 = require("codelyzer/util/function");
class Rule extends Lint.Rules.AbstractRule {
    static invalidName(className) {
        var whiteList = ['ActivitiContentComponent', 'ActivitiForm'];
        var classNameReg = /^(alfresco|activiti|adf|activity)/ig;
        var classNameMatch = classNameReg.exec(className);
        var isWhiteListName = whiteList.find((currentWhiteListName) => {
            return currentWhiteListName === className;
        });
        if (classNameMatch && !isWhiteListName) {
            return true;
        }
        return false;
    }
    apply(sourceFile) {
        return this.applyWithWalker(Rule.walkerBuilder(sourceFile, this.getOptions()));
    }
}
Rule.metadata = {
    ruleName: 'adf-class-name',
    type: 'maintainability',
    description: `Enforce consistent name avoid prefix`,
    descriptionDetails: `See more at https://angular.io/styleguide#style-05-13.`,
    rationale: `Consistent conventions make it easy to quickly identify class when you search with autocomplete.`,
    options: null,
    optionsDescription: "Not configurable.",
    typescriptOnly: true,
};
Rule.FAILURE_STRING = 'The name of the class should not start with ADF Alfresco or Activiti prefix ';
Rule.walkerBuilder = walkerFn_1.all(walkerFn_1.validateComponent((meta, suffixList) => function_1.Maybe.lift(meta.controller)
    .fmap(controller => controller.name)
    .fmap(name => {
    const className = name.text;
    if (Rule.invalidName(className)) {
        return [new walkerFactory_1.Failure(name, sprintf_js_1.sprintf(Rule.FAILURE_STRING + className, className, suffixList))];
    }
})));
exports.Rule = Rule;
