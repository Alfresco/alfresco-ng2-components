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

import { ValidateFormFieldEvent } from './../../../events/validate-form-field.event';
import { ValidateFormEvent } from './../../../events/validate-form.event';
import { FormService } from './../../../services/form.service';
import { ContainerModel } from './container.model';
import { FormFieldTypes } from './form-field-types';
import { FormOutcomeModel } from './form-outcome.model';
import { FormModel } from './form.model';
import { TabModel } from './tab.model';

describe('FormModel', () => {

    let formService: FormService;

    beforeEach(() => {
        formService = new FormService(null, null, null);
    });

    it('should store original json', () => {
        let json = {};
        let form = new FormModel(json);
        expect(form.json).toBe(json);
    });

    it('should setup properties with json', () => {
        let json = {
            id: '<id>',
            name: '<name>',
            taskId: '<task-id>',
            taskName: '<task-name>'
        };
        let form = new FormModel(json);

        Object.keys(json).forEach(key => {
            expect(form[key]).toEqual(form[key]);
        });
    });

    it('should take form name when task name is missing', () => {
        let json = {
            id: '<id>',
            name: '<name>'
        };
        let form = new FormModel(json);
        expect(form.taskName).toBe(json.name);
    });

    it('should use fallback value for task name', () => {
        let form = new FormModel({});
        expect(form.taskName).toBe(FormModel.UNSET_TASK_NAME);
    });

    it('should set readonly state from params', () => {
        let form = new FormModel({}, null, true);
        expect(form.readOnly).toBeTruthy();
    });

    it('should check tabs', () => {
        let form = new FormModel();

        form.tabs = null;
        expect(form.hasTabs()).toBeFalsy();

        form.tabs = [];
        expect(form.hasTabs()).toBeFalsy();

        form.tabs = [new TabModel(null)];
        expect(form.hasTabs()).toBeTruthy();
    });

    it('should check fields', () => {
        let form = new FormModel();

        form.fields = null;
        expect(form.hasFields()).toBeFalsy();

        form.fields = [];
        expect(form.hasFields()).toBeFalsy();

        form.fields = [new ContainerModel(null)];
        expect(form.hasFields()).toBeTruthy();
    });

    it('should check outcomes', () => {
        let form = new FormModel();

        form.outcomes = null;
        expect(form.hasOutcomes()).toBeFalsy();

        form.outcomes = [];
        expect(form.hasOutcomes()).toBeFalsy();

        form.outcomes = [new FormOutcomeModel(null)];
        expect(form.hasOutcomes()).toBeTruthy();
    });

    it('should parse tabs', () => {
        let json = {
            tabs: [
                { id: 'tab1' },
                { id: 'tab2' }
            ]
        };

        let form = new FormModel(json);
        expect(form.tabs.length).toBe(2);
        expect(form.tabs[0].id).toBe('tab1');
        expect(form.tabs[1].id).toBe('tab2');
    });

    it('should parse fields', () => {
        let json = {
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
        };

        let form = new FormModel(json);
        expect(form.fields.length).toBe(2);
        expect(form.fields[0].id).toBe('field1');
        expect(form.fields[1].id).toBe('field2');
    });

    it('should parse fields from the definition', () => {
        let json = {
            fields: null,
            formDefinition: {
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
            }
        };

        let form = new FormModel(json);
        expect(form.fields.length).toBe(2);
        expect(form.fields[0].id).toBe('field1');
        expect(form.fields[1].id).toBe('field2');
    });

    it('should convert missing fields to empty collection', () => {
        let json = {
            fields: null
        };

        let form = new FormModel(json);
        expect(form.fields).toBeDefined();
        expect(form.fields.length).toBe(0);
    });

    it('should put fields into corresponding tabs', () => {
        let json = {
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
        };

        let form = new FormModel(json);
        expect(form.tabs.length).toBe(2);
        expect(form.fields.length).toBe(4);

        let tab1 = form.tabs[0];
        expect(tab1.fields.length).toBe(2);
        expect(tab1.fields[0].id).toBe('field1');
        expect(tab1.fields[1].id).toBe('field3');

        let tab2 = form.tabs[1];
        expect(tab2.fields.length).toBe(1);
        expect(tab2.fields[0].id).toBe('field2');
    });

    it('should create standard form outcomes', () => {
        let json = {
            fields: [
                { id: 'container1' }
            ]
        };

        let form = new FormModel(json);
        expect(form.outcomes.length).toBe(3);

        expect(form.outcomes[0].id).toBe(FormModel.SAVE_OUTCOME);
        expect(form.outcomes[0].isSystem).toBeTruthy();

        expect(form.outcomes[1].id).toBe(FormModel.COMPLETE_OUTCOME);
        expect(form.outcomes[1].isSystem).toBeTruthy();

        expect(form.outcomes[2].id).toBe(FormModel.START_PROCESS_OUTCOME);
        expect(form.outcomes[2].isSystem).toBeTruthy();
    });

    it('should create outcomes only when fields available', () => {
        let json = {
            fields: null
        };
        let form = new FormModel(json);
        expect(form.outcomes.length).toBe(0);
    });

    it('should use custom form outcomes', () => {
        let json = {
            fields: [
                { id: 'container1' }
            ],
            outcomes: [
                { id: 'custom-1', name: 'custom 1' }
            ]
        };

        let form = new FormModel(json);
        expect(form.outcomes.length).toBe(2);

        expect(form.outcomes[0].id).toBe(FormModel.SAVE_OUTCOME);
        expect(form.outcomes[0].isSystem).toBeTruthy();

        expect(form.outcomes[1].id).toBe('custom-1');
        expect(form.outcomes[1].isSystem).toBeFalsy();
    });

    it('should raise validation event when validating form', (done) => {
        const form = new FormModel({}, null, false, formService);

        formService.validateForm.subscribe(() => done());
        form.validateForm();
    });

    it('should raise validation event when validating field', (done) => {
        const form = new FormModel({}, null, false, formService);
        const field = jasmine.createSpyObj('FormFieldModel', ['validate']);

        formService.validateFormField.subscribe(() => done());
        form.validateField(field);
    });

    it('should skip form validation when default behaviour prevented', () => {
        const form = new FormModel({}, null, false, formService);

        let prevented = false;

        formService.validateForm.subscribe((event: ValidateFormEvent) => {
            event.isValid = false;
            event.preventDefault();
            prevented = true;
        });

        const field = jasmine.createSpyObj('FormFieldModel', ['validate']);
        spyOn(form, 'getFormFields').and.returnValue([field]);

        form.validateForm();

        expect(prevented).toBeTruthy();
        expect(form.isValid).toBeFalsy();
        expect(field.validate).not.toHaveBeenCalled();
    });

    it('should skip field validation when default behaviour prevented', () => {
        const form = new FormModel({}, null, false, formService);

        let prevented = false;

        formService.validateFormField.subscribe((event: ValidateFormFieldEvent) => {
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
        const form = new FormModel({}, null, false, formService);

        let validated = false;

        formService.validateForm.subscribe((event: ValidateFormEvent) => {
            validated = true;
        });

        const field = jasmine.createSpyObj('FormFieldModel', ['validate']);
        spyOn(form, 'getFormFields').and.returnValue([field]);

        form.validateForm();

        expect(validated).toBeTruthy();
        expect(field.validate).toHaveBeenCalled();
    });

    it('should validate field when field validation not prevented', () => {
        const form = new FormModel({}, null, false, formService);

        let validated = false;

        formService.validateFormField.subscribe((event: ValidateFormFieldEvent) => {
            validated = true;
        });

        const field = jasmine.createSpyObj('FormFieldModel', ['validate']);
        form.validateField(field);

        expect(validated).toBeTruthy();
        expect(field.validate).toHaveBeenCalled();
    });

    it('should validate form when field validation not prevented', () => {
        const form = new FormModel({}, null, false, formService);
        spyOn(form, 'validateForm').and.stub();

        let validated = false;

        formService.validateFormField.subscribe((event: ValidateFormFieldEvent) => {
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
        const form = new FormModel({}, null, false, formService);
        spyOn(form, 'validateForm').and.stub();

        let prevented = false;

        formService.validateFormField.subscribe((event: ValidateFormFieldEvent) => {
            event.preventDefault();
            prevented = true;
        });

        const field = jasmine.createSpyObj('FormFieldModel', ['validate']);
        form.validateField(field);

        expect(prevented).toBeTruthy();
        expect(field.validate).not.toHaveBeenCalled();
        expect(form.validateForm).not.toHaveBeenCalled();
    });
});
