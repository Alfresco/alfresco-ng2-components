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

export class FormFieldModel extends FormWidgetModel {

    private _value: string;
    private _readOnly: boolean = false;

    fieldType: string;
    id: string;
    name: string;
    type: string;
    required: boolean;
    overrideId: boolean;
    tab: string;
    colspan: number = 1;
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

    get value(): any {
        return this._value;
    }

    set value(v: any) {
        this._value = v;
        this.updateForm();
    }

    get readOnly(): boolean {
        if (this.form && this.form.readOnly) {
            return true;
        }
        return this._readOnly;
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
            this.options = <FormFieldOption[]> json.options || [];
            this.hasEmptyValue = <boolean> json.hasEmptyValue;
            this.className = json.className;
            this.optionType = json.optionType;
            this.params = <FormFieldMetadata> json.params || {};
            this.hyperlinkUrl = json.hyperlinkUrl;
            this.displayText = json.displayText;

            this._value = this.parseValue(json);
            this.updateForm();
        }
    }

    static isReadOnlyType(type: string) {
        return FormFieldTypes.READONLY_TYPES.indexOf(type) > -1;
    }

    private parseValue(json: any): any {
        let value = json.value;

        /*
         This is needed due to Activiti issue related to reading dropdown values as value string
         but saving back as object: { id: <id>, name: <name> }
         */
        // TODO: needs review
        if (json.type === FormFieldTypes.DROPDOWN) {
            if (value === '') {
                value = 'empty';
            }
        }

        /*
         This is needed due to Activiti issue related to reading radio button values as value string
         but saving back as object: { id: <id>, name: <name> }
         */
        if (json.type === FormFieldTypes.RADIO_BUTTONS) {
            // Activiti has a bug with default radio button value,
            // so try resolving current one with a fallback to first entry
            let entry: FormFieldOption[] = this.options.filter(opt => opt.id === value);
            if (entry.length > 0) {
                value = entry[0].id;
            } else if (this.options.length > 0) {
                value = this.options[0].id;
            }
        }

        return value;
    }

    updateForm() {
        if (this.type === FormFieldTypes.DROPDOWN) {
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
        } else if (this.type === FormFieldTypes.RADIO_BUTTONS) {
            /*
             This is needed due to Activiti issue related to reading radio button values as value string
             but saving back as object: { id: <id>, name: <name> }
             */
            let entry: FormFieldOption[] = this.options.filter(opt => opt.id === this.value);
            if (entry.length > 0) {
                this.form.values[this.id] = entry[0];
            } else if (this.options.length > 0) {
                this.form.values[this.id] = this.options[0].id;
            }
        } else {
            if (!FormFieldModel.isReadOnlyType(this.type)) {
                this.form.values[this.id] = this.value;
            }
        }
    }
}
