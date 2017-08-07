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
import { WidgetVisibilityModel } from '../../../models/widget-visibility.model';
import { ContainerColumnModel } from './container-column.model';
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
    dateDisplayFormat: string = this.dateDisplayFormat || this.defaultDateFormat;

    // container model members
    numberOfColumns: number = 1;
    fields: FormFieldModel[] = [];
    columns: ContainerColumnModel[] = [];

    // util members
    emptyOption: FormFieldOption;
    validationSummary: string;

    get value(): any {
        return this._value;
    }

    set value(v: any) {
        this._value = v;
        this.validate();
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

    validate(): boolean {
        this.validationSummary = null;

        let validators = this.form.fieldValidators || [];
        for (let validator of validators) {
            if (!validator.validate(this)) {
                this._isValid = false;
                return this._isValid;
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
            this.visibilityCondition = <WidgetVisibilityModel> json.visibilityCondition;
            this.enableFractions = <boolean> json.enableFractions;
            this.currency = json.currency;
            this.dateDisplayFormat = json.dateDisplayFormat || this.defaultDateFormat;
            this._value = this.parseValue(json);

            if (json.placeholder && json.placeholder !== '' && json.placeholder !== 'null') {
                this.placeholder = json.placeholder;
            }

            if (json.type === 'readonly') {
                if (json.params && json.params.field && json.params.field.responseVariable) {
                    this.value = this.getVariablesValue(json.params.field.name, form);
                }
            }

            if (json.type === 'container') {
                this.containerFactory(json, form);
            }
        }

        if (this.hasEmptyValue && this.options && this.options.length > 0) {
            this.emptyOption = this.options[0];
        }

        this.updateForm();
    }

    private getVariablesValue(variableName: string, form: FormModel) {
        let variable = form.json.variables.find((currentVariable) => {
            return currentVariable.name === variableName;
        });

        if (variable.type === 'boolean') {
            return JSON.parse(variable.value);
        }

        return variable.value;
    }

    private containerFactory(json: any, form: FormModel): void {
        this.numberOfColumns = <number> json.numberOfColumns || 1;

        this.fields = json.fields;

        this.rowspan = 1;
        this.colspan = 1;

        if (json.fields) {
            for (let currentField in json.fields) {
                if (json.fields.hasOwnProperty(currentField)) {
                    let col = new ContainerColumnModel();

                    let fields: FormFieldModel[] = (json.fields[currentField] || []).map(f => new FormFieldModel(form, f));
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
        let value = json.value;

        /*
         This is needed due to Activiti issue related to reading dropdown values as value string
         but saving back as object: { id: <id>, name: <name> }
         */
        if (json.type === FormFieldTypes.DROPDOWN) {
            if (json.hasEmptyValue && json.options) {
                let options = <FormFieldOption[]> json.options || [];
                if (options.length > 0) {
                    let emptyOption = json.options[0];
                    if (value === '' || value === emptyOption.id || value === emptyOption.name) {
                        value = emptyOption.id;
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
            let entry: FormFieldOption[] = this.options.filter(opt => opt.id === value || opt.name === value);
            if (entry.length > 0) {
                value = entry[0].id;
            }
        }

        /*
         This is needed due to Activiti displaying/editing dates in d-M-YYYY format
         but storing on server in ISO8601 format (i.e. 2013-02-04T22:44:30.652Z)
         */
        if (json.type === FormFieldTypes.DATE) {
            if (value) {
                let dateValue;
                if (NumberFieldValidator.isNumber(value)) {
                    dateValue = moment(value);
                } else {
                    dateValue = moment(value.split('T')[0], 'YYYY-M-D');
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
                    let entry: FormFieldOption[] = this.options.filter(opt => opt.id === this.value);
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
                let rbEntry: FormFieldOption[] = this.options.filter(opt => opt.id === this.value);
                if (rbEntry.length > 0) {
                    this.form.values[this.id] = rbEntry[0];
                }
                break;
            case FormFieldTypes.UPLOAD:
                if (this.value && this.value.length > 0) {
                    this.form.values[this.id] = this.value.map(elem => elem.id).join(',');
                } else {
                    this.form.values[this.id] = null;
                }
                break;
            case FormFieldTypes.TYPEAHEAD:
                let taEntry: FormFieldOption[] = this.options.filter(opt => opt.id === this.value);
                if (taEntry.length > 0) {
                    this.form.values[this.id] = taEntry[0];
                } else if (this.options.length > 0) {
                    this.form.values[this.id] = null;
                }
                break;
            case FormFieldTypes.DATE:
                let dateValue;
                if (NumberFieldValidator.isNumber(this.value)) {
                    dateValue = moment(this.value);
                } else {
                    dateValue = moment(this.value, this.dateDisplayFormat);
                }
                if (dateValue && dateValue.isValid()) {
                    this.form.values[this.id] = `${dateValue.format('YYYY-MM-DD')}T00:00:00.000Z`;
                } else {
                    this.form.values[this.id] = null;
                }
                break;
            case FormFieldTypes.NUMBER:
                this.form.values[this.id] = parseInt(this.value, 10);
                break;
            case FormFieldTypes.AMOUNT:
                this.form.values[this.id] = this.enableFractions ? parseFloat(this.value) : parseInt(this.value, 10);
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
        let option: FormFieldOption = this.options.find(opt => opt.id === this.value);
        return option ? option.name : null;
    }

    hasOptions() {
        return this.options && this.options.length > 0;
    }
}
