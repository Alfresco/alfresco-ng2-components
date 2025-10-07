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

import { ErrorMessageModel } from './error-message.model';
import { FormFieldTypes } from './form-field-types';
import {
    FixedValueFieldValidator,
    MaxLengthFieldValidator,
    MaxValueFieldValidator,
    MinLengthFieldValidator,
    MinValueFieldValidator,
    NumberFieldValidator,
    RegExFieldValidator,
    RequiredFieldValidator,
    DecimalFieldValidator
} from './form-field-validator';
import { FormFieldModel } from './form-field.model';
import { FormModel } from './form.model';

describe('FormFieldValidator', () => {
    describe('RequiredFieldValidator', () => {
        let validator: RequiredFieldValidator;

        beforeEach(() => {
            validator = new RequiredFieldValidator();
        });

        it('should require [required] setting', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT,
                value: '<value>'
            });

            field.required = false;
            expect(validator.isSupported(field)).toBe(false);
            expect(validator.validate(field)).toBe(true);

            field.required = true;
            expect(validator.isSupported(field)).toBe(true);
            expect(validator.validate(field)).toBe(true);
        });

        it('should skip unsupported type', () => {
            const field = new FormFieldModel(new FormModel(), { type: 'wrong-type' });
            expect(validator.validate(field)).toBe(true);
        });

        it('should fail (display error) for radio buttons', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.RADIO_BUTTONS,
                required: true,
                options: [{ id: 'two', name: 'two' }]
            });
            field.value = 'one';

            expect(validator.validate(field)).toBe(false);
        });

        it('should succeed for radio buttons', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.RADIO_BUTTONS,
                required: true,
                value: 'two',
                options: [{ id: 'two', name: 'two' }]
            });

            expect(validator.validate(field)).toBe(true);
        });

        it('should fail (display error) for upload', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.UPLOAD,
                value: null,
                required: true
            });

            field.value = null;
            expect(validator.validate(field)).toBe(false);

            field.value = [];
            expect(validator.validate(field)).toBe(false);
        });

        it('should succeed for upload', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.UPLOAD,
                value: [{}],
                required: true
            });

            expect(validator.validate(field)).toBe(true);
        });

        it('should fail (display error) for text', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT,
                value: null,
                required: true
            });

            field.value = null;
            expect(validator.validate(field)).toBe(false);

            field.value = '';
            expect(validator.validate(field)).toBe(false);
        });

        it('should succeed for date', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATE,
                value: '2016-12-31',
                required: true
            });

            expect(validator.validate(field)).toBe(true);
        });

        it('should succeed for text', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT,
                value: '<value>',
                required: true
            });

            expect(validator.validate(field)).toBe(true);
        });

        it('should succeed for check box', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.BOOLEAN,
                required: true,
                value: true,
                options: [{ id: 'two', name: 'two' }]
            });

            expect(validator.validate(field)).toBe(true);
        });

        it('should fail (display error) for check box', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.BOOLEAN,
                required: true,
                value: false,
                options: [{ id: 'two', name: 'two' }]
            });
            field.value = false;

            expect(validator.validate(field)).toBe(false);
        });

        it('should succeed for file viewer', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.ALFRESCO_FILE_VIEWER,
                value: [{ sys_id: '123', sys_name: 'screenshot_123' }],
                required: true
            });

            expect(validator.validate(field)).toBe(true);
        });

        it('should fail if file viewer has no value', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.ALFRESCO_FILE_VIEWER,
                value: null,
                required: true
            });

            expect(validator.validate(field)).toBe(false);
        });

        it('should succeed for properties viewer', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.PROPERTIES_VIEWER,
                value: [{ sys_id: '123', sys_name: 'screenshot_123' }],
                required: true
            });

            expect(validator.validate(field)).toBe(true);
        });

        it('should fail for properties viewer with no value', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.PROPERTIES_VIEWER,
                value: null,
                required: true
            });

            expect(validator.validate(field)).toBe(false);
        });
    });

    describe('NumberFieldValidator', () => {
        let validator: NumberFieldValidator;

        beforeEach(() => {
            validator = new NumberFieldValidator();
        });

        it('should verify number', () => {
            expect(NumberFieldValidator.isNumber('1')).toBe(true);
            expect(NumberFieldValidator.isNumber('1.0')).toBe(true);
            expect(NumberFieldValidator.isNumber('-1')).toBe(true);
            expect(NumberFieldValidator.isNumber(1)).toBe(true);
            expect(NumberFieldValidator.isNumber(0)).toBe(true);
            expect(NumberFieldValidator.isNumber(-1)).toBe(true);
        });

        it('should not verify number', () => {
            expect(NumberFieldValidator.isNumber(null)).toBe(false);
            expect(NumberFieldValidator.isNumber(undefined)).toBe(false);
            expect(NumberFieldValidator.isNumber('')).toBe(false);
            expect(NumberFieldValidator.isNumber('one')).toBe(false);
            expect(NumberFieldValidator.isNumber('1q')).toBe(false);
        });

        it('should allow empty number value', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                value: null
            });

            expect(validator.validate(field)).toBe(true);
        });

        it('should allow number value', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                value: 44
            });

            expect(validator.validate(field)).toBe(true);
        });

        it('should allow zero number value', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                value: 0
            });

            expect(validator.validate(field)).toBe(true);
        });

        it('should fail (display error) for wrong number value', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                value: '<value>'
            });

            field.validationSummary = new ErrorMessageModel();
            expect(validator.validate(field)).toBe(false);
            expect(field.validationSummary).not.toBeNull();
        });
    });

    describe('MinLengthFieldValidator', () => {
        let validator: MinLengthFieldValidator;

        beforeEach(() => {
            validator = new MinLengthFieldValidator();
        });

        it('should require minLength defined', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT
            });

            expect(validator.isSupported(field)).toBe(false);

            field.minLength = 10;
            expect(validator.isSupported(field)).toBe(true);
        });

        it('should allow empty values', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT,
                minLength: 10,
                value: null
            });

            expect(validator.validate(field)).toBe(true);
        });

        it('should succeed text validation', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT,
                minLength: 3,
                value: '1234'
            });

            expect(validator.validate(field)).toBe(true);
        });

        it('should fail (display error) text validation', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT,
                minLength: 3,
                value: '12'
            });

            field.validationSummary = new ErrorMessageModel();
            expect(validator.validate(field)).toBe(false);
            expect(field.validationSummary).not.toBeNull();
        });
    });

    describe('MaxLengthFieldValidator', () => {
        let validator: MaxLengthFieldValidator;

        beforeEach(() => {
            validator = new MaxLengthFieldValidator();
        });

        it('should require maxLength defined', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT
            });

            expect(validator.isSupported(field)).toBe(false);

            field.maxLength = 10;
            expect(validator.isSupported(field)).toBe(true);
        });

        it('should allow empty values', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT,
                maxLength: 10,
                value: null
            });

            expect(validator.validate(field)).toBe(true);
        });

        it('should succeed text validation', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT,
                maxLength: 3,
                value: '123'
            });

            expect(validator.validate(field)).toBe(true);
        });

        it('should fail (display error) text validation', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT,
                maxLength: 3,
                value: '1234'
            });

            field.validationSummary = new ErrorMessageModel();
            expect(validator.validate(field)).toBe(false);
            expect(field.validationSummary).not.toBeNull();
        });

        describe('MaxLengthFieldValidator with custom value', () => {
            let customValidator: MaxLengthFieldValidator;

            beforeEach(() => {
                customValidator = new MaxLengthFieldValidator([FormFieldTypes.NUMBER], 3);
            });

            it('should validate integer values', () => {
                const field = new FormFieldModel(new FormModel(), {
                    type: FormFieldTypes.NUMBER,
                    value: '444'
                });

                const isValid = customValidator.validate(field);
                expect(isValid).toBe(true);
            });

            it('should validate values exceeding maxLength', () => {
                const field = new FormFieldModel(new FormModel(), {
                    type: FormFieldTypes.NUMBER,
                    value: '4444'
                });

                const isValid = customValidator.validate(field);
                expect(isValid).toBe(false);
            });

            it('should not validate not supported fields', () => {
                const field = new FormFieldModel(new FormModel(), {
                    type: FormFieldTypes.TEXT,
                    value: 'abcd'
                });

                const isSupported = customValidator.isSupported(field);
                expect(isSupported).toBe(false);
            });
        });
    });

    describe('MinValueFieldValidator', () => {
        let validator: MinValueFieldValidator;

        beforeEach(() => {
            validator = new MinValueFieldValidator();
        });

        it('should require minValue defined', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER
            });
            expect(validator.isSupported(field)).toBe(false);

            field.minValue = '1';
            expect(validator.isSupported(field)).toBe(true);
        });

        it('should support numeric widgets only', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                minValue: '1'
            });

            expect(validator.isSupported(field)).toBe(true);

            field.type = FormFieldTypes.TEXT;
            expect(validator.isSupported(field)).toBe(false);
        });

        it('should allow empty values', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                value: null,
                minValue: '1'
            });

            expect(validator.validate(field)).toBe(true);
        });

        it('should succeed for unsupported types', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT
            });

            expect(validator.validate(field)).toBe(true);
        });

        it('should succeed validating value', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                value: '10',
                minValue: '10'
            });

            expect(validator.validate(field)).toBe(true);
        });

        it('should fail (display error) validating value', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                value: '9',
                minValue: '10'
            });

            field.validationSummary = new ErrorMessageModel();
            expect(validator.validate(field)).toBe(false);
            expect(field.validationSummary).not.toBeNull();
        });
    });

    describe('MaxValueFieldValidator', () => {
        let validator: MaxValueFieldValidator;

        beforeEach(() => {
            validator = new MaxValueFieldValidator();
        });

        it('should require maxValue defined', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER
            });
            expect(validator.isSupported(field)).toBe(false);

            field.maxValue = '1';
            expect(validator.isSupported(field)).toBe(true);
        });

        it('should support numeric widgets only', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                maxValue: '1'
            });

            expect(validator.isSupported(field)).toBe(true);

            field.type = FormFieldTypes.TEXT;
            expect(validator.isSupported(field)).toBe(false);
        });

        it('should allow empty values', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                value: null,
                maxValue: '1'
            });

            expect(validator.validate(field)).toBe(true);
        });

        it('should succeed for unsupported types', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT
            });

            expect(validator.validate(field)).toBe(true);
        });

        it('should succeed validating value', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                value: '10',
                maxValue: '10'
            });

            expect(validator.validate(field)).toBe(true);
        });

        it('should fail (display error) validating value', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                value: '11',
                maxValue: '10'
            });

            field.validationSummary = new ErrorMessageModel();
            expect(validator.validate(field)).toBe(false);
            expect(field.validationSummary).not.toBeNull();
        });
    });

    describe('RegExFieldValidator', () => {
        let validator: RegExFieldValidator;

        beforeEach(() => {
            validator = new RegExFieldValidator();
        });

        it('should require regex pattern to be defined', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT
            });
            expect(validator.isSupported(field)).toBe(false);

            field.regexPattern = '<pattern>';
            expect(validator.isSupported(field)).toBe(true);
        });

        it('should allow empty values', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT,
                value: null,
                regexPattern: 'pattern'
            });

            expect(validator.validate(field)).toBe(true);
        });

        it('should allow empty string values', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT,
                value: '',
                regexPattern: 'pattern'
            });

            expect(validator.validate(field)).toBe(true);
        });

        it('should succeed validating regex', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT,
                value: 'pattern',
                regexPattern: 'pattern'
            });

            expect(validator.validate(field)).toBe(true);
        });

        it('should fail (display error) validating regex', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT,
                value: 'some value',
                regexPattern: 'pattern'
            });

            expect(validator.validate(field)).toBe(false);
        });
    });

    describe('FixedValueFieldValidator', () => {
        let validator: FixedValueFieldValidator;

        beforeEach(() => {
            validator = new FixedValueFieldValidator();
        });

        it('should support only typeahead field', () => {
            let field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT
            });
            expect(validator.isSupported(field)).toBe(false);

            field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TYPEAHEAD
            });

            expect(validator.isSupported(field)).toBe(true);
        });

        it('should allow empty values', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TYPEAHEAD,
                value: null,
                regexPattern: 'pattern'
            });

            expect(validator.validate(field)).toBe(true);
        });

        it('should succeed for a valid input value in options', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TYPEAHEAD,
                value: '1',
                options: [
                    { id: '1', name: 'Leanne Graham' },
                    { id: '2', name: 'Ervin Howell' }
                ]
            });

            expect(validator.validate(field)).toBe(true);
        });

        it('should fail (display error) for an invalid input value in options', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TYPEAHEAD,
                value: 'Lean',
                options: [
                    { id: '1', name: 'Leanne Graham' },
                    { id: '2', name: 'Ervin Howell' }
                ]
            });

            expect(validator.validate(field)).toBe(false);
        });
    });

    describe('DecimalFieldValidator', () => {
        let decimalValidator: DecimalFieldValidator;

        beforeEach(() => {
            decimalValidator = new DecimalFieldValidator();
        });

        it('should validate decimal with correct precision', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DECIMAL,
                value: 1.22,
                precision: 2
            });

            expect(decimalValidator.validate(field)).toBe(true);
        });

        it('should return true when value is of lower precision', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DECIMAL,
                value: 1.2,
                precision: 2
            });

            expect(decimalValidator.validate(field)).toBe(true);
        });

        it('should return false when value is of higher precision', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DECIMAL,
                value: 1.22,
                precision: 1
            });

            expect(decimalValidator.validate(field)).toBe(false);
        });

        it('should validate decimal of wrong precision when value is of type string', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DECIMAL,
                value: '1.22',
                precision: 1
            });

            expect(decimalValidator.validate(field)).toBe(false);
        });

        it('should return false, when value is a negative number and of correct precission', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DECIMAL,
                value: -1.22,
                precision: 1
            });

            expect(decimalValidator.validate(field)).toBe(false);
        });

        it('should return true, when value is a positive number and of correct precission', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DECIMAL,
                value: -1.22,
                precision: 3
            });

            expect(decimalValidator.validate(field)).toBe(true);
        });
    });
});
