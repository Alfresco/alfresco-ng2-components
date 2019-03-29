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

import { FormCloudService } from '../services/form-cloud.services';
import { FormCloudModel } from './form-cloud.model';
import { TabModel, FormFieldModel, ContainerModel, FormOutcomeModel, FormFieldTypes, FormFieldValidator, FORM_FIELD_VALIDATORS } from '@alfresco/adf-core';

describe('FormCloudModel', () => {

    let formCloudService: FormCloudService;

    beforeEach(() => {
        formCloudService = new FormCloudService(null, null, null);
    });

    it('should store original json', () => {
        let json = {formRepresentation: {formDefinition: {}}};
        let form = new FormCloudModel(json);
        expect(form.json).toBe(json);
    });

    it('should setup properties with json', () => {
        let json = {formRepresentation: {
            id: '<id>',
            name: '<name>',
            taskId: '<task-id>',
            taskName: '<task-name>'
        }};
        let form = new FormCloudModel(json);

        Object.keys(json).forEach((key) => {
            expect(form[key]).toEqual(form[key]);
        });
    });

    it('should take form name when task name is missing', () => {
        let json = {formRepresentation: {
            id: '<id>',
            name: '<name>',
            formDefinition: {}
        }};
        let form = new FormCloudModel(json);
        expect(form.taskName).toBe(json.formRepresentation.name);
    });

    it('should use fallback value for task name', () => {
        let form = new FormCloudModel({});
        expect(form.taskName).toBe(FormCloudModel.UNSET_TASK_NAME);
    });

    it('should set readonly state from params', () => {
        let form = new FormCloudModel({}, null, true);
        expect(form.readOnly).toBeTruthy();
    });

    it('should check tabs', () => {
        let form = new FormCloudModel();

        form.tabs = null;
        expect(form.hasTabs()).toBeFalsy();

        form.tabs = [];
        expect(form.hasTabs()).toBeFalsy();

        form.tabs = [new TabModel(null)];
        expect(form.hasTabs()).toBeTruthy();
    });

    it('should check fields', () => {
        let form = new FormCloudModel();

        form.fields = null;
        expect(form.hasFields()).toBeFalsy();

        form.fields = [];
        expect(form.hasFields()).toBeFalsy();

        let field = new FormFieldModel(<any> form);
        form.fields = [new ContainerModel(field)];
        expect(form.hasFields()).toBeTruthy();
    });

    it('should check outcomes', () => {
        let form = new FormCloudModel();

        form.outcomes = null;
        expect(form.hasOutcomes()).toBeFalsy();

        form.outcomes = [];
        expect(form.hasOutcomes()).toBeFalsy();

        form.outcomes = [new FormOutcomeModel(null)];
        expect(form.hasOutcomes()).toBeTruthy();
    });

    it('should parse tabs', () => {
        let json = {formRepresentation: {formDefinition: {
            tabs: [
                { id: 'tab1' },
                { id: 'tab2' }
            ]
        }}};

        let form = new FormCloudModel(json);
        expect(form.tabs.length).toBe(2);
        expect(form.tabs[0].id).toBe('tab1');
        expect(form.tabs[1].id).toBe('tab2');
    });

    it('should parse fields', () => {
        let json = {formRepresentation: {formDefinition: {
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

        let form = new FormCloudModel(json);
        expect(form.fields.length).toBe(2);
        expect(form.fields[0].id).toBe('field1');
        expect(form.fields[1].id).toBe('field2');
    });

    it('should convert missing fields to empty collection', () => {
        let json = {formRepresentation: {formDefinition: {
            fields: null
        }}};

        let form = new FormCloudModel(json);
        expect(form.fields).toBeDefined();
        expect(form.fields.length).toBe(0);
    });

    it('should put fields into corresponding tabs', () => {
        let json = {formRepresentation: {formDefinition: {
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

        let form = new FormCloudModel(json);
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
        let json = {formRepresentation: {formDefinition: {
            fields: [
                { id: 'container1' }
            ]
        }}};

        let form = new FormCloudModel(json);
        expect(form.outcomes.length).toBe(3);

        expect(form.outcomes[0].id).toBe(FormCloudModel.SAVE_OUTCOME);
        expect(form.outcomes[0].isSystem).toBeTruthy();

        expect(form.outcomes[1].id).toBe(FormCloudModel.COMPLETE_OUTCOME);
        expect(form.outcomes[1].isSystem).toBeTruthy();

        expect(form.outcomes[2].id).toBe(FormCloudModel.START_PROCESS_OUTCOME);
        expect(form.outcomes[2].isSystem).toBeTruthy();
    });

    it('should create outcomes only when fields available', () => {
        let json = {formRepresentation: {formDefinition: {
            fields: null
        }}};
        let form = new FormCloudModel(json);
        expect(form.outcomes.length).toBe(0);
    });

    it('should use custom form outcomes', () => {
        let json = {formRepresentation: {formDefinition: {
            fields: [
                { id: 'container1' }
            ]},
            outcomes: [
                { id: 'custom-1', name: 'custom 1' }
            ]
        }};

        let form = new FormCloudModel(json);
        expect(form.outcomes.length).toBe(2);

        expect(form.outcomes[0].id).toBe(FormCloudModel.SAVE_OUTCOME);
        expect(form.outcomes[0].isSystem).toBeTruthy();

        expect(form.outcomes[1].id).toBe('custom-1');
        expect(form.outcomes[1].isSystem).toBeFalsy();
    });

    it('should get field by id', () => {
        const form = new FormCloudModel({}, null, false, formCloudService);
        const field: any = { id: 'field1' };
        spyOn(form, 'getFormFields').and.returnValue([field]);

        const result = form.getFieldById('field1');
        expect(result).toBe(field);
    });
});
