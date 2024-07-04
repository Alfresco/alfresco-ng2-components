/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

/* eslint-disable @angular-eslint/component-selector */

import { FormFieldTypes } from './form-field-types';
import { isNumberValue } from './form-field-utils';
import { FormFieldModel } from './form-field.model';
import { DateFnsUtils } from '../../../../common/utils/date-fns-utils';
import { isValid as isDateValid, isBefore, isAfter } from 'date-fns';
import { ErrorMessageModel } from './error-message.model';

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
        FormFieldTypes.ATTACH_FOLDER,
        FormFieldTypes.DECIMAL,
        FormFieldTypes.DISPLAY_EXTERNAL_PROPERTY
    ];

    isSupported(field: FormFieldModel): boolean {
        return field && this.supportedTypes.indexOf(field.type) > -1 && field.required;
    }

    validate(field: FormFieldModel): boolean {
        if (this.isSupported(field) && field.isVisible) {
            if (field.type === FormFieldTypes.DROPDOWN) {
                if (field.hasMultipleValues) {
                    return Array.isArray(field.value) && !!field.value.length;
                }

                if (field.hasEmptyValue && field.emptyOption) {
                    if (field.value === field.emptyOption.id) {
                        return false;
                    }
                }

                if (field.required && field.value && typeof field.value === 'object' && !Object.keys(field.value).length) {
                    return false;
                }
            }

            if (field.type === FormFieldTypes.RADIO_BUTTONS) {
                const option = field.options.find((opt) => opt.id === field.value);
                return !!option;
            }

            if (field.type === FormFieldTypes.UPLOAD) {
                return !!field.value && field.value.length > 0;
            }

            if (field.type === FormFieldTypes.DYNAMIC_TABLE) {
                return !!field.value && field.value instanceof Array && field.value.length > 0;
            }

            if (field.type === FormFieldTypes.BOOLEAN) {
                return !!field.value;
            }

            if (field.value === null || field.value === undefined || field.value === '') {
                return false;
            }
        }
        return true;
    }
}

export class NumberFieldValidator implements FormFieldValidator {
    private supportedTypes = [FormFieldTypes.NUMBER, FormFieldTypes.AMOUNT];

    static isNumber(value: any): boolean {
        return isNumberValue(value);
    }

    isSupported(field: FormFieldModel): boolean {
        return field && this.supportedTypes.indexOf(field.type) > -1;
    }

