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

import { formFieldRuleHandler } from './form-field-rule.handler';
import { FormFieldRule } from '../form-field-rule';
import { mockParentRule, mockRule } from '../mocks/form-field-rule.handler.mock';
import { mockParentWithoutFields, mockParentWithFields, mockParentWithSectionFields } from '../mocks/repeatable-section-model.mock';

describe('formFieldRuleHandler', () => {
    it('should return null if provided rule is null', () => {
        expect(formFieldRuleHandler.getRule('mock-id', null)).toBe(null);
    });

    it('should return undefined if provided rule is undefined', () => {
        expect(formFieldRuleHandler.getRule('mock-id', undefined)).toBe(undefined);
    });

    it('should return provided rule if rule is provided and no parent is provided', () => {
        const expectedRule: FormFieldRule = {
            ruleOn: 'mock-rule-on',
            entries: []
        };

        expect(formFieldRuleHandler.getRule('mock-id', mockRule)).toEqual(expectedRule);
    });

    describe('rule and parent provided', () => {
        it('should return provided rule if parent has no fields', () => {
            const expectedRule: FormFieldRule = {
                ruleOn: 'mock-rule-on',
                entries: []
            };

            expect(formFieldRuleHandler.getRule('mock-id-Row123456789', mockRule, mockParentWithoutFields)).toEqual(expectedRule);
        });
        it('should return provided rule if ruleOn does not belong to parent fields', () => {
            const expectedRule: FormFieldRule = {
                ruleOn: 'mock-rule-on',
                entries: []
            };

            expect(formFieldRuleHandler.getRule('mock-id-Row123456789', mockRule, mockParentWithFields)).toEqual(expectedRule);
        });

        it('should return rule with parent ruleOn property if ruleOn belongs to parent fields', () => {
            const expectedRule: FormFieldRule = {
                ruleOn: 'Text0c0ydk-Row123456789',
                entries: []
            };

            expect(formFieldRuleHandler.getRule('mock-id-Row123456789', mockParentRule, mockParentWithFields)).toEqual(expectedRule);
        });

        it('should return rule with parent ruleOn property if ruleOn belongs to parent fields and sections are present', () => {
            const expectedRule: FormFieldRule = {
                ruleOn: 'Text0c0ydk-Row123456789',
                entries: []
            };

            expect(formFieldRuleHandler.getRule('mock-id-Row123456789', mockParentRule, mockParentWithSectionFields)).toEqual(expectedRule);
        });
    });
});
