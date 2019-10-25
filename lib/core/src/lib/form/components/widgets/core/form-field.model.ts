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
import { WidgetVisibilityModel } from '../../../models/widget-visibility.model';
import { ContainerColumnModel } from './container-column.model';
import { ErrorMessageModel } from './error-message.model';
import { FormFieldMetadata } from './form-field-metadata';
import { FormFieldOption } from './form-field-option';
import { FormFieldTypes } from './form-field-types';
import { NumberFieldValidator } from './form-field-validator';
import { FormWidgetModel } from './form-widget.model';
import { FormModel } from './form.model';

// Maps to FormFieldRepresentation
export class FormFieldModel extends FormWidgetModel {

    private _value: string;
    private _readOnly: boolean = false;
    private _isValid: boolean = true;
    private _required: boolean = false;

    readonly defaultDateFormat: string = 'D-M-YYYY';
    readonly defaultDateTimeFormat: string = 'D-M-YYYY hh:mm A';

    // model members
    fieldType: string;
    id: string;
    name: string;
    type: string;
    overrideId: boolean;
    tab: string;
    rowspan: number = 1;
    colspan: number = 1;
    placeholder: string = null;
    minLength: number = 0;
    maxLength: number = 0;
    minValue: string;
    maxValue: string;
    regexPattern: string;
    options: FormFieldOption[] = [];
    restUrl: string;
    restResponsePath: string;
    restIdProperty: string;
    restLabelProperty: string;
    hasEmptyValue: boolean;
    className: string;
    optionType: string;
    params: FormFieldMetadata = {};
    hyperlinkUrl: string;
    displayText: string;
    isVisible: boolean = true;
    visibilityCondition: WidgetVisibilityModel = null;
    enableFractions: boolean = false;
    currency: string = null;
    dateDisplayFormat: string = this.defaultDateFormat;

    // container model members
    numberOfColumns: number = 1;
    fields: FormFieldModel[] = [];
    columns: ContainerColumnModel[] = [];

    // util members
    emptyOption: FormFieldOption;
    validationSummary: ErrorMessageModel;

    get value(): any {
        return this._value;
    }

    set value(value: any) {
        this._value = value;
        this.updateForm();
    }

    get readOnly(): boolean {
        if (this.form && this.form.readOnly) {
            return true;
        }
        return this._readOnly;
    }

    set readOnly(readOnly: boolean) {
        this._readOnly = readOnly;
        this.updateForm();
    }

    get required(): boolean {
        return this._required;
    }

    set required(value: boolean) {
        this._required = value;
        this.updateForm();
    }

    get isValid(): boolean {
        return this._isValid;
    }

    markAsInvalid() {
        this._isValid = false;
    }

    validate(): boolean {
        this.validationSummary = new ErrorMessageModel();

        if (!this.readOnly) {
            const validators = this.form.fieldValidators || [];
            for (const validator of validators) {
                if (!validator.validate(this)) {
                    this._isValid = false;
                    return this._isValid;
                }
            }
        }
        this._isValid = true;
        return this._isValid;
    }

    constructor(form: FormModel, json?: any) {
        super(form, json);
        if (json) {
            this.fieldType = json.fieldType;
            this.id = json.id;
            this.name = json.name;
            this.type = json.type;
            this._required = <boolean> json.required;
            this._readOnly = <boolean> json.readOnly || json.type === 'readonly';
            this.overrideId = <boolean> json.overrideId;
            this.tab = json.tab;
            this.restUrl = json.restUrl;
            this.restResponsePath = json.restResponsePath;
            this.restIdProperty = json.restIdProperty;
            this.restLabelProperty = json.restLabelProperty;
            this.colspan = <number> json.colspan;
            this.minLength = <number> json.minLength || 0;
            this.maxLength = <number> json.maxLength || 0;
            this.minValue = json.minValue;
            this.maxValue = json.maxValue;
            this.regexPattern = json.regexPattern;
            this.options = <FormFieldOption[]> json.options || [];
            this.hasEmptyValue = <boolean> json.hasEmptyValue;
            this.className = json.className;
            this.optionType = json.optionType;
            this.params = <FormFieldMetadata> json.params || {};
            this.hyperlinkUrl = json.hyperlinkUrl;
            this.displayText = json.displayText;
            this.visibilityCondition = json.visibilityCondition ? new WidgetVisibilityModel(json.visibilityCondition) : undefined;
            this.enableFractions = <boolean> json.enableFractions;
            this.currency = json.currency;
            this.dateDisplayFormat = json.dateDisplayFormat || this.getDefaultDateFormat(json);
            this._value = this.parseValue(json);
            this.validationSummary = new ErrorMessageModel();

            if (json.placeholder && json.placeholder !== '' && json.placeholder !== 'null') {
                this.placeholder = json.placeholder;
            }

            if (FormFieldTypes.isReadOnlyType(this.type)) {
                if (this.params && this.params.field) {
                    let valueFound = false;

                    if (form.processVariables) {
                        const processVariable = this.getProcessVariableValue(this.params.field, form);

                        if (processVariable) {
                            valueFound = true;
                            this.value = processVariable;
                        }
                    }

                    if (!valueFound && this.params.responseVariable) {
                        const defaultValue = form.getFormVariableValue(this.params.field.name);

                        if (defaultValue) {
                            valueFound = true;
                            this.value = defaultValue;
                        }
                    }
                }
            }

            if (FormFieldTypes.isContainerType(this.type)) {
                this.containerFactory(json, form);
            }
        }

        if (this.hasEmptyValue && this.options && this.options.length > 0) {
            this.emptyOption = this.options[0];
        }

        this.updateForm();
    }

