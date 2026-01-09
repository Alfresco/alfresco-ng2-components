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

import { Injectable } from '@angular/core';
import { AdfHttpClient } from '@alfresco/adf-core/api';
import { FormModel } from '../components/widgets/core';
import { AppConfigService } from '../../app-config';
import { forkJoin, from, map, Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FormExpressionService {
    private readonly GLOBAL_EXPRESSION_REGEX = /\$\{(\s|\S)+?\}/gm;
    private readonly FIELD_PREFIX = 'field.';
    private readonly VARIABLE_PREFIX = 'variable.';
    private readonly VARIABLES_REGEX = /(?:field|variable)\.[a-zA-Z_$][a-zA-Z0-9_$]*/g;

    constructor(
        private appConfigService: AppConfigService,
        private adfHttpClient: AdfHttpClient
    ) {}

    resolveExpressions(form: FormModel, formField: string): Observable<any> {
        let result = formField || '';

        const matches = result.match(this.GLOBAL_EXPRESSION_REGEX);

        if (!matches) {
            return of(result);
        }

        const observables: { [key: string]: Observable<any> } = {};
        const syncResults: { [key: string]: any } = {};

        for (const match of matches) {
            const expressionResult = this.resolveExpression(form, match);
            if (expressionResult instanceof Observable) {
                observables[match] = expressionResult;
            } else {
                syncResults[match] = expressionResult;
            }
        }

        if (Object.keys(observables).length === 0) {
            // All synchronous, replace immediately
            for (const match of matches) {
                let expressionResult = syncResults[match];
                if (expressionResult === null || expressionResult === undefined) {
                    expressionResult = '';
                } else if (typeof expressionResult !== 'string') {
                    expressionResult = JSON.stringify(expressionResult);
                }
                result = result.replace(match, expressionResult);
            }
            return of(result);
        }

        // Handle async observables
        return forkJoin(observables).pipe(
            map((asyncResults) => {
                let finalResult = result;
                for (const match of matches) {
                    let expressionResult = observables[match] ? asyncResults[match] : syncResults[match];
                    if (expressionResult === null || expressionResult === undefined) {
                        expressionResult = '';
                    } else if (typeof expressionResult !== 'string') {
                        expressionResult = JSON.stringify(expressionResult);
                    }
                    finalResult = finalResult.replace(match, expressionResult);
                }
                return finalResult;
            })
        );
    }

    private resolveExpression(form: FormModel, expression: any): any | Observable<any> {
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

        const url = `${this.getHostName()}/modeling-service/v1/juel`;
        const variables: { [key: string]: any } = {};
        let fixedExpression = expressionString;

        for (const variableName of variableNames) {
            const strippedName = this.stripPrefix(variableName);
            variables[strippedName] = this.resolveVariable(form, variableName);
            fixedExpression = fixedExpression.replace(variableName, strippedName);
        }

        const apiCall = this.adfHttpClient.request(url, {
            httpMethod: 'POST',
            bodyParam: { expression: fixedExpression, variables },
            contentTypes: ['application/json'],
            accepts: ['application/json']
        });

        return from(apiCall).pipe(map((response: { result: any }) => response.result));
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

    private getHostName(): string {
        return this.appConfigService.get('bpmHost', '').match(/^(?:https?:)?(?:\/\/)?([^/?]+)/g)[0];
    }

    private stripPrefix(variableName: string): string {
        if (variableName.startsWith(this.FIELD_PREFIX)) {
            return variableName.slice(this.FIELD_PREFIX.length);
        } else if (variableName.startsWith(this.VARIABLE_PREFIX)) {
            return variableName.slice(this.VARIABLE_PREFIX.length);
        }
        return variableName;
    }
}
