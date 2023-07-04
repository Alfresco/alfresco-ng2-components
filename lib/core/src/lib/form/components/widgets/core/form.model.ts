/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { FormFieldEvent } from '../../../events/form-field.event';
import { ValidateFormFieldEvent } from '../../../events/validate-form-field.event';
import { ValidateFormEvent } from '../../../events/validate-form.event';
import { ContainerModel } from './container.model';
import { FormFieldTypes } from './form-field-types';
import { FormFieldModel } from './form-field.model';
import { FormValues } from './form-values';
import { TabModel } from './tab.model';

import { FormVariableModel } from './form-variable.model';
import { ProcessVariableModel } from './process-variable.model';
import { FormOutcomeModel } from './form-outcome.model';
import { FormFieldValidator, FORM_FIELD_VALIDATORS } from './form-field-validator';
import { FormFieldTemplates } from './form-field-templates';
import { UploadWidgetContentLinkModel } from './upload-widget-content-link.model';
import { FormValidationService } from '../../../services/form-validation-service.interface';
import { ProcessFormModel } from './process-form-model.interface';
import { WidgetTypeEnum, WidgetVisibilityModel } from '../../../models/widget-visibility.model';

export interface ConfirmMessage {
    show: boolean;
    message: string;
}
export interface FormRepresentationModel {
    [key: string]: any;

