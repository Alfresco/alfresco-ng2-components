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

import { FormFieldTypes } from './form-field-types';
import { FormFieldModel } from './form-field.model';
import { FormModel } from './form.model';

describe('FormFieldModel', () => {

    it('should store the form reference', () => {
        let form = new FormModel();
        let model = new FormFieldModel(form);
        expect(model.form).toBe(form);
    });

    it('should store original json', () => {
        let json = {};
        let model = new FormFieldModel(new FormModel(), json);
        expect(model.json).toBe(json);
    });

    it('should setup with json config', () => {
        let json = {
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
        let field = new FormFieldModel(new FormModel(), json);
        Object.keys(json).forEach(key => {
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
        let form = new FormModel();
        let field = new FormFieldModel(form, {id: 'field1'});
        let value = 10;

        spyOn(field, 'updateForm').and.callThrough();
        field.value = value;

        expect(field.value).toBe(value);
        expect(field.updateForm).toHaveBeenCalled();
        expect(form.values['field1']).toBe(value);
    });

    it('should get form readonly state', () => {
        let form = new FormModel();
        let field = new FormFieldModel(form, null);

        expect(field.readOnly).toBeFalsy();
        form.readOnly = true;
        expect(field.readOnly).toBeTruthy();
    });

    it('should take own readonly state if form is writable', () => {
        let form = new FormModel();
        let field = new FormFieldModel(form, {readOnly: true});

        expect(form.readOnly).toBeFalsy();
        expect(field.readOnly).toBeTruthy();
    });

    it('should parse and leave dropdown value as is', () => {
        let field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.DROPDOWN,
            options: [],
            value: 'deferred'
        });

        expect(field.value).toBe('deferred');
    });

    it('should parse the date with the default format (D-M-YYYY) if the display format is missing', () => {
        let form = new FormModel();
        let field = new FormFieldModel(form, {
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
        let form = new FormModel();
        let field = new FormFieldModel(form, {
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
        let form = new FormModel();
        let field = new FormFieldModel(form, {
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
        let form = new FormModel();
        let field = new FormFieldModel(form, {
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

    it('should return the label of selected dropdown value ', () => {
        let field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.DROPDOWN,
            options: [
                {id: 'fake-option-1', name: 'fake label 1'},
                {id: 'fake-option-2', name: 'fake label 2'},
                {id: 'fake-option-3', name: 'fake label 3'}
            ],
            value: 'fake-option-2'
        });
        expect(field.getOptionName()).toBe('fake label 2');
    });

    it('should parse and resolve radio button value', () => {
        let field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.RADIO_BUTTONS,
            options: [
                {id: 'opt1', value: 'Option 1'},
                {id: 'opt2', value: 'Option 2'}
            ],
            value: 'opt2'
        });

        expect(field.value).toBe('opt2');
    });

    it('should parse and leave radio button value as is', () => {
        let field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.RADIO_BUTTONS,
            options: [],
            value: 'deferred-radio'
        });
        expect(field.value).toBe('deferred-radio');
    });

    it('should update form with empty dropdown value', () => {
        let form = new FormModel();
        let field = new FormFieldModel(form, {
            id: 'dropdown-1',
            type: FormFieldTypes.DROPDOWN
        });

        field.value = 'empty';
        expect(form.values['dropdown-1']).toEqual({});

        field.value = '';
        expect(form.values['dropdown-1']).toEqual({});
    });

    it('should update form with dropdown value', () => {
        let form = new FormModel();
        let field = new FormFieldModel(form, {
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
        let form = new FormModel();
        let field = new FormFieldModel(form, {
            id: 'radio-1',
            type: FormFieldTypes.RADIO_BUTTONS,
            options: [
                {id: 'opt1', value: 'Option 1'},
                {id: 'opt2', value: 'Option 2'}
            ]
        });

        field.value = 'opt2';
        expect(form.values['radio-1']).toEqual(field.options[1]);
    });

    it('should update form with the first radio button value', () => {
        let form = new FormModel();
        let field = new FormFieldModel(form, {
            id: 'radio-2',
            type: FormFieldTypes.RADIO_BUTTONS,
            options: [
                {id: 'opt1', value: 'Option 1'},
                {id: 'opt2', value: 'Option 2'}
            ]
        });

        field.value = 'missing';
        expect(form.values['radio-2']).toEqual(field.options[0]);
    });

    it('should not update form with display-only field value', () => {
        let form = new FormModel();

        FormFieldTypes.READONLY_TYPES.forEach(typeName => {
            let field = new FormFieldModel(form, {
                id: typeName,
                type: typeName
            });

            field.value = '<some value>';
            expect(form.values[field.id]).toBeUndefined();
        });
    });

    it('should be able to check if the field has options available', () => {
        let form = new FormModel();
        let field = new FormFieldModel(form, {
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
        let form = new FormModel();
        let field = new FormFieldModel(form, {
            id: 'dropdown-sad',
            type: FormFieldTypes.DROPDOWN
        });

        expect(field.hasOptions()).toBeFalsy();
    });

    it('should calculate the columns in case of container type', () => {
        let form = new FormModel();
        let field = new FormFieldModel(form, {
            type: FormFieldTypes.CONTAINER,
            numberOfColumns: 888
        });

        expect(field.numberOfColumns).toBe(888);
    });

    it('should calculate the columns in case of group type', () => {
        let form = new FormModel();
        let field = new FormFieldModel(form, {
            type: FormFieldTypes.GROUP,
            numberOfColumns: 999
        });

        expect(field.numberOfColumns).toBe(999);
    });
});
