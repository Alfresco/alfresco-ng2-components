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

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldTypes } from './../core/form-field-types';
import { FormFieldModel } from './../core/form-field.model';
import { FormModel } from './../core/form.model';
import { ContainerWidgetComponent } from './container.widget';
import { ContainerWidgetComponentModel } from './container.widget.model';
import { setupTestBed } from '../../../../testing/setup-test-bed';
import { CoreTestingModule } from '../../../../testing';
import { TranslateModule } from '@ngx-translate/core';

describe('ContainerWidgetComponent', () => {

    let widget: ContainerWidgetComponent;
    let fixture: ComponentFixture<ContainerWidgetComponent>;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ContainerWidgetComponent);
        widget = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should wrap field with model instance', () => {
        const field = new FormFieldModel(null);
        widget.field = field;
        widget.ngOnInit();
        expect(widget.content).toBeDefined();
        expect(widget.content.field).toBe(field);
    });

    it('should toggle underlying group container', () => {
        const container = new ContainerWidgetComponentModel(new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.GROUP,
            params: {
                allowCollapse: true
            }
        }));

        widget.content = container;

        expect(container.isExpanded).toBeTruthy();
        widget.onExpanderClicked();
        expect(container.isExpanded).toBeFalsy();
        widget.onExpanderClicked();
        expect(container.isExpanded).toBeTruthy();
    });

    it('should toggle only collapsible container', () => {
        const container = new ContainerWidgetComponentModel(new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.GROUP
        }));

        widget.content = container;

        expect(container.isExpanded).toBeTruthy();
        widget.onExpanderClicked();
        expect(container.isExpanded).toBeTruthy();
    });

    it('should toggle only group container', () => {

        const container = new ContainerWidgetComponentModel(new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.CONTAINER,
            params: {
                allowCollapse: true
            }
        }));

        widget.content = container;

        expect(container.isExpanded).toBeTruthy();
        widget.onExpanderClicked();
        expect(container.isExpanded).toBeTruthy();
    });

    it('should send an event when a value is changed in the form', (done) => {
        const fakeForm = new FormModel();
        const fakeField = new FormFieldModel(fakeForm, { id: 'fakeField', value: 'fakeValue' });
        widget.fieldChanged.subscribe((field) => {
            expect(field).not.toBe(null);
            expect(field.id).toBe('fakeField');
            expect(field.value).toBe('fakeValue');
            done();
        });

        widget.onFieldChanged(fakeField);
    });

    describe('fields', () => {

        it('should serializes the content fields', () => {
            const form = new FormModel();
            const json = {
                id: 'test',
                name: 'test',
                type: 'container',
                tab: null,
                fields: {
                    '1' : [{ id: '1' }, { id: '2' }, { id: '3' }],
                    '2' : [{ id: '4' }, { id: '5' }],
                    '3' : [{ id: '6' }]
                }
            };

            const field = new FormFieldModel(form, json);
            widget.field = field;
            widget.ngOnInit();

            expect(widget.fields.length).toEqual(6);
            expect(widget.fields[0].id).toEqual('1');
            expect(widget.fields[1].id).toEqual('4');
            expect(widget.fields[2].id).toEqual('6');
            expect(widget.fields[3].id).toEqual('2');
            expect(widget.fields[4].id).toEqual('5');
            expect(widget.fields[5].id).toEqual('3');
        });

        it('should serializes the content fields with rowspan', () => {
            const form = new FormModel();
            const json = {
                id: 'test',
                name: 'test',
                type: 'container',
                tab: null,
                fields: {
                    '1': [
                        {
                            id: 'a',
                            colspan: 2,
                            rowspan: 1
                        },
                        {
                            id: 'b',
                            colspan: 2,
                            rowspan: 1
                        },
                        {
                            id: 'c',
                            colspan: 2,
                            rowspan: 1
                        },
                        {
                            id: 'd',
                            colspan: 2,
                            rowspan: 1
                        },
                        {
                            id: 'e',
                            colspan: 2,
                            rowspan: 1
                        },
                        {
                            id: 'f',
                            colspan: 2,
                            rowspan: 1
                        },
                        {
                            id: 'g',
                            colspan: 2,
                            rowspan: 1
                        },
                        {
                            id: 'h',
                            colspan: 2,
                            rowspan: 1
                        }
                    ],
                    '2': [
                        {
                            id: '1',
                            rowspan: 3,
                            colspan: 2
                        },
                        {
                            id: '2',
                            rowspan: 2,
                            colspan: 2
                        },
                        {
                            id: '3',
                            colspan: 2
                        }
                    ],
                    '3': [
                        {
                            id: 'white'
                        },
                        {
                            id: 'black'
                        },
                        {
                            id: 'green',
                            rowspan: 2
                        },
                        {
                            id: 'yellow'
                        }
                    ]
                }
            };
            const field = new FormFieldModel(form, json);
            widget.field = field;
            widget.ngOnInit();

            expect(widget.fields.length).toEqual(25);
            expect(widget.fields[0].id).toEqual('a');
            expect(widget.fields[1].id).toEqual('1');
            expect(widget.fields[2].id).toEqual('white');
            expect(widget.fields[3].id).toEqual('b');
            expect(widget.fields[4].id).toEqual('2');
            expect(widget.fields[5].id).toEqual('black');
            expect(widget.fields[6].id).toEqual('c');
            expect(widget.fields[7].id).toEqual('3');
            expect(widget.fields[8].id).toEqual('green');
            expect(widget.fields[9].id).toEqual('d');
            expect(widget.fields[10]).toEqual(null);
            expect(widget.fields[11]).toEqual(null);
            expect(widget.fields[12].id).toEqual('yellow');
            expect(widget.fields[13].id).toEqual('e');
            expect(widget.fields[14]).toEqual(null);
            expect(widget.fields[15]).toEqual(null);
            expect(widget.fields[16].id).toEqual('f');
            expect(widget.fields[17]).toEqual(null);
            expect(widget.fields[18]).toEqual(null);
            expect(widget.fields[19].id).toEqual('g');
            expect(widget.fields[20]).toEqual(null);
            expect(widget.fields[21]).toEqual(null);
            expect(widget.fields[22].id).toEqual('h');
            expect(widget.fields[23]).toEqual(null);
            expect(widget.fields[24]).toEqual(null);
        });
    });

    describe('getColumnWith', () => {

        it('should calculate the column width based on the numberOfColumns and current field\'s colspan property', () => {
            const container = new ContainerWidgetComponentModel(new FormFieldModel(new FormModel(), { numberOfColumns: 4 }));
            widget.content = container;

            expect(widget.getColumnWith(undefined)).toBe('25');
            expect(widget.getColumnWith(<FormFieldModel> { colspan: 1 })).toBe('25');
            expect(widget.getColumnWith(<FormFieldModel> { colspan: 3 })).toBe('75');
        });
    });
});
