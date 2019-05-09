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

import { FormCloud } from './form-cloud.model';
import { TabModel, FormFieldModel, ContainerModel, FormOutcomeModel,
    FormFieldTypes, FormControlService, ValidateFormEvent,
    ValidateFormFieldEvent, FormFieldValidator, FORM_FIELD_VALIDATORS } from '@alfresco/adf-core';

describe('FormCloud', () => {

    let formControlService: FormControlService;

    beforeEach(() => {
        formControlService = new FormControlService();
    });

    it('should store original json', () => {
        const json = {formRepresentation: {formDefinition: {}}};
        const form = new FormCloud(json);
        expect(form.json).toBe(json);
    });

    it('should setup properties with json', () => {
        const json = {formRepresentation: {
            id: '<id>',
            name: '<name>',
            taskId: '<task-id>',
            taskName: '<task-name>'
        }};
        const form = new FormCloud(json);

        Object.keys(json).forEach((key) => {
            expect(form[key]).toEqual(form[key]);
        });
    });

    it('should take form name when task name is missing', () => {
        const json = {formRepresentation: {
            id: '<id>',
            name: '<name>',
            formDefinition: {}
        }};
        const form = new FormCloud(json);
        expect(form.taskName).toBe(json.formRepresentation.name);
    });

    it('should set readonly state from params', () => {
        const form = new FormCloud({}, null, true);
        expect(form.readOnly).toBeTruthy();
    });

    it('should check tabs', () => {
        const form = new FormCloud();

        form.tabs = null;
        expect(form.hasTabs()).toBeFalsy();

        form.tabs = [];
        expect(form.hasTabs()).toBeFalsy();

        form.tabs = [new TabModel(null)];
        expect(form.hasTabs()).toBeTruthy();
    });

    it('should check fields', () => {
        const form = new FormCloud();

        form.fields = null;
        expect(form.hasFields()).toBeFalsy();

        form.fields = [];
        expect(form.hasFields()).toBeFalsy();

        const field = new FormFieldModel(<any> form);
        form.fields = [new ContainerModel(field)];
        expect(form.hasFields()).toBeTruthy();
    });

    it('should check outcomes', () => {
        const form = new FormCloud();

        form.outcomes = null;
        expect(form.hasOutcomes()).toBeFalsy();

        form.outcomes = [];
        expect(form.hasOutcomes()).toBeFalsy();

        form.outcomes = [new FormOutcomeModel(null)];
        expect(form.hasOutcomes()).toBeTruthy();
    });

    it('should parse tabs', () => {
        const json = {formRepresentation: {formDefinition: {
            tabs: [
                { id: 'tab1' },
                { id: 'tab2' }
            ]
        }}};

        const form = new FormCloud(json);
        expect(form.tabs.length).toBe(2);
        expect(form.tabs[0].id).toBe('tab1');
        expect(form.tabs[1].id).toBe('tab2');
    });

    it('should parse fields', () => {
        const json = {formRepresentation: {formDefinition: {
            fields: [
                {
                    id: 'field1',
                    type: FormFieldTypes.CONTAINER
                },
                {
                    id: 'field2',
                    type: FormFieldTypes.CONTAINER
                }
            ]
        }}};

        const form = new FormCloud(json);
        expect(form.fields.length).toBe(2);
        expect(form.fields[0].id).toBe('field1');
        expect(form.fields[1].id).toBe('field2');
    });

    it('should convert missing fields to empty collection', () => {
        const json = {formRepresentation: {formDefinition: {
            fields: null
        }}};

        const form = new FormCloud(json);
        expect(form.fields).toBeDefined();
        expect(form.fields.length).toBe(0);
    });

    it('should put fields into corresponding tabs', () => {
        const json = {formRepresentation: {formDefinition: {
            tabs: [
                { id: 'tab1' },
                { id: 'tab2' }
            ],
            fields: [
                { id: 'field1', tab: 'tab1', type: FormFieldTypes.CONTAINER },
                { id: 'field2', tab: 'tab2', type: FormFieldTypes.CONTAINER },
                { id: 'field3', tab: 'tab1', type: FormFieldTypes.DYNAMIC_TABLE },
                { id: 'field4', tab: 'missing-tab', type: FormFieldTypes.DYNAMIC_TABLE }
            ]
        }}};

        const form = new FormCloud(json);
        expect(form.tabs.length).toBe(2);
        expect(form.fields.length).toBe(4);

        const tab1 = form.tabs[0];
        expect(tab1.fields.length).toBe(2);
        expect(tab1.fields[0].id).toBe('field1');
        expect(tab1.fields[1].id).toBe('field3');

        const tab2 = form.tabs[1];
        expect(tab2.fields.length).toBe(1);
        expect(tab2.fields[0].id).toBe('field2');
    });

    it('should create standard form outcomes', () => {
        const json = {formRepresentation: {formDefinition: {
            fields: [
                { id: 'container1' }
            ]
        }}};

        const form = new FormCloud(json);
        expect(form.outcomes.length).toBe(3);

        expect(form.outcomes[0].id).toBe(FormCloud.SAVE_OUTCOME);
        expect(form.outcomes[0].isSystem).toBeTruthy();

        expect(form.outcomes[1].id).toBe(FormCloud.COMPLETE_OUTCOME);
        expect(form.outcomes[1].isSystem).toBeTruthy();

        expect(form.outcomes[2].id).toBe(FormCloud.START_PROCESS_OUTCOME);
        expect(form.outcomes[2].isSystem).toBeTruthy();
    });

    it('should create outcomes only when fields available', () => {
        const json = {formRepresentation: {formDefinition: {
            fields: null
        }}};
        const form = new FormCloud(json);
        expect(form.outcomes.length).toBe(0);
    });

    it('should use custom form outcomes', () => {
        const json = {formRepresentation: {formDefinition: {
            fields: [
                { id: 'container1' }
            ]},
            outcomes: [
                { id: 'custom-1', name: 'custom 1' }
            ]
        }};

        const form = new FormCloud(json);
        expect(form.outcomes.length).toBe(2);

        expect(form.outcomes[0].id).toBe(FormCloud.SAVE_OUTCOME);
        expect(form.outcomes[0].isSystem).toBeTruthy();

        expect(form.outcomes[1].id).toBe('custom-1');
        expect(form.outcomes[1].isSystem).toBeFalsy();
    });

    it('should get field by id', () => {
        const form = new FormCloud({}, null, false, formControlService);
        const field: any = { id: 'field1' };
        spyOn(form, 'getFormFields').and.returnValue([field]);

        const result = form.getFieldById('field1');
        expect(result).toBe(field);
    });

    it('should raise validation event when validating form', (done) => {
        const form = new FormCloud({}, null, false, formControlService);

        formControlService.validateForm.subscribe(() => done());
        form.validateForm();
    });

    it('should raise validation event when validating field', (done) => {
        const form = new FormCloud({}, null, false, formControlService);
        const field = jasmine.createSpyObj('FormFieldModel', ['validate']);

        formControlService.validateFormField.subscribe(() => done());
        form.validateField(field);
    });

    it('should skip field validation when default behaviour prevented', () => {
        const form = new FormCloud({}, null, false, formControlService);

        let prevented = false;

        formControlService.validateFormField.subscribe((event: ValidateFormFieldEvent) => {
            event.isValid = false;
            event.preventDefault();
            prevented = true;
        });

        const field = jasmine.createSpyObj('FormFieldModel', ['validate']);
        form.validateField(field);

        expect(prevented).toBeTruthy();
        expect(form.isValid).toBeFalsy();
        expect(field.validate).not.toHaveBeenCalled();
    });

    it('should validate fields when form validation not prevented', () => {
        const form = new FormCloud({}, null, false, formControlService);

        let validated = false;

        formControlService.validateForm.subscribe((event: ValidateFormEvent) => {
            validated = true;
        });

        const field = jasmine.createSpyObj('FormFieldModel', ['validate']);
        spyOn(form, 'getFormFields').and.returnValue([field]);

        form.validateForm();

        expect(validated).toBeTruthy();
        expect(field.validate).toHaveBeenCalled();
    });

    it('should validate field when field validation not prevented', () => {
        const form = new FormCloud({}, null, false, formControlService);

        let validated = false;

        formControlService.validateFormField.subscribe((event: ValidateFormFieldEvent) => {
            validated = true;
        });

        const field = jasmine.createSpyObj('FormFieldModel', ['validate']);
        form.validateField(field);

        expect(validated).toBeTruthy();
        expect(field.validate).toHaveBeenCalled();
    });

    it('should validate form when field validation not prevented', () => {
        const form = new FormCloud({}, null, false, formControlService);
        spyOn(form, 'validateForm').and.stub();

        let validated = false;

        formControlService.validateFormField.subscribe((event: ValidateFormFieldEvent) => {
            validated = true;
        });

        const field: any = {
            validate() {
                return true;
            }
        };
        form.validateField(field);

        expect(validated).toBeTruthy();
        expect(form.validateForm).toHaveBeenCalled();
    });

    it('should not validate form when field validation prevented', () => {
        const form = new FormCloud({}, null, false, formControlService);
        spyOn(form, 'validateForm').and.stub();

        let prevented = false;

        formControlService.validateFormField.subscribe((event: ValidateFormFieldEvent) => {
            event.preventDefault();
            prevented = true;
        });

        const field = jasmine.createSpyObj('FormFieldModel', ['validate']);
        form.validateField(field);

        expect(prevented).toBeTruthy();
        expect(field.validate).not.toHaveBeenCalled();
        expect(form.validateForm).not.toHaveBeenCalled();
    });

    it('should use custom field validator', () => {
        const form = new FormCloud({}, null, false, formControlService);
        const testField = new FormFieldModel(<any> form, {
            id: 'test-field-1'
        });

        spyOn(form, 'getFormFields').and.returnValue([testField]);

        const validator = <FormFieldValidator> {
            isSupported(field: FormFieldModel): boolean {
                return true;
            },
            validate(field: FormFieldModel): boolean {
                return true;
            }
        };

        spyOn(validator, 'validate').and.callThrough();

        form.fieldValidators = [validator];
        form.validateForm();

        expect(validator.validate).toHaveBeenCalledWith(testField);
    });

    it('should re-validate the field when required attribute changes', () => {
        const form = new FormCloud({}, null, false, formControlService);
        const testField = new FormFieldModel(<any> form, {
            id: 'test-field-1',
            required: false
        });

        spyOn(form, 'getFormFields').and.returnValue([testField]);
        spyOn(form, 'onFormFieldChanged').and.callThrough();
        spyOn(form, 'validateField').and.callThrough();

        testField.required = true;

        expect(testField.required).toBeTruthy();
        expect(form.onFormFieldChanged).toHaveBeenCalledWith(testField);
        expect(form.validateField).toHaveBeenCalledWith(testField);
    });

    it('should not change default validators export', () => {
        const form = new FormCloud({}, null, false, formControlService);
        const defaultLength = FORM_FIELD_VALIDATORS.length;

        expect(form.fieldValidators.length).toBe(defaultLength);
        form.fieldValidators.push(<any> {});

        expect(form.fieldValidators.length).toBe(defaultLength + 1);
        expect(FORM_FIELD_VALIDATORS.length).toBe(defaultLength);
    });
});
