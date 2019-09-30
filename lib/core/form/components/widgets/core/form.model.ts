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

import { FormFieldEvent } from './../../../events/form-field.event';
import { ValidateFormFieldEvent } from './../../../events/validate-form-field.event';
import { ValidateFormEvent } from './../../../events/validate-form.event';
import { FormService } from './../../../services/form.service';
import { ContainerModel } from './container.model';
import { FormFieldTypes } from './form-field-types';
import { FormFieldModel } from './form-field.model';
import { FormValues } from './form-values';
import { FormWidgetModel, FormWidgetModelCache } from './form-widget.model';
import { TabModel } from './tab.model';

import { FormVariableModel } from './form-variable.model';
import { ProcessVariableModel } from './process-variable.model';
import { FormOutcomeModel } from './form-outcome.model';
import { FormFieldValidator, FORM_FIELD_VALIDATORS } from './form-field-validator';
import { FormFieldTemplates } from './form-field-templates';

export interface FormRepresentationModel {
    [key: string]: any;

    id?: string | number;
    name?: string;
    taskId?: string;
    taskName?: string;
    processDefinitionId?: string;
    customFieldTemplates?: {
        [key: string]: string
    };
    selectedOutcome?: string;
    fields?: any[];
    tabs?: any[];
    outcomes?: any[];
    formDefinition?: {
        [key: string]: any;
        fields?: any[];
    };
}

export class FormModel {

    static UNSET_TASK_NAME: string = 'Nameless task';
    static SAVE_OUTCOME: string = '$save';
    static COMPLETE_OUTCOME: string = '$complete';
    static START_PROCESS_OUTCOME: string = '$startProcess';

    readonly id: string | number;
    readonly name: string;
    readonly taskId: string;
    readonly taskName = FormModel.UNSET_TASK_NAME;
    readonly processDefinitionId: string;
    readonly selectedOutcome: string;

    json: any;
    nodeId: string;
    contentHost: string;
    values: FormValues = {};
    tabs: TabModel[] = [];
    fields: FormWidgetModel[] = [];
    outcomes: FormOutcomeModel[] = [];
    fieldValidators: FormFieldValidator[] = [...FORM_FIELD_VALIDATORS];
    customFieldTemplates: FormFieldTemplates = {};

    className: string;
    readOnly = false;
    isValid = true;
    processVariables: ProcessVariableModel[] = [];
    variables: FormVariableModel[] = [];

