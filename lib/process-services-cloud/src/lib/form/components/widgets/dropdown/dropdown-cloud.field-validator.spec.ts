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

import { FormFieldModel, FormModel } from '@alfresco/adf-core';
import { DropdownCloudFieldValidator } from './dropdown-cloud.field-validator';

describe('DropdownCloudFieldValidator', () => {
    let validator: DropdownCloudFieldValidator;

    const options = [
        { id: 'empty', name: 'Choose one...' },
        { id: 'gold', name: 'Gold' }
    ];
    const variableConfig = { variableName: 'planOptions', optionsPath: 'list', optionsId: 'id', optionsLabel: 'name' };

    const createField = (json: Record<string, unknown>, form = new FormModel()): FormFieldModel =>
        new FormFieldModel(form, { id: 'dropdown', type: 'dropdown', required: true, ...json });

    const createVariableForm = (): FormModel =>
        new FormModel({ variables: [{ id: 'plan-options', name: 'planOptions', type: 'json', value: { list: [{ id: 'plus', name: 'Plus' }] } }] });

    beforeEach(() => {
        validator = new DropdownCloudFieldValidator();
    });

    it('should report required when a value next to an empty option is not one of the options', () => {
        const field = createField({ options, value: 'platinum' });

        expect(validator.validate(field)).toBe(false);
        expect(field.validationSummary.message).toBe('FORM.FIELD.REQUIRED');
    });

    it('should accept one of the options next to an empty option', () => {
        expect(validator.validate(createField({ options, value: 'gold' }))).toBe(true);
    });

    it('should report required when the value is not among the variable options', () => {
        expect(validator.validate(createField({ optionType: 'variable', variableConfig, value: 'legacy' }, createVariableForm()))).toBe(false);
    });

    it('should accept a value among the variable options', () => {
        expect(validator.validate(createField({ optionType: 'variable', variableConfig, value: 'plus' }, createVariableForm()))).toBe(true);
    });

    it('should report required when the variable holds null on the options path', () => {
        const form = new FormModel({ variables: [{ id: 'plan-options', name: 'planOptions', type: 'json', value: { list: null } }] });

        expect(validator.validate(createField({ optionType: 'variable', variableConfig, value: 'plus' }, form))).toBe(false);
    });

    it('should report required when the variable options contain null', () => {
        const form = new FormModel({ variables: [{ id: 'plan-options', name: 'planOptions', type: 'json', value: { list: [null] } }] });

        expect(validator.validate(createField({ optionType: 'variable', variableConfig, value: 'plus' }, form))).toBe(false);
    });

    it('should accept a stored value of a REST dropdown before its options load', () => {
        expect(validator.validate(createField({ optionType: 'rest', restUrl: 'https://example.com/options', value: 'any-id' }))).toBe(true);
    });

    it('should report required when a REST multiple selection dropdown has nothing selected', () => {
        const field = createField({ optionType: 'rest', restUrl: 'https://example.com/options', multiple: true, value: [] });

        expect(validator.validate(field)).toBe(false);
    });

    it('should accept a stored value that is not an option when the dropdown has no empty option', () => {
        const field = createField({ options: [{ id: 'gold', name: 'Gold' }], value: 'platinum' });

        expect(validator.validate(field)).toBe(true);
    });

    it('should report required when a linked dropdown has the empty option selected', () => {
        expect(validator.validate(createField({ rule: { ruleOn: 'country', entries: [] }, value: 'empty' }))).toBe(false);
    });

    it('should skip a read-only dropdown', () => {
        expect(validator.validate(createField({ options, readOnly: true, value: 'platinum' }))).toBe(true);
    });

    it('should skip a dropdown whose widget disabled its input', () => {
        const field = createField({ options, value: 'platinum' });
        field.inputDisabled = true;

        expect(validator.validate(field)).toBe(true);
    });
});
