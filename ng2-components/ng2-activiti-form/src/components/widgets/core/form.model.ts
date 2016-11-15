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

import { FormWidgetModel, FormWidgetModelCache } from './form-widget.model';
import { FormValues } from './form-values';
import { ContainerModel } from './container.model';
import { TabModel } from './tab.model';
import { FormOutcomeModel } from './form-outcome.model';
import { FormFieldModel } from './form-field.model';
import { FormFieldTypes } from './form-field-types';
import { DynamicTableModel } from './dynamic-table.model';

export class FormModel {

    static UNSET_TASK_NAME: string = 'Nameless task';
    static SAVE_OUTCOME: string = '$save';
    static COMPLETE_OUTCOME: string = '$complete';

    readonly id: string;
    readonly name: string;
    readonly taskId: string;
    readonly taskName: string = FormModel.UNSET_TASK_NAME;
    processDefinitionId: string;
    private _isValid: boolean = true;

    get isValid(): boolean {
        return this._isValid;
    }

    readOnly: boolean = false;
    tabs: TabModel[] = [];
    /** Stores root containers */
    fields: FormWidgetModel[] = [];
    outcomes: FormOutcomeModel[] = [];

    values: FormValues = {};

    readonly json: any;

    hasTabs(): boolean {
        return this.tabs && this.tabs.length > 0;
    }

    hasFields(): boolean {
        return this.fields && this.fields.length > 0;
    }

    hasOutcomes(): boolean {
        return this.outcomes && this.outcomes.length > 0;
    }

    constructor(json?: any, data?: FormValues, readOnly: boolean = false) {
        this.readOnly = readOnly;

        if (json) {
            this.json = json;

            this.id = json.id;
            this.name = json.name;
            this.taskId = json.taskId;
            this.taskName = json.taskName || json.name || FormModel.UNSET_TASK_NAME;
            this.processDefinitionId = json.processDefinitionId;

            let tabCache: FormWidgetModelCache<TabModel> = {};

            this.tabs = (json.tabs || []).map(t => {
                let model = new TabModel(this, t);
                tabCache[model.id] = model;
                return model;
            });

            this.fields = this.parseRootFields(json);

            if (data) {
                this.loadData(data);
            }

            for (let i = 0; i < this.fields.length; i++) {
                let field = this.fields[i];
                if (field.tab) {
                    let tab = tabCache[field.tab];
                    if (tab) {
                        tab.fields.push(field);
                    }
                }
            }
            if (json.fields) {
                let saveOutcome = new FormOutcomeModel(this, { id: FormModel.SAVE_OUTCOME, name: 'Save', isSystem: true });
                let completeOutcome = new FormOutcomeModel(this, {id: FormModel.COMPLETE_OUTCOME, name: 'Complete', isSystem: true });

                let customOutcomes = (json.outcomes || []).map(obj => new FormOutcomeModel(this, obj));

                this.outcomes = [saveOutcome].concat(
                    customOutcomes.length > 0 ? customOutcomes : [completeOutcome]
                );
            }
        }
        this.validateForm();
    }

    onFormFieldChanged(field: FormFieldModel) {
        this.validateField(field);
    }

    // TODO: consider evaluating and caching once the form is loaded
    getFormFields(): FormFieldModel[] {
        let result: FormFieldModel[] = [];

        for (let i = 0; i < this.fields.length; i++) {
            let field = this.fields[i];

            if (field.type === FormFieldTypes.CONTAINER || field.type === FormFieldTypes.GROUP) {
                let container = <ContainerModel> field;
                result.push(...container.getFormFields());
            }

            if (field.type === FormFieldTypes.DYNAMIC_TABLE) {
                let dynamicTable = <DynamicTableModel> field;
                result.push(dynamicTable.field);
            }
        }

        return result;
    }

    private validateForm() {
        this._isValid = true;
        let fields = this.getFormFields();
        for (let i = 0; i < fields.length; i++) {
            if (!fields[i].validate()) {
                this._isValid = false;
                return;
            }
        }
    }

    private validateField(field: FormFieldModel) {
        if (!field) {
            return;
        }
        if (!field.validate()) {
            this._isValid = false;
            return;
        }
        this.validateForm();
    }

    // Activiti supports 2 types of root fields: 'container' and 'dynamic-table'.
    private parseRootFields(json: any): FormWidgetModel[] {
        let fields = [];

        if (json.fields) {
            fields = json.fields;
        } else if (json.formDefinition && json.formDefinition.fields) {
            fields = json.formDefinition.fields;
        }

        let result: FormWidgetModel[] = [];

        for (let field of fields) {
            if (field.type === FormFieldTypes.CONTAINER || field.type === FormFieldTypes.GROUP ) {
                result.push(new ContainerModel(this, field));
            } else if (field.type === FormFieldTypes.DYNAMIC_TABLE) {
                result.push(new DynamicTableModel(this, field));
            } else if (field.type === FormFieldTypes.DISPLAY_VALUE) {
                // workaround for dynamic table on a completed/readonly form
                if (field.params) {
                    let originalField = field.params['field'];
                    if (originalField.type === FormFieldTypes.DYNAMIC_TABLE) {
                        result.push(new DynamicTableModel(this, field));
                    }
                }
            }
        }

        return result;
    }

    // Loads external data and overrides field values
    // Typically used when form definition and form data coming from different sources
    private loadData(data: FormValues) {
        for (let field of this.getFormFields()) {
            if (data[field.id]) {
                field.json.value = data[field.id];
                field.value = data[field.id];
            }
        }
    }
}