    id?: string | number;
    name?: string;
    taskId?: string;
    taskName?: string;
    processDefinitionId?: string;
    customFieldTemplates?: {
        [key: string]: string;
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
export class FormModel implements ProcessFormModel {

    static UNSET_TASK_NAME: string = 'Nameless task';
    static SAVE_OUTCOME: string = '$save';
    static COMPLETE_OUTCOME: string = '$complete';
    static START_PROCESS_OUTCOME: string = '$startProcess';

    readonly id: string | number;
    readonly name: string;
    readonly taskId: string;
    readonly confirmMessage: ConfirmMessage;
    readonly taskName = FormModel.UNSET_TASK_NAME;
    readonly processDefinitionId: string;
    readonly selectedOutcome: string;
    readonly enableFixedSpace: boolean;

    fieldsCache: FormFieldModel[] = [];

    json: any;
    nodeId: string;
    values: FormValues = {};
    tabs: TabModel[] = [];
    fields: (ContainerModel | FormFieldModel)[] = [];
    outcomes: FormOutcomeModel[] = [];
    fieldValidators: FormFieldValidator[] = [...FORM_FIELD_VALIDATORS];
    customFieldTemplates: FormFieldTemplates = {};

    className: string;
    readOnly = false;
    isValid = true;
    processVariables: ProcessVariableModel[] = [];
    variables: FormVariableModel[] = [];

    constructor(
        json?: any,
        formValues?: FormValues,
        readOnly: boolean = false,
        protected formService?: FormValidationService,
        enableFixedSpace?: boolean
    ) {
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
            this.variables = json.variables || json.formDefinition?.variables || [];
            this.processVariables = json.processVariables || [];
            this.enableFixedSpace = enableFixedSpace ? true : false;
            this.confirmMessage = json.confirmMessage || {};

            this.tabs = (json.tabs || []).map((tabJson) => new TabModel(this, tabJson));

            this.fields = this.parseRootFields(json);
            this.fieldsCache = this.getFormFields();

            if (formValues) {
                this.loadData(formValues);
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

        for (let i = 0; i < this.fieldsCache.length; i++) {
            if (!this.fieldsCache[i].validate()) {
                errorsField.push(this.fieldsCache[i]);
            }
        }

        this.isValid = errorsField.length <= 0;

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
    private parseRootFields(json: any): (ContainerModel | FormFieldModel)[] {
        let fields = [];

        if (json.fields) {
            fields = json.fields;
        } else if (json.formDefinition && json.formDefinition.fields) {
            fields = json.formDefinition.fields;
        }

        const rootElements: (ContainerModel | FormFieldModel)[] = [];
        let currentRootElement;
        for (const field of fields) {
            if (field?.type === FormFieldTypes.DYNAMIC_TABLE) {
                currentRootElement = new FormFieldModel(this, field);
            } else {
                currentRootElement = new ContainerModel(new FormFieldModel(this, field));
            }

            if (field.tab) {
                const tab = this.tabs.find((currentTab) => field.tab === currentTab.id);
                if (tab) {
                    tab.fields.push(currentRootElement);
                }
            }

            rootElements.push(currentRootElement);
        }

        return rootElements;
    }

    // Loads external data and overrides field values
    // Typically used when form definition and form data coming from different sources
    private loadData(formValues: FormValues) {
        for (const field of this.fieldsCache) {
            const variableId = `variables.${field.name}`;

            if (this.isDefined(formValues[variableId]) || this.isDefined(formValues[field.id])) {
                field.json.value = formValues[variableId] || formValues[field.id];
                field.value = field.parseValue(field.json);
            }
        }
    }

    private isDefined(value: string): boolean {
        return value !== undefined && value !== null;
    }

    /**
     * Returns a form variable that matches the identifier.
     *
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
     *
     * @param identifier The `name` or `id` value
     */
    getDefaultFormVariableValue(identifier: string): any {
        const variable = this.getFormVariable(identifier);

        if (variable && variable.hasOwnProperty('value')) {
            return this.parseValue(variable.type, variable.value);
        }

        return undefined;
    }

    /**
     * Returns a process variable value.
     * When mapping a process variable with a form variable the mapping
     * is already resolved by the rest API with the name of variables.formVariableName
     *
     * @param name Variable name
     */
    getProcessVariableValue(name: string): any {
        let value;
        if (this.processVariables?.length) {
            const names = [`variables.${ name }`, name];

            const processVariable = this.processVariables.find(
                entry => names.includes(entry.name)
            );

            if (processVariable) {
                value = this.parseValue(processVariable.type, processVariable.value);
            }
        }

        if (!value) {
            value = this.getDefaultFormVariableValue(name);
        }

        return value;
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
        return this.fieldsCache.find((field) => field.id === fieldId);
    }

    getFormFields(): FormFieldModel[] {
        if (this.fieldsCache.length > 0) {
            return this.fieldsCache;
        } else {
            const formFieldModel: FormFieldModel[] = [];

            for (let i = 0; i < this.fields.length; i++) {
                const field = this.fields[i];

                if (field instanceof ContainerModel) {
                    formFieldModel.push(field.field);

                    field.field.columns.forEach((column) => {
                        formFieldModel.push(...column.fields);
                    });
                }else{
                    formFieldModel.push(field);
                }
            }

            return formFieldModel;
        }
    }

    markAsInvalid(): void {
        this.isValid = false;
    }

    protected parseOutcomes() {
        if (this.json.fields) {
            const saveOutcome = new FormOutcomeModel(this, {
                id: FormModel.SAVE_OUTCOME,
                name: 'SAVE',
                isSystem: true
            });
            const completeOutcome = new FormOutcomeModel(this, {
                id: FormModel.COMPLETE_OUTCOME,
                name: 'COMPLETE',
                isSystem: true
            });
            const startProcessOutcome = new FormOutcomeModel(this, {
                id: FormModel.START_PROCESS_OUTCOME,
                name: 'START PROCESS',
                isSystem: true
            });

            const customOutcomes = (this.json.outcomes || []).map(
                (obj) => new FormOutcomeModel(this, obj)
            );

            this.outcomes = [saveOutcome].concat(
                customOutcomes.length > 0
                    ? customOutcomes
                    : [completeOutcome, startProcessOutcome]
            );
        }
    }

    addValuesNotPresent(valuesToSetIfNotPresent: FormValues) {
        this.fieldsCache.forEach(field => {
            if (valuesToSetIfNotPresent[field.id] && (!this.values[field.id] || this.isValidDropDown(field.id))) {
                this.values[field.id] = valuesToSetIfNotPresent[field.id];
                field.json.value = this.values[field.id];
                field.value = field.parseValue(field.json);
            }
        });
    }

    private isValidDropDown(key: string): boolean {
        const field = this.getFieldById(key);
        if (field.type === FormFieldTypes.DROPDOWN) {
            if (field.hasMultipleValues) {
                return Array.isArray(this.values[key]);
            }
            return typeof this.values[key] === 'string' ? this.values[key] === 'empty' : Object.keys(this.values[key]).length === 0;
        }
        return false;
    }

    setNodeIdValueForViewersLinkedToUploadWidget(linkedUploadWidgetContentSelected: UploadWidgetContentLinkModel) {
        const linkedWidgetType = linkedUploadWidgetContentSelected?.options?.linkedWidgetType ?? 'uploadWidget';

        const subscribedViewers = this.fieldsCache.filter(field =>
            linkedUploadWidgetContentSelected.uploadWidgetId === field.params[linkedWidgetType]
        );

        subscribedViewers.forEach(viewer => {
            this.values[viewer.id] = linkedUploadWidgetContentSelected.id;
            viewer.json.value = this.values[viewer.id];
            viewer.value = viewer.parseValue(viewer.json);
        });
    }

    changeFieldVisibility(fieldId: string, visibility: boolean): void {
        const visibilityRule: WidgetVisibilityModel = new WidgetVisibilityModel();

        const field = this.getFieldById(fieldId);
        if (!!field) {
            visibilityRule.operator = visibility ? 'empty' : '!empty';
            visibilityRule.leftType = WidgetTypeEnum.field;
            field.visibilityCondition = visibilityRule;
            field.isVisible = visibility;
        }
    }

    changeFieldDisabled(fieldId: string, disabled: boolean): void {
        const field = this.getFieldById(fieldId);
        if (!!field) {
            field.readOnly = this.readOnly || disabled;
        }
    }

    changeFieldRequired(fieldId: string, required: boolean): void {
        const field = this.getFieldById(fieldId);
        if (!!field) {
            field.required = required;
        }
    }

    changeFieldValue(fieldId: string, value: any): void {
        const field = this.getFieldById(fieldId);
        if (!!field) {
            field.value = value;
        }
    }

    changeVariableValue(variableId: string, value: any): void {
        const variable = this.getFormVariable(variableId);
        if (!!variable) {
            variable.value = value;
        }
    }
}
