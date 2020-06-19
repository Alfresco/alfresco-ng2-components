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

/* tslint:disable:component-selector  */

import moment from 'moment-es6';
import { FormFieldTypes } from './form-field-types';
import { FormFieldModel } from './form-field.model';

export interface FormFieldValidator {

    isSupported(field: FormFieldModel): boolean;

    validate(field: FormFieldModel): boolean;

}

export class RequiredFieldValidator implements FormFieldValidator {

    private supportedTypes = [
        FormFieldTypes.TEXT,
        FormFieldTypes.MULTILINE_TEXT,
        FormFieldTypes.NUMBER,
        FormFieldTypes.BOOLEAN,
        FormFieldTypes.TYPEAHEAD,
        FormFieldTypes.DROPDOWN,
        FormFieldTypes.PEOPLE,
        FormFieldTypes.FUNCTIONAL_GROUP,
        FormFieldTypes.RADIO_BUTTONS,
        FormFieldTypes.UPLOAD,
        FormFieldTypes.AMOUNT,
        FormFieldTypes.DYNAMIC_TABLE,
        FormFieldTypes.DATE,
        FormFieldTypes.DATETIME,
        FormFieldTypes.ATTACH_FOLDER
    ];

    isSupported(field: FormFieldModel): boolean {
        return field &&
            this.supportedTypes.indexOf(field.type) > -1 &&
            field.required;
    }

    validate(field: FormFieldModel): boolean {
        if (this.isSupported(field) && field.isVisible) {

            if (field.type === FormFieldTypes.DROPDOWN) {
                if (field.hasEmptyValue && field.emptyOption) {
                    if (field.value === field.emptyOption.id) {
                        return false;
                    }
                }
            }

            if (field.type === FormFieldTypes.RADIO_BUTTONS) {
                const option = field.options.find((opt) => opt.id === field.value);
                return !!option;
            }

            if (field.type === FormFieldTypes.UPLOAD) {
                return field.value && field.value.length > 0;
            }

            if (field.type === FormFieldTypes.DYNAMIC_TABLE) {
                return field.value && field.value instanceof Array && field.value.length > 0;
            }

            if (field.type === FormFieldTypes.BOOLEAN) {
                return field.value ? true : false;
            }

            if (field.value === null || field.value === undefined || field.value === '') {
                return false;
            }
        }
        return true;
    }

}

export class NumberFieldValidator implements FormFieldValidator {

    private supportedTypes = [
        FormFieldTypes.NUMBER,
        FormFieldTypes.AMOUNT
    ];

    static isNumber(value: any): boolean {
        if (value === null || value === undefined || value === '') {
            return false;
        }

        return !isNaN(+value);
    }

    isSupported(field: FormFieldModel): boolean {
        return field && this.supportedTypes.indexOf(field.type) > -1;
    }

    validate(field: FormFieldModel): boolean {
        if (this.isSupported(field) && field.isVisible) {
            if (field.value === null ||
                field.value === undefined ||
                field.value === '') {
                return true;
            }
            const valueStr = '' + field.value;
            let pattern = new RegExp(/^-?\d+$/);
            if (field.enableFractions) {
                pattern = new RegExp(/^-?[0-9]+(\.[0-9]{1,2})?$/);
            }
            if (valueStr.match(pattern)) {
                return true;
            }
            field.validationSummary.message = 'FORM.FIELD.VALIDATOR.INVALID_NUMBER';
            return false;
        }
        return true;
    }
}

export class DateFieldValidator implements FormFieldValidator {

    private supportedTypes = [
        FormFieldTypes.DATE
    ];

    // Validates that the input string is a valid date formatted as <dateFormat> (default D-M-YYYY)
    static isValidDate(inputDate: string, dateFormat: string = 'D-M-YYYY'): boolean {
        if (inputDate) {
            const d = moment(inputDate, dateFormat, true);
            return d.isValid();
        }

        return false;
    }

    isSupported(field: FormFieldModel): boolean {
        return field && this.supportedTypes.indexOf(field.type) > -1;
    }

