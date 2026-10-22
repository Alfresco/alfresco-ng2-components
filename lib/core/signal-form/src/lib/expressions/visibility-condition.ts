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
import type { ConditionLiteral, VisibilityCondition } from '../definition/form-definition.interface';

export interface ConditionValueSource {
    fieldValue(fieldId: string): unknown;
    variableValue(identifier: string): unknown;
}

const FIELD_OPERAND = 'field';
const VARIABLE_OPERAND = 'variable';
const VALUE_OPERAND = 'value';

interface ConditionOperand {
    type: string | null;
    value: ConditionLiteral | null;
}

type PrimitiveValue = string | number | boolean | bigint | null | undefined;

/** A condition as a field, tab or outcome may set it, or none. */
type ConditionOrNone = VisibilityCondition | null | undefined;

interface EvaluatedCondition {
    result: boolean;
    nextOperator: string;
}

export const evaluateVisibilityCondition = (condition: ConditionOrNone, source: ConditionValueSource): boolean => {
    const left = leftOperand(condition);
    if (!condition || !(left.type || left.value) || left.value === 'null') {
        return true;
    }
    return combineResults(evaluateEachCondition(condition, source));
};

const evaluateEachCondition = (condition: VisibilityCondition, source: ConditionValueSource): EvaluatedCondition[] => {
    const evaluated: EvaluatedCondition[] = [];
    let current: ConditionOrNone = condition;

    while (current) {
        const result = evaluateOperator(leftValue(current, source), rightValue(current, source), current.operator);
        evaluated.push({ result: !!result, nextOperator: current.nextConditionOperator ?? '' });
        current = current.nextCondition?.operator ? current.nextCondition : null;
    }

    return evaluated;
};

const combineResults = (conditions: EvaluatedCondition[]): boolean => {
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

const leftOperand = (condition: ConditionOrNone): ConditionOperand => {
    if (!condition) {
        return { type: null, value: null };
    }
    const value = hasText(condition.leftValue) ? condition.leftValue : condition.leftFormFieldId || condition.leftRestResponseId || null;
    return { type: leftOperandType(condition), value };
};

/**
 * Returns what the left side of a condition reads, as today's form decides it: a field or a variable named by the
 * older id properties, else the condition's own left type.
 *
 * @param condition the condition
 * @returns the left operand type, `null` when the condition names none
 */
const leftOperandType = (condition: VisibilityCondition): string | null => {
    if (condition.leftFormFieldId) {
        return FIELD_OPERAND;
    }
    if (condition.leftRestResponseId) {
        return VARIABLE_OPERAND;
    }
    return condition.leftType ?? null;
};

const rightOperand = (condition: VisibilityCondition): ConditionOperand => {
    const value = hasText(condition.rightValue) ? condition.rightValue : condition.rightFormFieldId || condition.rightRestResponseId || null;
    return { type: rightOperandType(condition), value };
};

/**
 * Returns what the right side of a condition reads, as today's form decides it: the condition's own right type, else a
 * plain value when it has one, else a variable or a field named by the older id properties.
 *
 * @param condition the condition
 * @returns the right operand type, `null` when the condition names none
 */
const rightOperandType = (condition: VisibilityCondition): string | null => {
    if (condition.rightType) {
        return condition.rightType;
    }
    if (condition.rightValue) {
        return VALUE_OPERAND;
    }
    if (condition.rightRestResponseId) {
        return VARIABLE_OPERAND;
    }
    return condition.rightFormFieldId ? FIELD_OPERAND : null;
};

const leftValue = (condition: VisibilityCondition, source: ConditionValueSource): unknown => {
    const left = leftOperand(condition);

    if (left.type === VARIABLE_OPERAND) {
        return source.variableValue(operandName(left));
    }
    if (left.type !== FIELD_OPERAND) {
        return '';
    }

    const value = source.fieldValue(operandName(left));
    if (value !== undefined && value !== '') {
        return value;
    }

    return source.variableValue(operandName(left)) ?? value;
};

const rightValue = (condition: VisibilityCondition, source: ConditionValueSource): unknown => {
    const right = rightOperand(condition);

    if (right.type === FIELD_OPERAND) {
        return source.fieldValue(operandName(right));
    }
    if (right.type === VARIABLE_OPERAND) {
        return source.variableValue(operandName(right));
    }

    const asDate = parse(operandName(right), 'yyyy-MM-dd', new Date());
    return isValid(asDate) ? `${format(asDate, 'yyyy-MM-dd')}T00:00:00.000Z` : right.value;
};

const evaluateOperator = (left: unknown, right: unknown, operator: string | undefined): boolean | undefined => {
    switch (operator) {
        case '==':
            return comparedText(left) === comparedText(right);
        case '!=':
            return comparedText(left) !== comparedText(right);
        case '<':
            return asComparable(left) < asComparable(right);
        case '>':
            return asComparable(left) > asComparable(right);
        case '>=':
            return asComparable(left) >= asComparable(right);
        case '<=':
            return asComparable(left) <= asComparable(right);
        case 'empty':
            return left ? left === '' : true;
        case '!empty':
            return left ? left !== '' : false;
        case 'contains':
            return containsAll(left, right);
        case '!contains':
            return !containsAll(left, right);
        default:
            return undefined;
    }
};

/**
 * Returns the field id, variable name or constant an operand names, as text.
 *
 * @param operand the operand
 * @returns the text, `'null'` for an operand that names nothing, as today's form reads it
 */
const operandName = (operand: ConditionOperand): string => `${operand.value}`;

/**
 * Turns a condition value into the text `==` and `!=` compare, as today's form does: a list as its items joined by
 * commas, so a multiple selection `['a']` equals `'a'`; a date as its text; any other object as JSON.
 *
 * @param value the condition value
 * @returns the text
 */
const comparedText = (value: unknown): string => {
    if (isPrimitive(value)) {
        return `${value}`;
    }
    if (Array.isArray(value)) {
        return value.map(listItemText).join(',');
    }
    if (value instanceof Date) {
        return value.toString();
    }
    return JSON.stringify(value) ?? '';
};

const listItemText = (item: unknown): string => (item === null || item === undefined ? '' : comparedText(item));

const isPrimitive = (value: unknown): value is PrimitiveValue =>
    value === null || (typeof value !== 'object' && typeof value !== 'function' && typeof value !== 'symbol');

/**
 * Lets two condition values be compared as JavaScript compares them, as today's form does: numbers as numbers, texts
 * (such as ISO dates) as texts.
 *
 * @param value the condition value
 * @returns the value, typed for comparison
 */
const asComparable = (value: unknown): string | number => value as string | number;

const containsAll = (left: unknown, right: unknown): boolean =>
    Array.isArray(left) && Array.isArray(right) && right.every((element) => left.includes(element));

const hasText = (value: ConditionLiteral | null | undefined): boolean => value !== null && value !== undefined && `${value}` !== '';
