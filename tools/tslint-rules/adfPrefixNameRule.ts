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
import { NgWalker } from 'codelyzer/angular/ngWalker';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        ruleName: 'adf-prefix-name',
        type: 'maintainability',
        description: `Name events without the prefix on`,
        descriptionDetails: `See more at https://angular.io/guide/styleguide#dont-prefix-output-properties`,
        rationale: `Angular allows for an alternative syntax on-*. If the event itself was prefixed with on this would result in an on-onEvent binding expression`,
        options: null,
        optionsDescription: `Not configurable.`,
        typescriptOnly: true
    };

    static FAILURE_STRING: string = 'In the class "%s", the output ' +
        'property "%s" should not be prefixed with on';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(
            new ADFOutputPrefixNameRule(sourceFile,
                this.getOptions()));
    }
}

class ADFOutputPrefixNameRule extends NgWalker {
    visitNgOutput(property: ts.PropertyDeclaration, output: ts.Decorator, args: string[]) {
        const className = (<any>property).parent.name.text;
        const memberName = (<any>property.name).text;

        if (memberName && memberName.startsWith('on')) {
            const failureConfig: string[] = [className, memberName];
            failureConfig.unshift(Rule.FAILURE_STRING);
            this.addFailure(
                this.createFailure(
                    property.getStart(),
                    property.getWidth(),
                    sprintf.apply(this, failureConfig)));
        }
    }
}
