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

import { FormWidgetModel } from './form-widget.model';
import { FormFieldOption } from './form-field-option';
import { FormFieldTypes } from './form-field-types';
import { FormFieldMetadata } from './form-field-metadata';
import { FormModel } from './form.model';
import { WidgetVisibilityModel } from '../../../models/widget-visibility.model';
import {
    FormFieldValidator,
    RequiredFieldValidator,
    NumberFieldValidator,
    MinLengthFieldValidator,
    MaxLengthFieldValidator,
    MinValueFieldValidator,
    MaxValueFieldValidator,
    RegExFieldValidator
} from './form-field-validator';


export class FormFieldModel extends FormWidgetModel {

    private _value: string;
    private _readOnly: boolean = false;
    private _isValid: boolean = true;

    fieldType: string;
    id: string;
    name: string;
    type: string;
    required: boolean;
    overrideId: boolean;
    tab: string;
    colspan: number = 1;
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

    emptyOption: FormFieldOption;
    validationSummary: string;
    validators: FormFieldValidator[] = [];

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

    get isValid(): boolean {
        return this._isValid;
    }

    validate(): boolean {
        this.validationSummary = null;

        // TODO: consider doing that on value setter and caching result
        if (this.validators && this.validators.length > 0) {
            for (let i = 0; i < this.validators.length; i++) {
                if (!this.validators[i].validate(this)) {
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
            this.required = <boolean> json.required;
            this._readOnly = <boolean> json.readOnly;
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
            this._value = this.parseValue(json);
        }

        if (this.hasEmptyValue && this.options && this.options.length > 0) {
            this.emptyOption = this.options[0];
        }

        this.validators = [
            new RequiredFieldValidator(),
            new NumberFieldValidator(),
            new MinLengthFieldValidator(),
            new MaxLengthFieldValidator(),
            new MinValueFieldValidator(),
            new MaxValueFieldValidator(),
            new RegExFieldValidator()
        ];

        this.updateForm();
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

        return value;
    }

    updateForm() {
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
                } else if (this.options.length > 0) {
                    this.form.values[this.id] = this.options[0];
                }
                break;
            case FormFieldTypes.UPLOAD:
                if (this.value && this.value.length > 0) {
                    this.form.values[this.id] = `${this.value[0].id}`;
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
            default:
                if (!FormFieldTypes.isReadOnlyType(this.type)) {
                    this.form.values[this.id] = this.value;
                }
        }

        this.form.onFormFieldChanged(this);
    }
}