    validate(field: FormFieldModel): boolean {
        if (this.isSupported(field) && field.value && field.isVisible) {
            if (DateFieldValidator.isValidDate(field.value, field.dateDisplayFormat)) {
                return true;
            }
            field.validationSummary.message = field.dateDisplayFormat;
            return false;
        }
        return true;
    }
}

export abstract class BoundaryDateFieldValidator implements FormFieldValidator {

    DATE_FORMAT_CLOUD = 'YYYY-MM-DD';
    DATE_FORMAT = 'DD-MM-YYYY';

    supportedTypes = [
        FormFieldTypes.DATE
    ];

    validate(field: FormFieldModel): boolean {
        let isValid = true;
        if (this.isSupported(field) && field.value && field.isVisible) {
            const dateFormat = field.dateDisplayFormat;

            if (!DateFieldValidator.isValidDate(field.value, dateFormat)) {
                field.validationSummary.message = 'FORM.FIELD.VALIDATOR.INVALID_DATE';
                isValid = false;
            } else {
                isValid = this.checkDate(field, dateFormat);
            }
        }
        return isValid;
    }

    extractDateFormat(date: string): string {
        const brokenDownDate = date.split('-');
        return brokenDownDate[0].length === 4 ? this.DATE_FORMAT_CLOUD : this.DATE_FORMAT;
    }

    abstract checkDate(field: FormFieldModel, dateFormat: string);
    abstract isSupported(field: FormFieldModel);

}

export class MinDateFieldValidator extends BoundaryDateFieldValidator {

    checkDate(field: FormFieldModel, dateFormat: string): boolean {

        let isValid = true;
        // remove time and timezone info
        let fieldValueData;
        if (typeof field.value === 'string') {
            fieldValueData = moment(field.value.split('T')[0], dateFormat);
        } else {
            fieldValueData = field.value;
        }

        const minValueDateFormat = this.extractDateFormat(field.minValue);
        const min = moment(field.minValue, minValueDateFormat);

        if (fieldValueData.isBefore(min)) {
            field.validationSummary.message = `FORM.FIELD.VALIDATOR.NOT_LESS_THAN`;
            field.validationSummary.attributes.set('minValue', min.format(field.dateDisplayFormat).toLocaleUpperCase());
            isValid = false;
        }
        return isValid;
    }

    isSupported(field: FormFieldModel): boolean {
        return field &&
            this.supportedTypes.indexOf(field.type) > -1 && !!field.minValue;
    }
}

export class MaxDateFieldValidator extends BoundaryDateFieldValidator {

    checkDate(field: FormFieldModel, dateFormat: string): boolean {

        let isValid = true;
        // remove time and timezone info
        let fieldValueData;
        if (typeof field.value === 'string') {
            fieldValueData = moment(field.value.split('T')[0], dateFormat);
        } else {
            fieldValueData = field.value;
        }

        const maxValueDateFormat = this.extractDateFormat(field.maxValue);
        const max = moment(field.maxValue, maxValueDateFormat);

        if (fieldValueData.isAfter(max)) {
            field.validationSummary.message = `FORM.FIELD.VALIDATOR.NOT_GREATER_THAN`;
            field.validationSummary.attributes.set('maxValue', max.format(field.dateDisplayFormat).toLocaleUpperCase());
            isValid = false;
        }
        return isValid;
    }

    isSupported(field: FormFieldModel): boolean {
        return field &&
            this.supportedTypes.indexOf(field.type) > -1 && !!field.maxValue;
    }
}

export class MinDateTimeFieldValidator implements FormFieldValidator {

    private supportedTypes = [
        FormFieldTypes.DATETIME
    ];
    MIN_DATETIME_FORMAT = 'YYYY-MM-DD hh:mm AZ';

    isSupported(field: FormFieldModel): boolean {
        return field &&
            this.supportedTypes.indexOf(field.type) > -1 && !!field.minValue;
    }

    validate(field: FormFieldModel): boolean {
        let isValid = true;
        if (this.isSupported(field) && field.value && field.isVisible) {
            const dateFormat = field.dateDisplayFormat;

            if (!DateFieldValidator.isValidDate(field.value, dateFormat)) {
                field.validationSummary.message = 'FORM.FIELD.VALIDATOR.INVALID_DATE';
                isValid = false;
            } else {
                isValid = this.checkDateTime(field, dateFormat);
            }
        }
        return isValid;
    }

