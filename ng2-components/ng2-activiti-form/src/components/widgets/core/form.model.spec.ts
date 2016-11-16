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

import { FormModel } from './form.model';
import { TabModel } from './tab.model';
import { ContainerModel } from './container.model';
import { FormOutcomeModel } from './form-outcome.model';
// import { FormValues } from './form-values';
import { FormFieldTypes } from './form-field-types';

describe('FormModel', () => {

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

    /*
    it('should apply external data', () => {
        let data: FormValues = {
            field1: 'one',
            field2: 'two'
        };

        let json = {
            fields: [
                {
                    fieldType: 'ContainerRepresentation',
                    id: 'container1',
                    type: 'container',
                    numberOfColumns: 2,
                    fields: {
                        '1': [
                            {
                                fieldType: 'FormFieldRepresentation',
                                type: 'text',
                                id: 'field1'
                            }
                        ],
                        '2': [
                            {
                                fieldType: 'FormFieldRepresentation',
                                type: 'text',
                                id: 'field2'
                            },
                            {
                                fieldType: 'FormFieldRepresentation',
                                type: 'text',
                                id: 'field3',
                                value: 'original-value'
                            }
                        ]
                    }
                }
            ]
        };

        let form = new FormModel(json, data);
        expect(form.fields.length).toBe(1);

        let container = <ContainerModel> form.fields[0];
        expect(container.columns.length).toBe(2);

        let column1 = container.columns[0];
        let column2 = container.columns[1];
        expect(column1.fields.length).toBe(1);
        expect(column2.fields.length).toBe(2);

        let field1 = column1.fields[0];
        expect(field1.id).toBe('field1');
        expect(field1.value).toBe('one');

        let field2 = column2.fields[0];
        expect(field2.id).toBe('field2');
        expect(field2.value).toBe('two');

        let field3 = column2.fields[1];
        expect(field3.id).toBe('field3');
        expect(field3.value).toBe('original-value');
    });
    */

    it('should create standard form outcomes', () => {
        let json = {
            fields: [
                { id: 'container1' }
            ]
        };

        let form = new FormModel(json);
        expect(form.outcomes.length).toBe(2);

        expect(form.outcomes[0].id).toBe(FormModel.SAVE_OUTCOME);
        expect(form.outcomes[0].isSystem).toBeTruthy();

        expect(form.outcomes[1].id).toBe(FormModel.COMPLETE_OUTCOME);
        expect(form.outcomes[1].isSystem).toBeTruthy();
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
});
