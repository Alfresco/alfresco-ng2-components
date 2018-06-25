"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lint = require("tslint");
const sprintf_js_1 = require("sprintf-js");
const ngWalker_1 = require("codelyzer/angular/ngWalker");
class Rule extends Lint.Rules.AbstractRule {
    apply(sourceFile) {
        return this.applyWithWalker(new ADFOutputPrefixNameRule(sourceFile, this.getOptions()));
    }
}
Rule.metadata = {
    ruleName: 'adf-prefix-name',
    type: 'maintainability',
    description: `Name events without the prefix on`,
    descriptionDetails: `See more at https://angular.io/guide/styleguide#dont-prefix-output-properties`,
    rationale: `Angular allows for an alternative syntax on-*. If the event itself was prefixed with on this would result in an on-onEvent binding expression`,
    options: null,
    optionsDescription: `Not configurable.`,
    typescriptOnly: true,
};
Rule.FAILURE_STRING = 'In the class "%s", the output ' +
    'property "%s" should not be prefixed with on';
exports.Rule = Rule;
class ADFOutputPrefixNameRule extends ngWalker_1.NgWalker {
    visitNgOutput(property, output, args) {
        let className = property.parent.name.text;
        let memberName = property.name.text;
        if (memberName && memberName.startsWith('on')) {
            let failureConfig = [className, memberName];
            failureConfig.unshift(Rule.FAILURE_STRING);
            this.addFailure(this.createFailure(property.getStart(), property.getWidth(), sprintf_js_1.sprintf.apply(this, failureConfig)));
        }
    }
}