    private checkDateTime(field: FormFieldModel, dateFormat: string): boolean {
        let isValid = true;
        let fieldValueDate;
        if (typeof field.value === 'string') {
            fieldValueDate = moment(field.value, dateFormat);
        } else {
            fieldValueDate = field.value;
        }
        const min = moment(field.minValue, this.MIN_DATETIME_FORMAT);

        if (fieldValueDate.isBefore(min)) {
            field.validationSummary.message = `FORM.FIELD.VALIDATOR.NOT_LESS_THAN`;
            field.validationSummary.attributes.set('minValue', min.format(field.dateDisplayFormat).replace(':', '-'));
            isValid = false;
        }
        return isValid;
    }
}

export class MaxDateTimeFieldValidator implements FormFieldValidator {

    private supportedTypes = [
        FormFieldTypes.DATETIME
    ];
    MAX_DATETIME_FORMAT = 'YYYY-MM-DD hh:mm AZ';

    isSupported(field: FormFieldModel): boolean {
        return field &&
            this.supportedTypes.indexOf(field.type) > -1 && !!field.maxValue;
    }

    validate(field: FormFieldModel): boolean {
        let isValid = true;
        if (this.isSupported(field) && field.value && field.isVisible) {
            const dateFormat = field.dateDisplayFormat;

            if (!DateFieldValidator.isValidDate(field.value, dateFormat)) {
                field.validationSummary.message = 'FORM.FIELD.VALIDATOR.INVALID_DATE';
                isValid = false;
            } else {
                isValid = this.checkDateTime(field, dateFormat);
            }
        }
        return isValid;
    }

    private checkDateTime(field: FormFieldModel, dateFormat: string): boolean {
        let isValid = true;
        let fieldValueDate;

        if (typeof field.value === 'string') {
            fieldValueDate = moment(field.value, dateFormat);
        } else {
            fieldValueDate = field.value;
        }
        const max = moment(field.maxValue, this.MAX_DATETIME_FORMAT);

        if (fieldValueDate.isAfter(max)) {
            field.validationSummary.message = `FORM.FIELD.VALIDATOR.NOT_GREATER_THAN`;
            field.validationSummary.attributes.set('maxValue', max.format(field.dateDisplayFormat).replace(':', '-'));
            isValid = false;
        }
        return isValid;
    }
}

export class MinLengthFieldValidator implements FormFieldValidator {

    private supportedTypes = [
        FormFieldTypes.TEXT,
        FormFieldTypes.MULTILINE_TEXT
    ];

    isSupported(field: FormFieldModel): boolean {
        return field &&
            this.supportedTypes.indexOf(field.type) > -1 &&
            field.minLength > 0;
    }

    validate(field: FormFieldModel): boolean {
        if (this.isSupported(field) && field.value && field.isVisible) {
            if (field.value.length >= field.minLength) {
                return true;
            }
            field.validationSummary.message = `FORM.FIELD.VALIDATOR.AT_LEAST_LONG`;
            field.validationSummary.attributes.set('minLength', field.minLength.toLocaleString());
            return false;
        }
        return true;
    }
}

export class MaxLengthFieldValidator implements FormFieldValidator {

    private supportedTypes = [
        FormFieldTypes.TEXT,
        FormFieldTypes.MULTILINE_TEXT
    ];

    isSupported(field: FormFieldModel): boolean {
        return field &&
            this.supportedTypes.indexOf(field.type) > -1 &&
            field.maxLength > 0;
    }

    validate(field: FormFieldModel): boolean {
        if (this.isSupported(field) && field.value && field.isVisible) {
            if (field.value.length <= field.maxLength) {
                return true;
            }
            field.validationSummary.message = `FORM.FIELD.VALIDATOR.NO_LONGER_THAN`;
            field.validationSummary.attributes.set('maxLength', field.maxLength.toLocaleString());
            return false;
        }
        return true;
    }
}

export class MinValueFieldValidator implements FormFieldValidator {

    private supportedTypes = [
        FormFieldTypes.NUMBER,
        FormFieldTypes.AMOUNT
    ];

