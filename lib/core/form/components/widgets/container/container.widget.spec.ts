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

import { ContainerColumnModel } from './../core/container-column.model';
import { FormFieldTypes } from './../core/form-field-types';
import { FormFieldModel } from './../core/form-field.model';
import { FormModel } from './../core/form.model';
import { ContainerWidgetComponent } from './container.widget';
import { ContainerWidgetComponentModel } from './container.widget.model';
import { setupTestBed } from '../../../../testing/setupTestBed';
import { CoreModule } from '../../../../core.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ContainerWidgetComponent', () => {

    let widget: ContainerWidgetComponent;
    let fixture: ComponentFixture<ContainerWidgetComponent>;

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot()
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
        const fakeField = new FormFieldModel(fakeForm, {id: 'fakeField', value: 'fakeValue'});
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
            const field1 = <FormFieldModel> {id: '1'},
                field2 = <FormFieldModel> {id: '2'},
                field3 = <FormFieldModel> {id: '3'},
                field4 = <FormFieldModel> {id: '4'},
                field5 = <FormFieldModel> {id: '5'},
                field6 = <FormFieldModel> {id: '6'};

            const container = new ContainerWidgetComponentModel(new FormFieldModel(new FormModel()));
            container.columns = [
                <ContainerColumnModel> { fields: [
                    field1,
                    field2,
                    field3
                ] },
                <ContainerColumnModel> { fields: [
                    field4,
                    field5
                ] },
                <ContainerColumnModel> { fields: [
                    field6
                ] }
            ];

            widget.content = container;

            expect(widget.fields[0].id).toEqual('1');
            expect(widget.fields[1].id).toEqual('4');
            expect(widget.fields[2].id).toEqual('6');
            expect(widget.fields[3].id).toEqual('2');
            expect(widget.fields[4].id).toEqual('5');
            expect(widget.fields[5]).toEqual(undefined);
            expect(widget.fields[6].id).toEqual('3');
            expect(widget.fields[7]).toEqual(undefined);
            expect(widget.fields[8]).toEqual(undefined);
        });
    });

    describe('getColumnWith', () => {

        it('should calculate the column width based on the numberOfColumns and current field\'s colspan property', () => {
            const container = new ContainerWidgetComponentModel(new FormFieldModel(new FormModel(), { numberOfColumns: 4 }));
            widget.content = container;

            expect(widget.getColumnWith(undefined)).toBe('25%');
            expect(widget.getColumnWith(<FormFieldModel> { colspan: 1 })).toBe('25%');
            expect(widget.getColumnWith(<FormFieldModel> { colspan: 3 })).toBe('75%');
        });
    });
});
