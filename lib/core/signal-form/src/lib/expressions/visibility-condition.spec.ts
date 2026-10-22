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

import type { VisibilityCondition } from '../definition/form-definition.interface';
import { ConditionValueSource, evaluateVisibilityCondition } from './visibility-condition';

describe('evaluateVisibilityCondition', () => {
    const source = (fields: Record<string, unknown>, variables: Record<string, unknown> = {}): ConditionValueSource => ({
        fieldValue: (fieldId) => fields[fieldId],
        variableValue: (identifier) => variables[identifier]
    });
    const fieldIs = (fieldId: string, operator: string, rightValue: VisibilityCondition['rightValue']): VisibilityCondition => ({
        leftType: 'field',
        leftValue: fieldId,
        operator,
        rightType: 'value',
        rightValue
    });
    const isShown = (condition: VisibilityCondition | null, fields: Record<string, unknown>, variables?: Record<string, unknown>) =>
        evaluateVisibilityCondition(condition, source(fields, variables));

    it('should show what has no condition, no left operand or a left operand of "null"', () => {
        expect(isShown(null, {})).toBeTrue();
        expect(isShown({ operator: '==', rightValue: 'IT' }, {})).toBeTrue();
        expect(isShown({ leftType: 'field', leftValue: 'null', operator: '==', rightValue: 'IT' }, {})).toBeTrue();
    });

    it('should compare a field with a value for equality', () => {
        expect(isShown(fieldIs('country', '==', 'IT'), { country: 'IT' })).toBeTrue();
        expect(isShown(fieldIs('country', '==', 'IT'), { country: 'FR' })).toBeFalse();
        expect(isShown(fieldIs('country', '!=', 'IT'), { country: 'FR' })).toBeTrue();
        expect(isShown(fieldIs('country', '!=', 'IT'), { country: 'IT' })).toBeFalse();
    });

    it('should compare numbers in order', () => {
        expect(isShown(fieldIs('age', '>', 18), { age: 20 })).toBeTrue();
        expect(isShown(fieldIs('age', '>', 18), { age: 18 })).toBeFalse();
        expect(isShown(fieldIs('age', '>=', 18), { age: 18 })).toBeTrue();
        expect(isShown(fieldIs('age', '<', 18), { age: 18 })).toBeFalse();
        expect(isShown(fieldIs('age', '<=', 18), { age: 18 })).toBeTrue();
    });

    it('should compare a date value as the midnight UTC text a date field submits', () => {
        expect(isShown(fieldIs('due', '>', '2024-03-15'), { due: '2024-03-16T00:00:00.000Z' })).toBeTrue();
        expect(isShown(fieldIs('due', '==', '2024-03-15'), { due: '2024-03-15T00:00:00.000Z' })).toBeTrue();
    });

    it('should tell whether a field is empty', () => {
        const isEmpty: VisibilityCondition = { leftType: 'field', leftValue: 'note', operator: 'empty' };
        const isNotEmpty: VisibilityCondition = { leftType: 'field', leftValue: 'note', operator: '!empty' };

        expect(isShown(isEmpty, { note: '' })).toBeTrue();
        expect(isShown(isEmpty, { note: 'written' })).toBeFalse();
        expect(isShown(isNotEmpty, { note: 'written' })).toBeTrue();
        expect(isShown(isNotEmpty, { note: '' })).toBeFalse();
    });

    it('should tell whether a list contains every item of another', () => {
        const contains: VisibilityCondition = {
            leftType: 'field',
            leftValue: 'picked',
            operator: 'contains',
            rightType: 'field',
            rightValue: 'wanted'
        };

        expect(isShown(contains, { picked: ['a', 'b', 'c'], wanted: ['a', 'c'] })).toBeTrue();
        expect(isShown(contains, { picked: ['a', 'b'], wanted: ['a', 'd'] })).toBeFalse();
        expect(isShown({ ...contains, operator: '!contains' }, { picked: ['a', 'b'], wanted: ['a', 'd'] })).toBeTrue();
    });

    it('should hide what uses an unknown operator', () => {
        expect(isShown(fieldIs('country', 'between', 'IT'), { country: 'IT' })).toBeFalse();
    });

    it('should compare a multiple selection as its items joined by commas', () => {
        expect(isShown(fieldIs('countries', '==', 'IT'), { countries: ['IT'] })).toBeTrue();
        expect(isShown(fieldIs('countries', '==', 'IT,FR'), { countries: ['IT', 'FR'] })).toBeTrue();
        expect(isShown(fieldIs('countries', '==', ',FR'), { countries: [null, 'FR'] })).toBeTrue();
    });

    it('should compare objects by their content and dates as dates', () => {
        const sameAs: VisibilityCondition = { leftType: 'field', leftValue: 'first', operator: '==', rightType: 'field', rightValue: 'second' };
        const date = new Date(2024, 2, 15);

        expect(isShown(sameAs, { first: { id: 'IT' }, second: { id: 'IT' } })).toBeTrue();
        expect(isShown(sameAs, { first: { id: 'IT' }, second: { id: 'FR' } })).toBeFalse();
        expect(isShown(sameAs, { first: date, second: new Date(2024, 2, 15) })).toBeTrue();
    });

    it('should read variables, and a field without a value from the variable of the same name', () => {
        const approved: VisibilityCondition = { leftType: 'variable', leftValue: 'approved', operator: '==', rightType: 'value', rightValue: 'true' };
        const overLimit: VisibilityCondition = { leftType: 'field', leftValue: 'age', operator: '>', rightType: 'variable', rightValue: 'limit' };

        expect(isShown(approved, {}, { approved: true })).toBeTrue();
        expect(isShown(fieldIs('status', '==', 'open'), {}, { status: 'open' })).toBeTrue();
        expect(isShown(overLimit, { age: 6 }, { limit: 5 })).toBeTrue();
    });

    it('should read a left operand that is neither a field nor a variable as empty', () => {
        expect(isShown({ leftType: 'value', leftValue: 'anything', operator: 'empty' }, {})).toBeTrue();
    });

    it('should read the operands of the older id properties', () => {
        expect(isShown({ leftFormFieldId: 'country', operator: '==', rightValue: 'IT' }, { country: 'IT' })).toBeTrue();
        expect(isShown({ leftFormFieldId: 'first', operator: '==', rightFormFieldId: 'second' }, { first: 'x', second: 'x' })).toBeTrue();
        expect(isShown({ leftRestResponseId: 'count', operator: '==', rightValue: '1' }, {}, { count: 1 })).toBeTrue();
        expect(isShown({ leftFormFieldId: 'first', operator: '==', rightRestResponseId: 'expected' }, { first: 'x' }, { expected: 'x' })).toBeTrue();
    });

    it('should chain conditions with and, or, and-not and or-not, "and" binding first', () => {
        const chain = (first: VisibilityCondition, operator: string, second: VisibilityCondition): VisibilityCondition => ({
            ...first,
            nextConditionOperator: operator,
            nextCondition: second
        });
        const italian = fieldIs('country', '==', 'IT');
        const adult = fieldIs('age', '>', 18);

        expect(isShown(chain(italian, 'and', adult), { country: 'IT', age: 10 })).toBeFalse();
        expect(isShown(chain(italian, 'or', adult), { country: 'FR', age: 20 })).toBeTrue();
        expect(isShown(chain(italian, 'and-not', adult), { country: 'IT', age: 10 })).toBeTrue();
        expect(isShown(chain(italian, 'or-not', adult), { country: 'FR', age: 10 })).toBeTrue();
        const italianOrAdultInRome = chain(italian, 'or', chain(adult, 'and', fieldIs('city', '==', 'Rome')));

        expect(isShown(italianOrAdultInRome, { country: 'FR', age: 20, city: 'Milan' })).toBeFalse();
    });

    it('should stop the chain at a next condition without an operator', () => {
        const chained: VisibilityCondition = {
            ...fieldIs('country', '==', 'IT'),
            nextConditionOperator: 'and',
            nextCondition: { leftType: 'field' }
        };

        expect(isShown(chained, { country: 'IT' })).toBeTrue();
    });
});