    isSupported(field: FormFieldModel): boolean {
        return field &&
            this.supportedTypes.indexOf(field.type) > -1 &&
            NumberFieldValidator.isNumber(field.minValue);
    }

    validate(field: FormFieldModel): boolean {
        if (this.isSupported(field) && field.value && field.isVisible) {
            const value: number = +field.value;
            const minValue: number = +field.minValue;

            if (value >= minValue) {
                return true;
            }
            field.validationSummary.message = `FORM.FIELD.VALIDATOR.NOT_LESS_THAN`;
            field.validationSummary.attributes.set('minValue', field.minValue.toLocaleString());
            return false;
        }

        return true;
    }
}

export class MaxValueFieldValidator implements FormFieldValidator {

    private supportedTypes = [
        FormFieldTypes.NUMBER,
        FormFieldTypes.AMOUNT
    ];

    isSupported(field: FormFieldModel): boolean {
        return field &&
            this.supportedTypes.indexOf(field.type) > -1 &&
            NumberFieldValidator.isNumber(field.maxValue);
    }

    validate(field: FormFieldModel): boolean {
        if (this.isSupported(field) && field.value && field.isVisible) {
            const value: number = +field.value;
            const maxValue: number = +field.maxValue;

            if (value <= maxValue) {
                return true;
            }
            field.validationSummary.message = `FORM.FIELD.VALIDATOR.NOT_GREATER_THAN`;
            field.validationSummary.attributes.set('maxValue', field.maxValue.toLocaleString());
            return false;
        }

        return true;
    }
}

export class RegExFieldValidator implements FormFieldValidator {

    private supportedTypes = [
        FormFieldTypes.TEXT,
        FormFieldTypes.MULTILINE_TEXT
    ];

    isSupported(field: FormFieldModel): boolean {
        return field &&
            this.supportedTypes.indexOf(field.type) > -1 && !!field.regexPattern;
    }

    validate(field: FormFieldModel): boolean {
        if (this.isSupported(field) && field.value && field.isVisible) {
            if (field.value.length > 0 && field.value.match(new RegExp('^' + field.regexPattern + '$'))) {
                return true;
            }
            field.validationSummary.message = 'FORM.FIELD.VALIDATOR.INVALID_VALUE';
            return false;
        }
        return true;
    }

}

export class FixedValueFieldValidator implements FormFieldValidator {

    private supportedTypes = [
        FormFieldTypes.TYPEAHEAD
    ];

    isSupported(field: FormFieldModel): boolean {
        return field && this.supportedTypes.indexOf(field.type) > -1;
    }

    hasValidNameOrValidId(field: FormFieldModel): boolean {
        return this.hasValidName(field) || this.hasValidId(field);
    }

    hasValidName(field: FormFieldModel) {
        return field.options.find((item) => item.name && item.name.toLocaleLowerCase() === field.value.toLocaleLowerCase()) ? true : false;
    }

    hasValidId(field: FormFieldModel): boolean {
        return field.options.find((item) => item.id === field.value) ? true : false;
    }

    hasStringValue(field: FormFieldModel) {
        return field.value && typeof field.value === 'string';
    }

    hasOptions(field: FormFieldModel) {
        return field.options && field.options.length > 0;
    }

    validate(field: FormFieldModel): boolean {
        if (this.isSupported(field) && field.isVisible) {
            if (this.hasStringValue(field) && this.hasOptions(field) && !this.hasValidNameOrValidId(field)) {
                field.validationSummary.message = 'FORM.FIELD.VALIDATOR.INVALID_VALUE';
                return false;
            }
        }
        return true;
    }
}

export const FORM_FIELD_VALIDATORS = [
    new RequiredFieldValidator(),
    new NumberFieldValidator(),
    new MinLengthFieldValidator(),
    new MaxLengthFieldValidator(),
    new MinValueFieldValidator(),
    new MaxValueFieldValidator(),
    new RegExFieldValidator(),
    new DateFieldValidator(),
    new MinDateFieldValidator(),
    new MaxDateFieldValidator(),
    new FixedValueFieldValidator(),
    new MinDateTimeFieldValidator(),
    new MaxDateTimeFieldValidator()
];