    private getDefaultDateFormat(jsonField: any): string {
        let originalType = jsonField.type;
        if (FormFieldTypes.isReadOnlyType(jsonField.type) &&
            jsonField.params &&
            jsonField.params.field) {
            originalType = jsonField.params.field.type;
        }
        return originalType === FormFieldTypes.DATETIME ? this.defaultDateTimeFormat : this.defaultDateFormat;
    }

    private isTypeaheadFieldType(type: string): boolean {
        return type === 'typeahead' ? true : false;
    }

    private getFieldNameWithLabel(name: string): string {
        return name += '_LABEL';
    }

    private getProcessVariableValue(field: any, form: FormModel): any {
        let fieldName = field.name;
        if (this.isTypeaheadFieldType(field.type)) {
            fieldName = this.getFieldNameWithLabel(field.id);
        }
        return form.getProcessVariableValue(fieldName);
    }

    private containerFactory(json: any, form: FormModel): void {
        this.numberOfColumns = <number> json.numberOfColumns || 1;

        this.fields = json.fields;

        this.rowspan = 1;
        this.colspan = 1;

        if (json.fields) {
            for (const currentField in json.fields) {
                if (json.fields.hasOwnProperty(currentField)) {
                    const col = new ContainerColumnModel();

                    const fields: FormFieldModel[] = (json.fields[currentField] || []).map((field) => new FormFieldModel(form, field));
                    col.fields = fields;
                    col.rowspan = json.fields[currentField].length;

                    col.fields.forEach((colFields: any) => {
                        this.colspan = colFields.colspan > this.colspan ? colFields.colspan : this.colspan;
                    });

                    this.rowspan = this.rowspan < col.rowspan ? col.rowspan : this.rowspan;
                    this.columns.push(col);
                }
            }
        }
    }

    parseValue(json: any): any {
        let value = json.hasOwnProperty('value') ? json.value : null;

        /*
         This is needed due to Activiti issue related to reading dropdown values as value string
         but saving back as object: { id: <id>, name: <name> }
         */
        if (json.type === FormFieldTypes.DROPDOWN) {
            if (json.hasEmptyValue && json.options) {
                const options = <FormFieldOption[]> json.options || [];
                if (options.length > 0) {
                    const emptyOption = json.options[0];
                    if (value === '' || value === emptyOption.id || value === emptyOption.name) {
                        value = emptyOption.id;
                    } else if (value.id && value.name) {
                        value = value.id;
                    }
                }
            }
        }

        /*
         This is needed due to Activiti issue related to reading radio button values as value string
         but saving back as object: { id: <id>, name: <name> }
         */
        if (json.type === FormFieldTypes.RADIO_BUTTONS) {
            // Activiti has a bug with default radio button value where initial selection passed as `name` value
            // so try resolving current one with a fallback to first entry via name or id
            // TODO: needs to be reported and fixed at Activiti side
            const entry: FormFieldOption[] = this.options.filter((opt) =>
                opt.id === value || opt.name === value || (value && (opt.id === value.id || opt.name === value.name)));
            if (entry.length > 0) {
                value = entry[0].id;
            }
        }

        /*
         This is needed due to Activiti displaying/editing dates in d-M-YYYY format
         but storing on server in ISO8601 format (i.e. 2013-02-04T22:44:30.652Z)
         */
        if (this.isDateField(json) || this.isDateTimeField(json)) {
            if (value) {
                let dateValue;
                if (NumberFieldValidator.isNumber(value)) {
                    dateValue = moment(value);
                } else {
                    dateValue = this.isDateTimeField(json) ? moment(value, 'YYYY-MM-DD hh:mm A') : moment(value.split('T')[0], 'YYYY-M-D');
                }
                if (dateValue && dateValue.isValid()) {
                    value = dateValue.format(this.dateDisplayFormat);
                }
            }
        }

        return value;
    }

