/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { FormFieldOption } from './form-field-option';
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
    MaxDateTimeFieldValidator,
    MinDateTimeFieldValidator,
    MaxDateFieldValidator,
    MinDateFieldValidator
} from './form-field-validator';
import { FormFieldModel } from './form-field.model';
import { FormModel } from './form.model';
declare let moment: any;

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
            expect(validator.isSupported(field)).toBeFalsy();
            expect(validator.validate(field)).toBeTruthy();

            field.required = true;
            expect(validator.isSupported(field)).toBeTruthy();
            expect(validator.validate(field)).toBeTruthy();
        });

        it('should skip unsupported type', () => {
            const field = new FormFieldModel(new FormModel(), { type: 'wrong-type' });
            expect(validator.validate(field)).toBeTruthy();
        });

        it('should fail for dropdown with empty value', () => {
            const field = new FormFieldModel(new FormModel(), {
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
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.RADIO_BUTTONS,
                required: true,
                options: [{ id: 'two', name: 'two' }]
            });
            field.value = 'one';

            expect(validator.validate(field)).toBeFalsy();
        });

        it('should succeed for radio buttons', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.RADIO_BUTTONS,
                required: true,
                value: 'two',
                options: [{ id: 'two', name: 'two' }]
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should fail for upload', () => {
            const field = new FormFieldModel(new FormModel(), {
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
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.UPLOAD,
                value: [{}],
                required: true
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should fail for text', () => {
            const field = new FormFieldModel(new FormModel(), {
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
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATE,
                value: '2016-12-31',
                required: true
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should fail for date', () => {
            const field = new FormFieldModel(new FormModel(), {
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
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT,
                value: '<value>',
                required: true
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should succeed for check box', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.BOOLEAN,
                required: true,
                value: true,
                options: [{ id: 'two', name: 'two' }]
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should fail for check box', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.BOOLEAN,
                required: true,
                value: false,
                options: [{ id: 'two', name: 'two' }]
            });
            field.value = false;

            expect(validator.validate(field)).toBeFalsy();
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
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                value: null
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should allow number value', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                value: 44
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should allow zero number value', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                value: 0
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should fail for wrong number value', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                value: '<value>'
            });

            field.validationSummary = new ErrorMessageModel();
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
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT
            });

            expect(validator.isSupported(field)).toBeFalsy();

            field.minLength = 10;
            expect(validator.isSupported(field)).toBeTruthy();
        });

        it('should allow empty values', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT,
                minLength: 10,
                value: null
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should succeed text validation', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT,
                minLength: 3,
                value: '1234'
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should fail text validation', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT,
                minLength: 3,
                value: '12'
            });

            field.validationSummary = new ErrorMessageModel();
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
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT
            });

            expect(validator.isSupported(field)).toBeFalsy();

            field.maxLength = 10;
            expect(validator.isSupported(field)).toBeTruthy();
        });

        it('should allow empty values', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT,
                maxLength: 10,
                value: null
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should succeed text validation', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT,
                maxLength: 3,
                value: '123'
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should fail text validation', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT,
                maxLength: 3,
                value: '1234'
            });

            field.validationSummary = new ErrorMessageModel();
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
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER
            });
            expect(validator.isSupported(field)).toBeFalsy();

            field.minValue = '1';
            expect(validator.isSupported(field)).toBeTruthy();
        });

        it('should support numeric widgets only', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                minValue: '1'
            });

            expect(validator.isSupported(field)).toBeTruthy();

            field.type = FormFieldTypes.TEXT;
            expect(validator.isSupported(field)).toBeFalsy();
        });

        it('should allow empty values', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                value: null,
                minValue: '1'
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should succeed for unsupported types', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should succeed validating value', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                value: '10',
                minValue: '10'
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should fail validating value', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                value: '9',
                minValue: '10'
            });

            field.validationSummary = new ErrorMessageModel();
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
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER
            });
            expect(validator.isSupported(field)).toBeFalsy();

            field.maxValue = '1';
            expect(validator.isSupported(field)).toBeTruthy();
        });

        it('should support numeric widgets only', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                maxValue: '1'
            });

            expect(validator.isSupported(field)).toBeTruthy();

            field.type = FormFieldTypes.TEXT;
            expect(validator.isSupported(field)).toBeFalsy();
        });

        it('should allow empty values', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                value: null,
                maxValue: '1'
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should succeed for unsupported types', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should succeed validating value', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                value: '10',
                maxValue: '10'
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should fail validating value', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.NUMBER,
                value: '11',
                maxValue: '10'
            });

            field.validationSummary = new ErrorMessageModel();
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
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT
            });
            expect(validator.isSupported(field)).toBeFalsy();

            field.regexPattern = '<pattern>';
            expect(validator.isSupported(field)).toBeTruthy();
        });

        it('should allow empty values', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT,
                value: null,
                regexPattern: 'pattern'
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should succeed validating regex', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT,
                value: 'pattern',
                regexPattern: 'pattern'
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should fail validating regex', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT,
                value: 'some value',
                regexPattern: 'pattern'
            });

            expect(validator.validate(field)).toBeFalsy();
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
            expect(validator.isSupported(field)).toBeFalsy();

            field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TYPEAHEAD
            });

            expect(validator.isSupported(field)).toBeTruthy();
        });

        it('should allow empty values', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TYPEAHEAD,
                value: null,
                regexPattern: 'pattern'
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should succeed for a valid input value in options', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TYPEAHEAD,
                value: '1',
                options: [{id: '1', name: 'Leanne Graham'}, {id: '2', name: 'Ervin Howell'}]
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should fail for an invalid input value in options', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TYPEAHEAD,
                value: 'Lean',
                options: [{id: '1', name: 'Leanne Graham'}, {id: '2', name: 'Ervin Howell'}]
            });

            expect(validator.validate(field)).toBeFalsy();
        });

    });

    describe('MaxDateTimeFieldValidator', () => {

        let validator: MaxDateTimeFieldValidator;

        beforeEach(() => {
            validator = new MaxDateTimeFieldValidator();
        });

        it('should require maxValue defined', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATETIME
            });
            expect(validator.isSupported(field)).toBeFalsy();

            field.maxValue = '9999-02-08 10:10 AM';
            expect(validator.isSupported(field)).toBeTruthy();
        });

        it('should support date time widgets only', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATETIME,
                maxValue: '9999-02-08 10:10 AM'
            });

            expect(validator.isSupported(field)).toBeTruthy();

            field.type = FormFieldTypes.TEXT;
            expect(validator.isSupported(field)).toBeFalsy();
        });

        it('should allow empty values', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATETIME,
                value: null,
                maxValue: '9999-02-08 10:10 AM'
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should succeed for unsupported types', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should take into account that max value is in UTC and NOT fail validating value checking the time', () => {
            const maxValueFromActivitiInput = '31-3-2018 12:00 AM';
            const maxValueSavedInForm = moment(maxValueFromActivitiInput, 'DD-M-YYYY hh:mm A').utc().format();

            const localValidValue = '2018-3-30 11:59 PM';

            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATETIME,
                value: localValidValue,
                maxValue: maxValueSavedInForm
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should take into account that max value is in UTC and fail validating value checking the time', () => {
            const maxValueFromActivitiInput = '31-3-2018 12:00 AM';
            const maxValueSavedInForm = moment(maxValueFromActivitiInput, 'DD-M-YYYY hh:mm A').utc().format();

            const localInvalidValue = '2018-3-31 12:01 AM';

            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATETIME,
                value: localInvalidValue,
                maxValue: maxValueSavedInForm
            });

            field.validationSummary = new ErrorMessageModel();
            expect(validator.validate(field)).toBeFalsy();
            expect(field.validationSummary).not.toBeNull();
            expect(field.validationSummary.message).toBe('FORM.FIELD.VALIDATOR.NOT_GREATER_THAN');
        });

        it('should succeed validating value checking the time', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATETIME,
                value: '08-02-9999 09:10 AM',
                maxValue: '9999-02-08 10:10 AM'
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should fail validating value checking the time', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATETIME,
                value: '08-02-9999 11:10 AM',
                maxValue: '9999-02-08 10:10 AM'
            });

            field.validationSummary = new ErrorMessageModel();
            expect(validator.validate(field)).toBeFalsy();
            expect(field.validationSummary).not.toBeNull();
        });

        it('should succeed validating value checking the date', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATETIME,
                value: '08-02-9999 09:10 AM',
                maxValue: '9999-02-08 10:10 AM'
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should fail validating value checking the date', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATETIME,
                value: '08-02-9999 12:10 AM',
                maxValue: '9999-02-07 10:10 AM'
            });

            field.validationSummary = new ErrorMessageModel();
            expect(validator.validate(field)).toBeFalsy();
            expect(field.validationSummary).not.toBeNull();
        });

    });

    describe('MinDateTimeFieldValidator', () => {

        let validator: MinDateTimeFieldValidator;

        beforeEach(() => {
            validator = new MinDateTimeFieldValidator();
        });

        it('should require minValue defined', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATETIME
            });
            expect(validator.isSupported(field)).toBeFalsy();

            field.minValue = '9999-02-08 09:10 AM';
            expect(validator.isSupported(field)).toBeTruthy();
        });

        it('should support date time widgets only', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATETIME,
                minValue: '9999-02-08 09:10 AM'
            });

            expect(validator.isSupported(field)).toBeTruthy();

            field.type = FormFieldTypes.TEXT;
            expect(validator.isSupported(field)).toBeFalsy();
        });

        it('should allow empty values', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATETIME,
                value: null,
                minValue: '9999-02-08 09:10 AM'
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should succeed for unsupported types', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should take into account that min value is in UTC and NOT fail validating value checking the time', () => {
            const minValueFromActivitiInput = '02-3-2018 06:00 AM';
            const minValueSavedInForm = moment(minValueFromActivitiInput, 'DD-M-YYYY hh:mm A').utc().format();

            const localValidValue = '2018-3-02 06:01 AM';

            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATETIME,
                value: localValidValue,
                minValue: minValueSavedInForm
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should take into account that min value is in UTC and fail validating value checking the time', () => {
            const minValueFromActivitiInput = '02-3-2018 06:00 AM';
            const minValueSavedInForm = moment(minValueFromActivitiInput, 'DD-M-YYYY hh:mm A').utc().format();

            const localInvalidValue = '2018-3-02 05:59 AM';

            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATETIME,
                value: localInvalidValue,
                minValue: minValueSavedInForm
            });

            field.validationSummary = new ErrorMessageModel();
            expect(validator.validate(field)).toBeFalsy();
            expect(field.validationSummary).not.toBeNull();
            expect(field.validationSummary.message).toBe('FORM.FIELD.VALIDATOR.NOT_LESS_THAN');
        });

        it('should succeed validating value by time', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATETIME,
                value: '08-02-9999 09:10 AM',
                minValue: '9999-02-08 09:00 AM'
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should succeed validating value by date', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATETIME,
                value: '09-02-9999 09:10 AM',
                minValue: '9999-02-08 09:10 AM'
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should fail validating value by time', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATETIME,
                value: '08-02-9999 09:00 AM',
                minValue: '9999-02-08 09:10 AM'
            });

            field.validationSummary = new ErrorMessageModel();
            expect(validator.validate(field)).toBeFalsy();
            expect(field.validationSummary).not.toBeNull();
        });

        it('should fail validating value by date', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATETIME,
                value: '07-02-9999 09:10 AM',
                minValue: '9999-02-08 09:10 AM'
            });

            field.validationSummary = new ErrorMessageModel();
            expect(validator.validate(field)).toBeFalsy();
            expect(field.validationSummary).not.toBeNull();
        });

    });

    describe('MaxDateFieldValidator', () => {

        let validator: MaxDateFieldValidator;

        beforeEach(() => {
            validator = new MaxDateFieldValidator();
        });

        it('should require maxValue defined', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATE
            });
            expect(validator.isSupported(field)).toBeFalsy();

            field.maxValue = '9999-02-08';
            expect(validator.isSupported(field)).toBeTruthy();
        });

        it('should support date widgets only', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATE,
                maxValue: '9999-02-08'
            });

            expect(validator.isSupported(field)).toBeTruthy();

            field.type = FormFieldTypes.TEXT;
            expect(validator.isSupported(field)).toBeFalsy();
        });

        it('should allow empty values', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATE,
                value: null,
                maxValue: '9999-02-08'
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should succeed for unsupported types', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should succeed validating value checking the date', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATE,
                value: '9999-02-08T00:00:00',
                maxValue: '9999-02-09'
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should fail validating value checking the date', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATE,
                value: '9999-02-08T00:00:00',
                maxValue: '9999-02-07'
            });

            field.validationSummary = new ErrorMessageModel();
            expect(validator.validate(field)).toBeFalsy();
            expect(field.validationSummary).not.toBeNull();
        });

        it('should validate with APS1 format', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATE,
                value: '9999-02-08T00:00:00',
                maxValue: '09-02-9999'
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should fail validating with APS1 format', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATE,
                value: '9999-02-08T00:00:00',
                maxValue: '07-02-9999'
            });

            field.validationSummary = new ErrorMessageModel();
            expect(validator.validate(field)).toBeFalsy();
            expect(field.validationSummary).not.toBeNull();
        });

    });

    describe('MinDateFieldValidator', () => {

        let validator: MinDateFieldValidator;

        beforeEach(() => {
            validator = new MinDateFieldValidator();
        });

        it('should require maxValue defined', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATE
            });
            expect(validator.isSupported(field)).toBeFalsy();

            field.minValue = '9999-02-08';
            expect(validator.isSupported(field)).toBeTruthy();
        });

        it('should support date widgets only', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATE,
                minValue: '9999-02-08'
            });

            expect(validator.isSupported(field)).toBeTruthy();

            field.type = FormFieldTypes.TEXT;
            expect(validator.isSupported(field)).toBeFalsy();
        });

        it('should allow empty values', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATE,
                value: null,
                minValue: '9999-02-08'
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should succeed for unsupported types', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.TEXT
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should succeed validating value checking the date', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATE,
                value: '9999-02-08T00:00:00',
                minValue: '9999-02-07'
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should fail validating value checking the date', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATE,
                value: '9999-02-08T00:00:00',
                minValue: '9999-02-09'
            });

            field.validationSummary = new ErrorMessageModel();
            expect(validator.validate(field)).toBeFalsy();
            expect(field.validationSummary).not.toBeNull();
        });

        it('should validate with APS1 format', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATE,
                value: '9999-02-08T00:00:00',
                minValue: '07-02-9999'
            });

            expect(validator.validate(field)).toBeTruthy();
        });

        it('should fail validating with APS1 format', () => {
            const field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DATE,
                value: '9999-02-08T00:00:00',
                minValue: '09-02-9999'
            });

            field.validationSummary = new ErrorMessageModel();
            expect(validator.validate(field)).toBeFalsy();
            expect(field.validationSummary).not.toBeNull();
        });

    });
});
