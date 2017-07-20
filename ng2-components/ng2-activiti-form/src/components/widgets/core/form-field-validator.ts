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

 /* tslint:disable:component-selector  */

import * as moment from 'moment';
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
        FormFieldTypes.TYPEAHEAD,
        FormFieldTypes.DROPDOWN,
        FormFieldTypes.PEOPLE,
        FormFieldTypes.FUNCTIONAL_GROUP,
        FormFieldTypes.RADIO_BUTTONS,
        FormFieldTypes.UPLOAD,
        FormFieldTypes.AMOUNT,
        FormFieldTypes.DYNAMIC_TABLE,
        FormFieldTypes.DATE
    ];

    isSupported(field: FormFieldModel): boolean {
        return field &&
            this.supportedTypes.indexOf(field.type) > -1 &&
            field.required;
    }

    validate(field: FormFieldModel): boolean {
        if (this.isSupported(field)) {

            if (field.type === FormFieldTypes.DROPDOWN) {
                if (field.hasEmptyValue && field.emptyOption) {
                    if (field.value === field.emptyOption.id) {
                        return false;
                    }
                }
            }

            if (field.type === FormFieldTypes.RADIO_BUTTONS) {
                let option = field.options.find(opt => opt.id === field.value);
                return !!option;
            }

            if (field.type === FormFieldTypes.UPLOAD) {
                return field.value && field.value.length > 0;
            }

            if (field.type === FormFieldTypes.DYNAMIC_TABLE) {
                return field.value && field.value instanceof Array && field.value.length > 0;
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
        if (this.isSupported(field)) {
            if (field.value === null ||
                field.value === undefined ||
                field.value === '') {
                return true;
            }
            let valueStr = '' + field.value;
            let pattern = new RegExp(/^-?\d+$/);
            if (field.enableFractions) {
                pattern = new RegExp(/^-?[0-9]+(\.[0-9]{1,2})?$/);
            }
            if (valueStr.match(pattern)) {
                return true;
            }
            field.validationSummary = 'Incorrect number format';
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
            let d = moment(inputDate, dateFormat, true);
            return d.isValid();
        }

        return false;
    }

    isSupported(field: FormFieldModel): boolean {
        return field && this.supportedTypes.indexOf(field.type) > -1;
    }

    validate(field: FormFieldModel): boolean {
        if (this.isSupported(field) && field.value) {
            if (DateFieldValidator.isValidDate(field.value, field.dateDisplayFormat)) {
                return true;
            }
            field.validationSummary = 'Invalid date format';
            return false;
        }
        return true;
    }
}

export class MinDateFieldValidator implements FormFieldValidator {

    private supportedTypes = [
        FormFieldTypes.DATE
    ];

    isSupported(field: FormFieldModel): boolean {
        return field &&
            this.supportedTypes.indexOf(field.type) > -1 && !!field.minValue;
    }

    validate(field: FormFieldModel): boolean {
        if (this.isSupported(field) && field.value) {
            const dateFormat = field.dateDisplayFormat;

            if (!DateFieldValidator.isValidDate(field.value, dateFormat)) {
                field.validationSummary = 'Invalid date format';
                return false;
            }

            // remove time and timezone info
            let d = moment(field.value.split('T')[0], dateFormat);
            let min = moment(field.minValue, dateFormat);

            if (d.isBefore(min)) {
                field.validationSummary = `Should not be less than ${field.minValue}`;
                return false;
            }
        }
        return true;
    }
}

export class MaxDateFieldValidator implements FormFieldValidator {

    private supportedTypes = [
        FormFieldTypes.DATE
    ];

    isSupported(field: FormFieldModel): boolean {
        return field &&
            this.supportedTypes.indexOf(field.type) > -1 && !!field.maxValue;
    }

    validate(field: FormFieldModel): boolean {
        if (this.isSupported(field) && field.value) {
            const dateFormat = field.dateDisplayFormat;

            if (!DateFieldValidator.isValidDate(field.value, dateFormat)) {
                field.validationSummary = 'Invalid date format';
                return false;
            }

            // remove time and timezone info
            let d = moment(field.value.split('T')[0], dateFormat);
            let max = moment(field.maxValue, dateFormat);

            if (d.isAfter(max)) {
                field.validationSummary = `Should not be greater than ${field.maxValue}`;
                return false;
            }
        }
        return true;
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
        if (this.isSupported(field) && field.value) {
            if (field.value.length >= field.minLength) {
                return true;
            }
            field.validationSummary = `Should be at least ${field.minLength} characters long.`;
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
        if (this.isSupported(field) && field.value) {
            if (field.value.length <= field.maxLength) {
                return true;
            }
            field.validationSummary = `Should be ${field.maxLength} characters maximum.`;
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
        if (this.isSupported(field) && field.value) {
            let value: number = +field.value;
            let minValue: number = +field.minValue;

            if (value >= minValue) {
                return true;
            }
            field.validationSummary = `Should not be less than ${field.minValue}`;
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
        if (this.isSupported(field) && field.value) {
            let value: number = +field.value;
            let maxValue: number = +field.maxValue;

            if (value <= maxValue) {
                return true;
            }
            field.validationSummary = `Should not be greater than ${field.maxValue}`;
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
        if (this.isSupported(field) && field.value) {
            if (field.value.length > 0 && field.value.match(new RegExp('^' + field.regexPattern + '$'))) {
                return true;
            }
            field.validationSummary = 'Invalid value format';
            return false;
        }
        return true;
    }

}