    updateForm() {
        if (!this.form) {
            return;
        }

        switch (this.type) {
            case FormFieldTypes.DROPDOWN:
                /*
                 This is needed due to Activiti reading dropdown values as string
                 but saving back as object: { id: <id>, name: <name> }
                 */
                if (this.value === 'empty' || this.value === '') {
                    this.form.values[this.id] = {};
                } else {
                    const entry: FormFieldOption[] = this.options.filter((opt) => opt.id === this.value);
                    if (entry.length > 0) {
                        this.form.values[this.id] = entry[0];
                    }
                }
                break;
            case FormFieldTypes.RADIO_BUTTONS:
                /*
                 This is needed due to Activiti issue related to reading radio button values as value string
                 but saving back as object: { id: <id>, name: <name> }
                 */
                const rbEntry: FormFieldOption[] = this.options.filter((opt) => opt.id === this.value);
                if (rbEntry.length > 0) {
                    this.form.values[this.id] = rbEntry[0];
                }
                break;
            case FormFieldTypes.UPLOAD:
                this.form.hasUpload = true;
                if (this.value && this.value.length > 0) {
                    this.form.values[this.id] = Array.isArray(this.value) ? this.value.map((elem) => elem.id).join(',') : [this.value];
                } else {
                    this.form.values[this.id] = null;
                }
                break;
            case FormFieldTypes.TYPEAHEAD:
                const taEntry: FormFieldOption[] = this.options.filter((opt) => opt.id === this.value || opt.name === this.value);
                if (taEntry.length > 0) {
                    this.form.values[this.id] = taEntry[0];
                } else if (this.options.length > 0) {
                    this.form.values[this.id] = null;
                }
                break;
            case FormFieldTypes.DATE:
                const dateValue = moment(this.value, this.dateDisplayFormat, true);
                if (dateValue && dateValue.isValid()) {
                    this.form.values[this.id] = `${dateValue.format('YYYY-MM-DD')}T00:00:00.000Z`;
                } else {
                    this.form.values[this.id] = null;
                    this._value = this.value;
                }
                break;
            case FormFieldTypes.DATETIME:
                const dateTimeValue = moment(this.value, this.dateDisplayFormat, true).utc();
                if (dateTimeValue && dateTimeValue.isValid()) {
                    /* cspell:disable-next-line */
                    this.form.values[this.id] = dateTimeValue.format('YYYY-MM-DDTHH:mm:ssZ');
                } else {
                    this.form.values[this.id] = null;
                    this._value = this.value;
                }
                break;
            case FormFieldTypes.NUMBER:
                this.form.values[this.id] = parseInt(this.value, 10);
                break;
            case FormFieldTypes.AMOUNT:
                this.form.values[this.id] = this.enableFractions ? parseFloat(this.value) : parseInt(this.value, 10);
                break;
            case FormFieldTypes.BOOLEAN:
                this.form.values[this.id] = (this.value !== null && this.value !== undefined) ? this.value : false;
                break;
            default:
                if (!FormFieldTypes.isReadOnlyType(this.type) && !this.isInvalidFieldType(this.type)) {
                    this.form.values[this.id] = this.value;
                }
        }

        this.form.onFormFieldChanged(this);
    }

    /**
     * Skip the invalid field type
     * @param type
     */
    isInvalidFieldType(type: string) {
        if (type === 'container') {
            return true;
        } else {
            return false;
        }
    }

    getOptionName(): string {
        const option: FormFieldOption = this.options.find((opt) => opt.id === this.value);
        return option ? option.name : null;
    }

    hasOptions() {
        return this.options && this.options.length > 0;
    }

    private isDateField(json: any) {
        return (json.params &&
            json.params.field &&
            json.params.field.type === FormFieldTypes.DATE) ||
            json.type === FormFieldTypes.DATE;
    }

    private isDateTimeField(json: any): boolean {
        return (json.params &&
            json.params.field &&
            json.params.field.type === FormFieldTypes.DATETIME) ||
            json.type === FormFieldTypes.DATETIME;
    }

}
