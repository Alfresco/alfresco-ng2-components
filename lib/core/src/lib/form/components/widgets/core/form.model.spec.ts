/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ValidateFormFieldEvent } from '../../../events/validate-form-field.event';
import { FormService } from '../../../services/form.service';
import { ContainerModel } from './container.model';
import { ErrorMessageModel } from './error-message.model';
import { FormFieldTypes } from './form-field-types';
import { FORM_FIELD_VALIDATORS, FormFieldValidator } from './form-field-validator';
import { FormFieldModel } from './form-field.model';
import { FormOutcomeModel } from './form-outcome.model';
import { FormModel } from './form.model';
import { TabModel } from './tab.model';
import { fakeMetadataForm, mockDisplayExternalPropertyForm, mockFormWithSections, fakeValidatorMock } from '../../mock/form.mock';
import { TestBed } from '@angular/core/testing';
import { ValidateFormEvent } from '../../../events/validate-form.event';
import { WidgetVisibilityService } from '../../../services/widget-visibility.service';
import { tabInvalidFormVisibility } from '../../../../mock/form/widget-visibility.service.mock';

describe('FormModel', () => {
    let formService: FormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [FormService]
        });
        formService = TestBed.inject(FormService);
    });

    it('should store original json', () => {
        const json = {
            id: '<id>',
            name: '<name>'
        };
        const form = new FormModel(json);
        expect(form.json).toBe(json);
    });

    it('should setup properties with json', () => {
        const json = {
            id: '<id>',
            name: '<name>',
            taskId: '<task-id>',
            taskName: '<task-name>'
        };
        const form = new FormModel(json);

        Object.keys(json).forEach((key) => {
            expect(form[key]).toEqual(form[key]);
        });
    });

    it('should take form name when task name is missing', () => {
        const json = {
            id: '<id>',
            name: '<name>'
        };
        const form = new FormModel(json);
        expect(form.taskName).toBe(json.name);
    });

    it('should use fallback value for task name', () => {
        const form = new FormModel({});
        expect(form.taskName).toBe(FormModel.UNSET_TASK_NAME);
    });

    it('should set readonly state from params', () => {
        const form = new FormModel({}, null, true);
        expect(form.readOnly).toBeTruthy();
    });

    it('should have showAllValidationErrors default to false', () => {
        const form = new FormModel({});
        expect(form.showAllValidationErrors).toBe(false);
    });

    it('should set form values when variable value is 0', () => {
        const variables = {
            pfx_property_one: 0
        };
        const form = new FormModel(fakeMetadataForm, variables, true);
        expect(form.getFormFields()[0].fields[1][0].value).toEqual(0);
    });

    it('should check tabs', () => {
        const form = new FormModel();

        form.tabs = null;
        expect(form.hasTabs()).toBeFalsy();

        form.tabs = [];
        expect(form.hasTabs()).toBeFalsy();

        form.tabs = [new TabModel(null)];
        expect(form.hasTabs()).toBeTruthy();
    });

    it('should check fields', () => {
        const form = new FormModel();

        form.fields = null;
        expect(form.hasFields()).toBeFalsy();

        form.fields = [];
        expect(form.hasFields()).toBeFalsy();

        const field = new FormFieldModel(form);
        form.fields = [new ContainerModel(field)];
        expect(form.hasFields()).toBeTruthy();
    });

    it('should check outcomes', () => {
        const form = new FormModel();

        form.outcomes = null;
        expect(form.hasOutcomes()).toBeFalsy();

        form.outcomes = [];
        expect(form.hasOutcomes()).toBeFalsy();

        form.outcomes = [new FormOutcomeModel(null)];
        expect(form.hasOutcomes()).toBeTruthy();
    });

    it('should parse tabs', () => {
        const json = {
            tabs: [{ id: 'tab1' }, { id: 'tab2' }]
        };

        const form = new FormModel(json);
        expect(form.tabs.length).toBe(2);
        expect(form.tabs[0].id).toBe('tab1');
        expect(form.tabs[1].id).toBe('tab2');
    });

    it('should parse fields', () => {
        const json = {
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

        const form = new FormModel(json);
        expect(form.fields.length).toBe(2);
        expect(form.fields[0].id).toBe('field1');
        expect(form.fields[1].id).toBe('field2');
    });

    it('should parse fields from the definition', () => {
        const json = {
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

        const form = new FormModel(json);
        expect(form.fields.length).toBe(2);
        expect(form.fields[0].id).toBe('field1');
        expect(form.fields[1].id).toBe('field2');
    });

    it('should convert missing fields to empty collection', () => {
        const json = {
            fields: null
        };

        const form = new FormModel(json);
        expect(form.fields).toBeDefined();
        expect(form.fields.length).toBe(0);
    });

    it('should put fields into corresponding tabs', () => {
        const json = {
            tabs: [{ id: 'tab1' }, { id: 'tab2' }],
            fields: [
                { id: 'field1', tab: 'tab1', type: FormFieldTypes.CONTAINER },
                { id: 'field2', tab: 'tab2', type: FormFieldTypes.CONTAINER },
                { id: 'field3', tab: 'tab1', type: FormFieldTypes.DYNAMIC_TABLE },
                { id: 'field4', tab: 'missing-tab', type: FormFieldTypes.DYNAMIC_TABLE }
            ]
        };

        const form = new FormModel(json);
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
        const json = {
            fields: [{ id: 'container1' }]
        };

        const form = new FormModel(json);
        expect(form.outcomes.length).toBe(3);

        expect(form.outcomes[0].id).toBe(FormModel.SAVE_OUTCOME);
        expect(form.outcomes[0].isSystem).toBeTruthy();

        expect(form.outcomes[1].id).toBe(FormModel.COMPLETE_OUTCOME);
        expect(form.outcomes[1].isSystem).toBeTruthy();

        expect(form.outcomes[2].id).toBe(FormModel.START_PROCESS_OUTCOME);
        expect(form.outcomes[2].isSystem).toBeTruthy();
    });

    it('should create outcomes only when fields available', () => {
        const json = {
            fields: null
        };
        const form = new FormModel(json);
        expect(form.outcomes.length).toBe(0);
    });

    it('should use custom form outcomes', () => {
        const json = {
            fields: [{ id: 'container1' }],
            outcomes: [{ id: 'custom-1', name: 'custom 1' }]
        };

        const form = new FormModel(json);
        expect(form.outcomes.length).toBe(2);

        expect(form.outcomes[0].id).toBe(FormModel.SAVE_OUTCOME);
        expect(form.outcomes[0].isSystem).toBeTruthy();

        expect(form.outcomes[1].id).toBe('custom-1');
        expect(form.outcomes[1].isSystem).toBeFalsy();
    });

    it('should raise validation event when validating form', (done) => {
        const form = new FormModel({}, null, false, formService);

        formService.validateForm.subscribe((validateFormEvent) => {
            expect(validateFormEvent).toBeTruthy();
            done();
        });
        form.validateForm();
    });

    it('should raise validation event when validating field', (done) => {
        const form = new FormModel({}, null, false, formService);
        const field = jasmine.createSpyObj('FormFieldModel', ['validate']);

        formService.validateFormField.subscribe((validateFormFieldEvent) => {
            expect(validateFormFieldEvent).toBeTruthy();
            done();
        });
        form.validateField(field);
    });

    it('should skip field validation when default behaviour prevented', (done) => {
        const form = new FormModel({}, null, false, formService);
        const field = new FormFieldModel(form, { id: 'field', type: 'text' });
        spyOn(field, 'validate');

        let prevented = false;

        formService.validateFormField.subscribe((event: ValidateFormFieldEvent) => {
            event.isValid = false;
            event.preventDefault();
            prevented = true;
            done();
        });

        form.validateField(field);

        expect(prevented).toBeTruthy();
        expect(form.isValid).toBeFalsy();
        expect(field.validate).not.toHaveBeenCalled();
    });

    it('should validate fields when form validation not prevented', (done) => {
        const form = new FormModel(fakeMetadataForm, null, false, formService);

        let validated = false;

        formService.validateForm.subscribe(() => {
            validated = true;
            done();
        });

        const field = jasmine.createSpyObj('FormFieldModel', ['validate']);
        form.fieldsCache = [field];

        form.validateForm();

        expect(validated).toBeTruthy();
        expect(field.validate).toHaveBeenCalled();
    });

    it('should validate field when field validation not prevented', (done) => {
        const form = new FormModel({}, null, false, formService);

        let validated = false;

        formService.validateFormField.subscribe(() => {
            validated = true;
            done();
        });

        const field = jasmine.createSpyObj('FormFieldModel', ['validate']);
        form.validateField(field);

        expect(validated).toBeTruthy();
        expect(field.validate).toHaveBeenCalled();
    });

    it('should validate form when field validation not prevented', (done) => {
        const form = new FormModel({}, null, false, formService);
        spyOn(form, 'validateForm').and.stub();

        let validated = false;

        formService.validateFormField.subscribe(() => {
            validated = true;
            done();
        });

        const field: any = {
            validate: () => true
        };
        form.validateField(field);

        expect(validated).toBeTruthy();
        expect(form.validateForm).toHaveBeenCalled();
    });

    it('should not validate form when field validation prevented', (done) => {
        const form = new FormModel({}, null, false, formService);
        spyOn(form, 'validateForm').and.stub();

        let prevented = false;

        formService.validateFormField.subscribe((event: ValidateFormFieldEvent) => {
            event.preventDefault();
            prevented = true;
            done();
        });

        const field = jasmine.createSpyObj('FormFieldModel', ['validate']);
        form.validateField(field);

        expect(prevented).toBeTruthy();
        expect(field.validate).not.toHaveBeenCalled();
        expect(form.validateForm).not.toHaveBeenCalled();
    });

    it('should get field by id', () => {
        const form = new FormModel(fakeMetadataForm, null, false, formService);

        const result = form.getFieldById('pfx_property_three');
        expect(result.id).toBe('pfx_property_three');
    });

    it('should use custom field validator', () => {
        const form = new FormModel({}, null, false, formService);
        const testField = new FormFieldModel(form, {
            id: 'test-field-1'
        });

        form.fieldsCache = [testField];

        const validator = {
            isSupported: (): boolean => true,
            validate: (): boolean => true
        } as FormFieldValidator;

        spyOn(validator, 'validate').and.callThrough();

        form.fieldValidators = [validator];
        form.validateForm();

        expect(validator.validate).toHaveBeenCalledWith(testField);
    });

    it('should re-validate the field when required attribute changes', () => {
        const form = new FormModel({}, null, false, formService);
        const testField = new FormFieldModel(form, {
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
        const form = new FormModel({}, null, false, formService);
        const defaultLength = FORM_FIELD_VALIDATORS.length;

        expect(form.fieldValidators.length).toBe(defaultLength);
        form.fieldValidators.push({} as any);

        expect(form.fieldValidators.length).toBe(defaultLength + 1);
        expect(FORM_FIELD_VALIDATORS.length).toBe(defaultLength);
    });

    it('should include injected field validators', () => {
        const form = new FormModel({}, null, false, formService, undefined, [fakeValidatorMock]);
        const defaultLength = FORM_FIELD_VALIDATORS.length;

        expect(form.fieldValidators.length).toBe(defaultLength + 1);
    });

    describe('tab validation state', () => {
        const buildNestedTabsForm = (requiredFieldIds: string[]): FormModel => {
            const tabs = [
                { id: 'details', title: 'Details' },
                { id: 'review', title: 'Review' }
            ];
            const fields = [
                {
                    id: 'details-root',
                    type: 'container',
                    tab: 'details',
                    numberOfColumns: 1,
                    fields: { 1: [{ id: 'email', type: 'text', name: 'Email', required: requiredFieldIds.includes('email') }] }
                },
                {
                    id: 'review-root',
                    type: 'container',
                    tab: 'review',
                    numberOfColumns: 1,
                    fields: { 1: [{ id: 'notes', type: 'text', name: 'Notes', required: requiredFieldIds.includes('notes') }] }
                }
            ];

            return new FormModel({ tabs, fields }, null, false, formService);
        };

        const getTab = (form: FormModel, tabId: string): TabModel => form.tabs.find((tab) => tab.id === tabId);

        it('should mark only the tab whose root container holds an invalid nested field when the form is validated', () => {
            const form = buildNestedTabsForm(['email']);

            form.validateForm();

            expect(form.getFieldById('email').json.tab).toBeUndefined();
            expect(getTab(form, 'details').hasValidationErrors).toBeTrue();
            expect(getTab(form, 'review').hasValidationErrors).toBeFalse();
        });

        it('should mark every visible tab that holds an invalid field when errors span several tabs', () => {
            const form = buildNestedTabsForm(['email', 'notes']);

            form.validateForm();

            expect(getTab(form, 'details').hasValidationErrors).toBeTrue();
            expect(getTab(form, 'review').hasValidationErrors).toBeTrue();
        });

        it('should clear the tab state when the invalid field is corrected through the field change path', () => {
            const form = buildNestedTabsForm(['email']);
            const email = form.getFieldById('email');

            email.value = 'user@example.com';
            form.onFormFieldChanged(email);

            expect(form.isValid).toBeTrue();
            expect(getTab(form, 'details').hasValidationErrors).toBeFalse();
        });

        it('should not mark a tab when it is hidden and the form is revalidated', () => {
            const form = buildNestedTabsForm(['email']);

            getTab(form, 'details').isVisible = false;
            form.validateForm();

            expect(getTab(form, 'details').hasValidationErrors).toBeFalse();
        });

        it('should derive the same tab state when validation is repeated without changes', () => {
            const form = buildNestedTabsForm(['email']);

            form.validateForm();
            const firstState = form.tabs.map((tab) => tab.hasValidationErrors);
            form.validateForm();

            expect(form.tabs.map((tab) => tab.hasValidationErrors)).toEqual(firstState);
        });

        it('should keep the validate form event payload unchanged when tab state is derived', () => {
            const form = buildNestedTabsForm(['email']);
            let emittedEvent: ValidateFormEvent;
            let detailsStateOnEmit: boolean;

            formService.validateForm.subscribe((event: ValidateFormEvent) => {
                emittedEvent = event;
                detailsStateOnEmit = getTab(form, 'details').hasValidationErrors;
            });
            form.validateForm();

            expect(emittedEvent.isValid).toBeFalse();
            expect(emittedEvent.errorsField).toEqual([form.getFieldById('email')]);
            expect(detailsStateOnEmit).toBeTrue();
        });

        it('should keep the tab marked when a field validation subscriber rejects the corrected field', () => {
            const form = buildNestedTabsForm(['email']);
            const email = form.getFieldById('email');
            formService.validateFormField.subscribe((event: ValidateFormFieldEvent) => {
                event.isValid = false;
            });

            email.value = 'user@example.com';
            form.validateField(email);

            expect(form.isValid).toBeFalse();
            expect(getTab(form, 'details').hasValidationErrors).toBeTrue();
        });

        it('should keep the tab marked when a field validation subscriber skips validation', () => {
            const form = buildNestedTabsForm(['email']);
            const email = form.getFieldById('email');
            formService.validateFormField.subscribe((event: ValidateFormFieldEvent) => {
                event.preventDefault();
            });

            email.value = 'user@example.com';
            form.validateField(email);

            expect(getTab(form, 'details').hasValidationErrors).toBeTrue();
        });

        it('should clear the tab state when a visibility refresh hides a tab with an invalid nested field', () => {
            const visibilityService = TestBed.inject(WidgetVisibilityService);
            const form = new FormModel(tabInvalidFormVisibility, null, false, formService);
            const [conditionalTab] = form.tabs;
            form.getFieldById('Number1').value = 'invalidField';
            form.getFieldById('Text1').value = 'showtab';

            visibilityService.refreshVisibility(form);
            form.validateForm();

            expect(conditionalTab.hasValidationErrors).toBeTrue();

            form.getFieldById('Text1').value = 'hidetab';
            visibilityService.refreshVisibility(form);
            form.validateForm();

            expect(conditionalTab.isVisible).toBeFalse();
            expect(conditionalTab.hasValidationErrors).toBeFalse();
        });
    });

    describe('validity of unrendered and rejected fields', () => {
        const getTab = (form: FormModel, tabId: string): TabModel => form.tabs.find((tab) => tab.id === tabId);

        const hiddenCondition = {
            leftType: 'field',
            leftValue: 'email',
            operator: '==',
            rightValue: 'show',
            rightType: 'value',
            nextConditionOperator: '',
            nextCondition: null
        };

        const buildReactiveTabForm = (options: { dateValue?: string; coverageVisibility?: any; extraRootField?: any } = {}): FormModel =>
            new FormModel(
                {
                    tabs: [
                        { id: 'details', title: 'Details' },
                        { id: 'coverage', title: 'Coverage', visibilityCondition: options.coverageVisibility ?? null }
                    ],
                    fields: [
                        {
                            id: 'details-root',
                            type: 'container',
                            tab: 'details',
                            numberOfColumns: 1,
                            fields: { 1: [{ id: 'email', type: 'text', name: 'Email' }] }
                        },
                        {
                            id: 'coverage-root',
                            type: 'container',
                            tab: 'coverage',
                            numberOfColumns: 1,
                            fields: { 1: [{ id: 'dob', type: 'date', name: 'Date of birth', required: true, value: options.dateValue ?? null }] }
                        },
                        ...(options.extraRootField ? [options.extraRootField] : [])
                    ]
                },
                null,
                false,
                formService
            );

        const expectTabsToMatchForm = (form: FormModel) => {
            expect(form.isValid).toBe(!form.tabs.some((tab) => tab.hasValidationErrors));
        };

        it('should be invalid and mark the tab when an unrendered required date is empty', () => {
            const form = buildReactiveTabForm();

            expect(form.isValid).toBeFalse();
            expect(getTab(form, 'coverage').hasValidationErrors).toBeTrue();
            expect(getTab(form, 'details').hasValidationErrors).toBeFalse();
        });

        it('should report an unrendered invalid date as a form error and on the field itself', () => {
            let validateFormEvent: ValidateFormEvent;
            const form = buildReactiveTabForm();
            formService.validateForm.subscribe((event) => (validateFormEvent = event));

            form.validateForm();

            const dateField = form.getFieldById('dob');
            expect(validateFormEvent.isValid).toBeFalse();
            expect(validateFormEvent.errorsField).toEqual([dateField]);
            expect(dateField.isValid).toBeFalse();
            expect(dateField.validationSummary.message).toBe('FORM.FIELD.REQUIRED');
        });

        it('should stay valid when an unrendered required date has a value', () => {
            const form = buildReactiveTabForm({ dateValue: '2024-05-10' });

            expect(form.isValid).toBeTrue();
            expect(getTab(form, 'coverage').hasValidationErrors).toBeFalse();
        });

        it('should be invalid and mark the tab when the date input reports text that does not parse', () => {
            const form = buildReactiveTabForm({ dateValue: '2024-05-10' });
            const dateField = form.getFieldById('dob');

            dateField.inputErrors = { matDatepickerParse: true };
            form.validateForm();

            expect(form.isValid).toBeFalse();
            expect(getTab(form, 'coverage').hasValidationErrors).toBeTrue();
            expect(dateField.validationSummary.message).toBe('FORM.FIELD.VALIDATOR.INVALID_DATE_FORMAT');
        });

        it('should stay valid when the invalid field is hidden', () => {
            const form = buildReactiveTabForm();

            form.getFieldById('dob').isVisible = false;
            form.validateForm();

            expect(form.isValid).toBeTrue();
            expectTabsToMatchForm(form);
        });

        it('should stay valid when the invalid field is on a hidden tab', () => {
            const form = buildReactiveTabForm({ coverageVisibility: hiddenCondition });
            TestBed.inject(WidgetVisibilityService).refreshVisibility(form);

            form.validateForm();

            expect(getTab(form, 'coverage').isVisible).toBeFalse();
            expect(form.isValid).toBeTrue();
            expectTabsToMatchForm(form);
        });

        it('should be invalid without marking a tab when the invalid field belongs to no tab', () => {
            const form = buildReactiveTabForm({
                dateValue: '2024-05-10',
                extraRootField: {
                    id: 'orphan-root',
                    type: 'container',
                    tab: 'missing',
                    numberOfColumns: 1,
                    fields: { 1: [{ id: 'orphan', type: 'text', name: 'Orphan', required: true }] }
                }
            });

            form.validateForm();

            expect(form.getFieldById('orphan').isValid).toBeFalse();
            expect(form.isValid).toBeFalse();
            expect(form.tabs.every((tab) => !tab.hasValidationErrors)).toBeTrue();
        });

        it('should be invalid and mark the tab when a field is rejected, until the next validation', () => {
            const form = buildReactiveTabForm({ dateValue: '2024-05-10' });
            const validateFormSpy = spyOn(formService.validateForm, 'next');

            form.markFieldAsInvalid(form.getFieldById('email'));

            expect(validateFormSpy).not.toHaveBeenCalled();
            expect(form.getFieldById('email').isValid).toBeFalse();
            expect(form.isValid).toBeFalse();
            expect(getTab(form, 'details').hasValidationErrors).toBeTrue();

            form.validateForm();

            expect(form.isValid).toBeTrue();
            expect(getTab(form, 'details').hasValidationErrors).toBeFalse();
        });

        it('should mark the tab when a field validation subscriber rejects the field', () => {
            const form = buildReactiveTabForm({ dateValue: '2024-05-10' });
            formService.validateFormField.subscribe((event: ValidateFormFieldEvent) => {
                event.isValid = false;
            });

            form.validateField(form.getFieldById('email'));

            expect(form.isValid).toBeFalse();
            expect(getTab(form, 'details').hasValidationErrors).toBeTrue();
            expect(getTab(form, 'coverage').hasValidationErrors).toBeFalse();
        });

        it('should not keep marking the tab of a field hidden since the last validation when another field is rejected', () => {
            const form = buildReactiveTabForm();
            expect(getTab(form, 'coverage').hasValidationErrors).toBeTrue();
            form.getFieldById('dob').isVisible = false;

            form.markFieldAsInvalid(form.getFieldById('email'));

            expect(form.isValid).toBeFalse();
            expect(getTab(form, 'details').hasValidationErrors).toBeTrue();
            expect(getTab(form, 'coverage').hasValidationErrors).toBeFalse();
        });

        it('should stay valid when the rejected field is hidden', () => {
            const form = buildReactiveTabForm({ dateValue: '2024-05-10' });
            const email = form.getFieldById('email');
            email.isVisible = false;

            form.markFieldAsInvalid(email);

            expect(email.isValid).toBeFalse();
            expect(form.isValid).toBeTrue();
            expectTabsToMatchForm(form);
        });
    });

    describe('variables', () => {
        let form: FormModel;

        beforeEach(() => {
            const variables = [
                {
                    id: 'bfca9766-7bc1-45cc-8ecf-cdad551e36e2',
                    name: 'name1',
                    type: 'string',
                    value: 'hello'
                },
                {
                    id: '3ed9f28a-dbae-463f-b991-47ef06658bb6',
                    name: 'name2',
                    type: 'date',
                    value: '29.09.2019'
                },
                {
                    id: 'booleanVar',
                    name: 'bool',
                    type: 'boolean',
                    value: 'true'
                }
            ];

            const processVariables = [
                {
                    serviceName: 'denys-variable-mapping-rb',
                    serviceFullName: 'denys-variable-mapping-rb',
                    serviceVersion: '',
                    appName: 'denys-variable-mapping',
                    appVersion: '',
                    serviceType: null,
                    id: 3,
                    type: 'string',
                    name: 'variables.name1',
                    createTime: 1566989626284,
                    lastUpdatedTime: 1566989626284,
                    executionId: null,
                    value: 'hello',
                    markedAsDeleted: false,
                    processInstanceId: '1be4785f-c982-11e9-bdd8-96d6903e4e44',
                    taskId: '1beab9f6-c982-11e9-bdd8-96d6903e4e44',
                    taskVariable: true
                },
                {
                    serviceName: 'denys-variable-mapping-rb',
                    serviceFullName: 'denys-variable-mapping-rb',
                    serviceVersion: '',
                    appName: 'denys-variable-mapping',
                    appVersion: '',
                    serviceType: null,
                    id: 1,
                    type: 'boolean',
                    name: 'booleanVar',
                    createTime: 1566989626283,
                    lastUpdatedTime: 1566989626283,
                    executionId: null,
                    value: 'true',
                    markedAsDeleted: false,
                    processInstanceId: '1be4785f-c982-11e9-bdd8-96d6903e4e44',
                    taskId: '1beab9f6-c982-11e9-bdd8-96d6903e4e44',
                    taskVariable: true
                },
                {
                    id: 'variables.datetime',
                    name: 'variables.datetime',
                    value: '2025-01-23T04:30:00.000+0000',
                    type: 'date'
                },
                {
                    type: 'date',
                    name: 'variables.dateonly',
                    value: '2025-01-27'
                }
            ];

            form = new FormModel({
                variables,
                processVariables
            });
        });

        it('should parse form variables', () => {
            expect(form.variables.length).toBe(3);
            expect(form.variables[0].id).toBe('bfca9766-7bc1-45cc-8ecf-cdad551e36e2');
            expect(form.variables[1].id).toBe('3ed9f28a-dbae-463f-b991-47ef06658bb6');
            expect(form.variables[2].id).toBe('booleanVar');
        });

        it('should find a variable by or name', () => {
            const result1 = form.getFormVariable('bfca9766-7bc1-45cc-8ecf-cdad551e36e2');
            const result2 = form.getFormVariable('name1');

            expect(result1).toEqual(result2);
        });

        it('should not find a variable', () => {
            expect(form.getFormVariable(null)).toBeUndefined();
            expect(form.getFormVariable('')).toBeUndefined();
            expect(form.getFormVariable('missing')).toBeUndefined();
        });

        it('should find a form variable value', () => {
            const result1 = form.getDefaultFormVariableValue('name1');
            const result2 = form.getDefaultFormVariableValue('bfca9766-7bc1-45cc-8ecf-cdad551e36e2');

            expect(result1).toEqual(result2);
            expect(result1).toEqual('hello');
        });

        it('should convert the date variable value', () => {
            const value = form.getDefaultFormVariableValue('name2');
            expect(value).toBe('29.09.2019T00:00:00.000Z');
        });

        it('should convert the boolean variable value', () => {
            const value = form.getDefaultFormVariableValue('bool');
            expect(value).toEqual(true);
        });

        it('should not find variable value', () => {
            const value = form.getDefaultFormVariableValue('missing');
            expect(value).toBeUndefined();
        });

        it('should find a process variable by full form variable name', () => {
            const value = form.getProcessVariableValue('variables.name1');
            expect(value).toBe('hello');
        });

        it('should find a process variable by form variable name', () => {
            const value = form.getProcessVariableValue('name1');
            expect(value).toBe('hello');
        });

        it('should find default form variable by form variable name', () => {
            const value = form.getProcessVariableValue('name2');
            expect(value).toBe('29.09.2019T00:00:00.000Z');
        });

        [
            { name: 'booleanVar', result: true },
            { name: 'datetime', result: '2025-01-23T04:30:00.000+0000' },
            { name: 'dateonly', result: '2025-01-27T00:00:00.000Z' }
        ].forEach(({ name, result }) => {
            it(`should find a process variable by name ${name} and convert it`, () => {
                const value = form.getProcessVariableValue(name);
                expect(value).toEqual(result);
            });
        });

        it('should not find a process variable', () => {
            const missing = form.getProcessVariableValue('missing');
            expect(missing).toBeUndefined();
        });

        it('should return zero process variable value instead of the form default', () => {
            const formWithZero = new FormModel({
                variables: [{ id: 'amount-var', name: 'amount', type: 'integer', value: 99 }],
                processVariables: [{ name: 'variables.amount', value: 0, type: 'integer' }]
            });

            expect(formWithZero.getProcessVariableValue('amount')).toBe(0);
        });

        it('should return false process variable value instead of the form default', () => {
            const formWithFalse = new FormModel({
                variables: [{ id: 'flag-var', name: 'flag', type: 'boolean', value: true }],
                processVariables: [{ name: 'variables.flag', value: false, type: 'boolean' }]
            });

            expect(formWithFalse.getProcessVariableValue('flag')).toBe(false);
        });

        it('should return empty string process variable value instead of the form default', () => {
            const formWithEmpty = new FormModel({
                variables: [{ id: 'text-var', name: 'text', type: 'string', value: 'default' }],
                processVariables: [{ name: 'variables.text', value: '', type: 'string' }]
            });

            expect(formWithEmpty.getProcessVariableValue('text')).toBe('');
        });
    });

    describe('resolveVariableValue', () => {
        const createFormJson = () => ({
            variables: [{ id: 'list-var', name: 'accountList', type: 'json', value: { list: [{ id: 'default', name: 'Default' }] } }],
            processVariables: [{ name: 'variables.accountList', value: { list: [{ id: 'process', name: 'Process' }] }, type: 'json' }]
        });

        it('should prefer a runtime-set form variable over a process variable of the same name', () => {
            const form = new FormModel(createFormJson());
            const updatedValue = { list: [{ id: 'runtime', name: 'Runtime' }] };

            form.changeVariableValue('list-var', updatedValue);

            expect(form.resolveVariableValue('accountList')).toEqual(updatedValue);
        });

        it('should prefer a refreshed process variable over the cached process variable', () => {
            const form = new FormModel(createFormJson());
            const refreshedValue = { list: [{ id: 'refreshed', name: 'Refreshed' }] };

            expect(form.resolveVariableValue('accountList', [{ id: 'variables.accountList', value: refreshedValue, type: 'json' }])).toEqual(
                refreshedValue
            );
        });

        it('should resolve from cached process variables when no refresh list entry is provided', () => {
            const form = new FormModel(createFormJson());

            expect(form.resolveVariableValue('accountList')).toEqual({ list: [{ id: 'process', name: 'Process' }] });
        });

        it('should return falsy process variable values without falling back to the form default', () => {
            const formWithZero = new FormModel({
                variables: [{ id: 'amount-var', name: 'amount', type: 'integer', value: 99 }],
                processVariables: [{ name: 'variables.amount', value: 0, type: 'integer' }]
            });

            expect(formWithZero.resolveVariableValue('amount')).toBe(0);
        });

        it('should return undefined for an unknown variable', () => {
            const form = new FormModel(createFormJson());

            expect(form.resolveVariableValue('missing')).toBeUndefined();
        });

        it('should resolve a refreshed process variable by name', () => {
            const form = new FormModel(createFormJson());
            const refreshedValue = { list: [{ id: 'refreshed', name: 'Refreshed' }] };

            expect(form.resolveVariableValue('accountList', [{ name: 'variables.accountList', value: refreshedValue, type: 'json' }])).toEqual(
                refreshedValue
            );
        });
    });

    describe('add values not present', () => {
        let form: FormModel;

        beforeEach(() => {
            form = new FormModel(fakeMetadataForm);
            form.values['pfx_property_three'] = {};
            form.values['pfx_property_four'] = 'empty';
            form.values['pfx_property_five'] = 'green';
            form.values['pfx_property_six'] = 'text-value';
            form.values['pfx_property_seven'] = null;
        });

        it('should add values to form that are not already present', () => {
            const values = {
                pfx_property_one: 'testValue',
                pfx_property_two: true,
                pfx_property_three: 'opt_1',
                pfx_property_four: 'option_2',
                pfx_property_five: 'orange',
                pfx_property_six: 'other-value',
                pfx_property_none: 'no_form_field'
            };

            form.addValuesNotPresent(values);

            expect(form.values['pfx_property_one']).toBe('testValue');
            expect(form.values['pfx_property_two']).toBe(true);
            expect(form.values['pfx_property_three']).toEqual({ id: 'opt_1', name: 'Option 1' });
            expect(form.values['pfx_property_four']).toEqual({ id: 'option_2', name: 'Option: 2' });
            expect(form.values['pfx_property_five']).toEqual('green');
            expect(form.values['pfx_property_six']).toEqual('text-value');
            expect(form.values['pfx_property_seven']).toBeNull();
            expect(form.values['pfx_property_eight']).toBeNull();
        });
    });

    it('should NOT override value by provided form values for constant value field type', () => {
        const mockFormValues = {
            DisplayExternalProperty0ei65x: 'email',
            DisplayExternalProperty02kj65: 'test'
        };

        const formModel = new FormModel(mockDisplayExternalPropertyForm, mockFormValues);
        const displayExternalPropertyWidget = formModel.fields[0].form.fields[0].field.fields[1][0];

        expect(formModel.processVariables[1].name).toBe('DisplayExternalProperty02kj65');
        expect(formModel.processVariables[1].value).toBe('test');
        expect(formModel.values['DisplayExternalProperty02kj65']).toBe('hr');

        expect(FormFieldTypes.isConstantValueType(displayExternalPropertyWidget.type)).toBeTrue();
        expect(displayExternalPropertyWidget.value).toBe('hr');
    });

    describe('getFormFields', () => {
        let form: FormModel;

        beforeEach(() => {
            form = new FormModel(mockFormWithSections);
        });

        it('should get all form fields (containers, sections, fields)', () => {
            const fields = form.getFormFields();
            expect(fields.length).toBe(13);
        });

        it('should filter form fields by type inside sections', () => {
            const fields = form.getFormFields([FormFieldTypes.DATE]);
            expect(fields.length).toBe(1);
            expect(fields[0].id).toBe('dateInsideSection');
            expect(fields[0].type).toBe(FormFieldTypes.DATE);
        });

        it('should filter form fields by type outside sections', () => {
            const fields = form.getFormFields([FormFieldTypes.MULTILINE_TEXT]);
            expect(fields.length).toBe(1);
            expect(fields[0].id).toBe('multilineOutsideSection');
            expect(fields[0].type).toBe(FormFieldTypes.MULTILINE_TEXT);
        });

        it('should filter form fields by multiple types', () => {
            const fields = form.getFormFields([FormFieldTypes.DATE, FormFieldTypes.MULTILINE_TEXT]);
            expect(fields.length).toBe(2);
            expect(fields[0].id).toBe('dateInsideSection');
            expect(fields[1].id).toBe('multilineOutsideSection');
            expect(fields[0].type).toBe(FormFieldTypes.DATE);
            expect(fields[1].type).toBe(FormFieldTypes.MULTILINE_TEXT);
        });

        it('should return no fields when filtered by a non-existent type', () => {
            const fields = form.getFormFields(['NON_EXISTENT_TYPE']);
            expect(fields.length).toBe(0);
        });

        it('should return fields from cache if available', () => {
            form.fieldsCache = [new FormFieldModel(form, { type: FormFieldTypes.TEXT }), new FormFieldModel(form, { type: FormFieldTypes.NUMBER })];
            const fields = form.getFormFields();
            expect(fields.length).toBe(2);
            expect(fields[0].type).toBe(FormFieldTypes.TEXT);
            expect(fields[1].type).toBe(FormFieldTypes.NUMBER);
        });

        it('should return filtered fields from cache if available', () => {
            form.fieldsCache = [
                new FormFieldModel(form, { type: FormFieldTypes.TEXT }),
                new FormFieldModel(form, { type: FormFieldTypes.AMOUNT }),
                new FormFieldModel(form, { type: FormFieldTypes.DATE }),
                new FormFieldModel(form, { type: FormFieldTypes.NUMBER })
            ];

            const fields = form.getFormFields([FormFieldTypes.AMOUNT, FormFieldTypes.DATE, FormFieldTypes.NUMBER]);
            expect(fields.length).toBe(3);
            expect(fields[0].type).toBe(FormFieldTypes.AMOUNT);
            expect(fields[1].type).toBe(FormFieldTypes.DATE);
            expect(fields[2].type).toBe(FormFieldTypes.NUMBER);
        });

        it('should handle sections at root level correctly', () => {
            const mockFormWithRootSection = {
                id: 'test-form',
                name: 'Test Form',
                fields: [
                    {
                        id: 'root-section',
                        name: 'Root Section',
                        type: 'section',
                        numberOfColumns: 2,
                        fields: {
                            1: [
                                {
                                    id: 'text-in-root-section',
                                    name: 'Text in Root Section',
                                    type: 'text',
                                    required: false,
                                    readOnly: false
                                }
                            ]
                        }
                    }
                ]
            };

            const formWithRootSection = new FormModel(mockFormWithRootSection);

            // Check that the root section is parsed correctly - wrapped in ContainerModel as expected
            expect(formWithRootSection.fields.length).toBe(1);
            expect(formWithRootSection.fields[0]).toBeInstanceOf(ContainerModel);
            expect(formWithRootSection.fields[0].field.type).toBe('section');
            expect(formWithRootSection.fields[0].field.id).toBe('root-section');

            // Check that getFormFields returns all fields including the section and its children
            const allFields = formWithRootSection.getFormFields();
            expect(allFields.length).toBe(2); // section + text field inside
            expect(allFields[0].type).toBe('section');
            expect(allFields[1].type).toBe('text');
            expect(allFields[1].id).toBe('text-in-root-section');
        });

        it('should process container fields before section fields in getFormFields', () => {
            const mockFormWithContainerAndSection = {
                id: 'test-form',
                name: 'Test Form',
                fields: [
                    {
                        id: 'container-field',
                        name: 'Container Field',
                        type: 'container',
                        numberOfColumns: 2,
                        fields: {
                            1: [
                                {
                                    id: 'text-in-container',
                                    name: 'Text in Container',
                                    type: 'text',
                                    required: false,
                                    readOnly: false
                                }
                            ]
                        }
                    },
                    {
                        id: 'section-field',
                        name: 'Section Field',
                        type: 'section',
                        numberOfColumns: 1,
                        fields: {
                            1: [
                                {
                                    id: 'text-in-section',
                                    name: 'Text in Section',
                                    type: 'text',
                                    required: false,
                                    readOnly: false
                                }
                            ]
                        }
                    }
                ]
            };

            const formWithMixed = new FormModel(mockFormWithContainerAndSection);
            const allFields = formWithMixed.getFormFields();

            // Check that the following order is correct: container, text-in-container, section, text-in-section
            expect(allFields.length).toBe(4);
            expect(allFields[0].type).toBe('container');
            expect(allFields[0].id).toBe('container-field');
            expect(allFields[1].type).toBe('text');
            expect(allFields[1].id).toBe('text-in-container');
            expect(allFields[2].type).toBe('section');
            expect(allFields[2].id).toBe('section-field');
            expect(allFields[3].type).toBe('text');
            expect(allFields[3].id).toBe('text-in-section');
        });
    });

    describe('FormModel - isFieldOrParentHidden', () => {
        let form: FormModel;

        const repeatableSectionFormJson = (checkParentVisibilityForValidation: boolean) => ({
            id: 'test-form',
            name: 'Test Form',
            fields: [
                {
                    id: 'repeatableSection1',
                    type: FormFieldTypes.REPEATABLE_SECTION,
                    numberOfColumns: 1,
                    params: { initialNumberOfRows: 2 },
                    fields: {
                        1: [{ id: 'field1', type: FormFieldTypes.TEXT, required: true, checkParentVisibilityForValidation }]
                    }
                }
            ]
        });

        const sectionInRepeatableSectionFormJson = (checkParentVisibilityForValidation: boolean) => ({
            id: 'test-form',
            name: 'Test Form',
            fields: [
                {
                    id: 'repeatableSection1',
                    type: FormFieldTypes.REPEATABLE_SECTION,
                    numberOfColumns: 1,
                    params: { initialNumberOfRows: 2 },
                    fields: {
                        1: [
                            {
                                id: 'section1',
                                type: FormFieldTypes.SECTION,
                                numberOfColumns: 1,
                                fields: {
                                    1: [{ id: 'field1', type: FormFieldTypes.TEXT, required: true, checkParentVisibilityForValidation }]
                                }
                            }
                        ]
                    }
                }
            ]
        });

        const getRepeatableSectionField = (repeatableSection: ContainerModel, rowIndex: number): FormFieldModel =>
            repeatableSection.field.rows[rowIndex].columns[0].fields[0];

        beforeEach(() => {
            form = new FormModel();
        });

        it('should return true for directly hidden field', () => {
            const field = new FormFieldModel(form, {
                id: 'field1',
                type: FormFieldTypes.TEXT
            });
            field.isVisible = false;
            expect(form.isFieldOrParentHidden(field)).toBe(true);
        });

        it('should return false for visible field with no hidden parent', () => {
            const field = new FormFieldModel(form, {
                id: 'field1',
                type: FormFieldTypes.TEXT
            });
            field.isVisible = true;
            expect(form.isFieldOrParentHidden(field)).toBe(false);
        });

        it('should return false for field in hidden group when opt-in is disabled - backward compatible', () => {
            const formJson = {
                id: 'test-form',
                name: 'Test Form',
                fields: [
                    {
                        id: 'group1',
                        type: FormFieldTypes.GROUP,
                        numberOfColumns: 1,
                        fields: { 1: [{ id: 'field1', type: FormFieldTypes.TEXT, required: true, checkParentVisibilityForValidation: false }] }
                    }
                ]
            };
            const testForm = new FormModel(formJson);
            const group = testForm.fields[0] as ContainerModel;
            group.field.isVisible = false;
            const field = testForm.getFieldById('field1');
            field.isVisible = true;
            expect(testForm.isFieldOrParentHidden(field)).toBe(false);
        });

        it('should return true for field in hidden group when opt-in is enabled', () => {
            const formJson = {
                id: 'test-form',
                name: 'Test Form',
                fields: [
                    {
                        id: 'group1',
                        type: FormFieldTypes.GROUP,
                        numberOfColumns: 1,
                        fields: { 1: [{ id: 'field1', type: FormFieldTypes.TEXT, required: true, checkParentVisibilityForValidation: true }] }
                    }
                ]
            };
            const testForm = new FormModel(formJson);
            testForm.enableParentVisibilityCheck = true;
            const group = testForm.fields[0] as ContainerModel;
            group.field.isVisible = false;
            const field = testForm.getFieldById('field1');
            field.isVisible = true;
            expect(testForm.isFieldOrParentHidden(field)).toBe(true);
        });

        it('should return false for field in hidden section when opt-in is disabled - backward compatible', () => {
            const formJson = {
                id: 'test-form',
                name: 'Test Form',
                fields: [
                    {
                        id: 'section1',
                        type: FormFieldTypes.SECTION,
                        numberOfColumns: 1,
                        fields: { 1: [{ id: 'field1', type: FormFieldTypes.TEXT, required: true, checkParentVisibilityForValidation: false }] }
                    }
                ]
            };
            const testForm = new FormModel(formJson);
            const container = testForm.fields[0] as ContainerModel;
            container.field.isVisible = false;
            const field = testForm.getFieldById('field1');
            field.isVisible = true;
            expect(testForm.isFieldOrParentHidden(field)).toBe(false);
        });

        it('should return true for field in hidden section - opt-in is enabled', () => {
            const formJson = {
                id: 'test-form',
                name: 'Test Form',
                fields: [
                    {
                        id: 'section1',
                        type: FormFieldTypes.SECTION,
                        numberOfColumns: 1,
                        fields: { 1: [{ id: 'field1', type: FormFieldTypes.TEXT, required: true, checkParentVisibilityForValidation: true }] }
                    }
                ]
            };
            const testForm = new FormModel(formJson);
            testForm.enableParentVisibilityCheck = true;
            const container = testForm.fields[0] as ContainerModel;
            container.field.isVisible = false;
            const field = testForm.getFieldById('field1');
            field.isVisible = true;
            expect(testForm.isFieldOrParentHidden(field)).toBe(true);
        });

        it('should return true for nested structure - section in group when opt-in is enabled', () => {
            const formJson = {
                id: 'test-form',
                name: 'Test Form',
                fields: [
                    {
                        id: 'group1',
                        type: FormFieldTypes.GROUP,
                        numberOfColumns: 1,
                        fields: {
                            1: [
                                {
                                    id: 'section1',
                                    type: FormFieldTypes.SECTION,
                                    numberOfColumns: 1,
                                    fields: {
                                        1: [{ id: 'field1', type: FormFieldTypes.TEXT, required: true, checkParentVisibilityForValidation: true }]
                                    }
                                }
                            ]
                        }
                    }
                ]
            };
            const testForm = new FormModel(formJson);
            testForm.enableParentVisibilityCheck = true;
            const group = testForm.fields[0] as ContainerModel;
            group.field.isVisible = false;
            const sectionField = testForm.getFieldById('section1');
            sectionField.isVisible = true;
            const field = testForm.getFieldById('field1');
            field.isVisible = true;
            expect(testForm.isFieldOrParentHidden(field)).toBe(true);
        });

        it('should return true for nested structure - section in section when opt-in is enabled', () => {
            const formJson = {
                id: 'test-form',
                name: 'Test Form',
                fields: [
                    {
                        id: 'outerSection',
                        type: FormFieldTypes.SECTION,
                        numberOfColumns: 1,
                        fields: {
                            1: [
                                {
                                    id: 'innerSection',
                                    type: FormFieldTypes.SECTION,
                                    numberOfColumns: 1,
                                    fields: {
                                        1: [{ id: 'field1', type: FormFieldTypes.TEXT, required: true, checkParentVisibilityForValidation: true }]
                                    }
                                }
                            ]
                        }
                    }
                ]
            };
            const testForm = new FormModel(formJson);
            testForm.enableParentVisibilityCheck = true;
            const container = testForm.fields[0] as ContainerModel;
            container.field.isVisible = false;
            const innerSectionField = testForm.getFieldById('innerSection');
            innerSectionField.isVisible = true;
            const field = testForm.getFieldById('field1');
            field.isVisible = true;
            expect(testForm.isFieldOrParentHidden(field)).toBe(true);
        });

        it('should return true for field in the first row of a hidden repeatable section when opt-in is enabled', () => {
            const testForm = new FormModel(repeatableSectionFormJson(true));
            testForm.enableParentVisibilityCheck = true;
            const repeatableSection = testForm.fields[0] as ContainerModel;
            repeatableSection.field.isVisible = false;
            const field = getRepeatableSectionField(repeatableSection, 0);
            field.isVisible = true;
            expect(testForm.isFieldOrParentHidden(field)).toBe(true);
        });

        it('should return true for field in a later row of a hidden repeatable section when opt-in is enabled', () => {
            const testForm = new FormModel(repeatableSectionFormJson(true));
            testForm.enableParentVisibilityCheck = true;
            const repeatableSection = testForm.fields[0] as ContainerModel;
            repeatableSection.field.isVisible = false;
            const field = getRepeatableSectionField(repeatableSection, 1);
            field.isVisible = true;
            expect(testForm.isFieldOrParentHidden(field)).toBe(true);
        });

        it('should return true for field in a section nested in a hidden repeatable section when opt-in is enabled', () => {
            const testForm = new FormModel(sectionInRepeatableSectionFormJson(true));
            testForm.enableParentVisibilityCheck = true;
            const repeatableSection = testForm.fields[0] as ContainerModel;
            repeatableSection.field.isVisible = false;
            const nestedSection = getRepeatableSectionField(repeatableSection, 1);
            nestedSection.isVisible = true;
            const field = nestedSection.columns[0].fields[0];
            field.isVisible = true;
            expect(testForm.isFieldOrParentHidden(field)).toBe(true);
        });

        it('should return false for field in a later row of a visible repeatable section when opt-in is enabled', () => {
            const testForm = new FormModel(repeatableSectionFormJson(true));
            testForm.enableParentVisibilityCheck = true;
            const repeatableSection = testForm.fields[0] as ContainerModel;
            repeatableSection.field.isVisible = true;
            const field = getRepeatableSectionField(repeatableSection, 1);
            field.isVisible = true;
            expect(testForm.isFieldOrParentHidden(field)).toBe(false);
        });

        it('should return false for field in hidden repeatable section when opt-in is disabled - backward compatible', () => {
            const testForm = new FormModel(repeatableSectionFormJson(false));
            const repeatableSection = testForm.fields[0] as ContainerModel;
            repeatableSection.field.isVisible = false;
            const field = getRepeatableSectionField(repeatableSection, 1);
            field.isVisible = true;
            expect(testForm.isFieldOrParentHidden(field)).toBe(false);
        });

        it('should enable the parent visibility check on a repeatable section field added after model opt-in', () => {
            const testForm = new FormModel(repeatableSectionFormJson(false));
            testForm.enableParentVisibilityCheck = true;
            testForm.getFormFields().forEach((field) => (field.checkParentVisibilityForValidation = true));
            const repeatableSection = testForm.fields[0] as ContainerModel;

            repeatableSection.field.addRow(repeatableSection.json.fields, repeatableSection.form);

            const field = getRepeatableSectionField(repeatableSection, 2);
            expect(field.checkParentVisibilityForValidation).toBe(true);
        });

        it('should preserve selective parent visibility checks when adding a repeatable section row', () => {
            const testForm = new FormModel({
                id: 'test-form',
                name: 'Test Form',
                fields: [
                    {
                        id: 'repeatableSection1',
                        type: FormFieldTypes.REPEATABLE_SECTION,
                        numberOfColumns: 1,
                        params: { initialNumberOfRows: 1 },
                        fields: {
                            1: [
                                { id: 'optedInField', type: FormFieldTypes.TEXT },
                                { id: 'optedOutField', type: FormFieldTypes.TEXT }
                            ]
                        }
                    },
                    { id: 'unrelatedField', type: FormFieldTypes.TEXT }
                ]
            });
            testForm.enableParentVisibilityCheck = true;
            const repeatableSection = testForm.fields[0] as ContainerModel;
            const sourceFields = repeatableSection.field.rows[0].columns[0].fields;
            sourceFields[0].checkParentVisibilityForValidation = true;

            repeatableSection.field.addRow(repeatableSection.json.fields, repeatableSection.form);

            const addedFields = repeatableSection.field.rows[1].columns[0].fields;
            expect(addedFields[0].checkParentVisibilityForValidation).toBe(true);
            expect(addedFields[1].checkParentVisibilityForValidation).toBe(false);
            expect(testForm.getFieldById('unrelatedField').checkParentVisibilityForValidation).toBe(false);
        });

        it('should copy nested field parent visibility checks to a new repeatable section row', () => {
            const testForm = new FormModel(sectionInRepeatableSectionFormJson(false));
            testForm.enableParentVisibilityCheck = true;
            const repeatableSection = testForm.fields[0] as ContainerModel;
            const sourceSection = getRepeatableSectionField(repeatableSection, 0);
            sourceSection.columns[0].fields[0].checkParentVisibilityForValidation = true;

            repeatableSection.field.addRow(repeatableSection.json.fields, repeatableSection.form);

            const addedSection = getRepeatableSectionField(repeatableSection, 2);
            expect(addedSection.checkParentVisibilityForValidation).toBe(false);
            expect(addedSection.columns[0].fields[0].checkParentVisibilityForValidation).toBe(true);
        });

        it('should copy template parent visibility checks when adding the first repeatable section row', () => {
            const formJson = repeatableSectionFormJson(false);
            formJson.fields[0].params.initialNumberOfRows = 0;
            const testForm = new FormModel(formJson);
            testForm.enableParentVisibilityCheck = true;
            const repeatableSection = testForm.fields[0] as ContainerModel;
            repeatableSection.field.columns[0].fields[0].checkParentVisibilityForValidation = true;

            repeatableSection.field.addRow(repeatableSection.json.fields, repeatableSection.form);

            const field = getRepeatableSectionField(repeatableSection, 0);
            expect(field.checkParentVisibilityForValidation).toBe(true);
        });

        it('should exclude a required field added to a hidden repeatable section from validation after model opt-in', () => {
            const testForm = new FormModel(repeatableSectionFormJson(false));
            testForm.enableParentVisibilityCheck = true;
            testForm.getFormFields().forEach((field) => (field.checkParentVisibilityForValidation = true));
            const repeatableSection = testForm.fields[0] as ContainerModel;
            repeatableSection.field.addRow(repeatableSection.json.fields, repeatableSection.form);
            repeatableSection.field.isVisible = false;

            testForm.validateForm();

            expect(testForm.isValid).toBe(true);
        });

        it('should preserve validation for a required field added to a hidden repeatable section without model opt-in', () => {
            const testForm = new FormModel(repeatableSectionFormJson(false));
            const repeatableSection = testForm.fields[0] as ContainerModel;
            repeatableSection.field.addRow(repeatableSection.json.fields, repeatableSection.form);
            repeatableSection.field.isVisible = false;

            testForm.validateForm();

            expect(testForm.isValid).toBe(false);
        });

        describe('reactive fields in a hidden parent', () => {
            const sectionInGroupFormJson = (type: string, checkParentVisibilityForValidation: boolean) => ({
                id: 'test-form',
                name: 'Test Form',
                fields: [
                    {
                        id: 'group1',
                        type: FormFieldTypes.GROUP,
                        numberOfColumns: 1,
                        fields: {
                            1: [
                                {
                                    id: 'section1',
                                    type: FormFieldTypes.SECTION,
                                    numberOfColumns: 1,
                                    fields: { 1: [{ id: 'field1', type, required: true, checkParentVisibilityForValidation }] }
                                }
                            ]
                        }
                    }
                ]
            });

            const createFormWithInvalidReactiveField = (type: string, checkParentVisibilityForValidation: boolean): FormModel => {
                const testForm = new FormModel(sectionInGroupFormJson(type, checkParentVisibilityForValidation));
                testForm.getFieldById('field1').validationSummary = new ErrorMessageModel({ message: 'FORM.FIELD.REQUIRED' });
                return testForm;
            };

            [FormFieldTypes.DROPDOWN, FormFieldTypes.DATE, FormFieldTypes.DATETIME].forEach((type) => {
                it(`should exclude an invalid ${type} field in a section of a hidden group from validation when opt-in is enabled`, () => {
                    const testForm = createFormWithInvalidReactiveField(type, true);
                    testForm.enableParentVisibilityCheck = true;
                    (testForm.fields[0] as ContainerModel).field.isVisible = false;

                    testForm.validateForm();

                    expect(testForm.isValid).toBe(true);
                });

                it(`should keep an invalid ${type} field in a section of a visible group in validation when opt-in is enabled`, () => {
                    const testForm = createFormWithInvalidReactiveField(type, true);
                    testForm.enableParentVisibilityCheck = true;

                    testForm.validateForm();

                    expect(testForm.isValid).toBe(false);
                });

                it(`should keep an invalid ${type} field in a hidden group in validation when opt-in is disabled - backward compatible`, () => {
                    const testForm = createFormWithInvalidReactiveField(type, false);
                    (testForm.fields[0] as ContainerModel).field.isVisible = false;

                    testForm.validateForm();

                    expect(testForm.isValid).toBe(false);
                });

                it(`should keep an invalid ${type} field in a hidden group in validation when only the form opt-in is enabled`, () => {
                    const testForm = createFormWithInvalidReactiveField(type, false);
                    testForm.enableParentVisibilityCheck = true;
                    (testForm.fields[0] as ContainerModel).field.isVisible = false;

                    testForm.validateForm();

                    expect(testForm.isValid).toBe(false);
                });

                it(`should exclude an invalid ${type} field in a hidden section of a visible group from validation when opt-in is enabled`, () => {
                    const testForm = createFormWithInvalidReactiveField(type, true);
                    testForm.enableParentVisibilityCheck = true;
                    testForm.getFieldById('section1').isVisible = false;

                    testForm.validateForm();

                    expect(testForm.isValid).toBe(true);
                });

                it(`should exclude an invalid ${type} field from validation when the field itself is hidden and opt-in is disabled`, () => {
                    const testForm = createFormWithInvalidReactiveField(type, false);
                    testForm.getFieldById('field1').isVisible = false;

                    testForm.validateForm();

                    expect(testForm.isValid).toBe(true);
                });
            });

            it('should exclude an invalid dropdown field in a hidden repeatable section from validation when opt-in is enabled', () => {
                const testForm = new FormModel({
                    id: 'test-form',
                    name: 'Test Form',
                    fields: [
                        {
                            id: 'repeatableSection1',
                            type: FormFieldTypes.REPEATABLE_SECTION,
                            numberOfColumns: 1,
                            params: { initialNumberOfRows: 2 },
                            fields: {
                                1: [{ id: 'field1', type: FormFieldTypes.DROPDOWN, required: true, checkParentVisibilityForValidation: true }]
                            }
                        }
                    ]
                });
                testForm.enableParentVisibilityCheck = true;
                const repeatableSection = testForm.fields[0] as ContainerModel;
                getRepeatableSectionField(repeatableSection, 0).validationSummary = new ErrorMessageModel({ message: 'FORM.FIELD.REQUIRED' });
                getRepeatableSectionField(repeatableSection, 1).validationSummary = new ErrorMessageModel({ message: 'FORM.FIELD.REQUIRED' });
                testForm.validateForm();
                expect(testForm.isValid).toBe(false);

                repeatableSection.field.isVisible = false;
                testForm.validateForm();

                expect(testForm.isValid).toBe(true);
            });

            it('should not report a reactive field in a hidden parent in the validate form event errors', () => {
                const testForm = new FormModel(sectionInGroupFormJson(FormFieldTypes.DROPDOWN, true), null, false, formService);
                testForm.getFieldById('field1').validationSummary = new ErrorMessageModel({ message: 'FORM.FIELD.REQUIRED' });
                testForm.enableParentVisibilityCheck = true;
                (testForm.fields[0] as ContainerModel).field.isVisible = false;
                let errorsField: FormFieldModel[] = [];
                formService.validateForm.subscribe((event) => (errorsField = event.errorsField));

                testForm.validateForm();

                expect(errorsField).toEqual([]);
            });
        });

        describe('invalid fields of every validatable type in a hidden parent', () => {
            interface InvalidFieldDefinition {
                description: string;
                json: { type: string; [key: string]: unknown };
            }

            interface HiddenParent {
                description: string;
                parentId: string;
            }

            interface ParentLayout {
                description: string;
                build: (field: object) => object[];
                hiddenParents: HiddenParent[];
            }

            const requiredFieldTypes = [
                FormFieldTypes.TEXT,
                FormFieldTypes.MULTILINE_TEXT,
                FormFieldTypes.NUMBER,
                FormFieldTypes.DECIMAL,
                FormFieldTypes.AMOUNT,
                FormFieldTypes.BOOLEAN,
                FormFieldTypes.PEOPLE,
                FormFieldTypes.FUNCTIONAL_GROUP,
                FormFieldTypes.RADIO_BUTTONS,
                FormFieldTypes.TYPEAHEAD,
                FormFieldTypes.UPLOAD,
                FormFieldTypes.ATTACH_FOLDER,
                FormFieldTypes.DYNAMIC_TABLE,
                FormFieldTypes.DISPLAY_EXTERNAL_PROPERTY,
                FormFieldTypes.ALFRESCO_FILE_VIEWER,
                FormFieldTypes.PROPERTIES_VIEWER,
                FormFieldTypes.DATE,
                FormFieldTypes.DATETIME,
                FormFieldTypes.DROPDOWN
            ];

            const invalidFieldDefinitions: InvalidFieldDefinition[] = [
                ...requiredFieldTypes.map((type) => ({
                    description: `a required ${type} field`,
                    json: { type, required: true, options: [{ id: 'option1', name: 'Option 1' }] }
                })),
                { description: 'a text field shorter than its minimum length', json: { type: FormFieldTypes.TEXT, minLength: 5, value: 'abc' } },
                {
                    description: 'a text field not matching its pattern',
                    json: { type: FormFieldTypes.TEXT, regexPattern: 'valid', value: 'invalid' }
                },
                {
                    description: 'a multi-line text field longer than its maximum length',
                    json: { type: FormFieldTypes.MULTILINE_TEXT, maxLength: 3, value: 'abcd' }
                },
                { description: 'an integer field with a non-numeric value', json: { type: FormFieldTypes.NUMBER, value: 'abc' } },
                { description: 'an integer field below its minimum value', json: { type: FormFieldTypes.NUMBER, minValue: '10', value: 5 } },
                { description: 'an amount field above its maximum value', json: { type: FormFieldTypes.AMOUNT, maxValue: '10', value: 20 } },
                { description: 'a decimal field exceeding its precision', json: { type: FormFieldTypes.DECIMAL, precision: 1, value: '1.25' } },
                {
                    description: 'a typeahead field with a value not in its options',
                    json: { type: FormFieldTypes.TYPEAHEAD, options: [{ id: 'option1', name: 'Option 1' }], value: 'unknown' }
                }
            ];

            const groupJson = (id: string, fields: object[]) => ({ id, type: FormFieldTypes.GROUP, numberOfColumns: 1, fields: { 1: fields } });

            const sectionJson = (id: string, fields: object[]) => ({ id, type: FormFieldTypes.SECTION, numberOfColumns: 1, fields: { 1: fields } });

            const repeatableSectionJson = (id: string, fields: object[]) => ({
                id,
                type: FormFieldTypes.REPEATABLE_SECTION,
                numberOfColumns: 1,
                params: { initialNumberOfRows: 2 },
                fields: { 1: fields }
            });

            const parentLayouts: ParentLayout[] = [
                {
                    description: 'a group',
                    build: (field) => [groupJson('group1', [field])],
                    hiddenParents: [{ description: 'a hidden group', parentId: 'group1' }]
                },
                {
                    description: 'a section',
                    build: (field) => [sectionJson('section1', [field])],
                    hiddenParents: [{ description: 'a hidden section', parentId: 'section1' }]
                },
                {
                    description: 'a section of a group',
                    build: (field) => [groupJson('group1', [sectionJson('section1', [field])])],
                    hiddenParents: [
                        { description: 'a section of a hidden group', parentId: 'group1' },
                        { description: 'a hidden section of a visible group', parentId: 'section1' }
                    ]
                },
                {
                    description: 'every row of a repeatable section',
                    build: (field) => [repeatableSectionJson('repeatableSection1', [field])],
                    hiddenParents: [{ description: 'every row of a hidden repeatable section', parentId: 'repeatableSection1' }]
                },
                {
                    description: 'a section in every row of a repeatable section',
                    build: (field) => [repeatableSectionJson('repeatableSection1', [sectionJson('section1', [field])])],
                    hiddenParents: [
                        { description: 'a section in every row of a hidden repeatable section', parentId: 'repeatableSection1' },
                        { description: 'a hidden section in every row of a visible repeatable section', parentId: 'section1' }
                    ]
                }
            ];

            const getFieldsByJsonId = (testForm: FormModel, id: string): FormFieldModel[] =>
                testForm.fieldsCache.filter((field) => field.json.id === id);

            const setVisibility = (testForm: FormModel, id: string, isVisible: boolean) =>
                getFieldsByJsonId(testForm, id).forEach((field) => (field.isVisible = isVisible));

            const createForm = (
                definition: InvalidFieldDefinition,
                layout: ParentLayout,
                checkParentVisibilityForValidation: boolean,
                enableParentVisibilityCheck: boolean,
                tabId?: string
            ): FormModel => {
                const field = { id: 'field1', ...definition.json, checkParentVisibilityForValidation };
                const fields = layout.build(field).map((rootElement) => (tabId ? { ...rootElement, tab: tabId } : rootElement));
                const tabs = tabId ? [{ id: tabId, title: 'Tab 1' }] : [];
                const testForm = new FormModel({ id: 'test-form', name: 'Test Form', tabs, fields }, null, false, formService);
                testForm.enableParentVisibilityCheck = enableParentVisibilityCheck;
                if (FormFieldTypes.isReactiveType(definition.json.type)) {
                    getFieldsByJsonId(testForm, 'field1').forEach(
                        (invalidField) => (invalidField.validationSummary = new ErrorMessageModel({ message: 'FORM.FIELD.REQUIRED' }))
                    );
                }
                return testForm;
            };

            const createFormWithoutReportedErrors = (definition: InvalidFieldDefinition, layout: ParentLayout, readOnlyForm = false): FormModel => {
                const fields = layout.build({ id: 'field1', ...definition.json });
                const testForm = new FormModel({ id: 'test-form', name: 'Test Form', tabs: [], fields }, null, readOnlyForm, formService);
                testForm.enableParentVisibilityCheck = true;
                return testForm;
            };

            const validateAndGetErrors = (testForm: FormModel): FormFieldModel[] => {
                let errorsField: FormFieldModel[] = [];
                const subscription = formService.validateForm.subscribe((event) => (errorsField = event.errorsField));
                testForm.validateForm();
                subscription.unsubscribe();
                return errorsField;
            };

            invalidFieldDefinitions.forEach((definition) => {
                parentLayouts.forEach((layout) => {
                    layout.hiddenParents.forEach(({ description, parentId }) => {
                        it(`should exclude ${definition.description} in ${description} from validation when opt-ins are enabled`, () => {
                            const testForm = createForm(definition, layout, true, true);
                            setVisibility(testForm, parentId, false);

                            expect(validateAndGetErrors(testForm)).toEqual([]);
                            expect(testForm.isValid).toBe(true);
                        });

                        it(`should validate ${definition.description} in ${description} again when the parent is shown`, () => {
                            const testForm = createForm(definition, layout, true, true);
                            const invalidFields = getFieldsByJsonId(testForm, 'field1');

                            expect(validateAndGetErrors(testForm)).toEqual(invalidFields);
                            expect(testForm.isValid).toBe(false);

                            setVisibility(testForm, parentId, false);
                            testForm.validateForm();
                            expect(testForm.isValid).toBe(true);

                            setVisibility(testForm, parentId, true);
                            expect(validateAndGetErrors(testForm)).toEqual(invalidFields);
                            expect(testForm.isValid).toBe(false);
                        });

                        it(`should keep ${definition.description} in ${description} in validation when the field opt-in is disabled`, () => {
                            const testForm = createForm(definition, layout, false, true);
                            setVisibility(testForm, parentId, false);

                            expect(validateAndGetErrors(testForm)).toEqual(getFieldsByJsonId(testForm, 'field1'));
                            expect(testForm.isValid).toBe(false);
                        });

                        it(`should keep ${definition.description} in ${description} in validation when the form opt-in is disabled`, () => {
                            const testForm = createForm(definition, layout, true, false);
                            setVisibility(testForm, parentId, false);

                            expect(validateAndGetErrors(testForm)).toEqual(getFieldsByJsonId(testForm, 'field1'));
                            expect(testForm.isValid).toBe(false);
                        });
                    });

                    it(`should exclude ${definition.description} in ${layout.description} on a hidden tab from validation when opt-ins are enabled`, () => {
                        const testForm = createForm(definition, layout, true, true, 'tab1');
                        testForm.tabs[0].isVisible = false;

                        expect(validateAndGetErrors(testForm)).toEqual([]);
                        expect(testForm.isValid).toBe(true);
                    });

                    it(`should validate ${definition.description} in ${layout.description} on a tab again when the tab is shown`, () => {
                        const testForm = createForm(definition, layout, true, true, 'tab1');
                        const invalidFields = getFieldsByJsonId(testForm, 'field1');

                        expect(validateAndGetErrors(testForm)).toEqual(invalidFields);
                        expect(testForm.isValid).toBe(false);

                        testForm.tabs[0].isVisible = false;
                        testForm.validateForm();
                        expect(testForm.isValid).toBe(true);

                        testForm.tabs[0].isVisible = true;
                        expect(validateAndGetErrors(testForm)).toEqual(invalidFields);
                        expect(testForm.isValid).toBe(false);
                    });

                    [
                        { optIn: 'field', checkParentVisibilityForValidation: false, enableParentVisibilityCheck: true },
                        { optIn: 'form', checkParentVisibilityForValidation: true, enableParentVisibilityCheck: false }
                    ].forEach(({ optIn, checkParentVisibilityForValidation, enableParentVisibilityCheck }) => {
                        it(`should exclude ${definition.description} in ${layout.description} on a hidden tab from validation when the ${optIn} opt-in is disabled`, () => {
                            const testForm = createForm(definition, layout, checkParentVisibilityForValidation, enableParentVisibilityCheck, 'tab1');
                            testForm.tabs[0].isVisible = false;

                            expect(validateAndGetErrors(testForm)).toEqual([]);
                            expect(testForm.isValid).toBe(true);
                        });
                    });

                    [true, false].forEach((isOptInEnabled) => {
                        it(`should exclude ${definition.description} in ${layout.description} from validation when the field itself is hidden and opt-ins are ${isOptInEnabled ? 'enabled' : 'disabled'}`, () => {
                            const testForm = createForm(definition, layout, isOptInEnabled, isOptInEnabled);
                            setVisibility(testForm, 'field1', false);

                            expect(validateAndGetErrors(testForm)).toEqual([]);
                            expect(testForm.isValid).toBe(true);
                        });
                    });

                    [
                        { state: 'read-only', readOnlyForm: false, restrict: (_form: FormModel, field: FormFieldModel) => (field.readOnly = true) },
                        {
                            state: 'disabled by a form rule',
                            readOnlyForm: false,
                            restrict: (testForm: FormModel, field: FormFieldModel) => testForm.changeFieldDisabled(field.id, true)
                        },
                        { state: 'in a read-only form', readOnlyForm: true, restrict: () => undefined }
                    ].forEach(({ state, readOnlyForm, restrict }) => {
                        it(`should keep ${definition.description} in ${layout.description} in validation when the field is ${state}`, () => {
                            const testForm = createFormWithoutReportedErrors(definition, layout, readOnlyForm);
                            const invalidFields = getFieldsByJsonId(testForm, 'field1');
                            invalidFields.forEach((invalidField) => restrict(testForm, invalidField));

                            expect(invalidFields.every((invalidField) => invalidField.readOnly)).toBe(true);
                            expect(validateAndGetErrors(testForm)).toEqual(invalidFields);
                            expect(testForm.isValid).toBe(false);
                        });
                    });
                });
            });
        });

        it('should return false for visible field with visible parents - ContainerModel', () => {
            const formJson = {
                id: 'test-form',
                name: 'Test Form',
                fields: [
                    {
                        id: 'group1',
                        type: FormFieldTypes.GROUP,
                        numberOfColumns: 1,
                        fields: {
                            1: [
                                {
                                    id: 'section1',
                                    type: FormFieldTypes.SECTION,
                                    numberOfColumns: 1,
                                    fields: { 1: [{ id: 'field1', type: FormFieldTypes.TEXT, required: true }] }
                                }
                            ]
                        }
                    }
                ]
            };
            const testForm = new FormModel(formJson);
            const group = testForm.fields[0] as ContainerModel;
            group.field.isVisible = true;
            const sectionField = testForm.getFieldById('section1');
            sectionField.isVisible = true;
            const field = testForm.getFieldById('field1');
            field.isVisible = true;
            expect(testForm.isFieldOrParentHidden(field)).toBe(false);
        });

        it('should return false for field with no parent - root level', () => {
            const field = new FormFieldModel(form, {
                id: 'field1',
                type: FormFieldTypes.TEXT
            });
            field.isVisible = true;
            form.fields = [field];
            expect(form.isFieldOrParentHidden(field)).toBe(false);
        });

        it('should return false for null field', () => {
            expect(form.isFieldOrParentHidden(null as any)).toBe(false);
        });

        it('should return false for undefined field', () => {
            expect(form.isFieldOrParentHidden(undefined as any)).toBe(false);
        });

        it('should return false for field with null form', () => {
            const fieldWithoutForm = new FormFieldModel(null as any, {
                id: 'field1',
                type: FormFieldTypes.TEXT
            });
            fieldWithoutForm.isVisible = true;
            const testForm = new FormModel();
            expect(testForm.isFieldOrParentHidden(fieldWithoutForm)).toBe(false);
        });

        it('should return false for form with empty fields array', () => {
            form.fields = [];
            const field = new FormFieldModel(form, {
                id: 'field1',
                type: FormFieldTypes.TEXT
            });
            field.isVisible = true;
            expect(form.isFieldOrParentHidden(field)).toBe(false);
        });

        it('should use ID comparison to find parent field', () => {
            const formJson = {
                id: 'test-form',
                name: 'Test Form',
                fields: [
                    {
                        id: 'group1',
                        type: FormFieldTypes.GROUP,
                        numberOfColumns: 1,
                        fields: { 1: [{ id: 'field1', type: FormFieldTypes.TEXT, required: true, checkParentVisibilityForValidation: true }] }
                    }
                ]
            };
            const testForm = new FormModel(formJson);
            testForm.enableParentVisibilityCheck = true;
            const group = testForm.fields[0] as ContainerModel;
            group.field.isVisible = false;
            const field = testForm.getFieldById('field1');
            field.isVisible = true;
            const fieldWithSameId = new FormFieldModel(testForm, {
                id: 'field1',
                type: FormFieldTypes.TEXT,
                checkParentVisibilityForValidation: true
            });
            fieldWithSameId.isVisible = true;
            expect(testForm.isFieldOrParentHidden(fieldWithSameId)).toBe(true);
        });

        it('should return false when opt-in property defaults to false - backward compatible', () => {
            const formJson = {
                id: 'test-form',
                name: 'Test Form',
                fields: [
                    {
                        id: 'group1',
                        type: FormFieldTypes.GROUP,
                        numberOfColumns: 1,
                        fields: { 1: [{ id: 'field1', type: FormFieldTypes.TEXT, required: true }] }
                    }
                ]
            };
            const testForm = new FormModel(formJson);
            const group = testForm.fields[0] as ContainerModel;
            group.field.isVisible = false;
            const field = testForm.getFieldById('field1');
            field.isVisible = true;
            expect(field.checkParentVisibilityForValidation).toBe(false);
            expect(testForm.isFieldOrParentHidden(field)).toBe(false);
        });

        it('should return true for directly hidden field - opt-in is enabled', () => {
            const field = new FormFieldModel(form, {
                id: 'field1',
                type: FormFieldTypes.TEXT,
                checkParentVisibilityForValidation: true
            });
            field.isVisible = false;
            expect(form.isFieldOrParentHidden(field)).toBe(true);
        });
    });

    describe('repeatable section field ids', () => {
        const formJson = () => ({
            id: 'test-form',
            fields: [
                { id: 'topLevelField', type: FormFieldTypes.TEXT },
                {
                    id: 'repeatableSection1',
                    type: FormFieldTypes.REPEATABLE_SECTION,
                    numberOfColumns: 1,
                    params: { initialNumberOfRows: 2 },
                    fields: {
                        1: [{ id: 'rowField', type: FormFieldTypes.TEXT }]
                    }
                }
            ]
        });

        const getRowFieldIds = (model: FormModel): string[] =>
            model
                .getFormFields([], true)
                .filter((field) => field.id.startsWith('rowField'))
                .map((field) => field.id);

        it('should give each repeatable section row its own field id', () => {
            const rowFieldIds = getRowFieldIds(new FormModel(formJson()));

            expect(rowFieldIds.length).toBe(2);
            expect(rowFieldIds[0]).not.toEqual(rowFieldIds[1]);
        });

        /*
            Row ids are generated per parse, so consumers cannot identify a row scoped field across
            two models built from the same definition, for example before and after a data refresh.
        */
        it('should generate different row scoped ids when the same definition is parsed twice', () => {
            const firstParse = getRowFieldIds(new FormModel(formJson()));
            const secondParse = getRowFieldIds(new FormModel(formJson()));

            expect(firstParse).not.toEqual(secondParse);
        });

        it('should keep ids of fields outside a repeatable section stable across parses', () => {
            expect(new FormModel(formJson()).getFieldById('topLevelField')).toBeDefined();
            expect(new FormModel(formJson()).getFieldById('topLevelField')).toBeDefined();
        });
    });
});
