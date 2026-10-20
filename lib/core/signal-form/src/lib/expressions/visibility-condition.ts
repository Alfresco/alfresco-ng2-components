/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { format, isValid, parse } from 'date-fns';
import { VisibilityCondition } from '../definition/form-definition.model';

export interface ConditionValueSource {
    fieldValue(fieldId: string): unknown;
    variableValue(identifier: string): unknown;
}

interface ConditionOperand {
    type: string | null;
    value: unknown;
}

interface EvaluatedCondition {
    result: boolean;
    nextOperator: string;
}

export const evaluateVisibilityCondition = (condition: VisibilityCondition | null | undefined, source: ConditionValueSource): boolean => {
    const left = leftOperand(condition);
    if (!condition || !(left.type || left.value) || left.value === 'null') {
        return true;
    }
    return combine(evaluateChain(condition, source));
};

const evaluateChain = (condition: VisibilityCondition, source: ConditionValueSource): EvaluatedCondition[] => {
    const evaluated: EvaluatedCondition[] = [];
    let current: VisibilityCondition | null | undefined = condition;

    while (current) {
        const result = evaluateOperator(leftValue(current, source), rightValue(current, source), current.operator);
        evaluated.push({ result: !!result, nextOperator: current.nextConditionOperator ?? '' });
        current = current.nextCondition?.operator ? current.nextCondition : null;
    }

    return evaluated;
};

const combine = (conditions: EvaluatedCondition[]): boolean => {
    const orTerms: boolean[] = [];
    let term = conditions[0].result;

    for (let index = 1; index < conditions.length; index++) {
        const joining = conditions[index - 1].nextOperator;
        const next = conditions[index].result;

        if (joining === 'and') {
            term = term && next;
        } else if (joining === 'and-not') {
            term = term && !next;
        } else if (joining === 'or') {
            orTerms.push(term);
            term = next;
        } else if (joining === 'or-not') {
            orTerms.push(term);
            term = !next;
        }
    }

    orTerms.push(term);
    return orTerms.some(Boolean);
};

const leftOperand = (condition: VisibilityCondition | null | undefined): ConditionOperand => {
    if (!condition) {
        return { type: null, value: null };
    }
    const type = condition.leftFormFieldId ? 'field' : condition.leftRestResponseId ? 'variable' : (condition.leftType ?? null);
    const value = hasText(condition.leftValue) ? condition.leftValue : condition.leftFormFieldId || condition.leftRestResponseId || null;
    return { type, value };
};

const rightOperand = (condition: VisibilityCondition): ConditionOperand => {
    const type = condition.rightType
        ? condition.rightType
        : condition.rightValue
          ? 'value'
          : condition.rightRestResponseId
            ? 'variable'
            : condition.rightFormFieldId
              ? 'field'
              : null;
    const value = hasText(condition.rightValue) ? condition.rightValue : condition.rightFormFieldId || condition.rightRestResponseId || null;
    return { type, value };
};

const leftValue = (condition: VisibilityCondition, source: ConditionValueSource): unknown => {
    const left = leftOperand(condition);

    if (left.type === 'variable') {
        return source.variableValue(`${left.value}`);
    }
    if (left.type !== 'field') {
        return '';
    }

    const value = source.fieldValue(`${left.value}`);
    if (value !== undefined && value !== '') {
        return value;
    }

    const variable = source.variableValue(`${left.value}`);
    return variable !== undefined && variable !== null ? variable : value;
};

const rightValue = (condition: VisibilityCondition, source: ConditionValueSource): unknown => {
    const right = rightOperand(condition);

    if (right.type === 'field') {
        return source.fieldValue(`${right.value}`);
    }
    if (right.type === 'variable') {
        return source.variableValue(`${right.value}`);
    }

    const asDate = parse(`${right.value}`, 'yyyy-MM-dd', new Date());
    return isValid(asDate) ? `${format(asDate, 'yyyy-MM-dd')}T00:00:00.000Z` : right.value;
};

const evaluateOperator = (left: any, right: any, operator: string | undefined): boolean | undefined => {
    switch (operator) {
        case '==':
            return left + '' === right + '';
        case '!=':
            return left + '' !== right + '';
        case '<':
            return left < right;
        case '>':
            return left > right;
        case '>=':
            return left >= right;
        case '<=':
            return left <= right;
        case 'empty':
            return left ? left === '' : true;
        case '!empty':
            return left ? left !== '' : false;
        case 'contains':
            return contains(left, right);
        case '!contains':
            return !contains(left, right);
        default:
            return undefined;
    }
};

const contains = (left: unknown, right: unknown): boolean =>
    Array.isArray(left) && Array.isArray(right) && right.every((element) => left.includes(element));

const hasText = (value: unknown): boolean => value !== null && value !== undefined && `${value}` !== '';
