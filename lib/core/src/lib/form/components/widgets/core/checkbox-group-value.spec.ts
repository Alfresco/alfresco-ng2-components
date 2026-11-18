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

import { getCheckboxGroupValue } from './checkbox-group-value';
import { FormFieldModel } from './form-field.model';
import { FormModel } from './form.model';
import { FormFieldTypes } from './form-field-types';
import { FormFieldValueAdapterService } from '../../../services/form-field-value-adapter.service';
import { FormFieldValueFormatterService } from '../../../services/form-field-value-formatter.service';
import { FieldStylePipe } from '../../../pipes/field-style.pipe';

const options = [
    { id: 'a', name: 'Alpha' },
    { id: 'b', name: 'Beta' }
];
const definition = { id: 'choices', type: FormFieldTypes.CHECKBOX_GROUP, options };

describe('Checkbox group shared values', () => {
    for (const value of [undefined, null, '', 'a', options[0], 12, true, [], [null, {}, [], 12, true, { id: '' }, { id: 'a' }]]) {
        it(`should normalize empty/invalid ${JSON.stringify(value)} to an array`, () => {
            expect(getCheckboxGroupValue(value, options)).toEqual([]);
        });
    }

    it('should resolve IDs, preserve saved labels, remove duplicate IDs and ignore extra properties', () => {
        expect(getCheckboxGroupValue(['a', options[1], { ...options[1], extra: 1 }, 'unknown'], options)).toEqual([
            options[0],
            options[1],
            { id: 'unknown', name: 'unknown' }
        ]);
        expect(getCheckboxGroupValue([{ id: 'a', name: 'Saved label' }], options)).toEqual([{ id: 'a', name: 'Saved label' }]);
        expect(getCheckboxGroupValue(['b', 'a'], options)).toEqual([options[1], options[0]]);
    });

    it('should infer multiple values from the field type without selection configuration', () => {
        const field = new FormFieldModel(new FormModel(), definition);
        expect(field.selectionType).toBeUndefined();
        expect(field.hasMultipleValues).toBeTrue();
        expect(field.value).toEqual([]);
        expect(field.form.values.choices).toEqual([]);
    });

    for (const optionType of ['manual', 'rest', 'variable']) {
        const saved = options;
        const empty = [];
        it(`should restore, submit, clear and reopen ${optionType} selections`, () => {
            const config = { ...definition, optionType, value: saved };
            const field = new FormFieldModel(new FormModel(), config);
            expect(field.value).toEqual(saved);
            expect(field.form.values.choices).toEqual(saved);
            field.value = empty;
            expect(field.form.values.choices).toEqual(empty);
            const reopened = new FormFieldModel(new FormModel(), { ...config, value: field.form.values.choices });
            expect(reopened.value).toEqual(empty);
            expect(reopened.form.values.choices).toEqual(empty);
        });
        it(`should explicitly submit empty ${optionType} values`, () => {
            const field = new FormFieldModel(new FormModel(), { ...definition, optionType });
            expect(field.form.values.choices).toEqual(empty);
        });
        it(`should validate required and optional ${optionType} selections`, () => {
            const field = new FormFieldModel(new FormModel(), { ...definition, optionType, required: true });
            expect(field.validate()).toBeFalse();
            expect(field.validationSummary.message).toBe('');
            field.value = saved;
            expect(field.validate()).toBeTrue();
            field.value = empty;
            expect(field.validate()).toBeFalse();
            field.required = false;
            expect(field.validate()).toBeTrue();
        });
    }

    it('should resolve primitive saved IDs and preserve saved options missing from the source', () => {
        const field = new FormFieldModel(new FormModel(), { ...definition, value: ['b', { id: 'old', name: 'Old label' }] });
        expect(field.getFormValue()).toEqual([options[1], { id: 'old', name: 'Old label' }]);
        expect(field.options).toContain({ id: 'old', name: 'Old label' });
    });

    it('should adapt external updates and format selection labels', () => {
        const adapter = new FormFieldValueAdapterService();
        const formatter = new FormFieldValueFormatterService();
        const field = new FormFieldModel(new FormModel(), definition);
        expect(adapter.hasAdapter(field.type)).toBeTrue();
        expect(formatter.hasFormatter(field.type)).toBeTrue();
        field.value = adapter.adapt(['a', options[1]], field);
        expect(formatter.format(field)).toBe('Alpha, Beta');
        expect(adapter.adapt(null, field)).toEqual([]);
        field.value = adapter.adapt(['b'], field);
        expect(field.getFormValue()).toEqual([options[1]]);
        expect(formatter.format(field)).toBe('Beta');
        expect(adapter.adapt([], field)).toEqual([]);
        expect(adapter.adapt('b', field)).toEqual([]);
        expect(formatter.formatValue(['a', options[1]], field)).toBe('Alpha, Beta');
        expect(formatter.formatValue([], field)).toBe('');
        expect(formatter.formatValue('b', field)).toBe('');
    });

    it('should load and explicitly clear via FormModel data updates', () => {
        const form = new FormModel({ fields: [definition] }, { choices: options });
        const field = form.getFormFields()[0];
        expect(field.getFormValue()).toEqual(options);
        const cleared = new FormModel({ fields: [definition] }, { choices: [] });
        expect(cleared.getFormFields()[0].value).toEqual([]);
        expect(cleared.values.choices).toEqual([]);
    });

    for (const key of ['choices', 'variables.Choices']) {
        it(`should keep a saved selection when ${key} is null, like other fields`, () => {
            const config = { ...definition, name: 'Choices', value: [options[0]] };
            const form = new FormModel({ fields: [config] }, { [key]: null });
            expect(form.values.choices).toEqual([options[0]]);
        });
    }
    it('should prefer an empty array variable over a populated field value', () => {
        const form = new FormModel(
            { fields: [{ ...definition, name: 'Choices', value: [options[0]] }] },
            {
                'variables.Choices': [],
                choices: [options[1]]
            }
        );
        expect(form.values.choices).toEqual([]);
    });

    it('should ignore a null variable and use the field value', () => {
        const form = new FormModel(
            { fields: [{ ...definition, name: 'Choices', value: [options[0]] }] },
            {
                'variables.Choices': null,
                choices: [options[1]]
            }
        );
        expect(form.values.choices).toEqual([options[1]]);
    });

    it('should skip required validation when hidden and validate readonly saved values', () => {
        const field = new FormFieldModel(new FormModel(), { ...definition, required: true, readOnly: true });
        expect(field.validate()).toBeFalse();
        field.value = options;
        expect(field.validate()).toBeTrue();
        field.value = [];
        spyOn(field.form, 'isFieldOrParentHidden').and.returnValue(true);
        expect(field.validate()).toBeTrue();
    });

    it('should resolve named custom and predefined styles', () => {
        const form = new FormModel({
            theme: {
                widgets: {
                    'checkbox-group': {
                        custom: { name: 'Custom', styles: { '--adf-checkbox-group-color': 'purple' } }
                    }
                }
            }
        });
        const field = new FormFieldModel(form, { ...definition, style: 'custom', alignmentType: 'horizontal', tooltip: 'Choose' });
        expect(new FieldStylePipe().transform(field)).toBe('--adf-checkbox-group-color:purple;');
        for (const style of ['normal', 'strong', 'heading']) {
            field.style = style;
            expect(new FieldStylePipe().transform(field)).toContain('--adf-checkbox-group-font-size:');
        }
        expect(field.alignmentType).toBe('horizontal');
        expect(field.tooltip).toBe('Choose');
    });
});