    constructor(json?: any, formValues?: FormValues, readOnly: boolean = false, protected formService?: FormService) {
        this.readOnly = readOnly;
        this.json = json;

        if (json) {
            this.id = json.id;
            this.name = json.name;
            this.taskId = json.taskId;
            this.taskName = json.taskName || json.name || FormModel.UNSET_TASK_NAME;
            this.processDefinitionId = json.processDefinitionId;
            this.customFieldTemplates = json.customFieldTemplates || {};
            this.selectedOutcome = json.selectedOutcome;
            this.className = json.className || '';
            this.variables = json.variables || [];
            this.processVariables = json.processVariables || [];

            const tabCache: FormWidgetModelCache<TabModel> = {};

            this.tabs = (json.tabs || []).map((tabJson) => {
                const model = new TabModel(this, tabJson);
                tabCache[model.id] = model;
                return model;
            });

            this.fields = this.parseRootFields(json);

            if (formValues) {
                this.loadData(formValues);
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

            this.parseOutcomes();
        }

        this.validateForm();
    }

    onFormFieldChanged(field: FormFieldModel) {
        this.validateField(field);

        if (this.formService) {
            this.formService.formFieldValueChanged.next(new FormFieldEvent(this, field));
        }
    }

    /**
     * Validates entire form and all form fields.
     *
     * @memberof FormModel
     */
    validateForm(): void {
        const validateFormEvent: any = new ValidateFormEvent(this);

        const errorsField: FormFieldModel[] = [];

        const fields = this.getFormFields();
        for (let i = 0; i < fields.length; i++) {
            if (!fields[i].validate()) {
                errorsField.push(fields[i]);
            }
        }

        this.isValid = errorsField.length > 0 ? false : true;

        if (this.formService) {
            validateFormEvent.isValid = this.isValid;
            validateFormEvent.errorsField = errorsField;
            this.formService.validateForm.next(validateFormEvent);
        }

    }

    /**
     * Validates a specific form field, triggers form validation.
     *
     * @param field Form field to validate.
     * @memberof FormModel
     */
    validateField(field: FormFieldModel): void {
        if (!field) {
            return;
        }

        const validateFieldEvent = new ValidateFormFieldEvent(this, field);

        if (this.formService) {
            this.formService.validateFormField.next(validateFieldEvent);
        }

        if (!validateFieldEvent.isValid) {
            this.markAsInvalid();
            return;
        }

        if (validateFieldEvent.defaultPrevented) {
            return;
        }

        if (!field.validate()) {
            this.markAsInvalid();
        }

        this.validateForm();
    }

    // Activiti supports 3 types of root fields: container|group|dynamic-table
    private parseRootFields(json: any): FormWidgetModel[] {
        let fields = [];

        if (json.fields) {
            fields = json.fields;
        } else if (json.formDefinition && json.formDefinition.fields) {
            fields = json.formDefinition.fields;
        }

        const formWidgetModel: FormWidgetModel[] = [];

        for (const field of fields) {
            if (field.type === FormFieldTypes.DISPLAY_VALUE) {
                // workaround for dynamic table on a completed/readonly form
                if (field.params) {
                    const originalField = field.params['field'];
                    if (originalField.type === FormFieldTypes.DYNAMIC_TABLE) {
                        formWidgetModel.push(new ContainerModel(new FormFieldModel(this, field)));
                    }
                }
            } else {
                formWidgetModel.push(new ContainerModel(new FormFieldModel(this, field)));
            }
        }

        return formWidgetModel;
    }

    // Loads external data and overrides field values
    // Typically used when form definition and form data coming from different sources
    private loadData(formValues: FormValues) {
        for (const field of this.getFormFields()) {
            const variableId = `variables.${field.name}`;

            if (formValues[variableId] || formValues[field.id]) {
                field.json.value = formValues[variableId] || formValues[field.id];
                field.value = field.parseValue(field.json);
            }
        }
    }

    /**
     * Returns a form variable that matches the identifier.
     * @param identifier The `name` or `id` value.
     */
    getFormVariable(identifier: string): FormVariableModel {
        if (identifier) {
            return this.variables.find(
                variable =>
                    variable.name === identifier ||
                    variable.id === identifier
            );
        }
        return undefined;
    }

    /**
     * Returns a value of the form variable that matches the identifier.
     * Provides additional conversion of types (date, boolean).
     * @param identifier The `name` or `id` value
     */
    getFormVariableValue(identifier: string): any {
        const variable = this.getFormVariable(identifier);

        if (variable && variable.hasOwnProperty('value')) {
            return this.parseValue(variable.type, variable.value);
        }

        return undefined;
    }

    /**
     * Returns a process variable value.
     * @param name Variable name
     */
    getProcessVariableValue(name: string): any {
        if (this.processVariables) {
            const names = [`variables.${name}`, name];

            const variable = this.processVariables.find(
                entry => names.includes(entry.name)
            );

            if (variable) {
                return this.parseValue(variable.type, variable.value);
            }
        }

        return undefined;
    }

    protected parseValue(type: string, value: any): any {
        if (type && value) {
            switch (type) {
                case 'date':
                    return value
                        ? `${value}T00:00:00.000Z`
                        : undefined;
                case 'boolean':
                    return typeof value === 'string'
                        ? JSON.parse(value)
                        : value;
                default:
                    return value;
            }
        }

        return value;
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

    getFieldById(fieldId: string): FormFieldModel {
        return this.getFormFields().find((field) => field.id === fieldId);
    }

    getFormFields(): FormFieldModel[] {
        const formFieldModel: FormFieldModel[] = [];

        for (let i = 0; i < this.fields.length; i++) {
            const field = this.fields[i];

            if (field instanceof ContainerModel) {
                const container = <ContainerModel> field;
                formFieldModel.push(container.field);

                container.field.columns.forEach((column) => {
                    formFieldModel.push(...column.fields);
                });
            }
        }

        return formFieldModel;
    }

    markAsInvalid(): void {
        this.isValid = false;
    }

    protected parseOutcomes() {
        if (this.json.fields) {
            const saveOutcome = new FormOutcomeModel(<any> this, {
                id: FormModel.SAVE_OUTCOME,
                name: 'SAVE',
                isSystem: true
            });
            const completeOutcome = new FormOutcomeModel(<any> this, {
                id: FormModel.COMPLETE_OUTCOME,
                name: 'COMPLETE',
                isSystem: true
            });
            const startProcessOutcome = new FormOutcomeModel(<any> this, {
                id: FormModel.START_PROCESS_OUTCOME,
                name: 'START PROCESS',
                isSystem: true
            });

            const customOutcomes = (this.json.outcomes || []).map(
                (obj) => new FormOutcomeModel(<any> this, obj)
            );

            this.outcomes = [saveOutcome].concat(
                customOutcomes.length > 0
                    ? customOutcomes
                    : [completeOutcome, startProcessOutcome]
            );
        }
    }
}
