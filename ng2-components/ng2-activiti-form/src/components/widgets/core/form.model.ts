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

import { FormWidgetModelCache } from './form-widget.model';
import { FormValues } from './form-values';
import { ContainerModel } from './container.model';
import { TabModel } from './tab.model';
import { FormOutcomeModel } from './form-outcome.model';
import { FormFieldModel } from './form-field.model';

export class FormModel {

    static UNSET_TASK_NAME: string = 'Nameless task';
    static SAVE_OUTCOME: string = '$save';
    static COMPLETE_OUTCOME: string = '$complete';

    private _id: string;
    private _name: string;
    private _taskId: string;
    private _taskName: string = FormModel.UNSET_TASK_NAME;
    private _isValid: boolean = true;

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get taskId(): string {
        return this._taskId;
    }

    get taskName(): string {
        return this._taskName;
    }

    get isValid(): boolean {
        return this._isValid;
    }

    readOnly: boolean = false;
    tabs: TabModel[] = [];
    fields: ContainerModel[] = [];
    outcomes: FormOutcomeModel[] = [];

    values: FormValues = {};

    private _json: any;

    get json() {
        return this._json;
    }

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
            this._json = json;

            this._id = json.id;
            this._name = json.name;
            this._taskId = json.taskId;
            this._taskName = json.taskName || json.name || FormModel.UNSET_TASK_NAME;

            let tabCache: FormWidgetModelCache<TabModel> = {};

            this.tabs = (json.tabs || []).map(t => {
                let model = new TabModel(this, t);
                tabCache[model.id] = model;
                return model;
            });

            this.fields = this.parseContainerFields(json);

            if (data) {
                this.loadData(data);
            }

            for (let i = 0; i < this.fields.length; i++) {
                let field = this.fields[i];
                if (field.tab) {
                    let tab = tabCache[field.tab];
                    if (tab) {
                        // tab.fields.push(new ContainerModel(this, field.json));
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
    }

    onFormFieldChanged(field: FormFieldModel) {
        this.validateField(field);
    }

    // TODO: evaluate and cache once the form is loaded
    private getFormFields(): FormFieldModel[] {
        let result: FormFieldModel[] = [];

        for (let i = 0; i < this.fields.length; i++) {
            let container = this.fields[i];
            for (let j = 0; j < container.columns.length; j++) {
                let column = container.columns[j];
                for (let k = 0; k < column.fields.length; k++) {
                    let field = column.fields[k];
                    result.push(field);
                }
            }
        }

        return result;
    }

    private validateForm() {
        this._isValid = true;
        let fields = this.getFormFields();
        for (let i = 0; i < fields.length; i++) {
            if (!fields[i].isValid()) {
                this._isValid = false;
                return;
            }
        }
    }

    private validateField(field: FormFieldModel) {
        if (!field) {
            return;
        }
        if (!field.isValid()) {
            this._isValid = false;
            return;
        }
        this.validateForm();
    }

    private parseContainerFields(json: any): ContainerModel[] {
        let fields = [];

        if (json.fields) {
            fields = json.fields;
        } else if (json.formDefinition && json.formDefinition.fields) {
            fields = json.formDefinition.fields;
        }

        return fields.map(obj => new ContainerModel(this, obj));
    }

    // Loads external data and overrides field values
    // Typically used when form definition and form data coming from different sources
    private loadData(data: FormValues) {
        for (let i = 0; i < this.fields.length; i++) {
            let container = this.fields[i];
            for (let i = 0; i < container.columns.length; i++) {
                let column = container.columns[i];
                for (let i = 0; i < column.fields.length; i++) {
                    let field = column.fields[i];
                    if (data[field.id]) {
                        field.json.value = data[field.id];
                        field.value = data[field.id];
                    }
                }
            }
        }
    }
}
