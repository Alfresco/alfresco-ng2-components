/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { FormModel } from './form.model';
import { FormFieldModel } from './form-field.model';
import { FormFieldOption } from './form-field-option';
import { FormFieldTypes } from './form-field-types';
import {
    RequiredFieldValidator,
    NumberFieldValidator,
    MinLengthFieldValidator,
    MaxLengthFieldValidator,
    MinValueFieldValidator,
    MaxValueFieldValidator,
    RegExFieldValidator
} from './form-field-validator';

describe('FormFieldValidator', () => {

    describe('RequiredFieldValidator', () => {

        let validator: RequiredFieldValidator;

        beforeEach(() => {
           validator = new RequiredFieldValidator();
        });

        it('should require [required] setting', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT,
                value: '<value>'
            });

            field.required = false;
            expect(validator.isSupported(field)).toBeFalsy();
            expect(validator.validate(field)).toBeTruthy();

            field.required = true;
            expect(validator.isSupported(field)).toBeTruthy();
            expect(validator.validate(field)).toBeTruthy();
        });

        it('should skip unsupported type', () => {
            let field = new FormFieldModel(new FormModel(), { type: 'wrong-type' });
            expect(validator.validate(field)).toBeTruthy();
        });

        it('should fail for dropdown with empty value', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DROPDOWN,
                value: '<empty>',
                hasEmptyValue: true,
                required: true
            });

            field.emptyOption = <FormFieldOption> { id: '<empty>' };
            expect(validator.validate(field)).toBeFalsy();

            field.value = '<non-empty>';
            expect(validator.validate(field)).toBeTruthy();
        });

        it('should fail for radio buttons', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.RADIO_BUTTONS,
                required: true,
                value: 'one',
                options: [{ id: 'two', name: 'two' }]
            });

            expect(validator.validate(field)).toBeFalsy();
        });

        it('should succeed for radio buttons', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.RADIO_BUTTONS,
                required: true,
                value: 'two',
                options: [{ id: 'two', name: 'two' }]
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should fail for upload', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.UPLOAD,
                value: null,
                required: true
            });

            field.value = null;
            expect(validator.validate(field)).toBeFalsy();

            field.value = [];
            expect(validator.validate(field)).toBeFalsy();
        });

        it('should succeed for upload', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.UPLOAD,
                value: [{}],
                required: true
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should fail for text', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT,
                value: null,
                required: true
            });

            field.value = null;
            expect(validator.validate(field)).toBeFalsy();

            field.value = '';
            expect(validator.validate(field)).toBeFalsy();
        });

        it('should succeed for date', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATE,
                value: '2016-12-31',
                required: true
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should fail for date', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATE,
                value: null,
                required: true
            });

            field.value = null;
            expect(validator.validate(field)).toBeFalsy();

            field.value = '';
            expect(validator.validate(field)).toBeFalsy();
        });

        it('should succeed for text', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT,
                value: '<value>',
                required: true
            });

            expect(validator.validate(field)).toBeTruthy();
        });

    });

    describe('NumberFieldValidator', () => {

        let validator: NumberFieldValidator;

        beforeEach(() => {
            validator = new NumberFieldValidator();
        });

        it('should verify number', () => {
            expect(NumberFieldValidator.isNumber('1')).toBeTruthy();
            expect(NumberFieldValidator.isNumber('1.0')).toBeTruthy();
            expect(NumberFieldValidator.isNumber('-1')).toBeTruthy();
            expect(NumberFieldValidator.isNumber(1)).toBeTruthy();
            expect(NumberFieldValidator.isNumber(0)).toBeTruthy();
            expect(NumberFieldValidator.isNumber(-1)).toBeTruthy();
        });

        it('should not verify number', () => {
            expect(NumberFieldValidator.isNumber(null)).toBeFalsy();
            expect(NumberFieldValidator.isNumber(undefined)).toBeFalsy();
            expect(NumberFieldValidator.isNumber('')).toBeFalsy();
            expect(NumberFieldValidator.isNumber('one')).toBeFalsy();
            expect(NumberFieldValidator.isNumber('1q')).toBeFalsy();
        });

        it('should allow empty number value', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                value: null
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should allow number value', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                value: 44
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should allow zero number value', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                value: 0
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should fail for wrong number value', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                value: '<value>'
            });

            field.validationSummary = null;
            expect(validator.validate(field)).toBeFalsy();
            expect(field.validationSummary).not.toBeNull();
        });

    });

    describe('MinLengthFieldValidator', () => {

        let validator: MinLengthFieldValidator;

        beforeEach(() => {
            validator = new MinLengthFieldValidator();
        });

        it('should require minLength defined', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT
            });

            expect(validator.isSupported(field)).toBeFalsy();

            field.minLength = 10;
            expect(validator.isSupported(field)).toBeTruthy();
        });

        it('should allow empty values', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT,
                minLength: 10,
                value: null
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should succeed text validation', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT,
                minLength: 3,
                value: '1234'
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should fail text validation', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT,
                minLength: 3,
                value: '12'
            });

            field.validationSummary = null;
            expect(validator.validate(field)).toBeFalsy();
            expect(field.validationSummary).not.toBeNull();
        });

    });

    describe('MaxLengthFieldValidator', () => {

        let validator: MaxLengthFieldValidator;

        beforeEach(() => {
            validator = new MaxLengthFieldValidator();
        });

        it('should require maxLength defined', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT
            });

            expect(validator.isSupported(field)).toBeFalsy();

            field.maxLength = 10;
            expect(validator.isSupported(field)).toBeTruthy();
        });

        it('should allow empty values', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT,
                maxLength: 10,
                value: null
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should succeed text validation', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT,
                maxLength: 3,
                value: '123'
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should fail text validation', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT,
                maxLength: 3,
                value: '1234'
            });

            field.validationSummary = null;
            expect(validator.validate(field)).toBeFalsy();
            expect(field.validationSummary).not.toBeNull();
        });
    });

    describe('MinValueFieldValidator', () => {

        let validator: MinValueFieldValidator;

        beforeEach(() => {
            validator = new MinValueFieldValidator();
        });

        it('should require minValue defined', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER
            });
            expect(validator.isSupported(field)).toBeFalsy();

            field.minValue = '1';
            expect(validator.isSupported(field)).toBeTruthy();
        });

        it('should support numeric widgets only', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                minValue: '1'
            });

            expect(validator.isSupported(field)).toBeTruthy();

            field.type = FormFieldTypes.TEXT;
            expect(validator.isSupported(field)).toBeFalsy();
        });

        it('should allow empty values', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                value: null,
                minValue: '1'
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should succeed for unsupported types', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should succeed validating value', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                value: '10',
                minValue: '10'
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should fail validating value', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                value: '9',
                minValue: '10'
            });

            field.validationSummary = null;
            expect(validator.validate(field)).toBeFalsy();
            expect(field.validationSummary).not.toBeNull();
        });

    });

    describe('MaxValueFieldValidator', () => {

        let validator: MaxValueFieldValidator;

        beforeEach(() => {
            validator = new MaxValueFieldValidator();
        });

        it('should require maxValue defined', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER
            });
            expect(validator.isSupported(field)).toBeFalsy();

            field.maxValue = '1';
            expect(validator.isSupported(field)).toBeTruthy();
        });

        it('should support numeric widgets only', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                maxValue: '1'
            });

            expect(validator.isSupported(field)).toBeTruthy();

            field.type = FormFieldTypes.TEXT;
            expect(validator.isSupported(field)).toBeFalsy();
        });

        it('should allow empty values', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                value: null,
                maxValue: '1'
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should succeed for unsupported types', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should succeed validating value', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                value: '10',
                maxValue: '10'
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should fail validating value', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                value: '11',
                maxValue: '10'
            });

            field.validationSummary = null;
            expect(validator.validate(field)).toBeFalsy();
            expect(field.validationSummary).not.toBeNull();
        });

    });

    describe('RegExFieldValidator', () => {

        let validator: RegExFieldValidator;

        beforeEach(() => {
            validator = new RegExFieldValidator();
        });

        it('should require regex pattern to be defined', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT
            });
            expect(validator.isSupported(field)).toBeFalsy();

            field.regexPattern = '<pattern>';
            expect(validator.isSupported(field)).toBeTruthy();
        });

        it('should allow empty values', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT,
                value: null,
                regexPattern: 'pattern'
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should succeed validating regex', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT,
                value: 'pattern',
                regexPattern: 'pattern'
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should fail validating regex', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT,
                value: 'some value',
                regexPattern: 'pattern'
            });

            expect(validator.validate(field)).toBeFalsy();
        });

    });
});
