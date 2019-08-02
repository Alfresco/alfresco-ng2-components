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

import {
    TabModel, FormWidgetModel, FormOutcomeModel, FormValues,
    FormWidgetModelCache, FormFieldModel, ContainerModel, FormFieldTypes,
    ValidateFormFieldEvent, FormFieldValidator, FormFieldTemplates, FormBaseModel, FORM_FIELD_VALIDATORS } from '@alfresco/adf-core';
import { FormCloudService } from '../services/form-cloud.service';
import { TaskVariableCloud } from './task-variable-cloud.model';

export class FormCloud extends FormBaseModel {

    static SAVE_OUTCOME: string = '$save';
    static COMPLETE_OUTCOME: string = '$complete';
    static START_PROCESS_OUTCOME: string = '$startProcess';

    readonly id: string;
    nodeId: string;
    contentHost: string;
    readonly name: string;
    readonly taskId: string;
    readonly taskName: string;

    readonly selectedOutcome: string;

    readOnly: boolean;
    processDefinitionId: any;
    className: string;
    values: FormValues = {};

    tabs: TabModel[] = [];
    fields: FormWidgetModel[] = [];
    outcomes: FormOutcomeModel[] = [];
    customFieldTemplates: FormFieldTemplates = {};
    fieldValidators: FormFieldValidator[] = [...FORM_FIELD_VALIDATORS];

    constructor(formCloudRepresentationJSON?: any, formData?: TaskVariableCloud[], readOnly: boolean = false, protected formService?: FormCloudService) {
        super();
        this.readOnly = readOnly;

        if (formCloudRepresentationJSON) {
            this.json = formCloudRepresentationJSON;
            this.id = formCloudRepresentationJSON.id;
            this.name = formCloudRepresentationJSON.name;
            this.taskId = formCloudRepresentationJSON.taskId;
            this.taskName = formCloudRepresentationJSON.taskName || formCloudRepresentationJSON.name;
            this.processDefinitionId = formCloudRepresentationJSON.processDefinitionId;
            this.selectedOutcome = formCloudRepresentationJSON.selectedOutcome || '';

            const tabCache: FormWidgetModelCache<TabModel> = {};

            this.tabs = (formCloudRepresentationJSON.tabs || []).map((t) => {
                const model = new TabModel(<any> this, t);
                tabCache[model.id] = model;
                return model;
            });

            this.fields = this.parseRootFields(formCloudRepresentationJSON);

            if (formData && formData.length > 0) {
                this.loadData(formData);
            }

            for (let i = 0; i < this.fields.length; i++) {
                const field = this.fields[i];
                if (field.tab) {
                    const tab = tabCache[field.tab];
                    if (tab) {
                        tab.fields.push(field);
                    }
                }
            }

            if (formCloudRepresentationJSON.fields) {
                const saveOutcome = new FormOutcomeModel(<any> this, {
                    id: FormCloud.SAVE_OUTCOME,
                    name: 'SAVE',
                    isSystem: true
                });
                const completeOutcome = new FormOutcomeModel(<any> this, {
                    id: FormCloud.COMPLETE_OUTCOME,
                    name: 'COMPLETE',
                    isSystem: true
                });
                const startProcessOutcome = new FormOutcomeModel(<any> this, {
                    id: FormCloud.START_PROCESS_OUTCOME,
                    name: 'START PROCESS',
                    isSystem: true
                });

                const customOutcomes = (formCloudRepresentationJSON.outcomes || []).map((obj) => new FormOutcomeModel(<any> this, obj));

                this.outcomes = [saveOutcome].concat(
                    customOutcomes.length > 0 ? customOutcomes : [completeOutcome, startProcessOutcome]
                );
            }
        }

        this.validateForm();
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

    onFormFieldChanged(field: FormFieldModel) {
        this.validateField(field);
    }

    validateForm() {
        const errorsField: FormFieldModel[] = [];

        const fields = this.getFormFields();
        for (let i = 0; i < fields.length; i++) {
            if (!fields[i].validate()) {
                errorsField.push(fields[i]);
            }
        }

        this.isValid = errorsField.length > 0 ? false : true;
    }

    /**
     * Validates a specific form field, triggers form validation.
     *
     * @param field Form field to validate.
     * @memberof FormCloud
     */
    validateField(field: FormFieldModel) {
        if (!field) {
            return;
        }

        const validateFieldEvent = new ValidateFormFieldEvent(<any> this, field);

        if (!validateFieldEvent.isValid) {
            this.isValid = false;
            return;
        }

        if (validateFieldEvent.defaultPrevented) {
            return;
        }

        if (!field.validate()) {
            this.isValid = false;
        }

        this.validateForm();
    }

    // Activiti supports 3 types of root fields: container|group|dynamic-table
    private parseRootFields(json: any): FormWidgetModel[] {
        let fields = [];

        if (json.fields) {
            fields = json.fields;
        }

        const formWidgetModel: FormWidgetModel[] = [];

        for (const field of fields) {
            if (field.type === FormFieldTypes.DISPLAY_VALUE) {
                // workaround for dynamic table on a completed/readonly form
                if (field.params) {
                    const originalField = field.params['field'];
                    if (originalField.type === FormFieldTypes.DYNAMIC_TABLE) {
                        formWidgetModel.push(new ContainerModel(new FormFieldModel(<any> this, field)));
                    }
                }
            } else {
                formWidgetModel.push(new ContainerModel(new FormFieldModel(<any> this, field)));
            }
        }

        return formWidgetModel;
    }

    // Loads external data and overrides field values
    // Typically used when form definition and form data coming from different sources
    private loadData(formData: TaskVariableCloud[]) {
        for (const field of this.getFormFields()) {
            const fieldValue = formData.find((value) => { return value.name === field.id; });
            if (fieldValue) {
                field.json.value = fieldValue.value;
                field.value = field.parseValue(field.json);
            }
        }
    }
}
