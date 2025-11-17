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
import { RepeatableSectionModel } from '../repeatable-section.model';

describe('formFieldRuleHandler', () => {
    it('should return null if provided rule is null', () => {
        expect(formFieldRuleHandler.getRule('mock-id', null)).toBe(null);
    });

    it('should return undefined if provided rule is undefined', () => {
        expect(formFieldRuleHandler.getRule('mock-id', undefined)).toBe(undefined);
    });

    it('should return provided rule if rule is provided', () => {
        const rule: FormFieldRule = {
            ruleOn: 'mock-rule-on',
            entries: []
        };

        expect(formFieldRuleHandler.getRule('mock-id', rule)).toEqual(rule);
    });

    it('should return provided rule if rule is provided and no parent is provided', () => {
        const rule: FormFieldRule = {
            ruleOn: 'mock-rule-on',
            entries: []
        };

        expect(formFieldRuleHandler.getRule('mock-id', rule)).toEqual(rule);
    });

    it('should return rule with parent ruleOn property if rule and parent are provided', () => {
        const rule: FormFieldRule = {
            ruleOn: 'mock-rule-on',
            entries: []
        };

        const parent: RepeatableSectionModel = {
            id: 'mock-parent-id',
            uid: 'mock-id-Row123456789',
            fields: [],
            rowIndex: 0
        };

        const expectedRule: FormFieldRule = {
            ruleOn: 'mock-rule-on-Row123456789',
            entries: []
        };

        expect(formFieldRuleHandler.getRule('mock-id-Row123456789', rule, parent)).toEqual(expectedRule);
    });
});
