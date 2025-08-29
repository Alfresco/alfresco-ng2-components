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

/* eslint-disable @angular-eslint/component-selector */

import { FormFieldTypes } from './form-field-types';
import { isNumberValue } from './form-field-utils';
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
        FormFieldTypes.PEOPLE,
        FormFieldTypes.FUNCTIONAL_GROUP,
        FormFieldTypes.RADIO_BUTTONS,
        FormFieldTypes.UPLOAD,
        FormFieldTypes.AMOUNT,
        FormFieldTypes.DYNAMIC_TABLE,
        FormFieldTypes.ATTACH_FOLDER,
        FormFieldTypes.DECIMAL,
        FormFieldTypes.DISPLAY_EXTERNAL_PROPERTY,
        FormFieldTypes.ALFRESCO_FILE_VIEWER,
        FormFieldTypes.PROPERTIES_VIEWER
    ];

    isSupported(field: FormFieldModel): boolean {
        return field && this.supportedTypes.indexOf(field.type) > -1 && field.required;
    }

    validate(field: FormFieldModel): boolean {
        if (this.isSupported(field) && field.isVisible) {
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
    constructor(
        private supportedTypes: FormFieldTypes[] = [FormFieldTypes.TEXT, FormFieldTypes.MULTILINE_TEXT],
        private maxLength?: number
    ) {}

    isSupported(field: FormFieldModel): boolean {
        return field && this.supportedTypes.indexOf(field.type) > -1 && this.getMaxLength(field) > 0;
    }

    validate(field: FormFieldModel): boolean {
        if (this.isSupported(field) && field.value && field.isVisible) {
            if (field.value.toString().length <= this.getMaxLength(field)) {
                return true;
            }

            field.validationSummary.message = `FORM.FIELD.VALIDATOR.NO_LONGER_THAN`;
            field.validationSummary.attributes.set('maxLength', this.getMaxLength(field).toLocaleString());

            return false;
        }

        return true;
    }

    getMaxLength(field: FormFieldModel): number | undefined {
        return this.maxLength ?? field.maxLength;
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
    new MaxLengthFieldValidator([FormFieldTypes.NUMBER], 10),
    new MinValueFieldValidator(),
    new MaxValueFieldValidator(),
    new RegExFieldValidator(),
    new FixedValueFieldValidator(),
    new DecimalFieldValidator()
];
