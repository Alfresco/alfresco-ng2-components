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
    TabModel, FormWidgetModel, FormOutcomeModel,
    FormWidgetModelCache, FormFieldModel, ContainerModel, FormFieldTypes,
    ValidateFormFieldEvent, FormFieldValidator, FormFieldTemplates,
    FormBaseModel, FormControlService, FormFieldEvent, ValidateFormEvent, FORM_FIELD_VALIDATORS } from '@alfresco/adf-core';
import { TaskVariableCloud } from './task-variable-cloud.model';

export class FormCloud extends FormBaseModel {

    readonly id: string;
    nodeId: string;
    readonly name: string;
    readonly taskId: string;
    private _isValid: boolean = true;

    get isValid(): boolean {
        return this._isValid;
    }

    readonly selectedOutcome: string;

    processDefinitionId: any;

    customFieldTemplates: FormFieldTemplates = {};
    fieldValidators: FormFieldValidator[] = [...FORM_FIELD_VALIDATORS];

    constructor(json?: any, formData?: TaskVariableCloud[], readOnly: boolean = false, protected formControlService?: FormControlService) {
        super();
        this.readOnly = readOnly;

        if (json && json.formRepresentation && json.formRepresentation.formDefinition) {
            this.json = json;
            this.id = json.formRepresentation.id;
            this.name = json.formRepresentation.name;
            this.taskId = json.formRepresentation.taskId;
            this.taskName = json.formRepresentation.taskName || json.formRepresentation.name;
            this.processDefinitionId = json.formRepresentation.processDefinitionId;
            this.customFieldTemplates = json.formRepresentation.formDefinition.customFieldTemplates || {};
            this.selectedOutcome = json.formRepresentation.formDefinition.selectedOutcome || {};
            this.className = json.formRepresentation.formDefinition.className || '';

            const tabCache: FormWidgetModelCache<TabModel> = {};

            this.tabs = (json.formRepresentation.formDefinition.tabs || []).map((t) => {
                const model = new TabModel(<any> this, t);
                tabCache[model.id] = model;
                return model;
            });

            this.fields = this.parseRootFields(json);

            if (formData && formData.length > 0) {
                this.loadData(formData);
                this.fixIncompatibilityFromPreviousAndNewForm(formData);
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

            if (json.formRepresentation.formDefinition.fields) {
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

                const customOutcomes = (json.formRepresentation.outcomes || []).map((obj) => new FormOutcomeModel(<any> this, obj));

                this.outcomes = [saveOutcome].concat(
                    customOutcomes.length > 0 ? customOutcomes : [completeOutcome, startProcessOutcome]
                );
            }
        }

        this.validateForm();
    }

    fixIncompatibilityFromPreviousAndNewForm(formData) {
        Object.keys(this.values).forEach( (propertyName) => {
            const fieldValue = formData.find((value) => { return value.name === propertyName; });
            if (fieldValue) {
                this.values[propertyName] = fieldValue.value;
            }
        });
    }

    onFormFieldChanged(field: FormFieldModel) {
        this.validateField(field);
        if (this.formControlService) {
            this.formControlService.formFieldValueChanged.next(new FormFieldEvent(<any> this, field));
        }
    }

    markAsInvalid() {
        this._isValid = false;
    }

    validateForm() {
        const validateFormEvent: any = new ValidateFormEvent(<any> this);

        const errorsField: FormFieldModel[] = [];

        const fields = this.getFormFields();
        for (let i = 0; i < fields.length; i++) {
            if (!fields[i].validate()) {
                errorsField.push(fields[i]);
            }
        }

        this._isValid = errorsField.length > 0 ? false : true;

        if (this.formControlService) {
            validateFormEvent.isValid = this._isValid;
            validateFormEvent.errorsField = errorsField;
            this.formControlService.validateForm.next(validateFormEvent);
        }
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

        if (this.formControlService) {
            this.formControlService.validateFormField.next(validateFieldEvent);
        }

        if (!validateFieldEvent.isValid) {
            this._isValid = false;
            return;
        }

        if (validateFieldEvent.defaultPrevented) {
            return;
        }

        if (!field.validate()) {
            this._isValid = false;
        }

        this.validateForm();
    }

    // Activiti supports 3 types of root fields: container|group|dynamic-table
    private parseRootFields(json: any): FormWidgetModel[] {
        let fields = [];

        if (json.formRepresentation.fields) {
            fields = json.formRepresentation.fields;
        } else if (json.formRepresentation.formDefinition && json.formRepresentation.formDefinition.fields) {
            fields = json.formRepresentation.formDefinition.fields;
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
