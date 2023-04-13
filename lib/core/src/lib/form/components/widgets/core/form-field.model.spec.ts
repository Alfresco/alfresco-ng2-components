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

import moment from 'moment';
import { FormFieldTypes } from './form-field-types';
import { FormFieldModel } from './form-field.model';
import { FormModel } from './form.model';

describe('FormFieldModel', () => {

    it('should store the form reference', () => {
        const form = new FormModel();
        const model = new FormFieldModel(form);
        expect(model.form).toBe(form);
    });

    it('should store original json', () => {
        const json = {};
        const model = new FormFieldModel(new FormModel(), json);
        expect(model.json).toBe(json);
    });

    it('should setup with json config', () => {
        const json = {
            fieldType: '<fieldType>',
            id: '<id>',
            name: '<name>',
            type: '<type>',
            required: true,
            readOnly: true,
            overrideId: true,
            tab: '<tab>',
            restUrl: '<rest-url>',
            restResponsePath: '<rest-path>',
            restIdProperty: '<rest-id>',
            restLabelProperty: '<rest-label>',
            colspan: 1,
            options: [],
            hasEmptyValue: true,
            className: '<class>',
            optionType: '<type>',
            params: {},
            hyperlinkUrl: '<url>',
            displayText: '<text>',
            value: '<value>'
        };
        const field = new FormFieldModel(new FormModel(), json);
        Object.keys(json).forEach((key) => {
            expect(field[key]).toBe(json[key]);
        });
    });

    it('should setup empty options collection', () => {
        let field = new FormFieldModel(new FormModel(), null);
        expect(field.options).toBeDefined();
        expect(field.options.length).toBe(0);

        field = new FormFieldModel(new FormModel(), {options: null});
        expect(field.options).toBeDefined();
        expect(field.options.length).toBe(0);
    });

    it('should setup empty params', () => {
        let field = new FormFieldModel(new FormModel(), null);
        expect(field.params).toEqual({});

        field = new FormFieldModel(new FormModel(), {params: null});
        expect(field.params).toEqual({});
    });

    it('should update form on every value change', () => {
        const form = new FormModel();
        const field = new FormFieldModel(form, {id: 'field1'});
        const value = 10;

        spyOn(field, 'updateForm').and.callThrough();
        field.value = value;

        expect(field.value).toBe(value);
        expect(field.updateForm).toHaveBeenCalled();
        expect(form.values['field1']).toBe(value);
    });

    it('should get form readonly state', () => {
        const form = new FormModel();
        const field = new FormFieldModel(form, null);

        expect(field.readOnly).toBeFalsy();
        form.readOnly = true;
        expect(field.readOnly).toBeTruthy();
    });

    it('should take own readonly state if form is writable', () => {
        const form = new FormModel();
        const field = new FormFieldModel(form, {readOnly: true});

        expect(form.readOnly).toBeFalsy();
        expect(field.readOnly).toBeTruthy();
    });

    it('should parse and leave dropdown value as is', () => {
        const field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.DROPDOWN,
            options: [],
            value: 'deferred'
        });

        expect(field.value).toBe('deferred');
    });

    it('should parse the date with the default format (D-M-YYYY) if the display format is missing', () => {
        const form = new FormModel();
        const field = new FormFieldModel(form, {
            fieldType: 'FormFieldRepresentation',
            id: 'mmddyyyy',
            name: 'MM-DD-YYYY',
            type: 'date',
            value: '2017-04-28T00:00:00.000+0000',
            required: false,
            readOnly: false,
            params: {
                field: {
                    id: 'mmddyyyy',
                    name: 'MM-DD-YYYY',
                    type: 'date',
                    value: null,
                    required: false,
                    readOnly: false
                }
            }
        });
        expect(field.value).toBe('28-4-2017');
        expect(form.values['mmddyyyy']).toEqual('2017-04-28T00:00:00.000Z');
    });

    it('should parse the date with the format MM-DD-YYYY', () => {
        const form = new FormModel();
        const field = new FormFieldModel(form, {
            fieldType: 'FormFieldRepresentation',
            id: 'mmddyyyy',
            name: 'MM-DD-YYYY',
            type: 'date',
            value: '2017-04-28T00:00:00.000+0000',
            required: false,
            readOnly: false,
            params: {
                field: {
                    id: 'mmddyyyy',
                    name: 'MM-DD-YYYY',
                    type: 'date',
                    value: null,
                    required: false,
                    readOnly: false
                }
            },
            dateDisplayFormat: 'MM-DD-YYYY'
        });
        expect(field.value).toBe('04-28-2017');
        expect(form.values['mmddyyyy']).toEqual('2017-04-28T00:00:00.000Z');
    });

    it('should parse the date with the format MM-YY-DD', () => {
        const form = new FormModel();
        const field = new FormFieldModel(form, {
            fieldType: 'FormFieldRepresentation',
            id: 'mmyydd',
            name: 'MM-YY-DD',
            type: 'date',
            value: '2017-04-28T00:00:00.000+0000',
            required: false,
            readOnly: false,
            params: {
                field: {
                    id: 'mmyydd',
                    name: 'MM-YY-DD',
                    type: 'date',
                    value: null,
                    required: false,
                    readOnly: false
                }
            },
            dateDisplayFormat: 'MM-YY-DD'
        });
        expect(field.value).toBe('04-17-28');
        expect(form.values['mmyydd']).toEqual('2017-04-28T00:00:00.000Z');
    });

    it('should parse the date with the format DD-MM-YYYY', () => {
        const form = new FormModel();
        const field = new FormFieldModel(form, {
            fieldType: 'FormFieldRepresentation',
            id: 'ddmmyyy',
            name: 'DD-MM-YYYY',
            type: 'date',
            value: '2017-04-28T00:00:00.000+0000',
            required: false,
            readOnly: false,
            params: {
                field: {
                    id: 'ddmmyyy',
                    name: 'DD-MM-YYYY',
                    type: 'date',
                    value: null,
                    required: false,
                    readOnly: false
                }
            },
            dateDisplayFormat: 'DD-MM-YYYY'
        });
        expect(field.value).toBe('28-04-2017');
        expect(form.values['ddmmyyy']).toEqual('2017-04-28T00:00:00.000Z');
    });

    it('should parse the date with the format DD-MM-YYYY when it is readonly', () => {
        const form = new FormModel();
        const field = new FormFieldModel(form, {
            fieldType: 'FormFieldRepresentation',
            id: 'ddmmyyy',
            name: 'DD-MM-YYYY',
            type: 'readonly',
            value: '2017-04-28T00:00:00.000+0000',
            required: false,
            readOnly: true,
            params: {
                field: {
                    id: 'ddmmyyy',
                    name: 'DD-MM-YYYY',
                    type: 'date',
                    value: null,
                    required: false,
                    readOnly: false
                }
            },
            dateDisplayFormat: 'DD-MM-YYYY'
        });
        expect(field.value).toBe('28-04-2017');
    });

    it('should set the value to today\'s date when the value is today', () => {
        const form = new FormModel();
        const field = new FormFieldModel(form, {
            fieldType: 'FormFieldRepresentation',
            id: 'ddmmyyy',
            name: 'DD-MM-YYYY',
            type: 'date',
            value: 'today',
            required: false,
            readOnly: false,
            params: {
                field: {
                    id: 'ddmmyyy',
                    name: 'DD-MM-YYYY',
                    type: 'date',
                    value: 'today',
                    required: false,
                    readOnly: false
                }
            },
            dateDisplayFormat: 'DD-MM-YYYY'
        });

        const currentDate = moment(new Date());
        const expectedDate = moment(currentDate).format('DD-MM-YYYY');
        const expectedDateFormat = `${currentDate.format('YYYY-MM-DD')}T00:00:00.000Z`;

        expect(field.value).toBe(expectedDate);
        expect(form.values['ddmmyyy']).toEqual(expectedDateFormat);
    });

    it('should set the value to now date time when the value is now', () => {
        const form = new FormModel();
        const field = new FormFieldModel(form, {
            fieldType: 'FormFieldRepresentation',
            id: 'datetime',
            name: 'date and time',
            type: 'datetime',
            value: 'now',
            required: false,
            readOnly: false,
            params: {
                field: {
                    id: 'datetime',
                    name: 'date and time',
                    type: 'datetime',
                    value: 'now',
                    required: false,
                    readOnly: false
                }
            },
            dateDisplayFormat: 'YYYY-MM-DD HH:mm'
        });

        const currentDateTime = moment(new Date());
        const expectedDateTime = moment.utc(currentDateTime).format('YYYY-MM-DD HH:mm');
        const expectedDateTimeFormat = `${currentDateTime.utc().format('YYYY-MM-DDTHH:mm:00')}.000Z`;

        expect(field.value).toBe(expectedDateTime);
        expect(form.values['datetime']).toEqual(expectedDateTimeFormat);
    });

    it('should parse the checkbox set to "true" when it is readonly', () => {
        const form = new FormModel();
        const field = new FormFieldModel(form, {
            fieldType: 'FormFieldRepresentation',
            id: 'checkbox',
            name: 'Checkbox',
            type: 'readonly',
            value: 'true',
            required: false,
            readOnly: true,
            params: {
                field: {
                    id: 'checkbox',
                    name: 'Checkbox',
                    type: 'boolean',
                    value: null,
                    required: false,
                    readOnly: false
                }
            }
        });
        expect(field.value).toBeTruthy();
    });

    it('should parse the checkbox set to null when it is readonly', () => {
        const form = new FormModel();
        const field = new FormFieldModel(form, {
            fieldType: 'FormFieldRepresentation',
            id: 'checkbox',
            name: 'Checkbox',
            type: 'readonly',
            value: null,
            required: false,
            readOnly: true,
            params: {
                field: {
                    id: 'checkbox',
                    name: 'Checkbox',
                    type: 'boolean',
                    value: null,
                    required: false,
                    readOnly: false
                }
            }
        });
        expect(field.value).toBeFalsy();
    });

    it('should parse the checkbox set to "false" when it is readonly', () => {
        const form = new FormModel();
        const field = new FormFieldModel(form, {
            fieldType: 'FormFieldRepresentation',
            id: 'checkbox',
            name: 'Checkbox',
            type: 'readonly',
            value: 'false',
            required: false,
            readOnly: true,
            params: {
                field: {
                    id: 'checkbox',
                    name: 'Checkbox',
                    type: 'boolean',
                    value: null,
                    required: false,
                    readOnly: false
                }
            }
        });
        expect(field.value).toBeFalsy();
    });

    it('should parse the checkbox set to "true" when it is editable', () => {
        const form = new FormModel();
        const field = new FormFieldModel(form, {
            fieldType: 'FormFieldRepresentation',
            id: 'checkbox',
            name: 'Checkbox',
            type: 'boolean',
            value: 'true',
            required: false,
            readOnly: true,
            params: {
                field: {
                    id: 'checkbox',
                    name: 'Checkbox',
                    type: 'boolean',
                    value: null,
                    required: false,
                    readOnly: false
                }
            }
        });
        expect(field.value).toBeTruthy();
    });

    it('should parse the checkbox set to null when it is editable', () => {
        const form = new FormModel();
        const field = new FormFieldModel(form, {
            fieldType: 'FormFieldRepresentation',
            id: 'checkbox',
            name: 'Checkbox',
            type: 'boolean',
            value: null,
            required: false,
            readOnly: true,
            params: {
                field: {
                    id: 'checkbox',
                    name: 'Checkbox',
                    type: 'boolean',
                    value: null,
                    required: false,
                    readOnly: false
                }
            }
        });
        expect(field.value).toBeFalsy();
    });

    it('should parse the checkbox set to "false" when it is editable', () => {
        const form = new FormModel();
        const field = new FormFieldModel(form, {
            fieldType: 'FormFieldRepresentation',
            id: 'checkbox',
            name: 'Checkbox',
            type: 'boolean',
            value: 'false',
            required: false,
            readOnly: true,
            params: {
                field: {
                    id: 'checkbox',
                    name: 'Checkbox',
                    type: 'boolean',
                    value: null,
                    required: false,
                    readOnly: false
                }
            }
        });
        expect(field.value).toBeFalsy();
    });

    it('should return the label of selected dropdown value ', () => {
        const field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.DROPDOWN,
            options: [
                {id: 'empty', name: 'Choose option...'},
                {id: 'fake-option-2', name: 'fake label 2'},
                {id: 'fake-option-3', name: 'fake label 3'}
            ],
            value: 'fake-option-2'
        });
        expect(field.getOptionName()).toBe('fake label 2');
        expect(field.hasEmptyValue).toBe(true);
    });

    it('should parse dropdown with multiple options', () => {
        const field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.DROPDOWN,
            options: [
                {id: 'fake-option-1', name: 'fake label 1'},
                {id: 'fake-option-2', name: 'fake label 2'},
                {id: 'fake-option-3', name: 'fake label 3'}
            ],
            value: [],
            selectionType: 'multiple'
        });
        expect(field.hasMultipleValues).toBe(true);
        expect(field.hasEmptyValue).toBe(false);
    });

    it('should parse and resolve radio button value', () => {
        const field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.RADIO_BUTTONS,
            options: [
                {id: 'opt1', name: 'Option 1'},
                {id: 'opt2', name: 'Option 2'}
            ],
            value: 'opt2'
        });

        expect(field.value).toBe('opt2');
    });

    it('should parse and leave radio button value as is', () => {
        const field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.RADIO_BUTTONS,
            options: [],
            value: 'deferred-radio'
        });
        expect(field.value).toBe('deferred-radio');
    });

    it('should parse boolean value when set to "true"', () => {
        const field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.BOOLEAN,
            value: 'true'
        });
        expect(field.value).toBe(true);
    });

    it('should parse boolean value when set to "false"', () => {
        const field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.BOOLEAN,
            value: 'false'
        });
        expect(field.value).toBe(false);
    });

    it('should parse boolean value to false when set to null', () => {
        const field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.BOOLEAN,
            value: null
        });
        expect(field.value).toBe(false);
    });

    it('should set the value as null for a dropdown field that has the None value selected', () => {
        const form = new FormModel();
        const field = new FormFieldModel(form, {
            id: 'dropdown-1',
            type: FormFieldTypes.DROPDOWN
        });

        field.value = 'empty';
        expect(form.values['dropdown-1']).toBe(null);

        field.value = '';
        expect(form.values['dropdown-1']).toBe(null);

        field.value = undefined;
        expect(form.values['dropdown-1']).toBe(null);
    });

    it('should update form with dropdown value', () => {
        const form = new FormModel();
        const field = new FormFieldModel(form, {
            id: 'dropdown-2',
            type: FormFieldTypes.DROPDOWN,
            options: [
                {id: 'opt1', name: 'Option 1'},
                {id: 'opt2', name: 'Option 2'}
            ]
        });

        field.value = 'opt2';
        expect(form.values['dropdown-2']).toEqual(field.options[1]);
    });

    it('should update form with radio button value', () => {
        const form = new FormModel();
        const field = new FormFieldModel(form, {
            id: 'radio-1',
            type: FormFieldTypes.RADIO_BUTTONS,
            options: [
                {id: 'opt1', name: 'Option 1'},
                {id: 'opt2', name: 'Option 2'}
            ]
        });

        field.value = 'opt2';
        expect(form.values['radio-1']).toEqual(field.options[1]);
    });

    it('radio button value should be null when no default is set', () => {
        const form = new FormModel();
        const field = new FormFieldModel(form, {
            id: 'radio-2',
            type: FormFieldTypes.RADIO_BUTTONS,
            options: [
                {id: 'opt1', name: 'Option 1'},
                {id: 'opt2', name: 'Option 2'}
            ]
        });

        field.value = 'missing';
        expect(form.values['radio-2']).toBeUndefined();
    });

    it('should not update form with display-only field value', () => {
        const form = new FormModel();

        FormFieldTypes.READONLY_TYPES.forEach((typeName) => {
            const field = new FormFieldModel(form, {
                id: typeName,
                type: typeName
            });

            field.value = '<some value>';
            expect(form.values[field.id]).toBeUndefined();
        });
    });

    it('should be able to check if the field has options available', () => {
        const form = new FormModel();
        const field = new FormFieldModel(form, {
            id: 'dropdown-happy',
            type: FormFieldTypes.DROPDOWN,
            options: [
                {id: 'opt1', name: 'Option 1'},
                {id: 'opt2', name: 'Option 2'}
            ]
        });

        expect(field.hasOptions()).toBeTruthy();
    });

    it('should return false if field has no options', () => {
        const form = new FormModel();
        const field = new FormFieldModel(form, {
            id: 'dropdown-sad',
            type: FormFieldTypes.DROPDOWN
        });

        expect(field.hasOptions()).toBeFalsy();
    });

    it('should calculate the columns in case of container type', () => {
        const form = new FormModel();
        const field = new FormFieldModel(form, {
            type: FormFieldTypes.CONTAINER,
            numberOfColumns: 888
        });

        expect(field.numberOfColumns).toBe(888);
    });

    it('should calculate the columns in case of group type', () => {
        const form = new FormModel();
        const field = new FormFieldModel(form, {
            type: FormFieldTypes.GROUP,
            numberOfColumns: 999
        });

        expect(field.numberOfColumns).toBe(999);
    });

    it('should instantiate FormField when has no variable', () => {
        const form = new FormModel({});
        form.json = {
            variables: undefined
        };
        const field = new FormFieldModel(form, {});
        expect(field).toBeDefined();
    });

    it('header field type should not appear into form values', () => {
        const form = new FormModel();
        const field = new FormFieldModel(form, {
            fieldType: 'HeaderFieldtype',
            id: 'header_field',
            name: 'header',
            type: FormFieldTypes.GROUP,
            value: '',
            required: false,
            readOnly: true
        });
        field.updateForm();
        expect(form.values['header_field']).not.toBeDefined();
    });

    it('dropdown field type should appear into form values', () => {
        const form = new FormModel();
        const field = new FormFieldModel(form, {
            fieldType: 'HeaderFieldtype',
            id: 'dropdown_field',
            name: 'header',
            type: FormFieldTypes.DROPDOWN,
            value: 'opt1',
            required: false,
            readOnly: true,
            options: [
                {id: 'opt1', name: 'Option 1'},
                {id: 'opt2', name: 'Option 2'}
            ]
        });
        field.updateForm();
        expect(form.values['dropdown_field'].name).toEqual('Option 1');
    });

    it('dropdown field type should be formatted on rest properties', () => {
        const form = new FormModel();
        const field = new FormFieldModel(form, {
            fieldType: 'HeaderFieldtype',
            id: 'dropdown_field',
            name: 'header',
            type: FormFieldTypes.DROPDOWN,
            value: 'opt1',
            required: false,
            readOnly: true,
            restUrl: 'fake-url-just-to-show',
            optionType: 'rest',
            restIdProperty: 'fake-id-property',
            restLabelProperty: 'fake-label-property',
            options: [
                {id: 'opt1', name: 'Option 1'},
                {id: 'opt2', name: 'Option 2'}
            ]
        });
        field.updateForm();
        expect(form.values['dropdown_field'].id).toEqual('opt1');
        expect(form.values['dropdown_field'].name).toEqual('Option 1');
    });

    it('dropdown field type should be formatted on id and name properties if rest properties are not set', () => {
        const form = new FormModel();
        const field = new FormFieldModel(form, {
            fieldType: 'HeaderFieldtype',
            id: 'dropdown_field',
            name: 'header',
            type: FormFieldTypes.DROPDOWN,
            value: 'opt1',
            required: false,
            readOnly: true,
            restUrl: 'fake-url-just-to-show',
            optionType: 'rest',
            options: [
                {id: 'opt1', name: 'Option 1'},
                {id: 'opt2', name: 'Option 2'}
            ]
        });
        field.updateForm();
        expect(form.values['dropdown_field']['id']).toEqual('opt1');
        expect(form.values['dropdown_field']['name']).toEqual('Option 1');
    });

    it('radio button field rest type should appear with its configured label and id into the rest values', () => {
        const form = new FormModel();
        const field = new FormFieldModel(form, {
            fieldType: 'HeaderFieldtype',
            id: 'radio_bananan_field',
            name: 'banana',
            type: FormFieldTypes.RADIO_BUTTONS,
            value: 'opt1',
            required: false,
            readOnly: true,
            restUrl: '<whatever-url-you-like-we-do-not-mind>',
            restIdProperty: 'banana',
            restLabelProperty: 'banLabel',
            optionType: 'rest',
            options: [
                {id: 'opt1', name: 'Option 1'},
                {id: 'opt2', name: 'Option 2'}
            ]
        });
        field.updateForm();
        expect(form.values['radio_bananan_field'].id).toEqual('opt1');
        expect(form.values['radio_bananan_field'].name).toEqual('Option 1');
    });

    it('radio button field rest type should appear with id / name properties when rest properties are not configured', () => {
        const form = new FormModel();
        const field = new FormFieldModel(form, {
            fieldType: 'HeaderFieldtype',
            id: 'radio_bananan_field',
            name: 'banana',
            type: FormFieldTypes.RADIO_BUTTONS,
            value: 'opt1',
            required: false,
            readOnly: true,
            restUrl: '<whatever-url-you-like-we-do-not-mind>',
            optionType: 'rest',
            options: [
                {id: 'opt1', name: 'Option 1'},
                {id: 'opt2', name: 'Option 2'}
            ]
        });
        field.updateForm();
        expect(form.values['radio_bananan_field']['id']).toEqual('opt1');
        expect(form.values['radio_bananan_field']['name']).toEqual('Option 1');
    });

    it('should parse and resolve people null value as null', () => {
        const field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.PEOPLE,
            value: null
        });

        field.updateForm();

        expect(field.value).toBe(null);
    });

    it('should parse and resolve people undefined value as null', () => {
        const field = new FormFieldModel(new FormModel(), {
            fieldType: 'HeaderFieldtype',
            id: 'people_field',
            name: 'people',
            type: FormFieldTypes.PEOPLE,
            value: undefined
        });

        field.updateForm();

        expect(field.value).toBe(null);
    });

    describe('variables', () => {

        let form: FormModel;

        beforeEach(() => {
            form = new FormModel({
                variables: [
                    {
                        id: 'bfca9766-7bc1-45cc-8ecf-cdad551e36e2',
                        name: 'name2',
                        type: 'string',
                        value: 'default hello'
                    }
                ],
                processVariables: [
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
                    }
                ]
            });
        });

        it('it should get a process value for readonly field', () => {
            const field = new FormFieldModel(form, {
                type: FormFieldTypes.DISPLAY_VALUE,
                params: {
                    field: {
                        id: 'name1',
                        name: 'name1',
                        type: 'string'
                    }
                }
            });

            expect(field.value).toBe('hello');
        });

        it('it should fallback to a form variable for readonly field', () => {
            const field = new FormFieldModel(form, {
                type: FormFieldTypes.DISPLAY_VALUE,
                params: {
                    responseVariable: true,
                    field: {
                        id: 'name2',
                        name: 'name2',
                        type: 'string'
                    }
                }
            });

            expect(field.value).toBe('default hello');
        });

    });
});
