/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isObservable } from 'rxjs';
import { FormModel } from '../components/widgets/core';
import { FormFieldValueFormatterService } from './form-field-value-formatter.service';
import { ADF_TYPED_VALUE_FORMATTING_ENABLED } from './form-field-value-formatter.token';

@Injectable({
    providedIn: 'root'
})
export class FormExpressionService {
    private readonly GLOBAL_EXPRESSION_REGEX = /\$\{[a-zA-Z0-9_.]+\}/g;
    private readonly FIELD_PREFIX = 'field.';
    private readonly VARIABLE_PREFIX = 'variable.';
    private readonly VARIABLES_REGEX = /(?:field|variable)\.[a-zA-Z_$][a-zA-Z0-9_$]*/g;

    private readonly formFieldValueFormatter = inject(FormFieldValueFormatterService);
    private readonly formattingEnabledToken = inject(ADF_TYPED_VALUE_FORMATTING_ENABLED, { optional: true });
    private formattingEnabled = false;

    constructor() {
        if (isObservable(this.formattingEnabledToken)) {
            this.formattingEnabledToken.pipe(takeUntilDestroyed()).subscribe((enabled: boolean) => {
                this.formattingEnabled = enabled ?? false;
            });
        } else {
            this.formattingEnabled = this.formattingEnabledToken ?? false;
        }
    }

    resolveExpressions(form: FormModel, formField: string, escapeHtml?: boolean): string {
        let result = formField || '';

        const matches = result.match(this.GLOBAL_EXPRESSION_REGEX);

        if (!matches) {
            return result;
        }

        for (const match of matches) {
            const rawResult = this.resolveExpression(form, match);
            let expressionResult = this.normalizeExpressionResult(form, match, rawResult);
            if (escapeHtml) {
                expressionResult = this.escapeHtmlEntities(expressionResult);
            }
            result = result.replace(match, expressionResult);
        }

        return result;
    }

    private normalizeExpressionResult(form: FormModel, match: string, expressionResult: any): string {
        if (expressionResult == null) {
            return '';
        }

        if (typeof expressionResult === 'string') {
            return expressionResult;
        }

        return this.formatTypedExpressionResult(form, match, expressionResult);
    }

    private formatTypedExpressionResult(form: FormModel, match: string, expressionResult: any): string {
        if (!this.formattingEnabled) {
            return JSON.stringify(expressionResult);
        }

        const fieldId = this.extractFieldIdFromMatch(match);
        const sourceField = fieldId ? form.getFieldById(fieldId) : undefined;

        if (sourceField && this.formFieldValueFormatter.hasFormatter(sourceField.type)) {
            return this.formFieldValueFormatter.formatValue(expressionResult, sourceField);
        }

        return JSON.stringify(expressionResult);
    }

    private escapeHtmlEntities(value: string): string {
        return value.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('"').join('&quot;').split("'").join('&#039;');
    }

    private resolveExpression(form: FormModel, expression: any): any {
        if (expression === undefined || expression === null) {
            return expression;
        }

        const expressionString = String(expression).trim();
        if (!expressionString.startsWith('${') || !expressionString.endsWith('}')) {
            return expressionString;
        }

        const variableNames = expressionString.match(this.VARIABLES_REGEX);
        if (!variableNames || variableNames.length === 0) {
            return expressionString;
        }

        if (variableNames.length === 1 && variableNames[0].length === expressionString.length - 3) {
            return this.resolveVariable(form, variableNames[0]);
        }

        return expressionString;
    }

    private resolveVariable(form: FormModel, variableName: string): any {
        if (variableName.startsWith(this.FIELD_PREFIX)) {
            const field = variableName.slice(this.FIELD_PREFIX.length);
            return form.getFieldById(field)?.value;
        } else if (variableName.startsWith(this.VARIABLE_PREFIX)) {
            const variable = variableName.slice(this.VARIABLE_PREFIX.length);
            return form.getProcessVariableValue(variable);
        } else {
            return '';
        }
    }

    private extractFieldIdFromMatch(match: string): string | null {
        const inner = match.slice(2, -1).trim();
        if (inner.startsWith(this.FIELD_PREFIX)) {
            return inner.slice(this.FIELD_PREFIX.length);
        }
        return null;
    }

    getFieldDependencies(expression: string): string[] {
        const dependencies: string[] = [];
        const matches = expression.match(this.GLOBAL_EXPRESSION_REGEX);

        if (!matches) {
            return dependencies;
        }

        for (const match of matches) {
            const variableNames = match.match(this.VARIABLES_REGEX);
            if (variableNames) {
                for (const variableName of variableNames) {
                    if (variableName.startsWith(this.FIELD_PREFIX)) {
                        const fieldId = variableName.slice(this.FIELD_PREFIX.length);
                        if (!dependencies.includes(fieldId)) {
                            dependencies.push(fieldId);
                        }
                    }
                }
            }
        }

        return dependencies;
    }
}
