import * as Lint from 'tslint';
import * as ts from 'typescript';
import {sprintf} from 'sprintf-js';
import {ComponentMetadata} from 'codelyzer/angular/metadata';
import {Failure} from 'codelyzer/walkerFactory/walkerFactory';
import {all, validateComponent} from 'codelyzer/walkerFactory/walkerFn';
import {Maybe, F2} from 'codelyzer/util/function';
import {IOptions} from 'tslint';
import {NgWalker} from 'codelyzer/angular/ngWalker';

export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: Lint.IRuleMetadata = {
        ruleName: 'adf-class-name',
        type: 'maintainability',
        description: `Enforce consistent name avoid prefix`,
        descriptionDetails: `See more at https://angular.io/styleguide#style-05-13.`,
        rationale: `Consistent conventions make it easy to quickly identify class when you search with autocomplete.`,
        options: null,
        optionsDescription: "Not configurable.",
        typescriptOnly: true,
    };

    public static FAILURE_STRING = 'The name of the class should not start with ADF Alfresco or Activiti prefix ';

    static walkerBuilder: F2<ts.SourceFile, IOptions, NgWalker> =
        all(
            validateComponent((meta: ComponentMetadata, suffixList?: string[]) =>
                Maybe.lift(meta.controller)
                    .fmap(controller => controller.name)
                    .fmap(name => {
                        const className = name.text;
                        if (Rule.invalidName(className)) {
                            return [new Failure(name, sprintf(Rule.FAILURE_STRING + className , className, suffixList))];
                        }
                    })
            ));

    static invalidName(className: string): boolean {
        var whiteList = ['ActivitiContentComponent', 'ActivitiForm'];

        var classNameReg = /^(alfresco|activiti|adf|activity)/ig;
        var classNameMatch = classNameReg.exec(className);

        var isWhiteListName = whiteList.find((currentWhiteListName)=>{
            return currentWhiteListName === className;
        });

        if (classNameMatch && !isWhiteListName) {
            return true;
        }

        return false;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(
            Rule.walkerBuilder(sourceFile, this.getOptions())
        );
    }
}