    validate(field: FormFieldModel): boolean {
        if (this.isSupported(field) && field.isVisible) {
            if (field.value === null || field.value === undefined || field.value === '') {
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
    private supportedTypes = new Set([FormFieldTypes.DATE]);

    static isValidDate(inputDate: string, dateFormat: string = 'D-M-YYYY'): boolean {
        return DateFnsUtils.isValidDate(inputDate, dateFormat);
    }

    isSupported(field: FormFieldModel): boolean {
        return field && this.supportedTypes.has(field.type);
    }

    skipValidation(field: FormFieldModel): boolean {
        return !this.isSupported(field) || !field.isVisible;
    }

    isInvalid(field: FormFieldModel): boolean {
        const isValidDate = DateFieldValidator.isValidDate(field.value, field.dateDisplayFormat);
        return !field.isValid || !isValidDate;
    }

    isValid(field: FormFieldModel): boolean {
        if (field.isValid && (!field.value || DateFieldValidator.isValidDate(field.value, field.dateDisplayFormat))) {
            return true;
        }

        return false;
    }

    validate(field: FormFieldModel): boolean {
        if (this.skipValidation(field)) {
            return true;
        }

        if (this.isValid(field)) {
            return true;
        }

        field.validationSummary = new ErrorMessageModel({ message: field.dateDisplayFormat || field.defaultDateFormat });
        return false;
    }
}

export class DateTimeFieldValidator implements FormFieldValidator {
    private supportedTypes = new Set([FormFieldTypes.DATETIME]);

    static isValidDateTime(input: string): boolean {
        const date = DateFnsUtils.getDate(input);
        return isDateValid(date);
    }

    isSupported(field: FormFieldModel): boolean {
        return field && this.supportedTypes.has(field.type);
    }

    skipValidation(field: FormFieldModel): boolean {
        return !this.isSupported(field) || !field.isVisible;
    }

    isValid(field: FormFieldModel): boolean {
        if (field.isValid && (!field.value || DateTimeFieldValidator.isValidDateTime(field.value))) {
            return true;
        }

        return false;
    }

    validate(field: FormFieldModel): boolean {
        if (this.skipValidation(field)) {
            return true;
        }

        if (this.isValid(field)) {
            return true;
        }

        field.validationSummary = new ErrorMessageModel({ message: field.dateDisplayFormat || field.defaultDateTimeFormat });
        return false;
    }
}

export abstract class BoundaryDateFieldValidator implements FormFieldValidator {
    DATE_FORMAT_CLOUD = 'YYYY-MM-DD';
    DATE_FORMAT = 'DD-MM-YYYY';

    supportedTypes = [FormFieldTypes.DATE];

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
        const fieldValueData = DateFnsUtils.parseDate(field.value, dateFormat, { dateOnly: true });
        const minValueDateFormat = this.extractDateFormat(field.minValue);
        const min = DateFnsUtils.parseDate(field.minValue, minValueDateFormat);

        if (DateFnsUtils.isBeforeDate(fieldValueData, min)) {
            field.validationSummary.message = `FORM.FIELD.VALIDATOR.NOT_LESS_THAN`;
            field.validationSummary.attributes.set('minValue', DateFnsUtils.formatDate(min, field.dateDisplayFormat).toLocaleUpperCase());
            isValid = false;
        }
        return isValid;
    }

    isSupported(field: FormFieldModel): boolean {
        return field && this.supportedTypes.indexOf(field.type) > -1 && !!field.minValue;
    }
}

export class MaxDateFieldValidator extends BoundaryDateFieldValidator {
    checkDate(field: FormFieldModel, dateFormat: string): boolean {
        let isValid = true;
        const fieldValueData = DateFnsUtils.parseDate(field.value, dateFormat, { dateOnly: true });
        const maxValueDateFormat = this.extractDateFormat(field.maxValue);
        const max = DateFnsUtils.parseDate(field.maxValue, maxValueDateFormat);

        if (DateFnsUtils.isAfterDate(fieldValueData, max)) {
            field.validationSummary.message = `FORM.FIELD.VALIDATOR.NOT_GREATER_THAN`;
            field.validationSummary.attributes.set('maxValue', DateFnsUtils.formatDate(max, field.dateDisplayFormat).toLocaleUpperCase());
            isValid = false;
        }
        return isValid;
    }

    isSupported(field: FormFieldModel): boolean {
        return field && this.supportedTypes.indexOf(field.type) > -1 && !!field.maxValue;
    }
}

export abstract class BoundaryDateTimeFieldValidator implements FormFieldValidator {
    private supportedTypes = [FormFieldTypes.DATETIME];

    isSupported(field: FormFieldModel): boolean {
        return field && this.supportedTypes.indexOf(field.type) > -1 && !!field[this.getSubjectField()];
    }

    validate(field: FormFieldModel): boolean {
        let isValid = true;
        if (this.isSupported(field) && field.value && field.isVisible) {
            if (!DateTimeFieldValidator.isValidDateTime(field.value)) {
                field.validationSummary.message = 'FORM.FIELD.VALIDATOR.INVALID_DATE';
                isValid = false;
            } else {
                isValid = this.checkDateTime(field);
            }
        }
        return isValid;
    }

    private checkDateTime(field: FormFieldModel): boolean {
        let isValid = true;
        const fieldValueDate = DateFnsUtils.getDate(field.value);
        const subjectFieldDate = DateFnsUtils.getDate(field[this.getSubjectField()]);

        if (this.compareDates(fieldValueDate, subjectFieldDate)) {
            field.validationSummary.message = this.getErrorMessage();
            field.validationSummary.attributes.set(this.getSubjectField(), DateFnsUtils.formatDate(subjectFieldDate, field.dateDisplayFormat));
            isValid = false;
        }
        return isValid;
    }

    protected abstract compareDates(fieldValueDate: Date, subjectFieldDate: Date): boolean;

    protected abstract getSubjectField(): string;

    protected abstract getErrorMessage(): string;
}

/**
 * Validates the min constraint for the datetime value.
 *
 * Notes for developers:
 * the format of the min/max values is always the ISO datetime: i.e. 2023-10-01T15:21:00.000Z.
 * Min/Max values can be parsed with standard `new Date(value)` calls.
 *
 */
export class MinDateTimeFieldValidator extends BoundaryDateTimeFieldValidator {
    protected compareDates(fieldValueDate: Date, subjectFieldDate: Date): boolean {
        return isBefore(fieldValueDate, subjectFieldDate);
    }

    protected getSubjectField(): string {
        return 'minValue';
    }

    protected getErrorMessage(): string {
        return `FORM.FIELD.VALIDATOR.NOT_LESS_THAN`;
    }
}

/**
 * Validates the max constraint for the datetime value.
 *
 * Notes for developers:
 * the format of the min/max values is always the ISO datetime: i.e. 2023-10-01T15:21:00.000Z.
 * Min/Max values can be parsed with standard `new Date(value)` calls.
 *
 */
export class MaxDateTimeFieldValidator extends BoundaryDateTimeFieldValidator {
    protected compareDates(fieldValueDate: Date, subjectFieldDate: Date): boolean {
        return isAfter(fieldValueDate, subjectFieldDate);
    }

    protected getSubjectField(): string {
        return 'maxValue';
    }

    protected getErrorMessage(): string {
        return `FORM.FIELD.VALIDATOR.NOT_GREATER_THAN`;
    }
}

export class MinLengthFieldValidator implements FormFieldValidator {
    private supportedTypes = [FormFieldTypes.TEXT, FormFieldTypes.MULTILINE_TEXT];

    isSupported(field: FormFieldModel): boolean {
        return field && this.supportedTypes.indexOf(field.type) > -1 && field.minLength > 0;
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
    private supportedTypes = [FormFieldTypes.TEXT, FormFieldTypes.MULTILINE_TEXT];

    isSupported(field: FormFieldModel): boolean {
        return field && this.supportedTypes.indexOf(field.type) > -1 && field.maxLength > 0;
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
    private supportedTypes = [FormFieldTypes.NUMBER, FormFieldTypes.DECIMAL, FormFieldTypes.AMOUNT];

    isSupported(field: FormFieldModel): boolean {
        return field && this.supportedTypes.indexOf(field.type) > -1 && NumberFieldValidator.isNumber(field.minValue);
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
    private supportedTypes = [FormFieldTypes.NUMBER, FormFieldTypes.DECIMAL, FormFieldTypes.AMOUNT];

    isSupported(field: FormFieldModel): boolean {
        return field && this.supportedTypes.indexOf(field.type) > -1 && NumberFieldValidator.isNumber(field.maxValue);
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
    private supportedTypes = [FormFieldTypes.TEXT, FormFieldTypes.MULTILINE_TEXT];

    isSupported(field: FormFieldModel): boolean {
        return field && this.supportedTypes.indexOf(field.type) > -1 && !!field.regexPattern;
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
    private supportedTypes = [FormFieldTypes.TYPEAHEAD];

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

export class DecimalFieldValidator implements FormFieldValidator {
    private supportedTypes = [FormFieldTypes.DECIMAL];

    isSupported(field: FormFieldModel): boolean {
        return field && this.supportedTypes.indexOf(field.type) > -1 && !!field.value;
    }

    validate(field: FormFieldModel): boolean {
        const shouldValidateField = this.isSupported(field) && field.isVisible;

        if (!shouldValidateField) {
            return true;
        }

        const precision = field.precision;
        const fieldValue = field.value;

        if (!isNumberValue(fieldValue)) {
            field.validationSummary.message = 'FORM.FIELD.VALIDATOR.INVALID_DECIMAL_NUMBER';
            return false;
        }

        const value = typeof fieldValue === 'string' ? fieldValue : fieldValue.toString();
        const valueParts = value.split('.');
        const decimalPart = valueParts[1];

        if (decimalPart === undefined) {
            return true;
        }

        if (decimalPart.length > precision) {
            field.validationSummary.message = 'FORM.FIELD.VALIDATOR.INVALID_DECIMAL_PRECISION';
            field.validationSummary.attributes.set('precision', precision.toString());

            return false;
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
    new DateTimeFieldValidator(),
    new MinDateFieldValidator(),
    new MaxDateFieldValidator(),
    new FixedValueFieldValidator(),
    new MinDateTimeFieldValidator(),
    new MaxDateTimeFieldValidator(),
    new DecimalFieldValidator()
];
