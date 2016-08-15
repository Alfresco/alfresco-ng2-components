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

export class FormModel {

    static UNSET_TASK_NAME: string = 'Nameless task';

    private _id: string;
    private _name: string;
    private _taskId: string;
    private _taskName: string = FormModel.UNSET_TASK_NAME;

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

    constructor(json?: any, data?: any, saveOption?: any, readOnly: boolean = false) {
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
                        tab.fields.push(new ContainerModel(this, field.json));
                    }
                }
            }
            if (this.isATaskForm()) {
                let saveOutcome = new FormOutcomeModel(this, {id: '$save', name: 'Save'});
                saveOutcome.isSystem = true;

                let completeOutcome = new FormOutcomeModel(this, {id: '$complete', name: 'Complete'});
                completeOutcome.isSystem = true;

                let customOutcomes = (json.outcomes || []).map(obj => new FormOutcomeModel(this, obj));

                this.outcomes = [saveOutcome].concat(
                    customOutcomes.length > 0 ? customOutcomes : [completeOutcome]
                );
            } else {
                if (saveOption && saveOption.observers.length > 0) {
                    let saveOutcome = new FormOutcomeModel(this, {id: '$custom', name: 'Save'});
                    saveOutcome.isSystem = true;

                    this.outcomes = [saveOutcome];
                }
            }
        }
    }

    private parseContainerFields(json: any): ContainerModel[] {
        let fields = [];

        if (json) {
            if (json.fields) {
                fields = json.fields;
            } else if (json.formDefinition && json.formDefinition.fields) {
                fields = json.formDefinition.fields;
            }
        }

        return fields.map(obj => new ContainerModel(this, obj));
    }

    // Loads external data and overrides field values
    // Typically used when form definition and form data coming from different sources
    private loadData(data: any) {
        for (let i = 0; i < this.fields.length; i++) {
            let containerModel = this.fields[i];
            if (containerModel) {
                for (let i = 0; i < containerModel.columns.length; i++) {
                    let containerModelColumn = containerModel.columns[i];
                    if (containerModelColumn) {
                        for (let i = 0; i < containerModelColumn.fields.length; i++) {
                            let formField = containerModelColumn.fields[i];
                            if (data[formField.id]) {
                                formField.value = data[formField.id];
                                formField.json.value = data[formField.id];
                            }
                        }
                    }
                }
            }

        }
    }

    /**
     * Check if the form is associated to a task or if is only the form definition
     * @returns {boolean}
     */
    private isATaskForm(): boolean {
        return this._json.fields ? true : false;
    }
}
