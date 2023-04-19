/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as Lint from 'tslint';
import * as ts from 'typescript';
import { sprintf } from 'sprintf-js';
import { ComponentMetadata } from 'codelyzer/angular/metadata';
import { Failure } from 'codelyzer/walkerFactory/walkerFactory';
import { all, validateComponent } from 'codelyzer/walkerFactory/walkerFn';
import { Maybe, F2 } from 'codelyzer/util/function';
import { IOptions } from 'tslint';
import { NgWalker } from 'codelyzer/angular/ngWalker';

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
                            return [new Failure(name, sprintf(Rule.FAILURE_STRING + className, className, suffixList))];
                        }
                    })
            ));

    static invalidName(className: string): boolean {
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

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(
            Rule.walkerBuilder(sourceFile, this.getOptions())
        );
    }
}
