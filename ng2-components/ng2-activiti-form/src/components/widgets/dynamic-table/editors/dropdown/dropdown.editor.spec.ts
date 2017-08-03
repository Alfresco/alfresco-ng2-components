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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CoreModule } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Rx';
import { MATERIAL_MODULE } from '../../../../../../index';
import { EcmModelService } from '../../../../../services/ecm-model.service';
import { FormService } from './../../../../../services/form.service';
import { FormFieldModel, FormModel } from './../../../core/index';
import {
    DynamicTableColumn,
    DynamicTableColumnOption,
    DynamicTableModel,
    DynamicTableRow
} from './../../dynamic-table.widget.model';
import { DropdownEditorComponent } from './dropdown.editor';

describe('DropdownEditorComponent', () => {

    function openSelect() {
        const dropdown = fixture.debugElement.query(By.css('[class="mat-select-trigger"]'));
        dropdown.triggerEventHandler('click', null);
        fixture.detectChanges();
    }

    let component: DropdownEditorComponent;
    let formService: FormService;
    let form: FormModel;
    let table: DynamicTableModel;
    let column: DynamicTableColumn;
    let row: DynamicTableRow;

    beforeEach(() => {
        formService = new FormService(null, null, null);

        row = <DynamicTableRow> {value: {dropdown: 'one'}};
        column = <DynamicTableColumn> {
            id: 'dropdown',
            options: [
                <DynamicTableColumnOption> {id: '1', name: 'one'},
                <DynamicTableColumnOption> {id: '2', name: 'two'}
            ]
        };

        form = new FormModel({taskId: '<task-id>'});
        table = new DynamicTableModel(new FormFieldModel(form, {id: '<field-id>'}));
        table.rows.push(row);
        table.columns.push(column);

        component = new DropdownEditorComponent(formService, null);
        component.table = table;
        component.row = row;
        component.column = column;
    });

    it('should require table field to setup', () => {
        table.field = null;
        component.ngOnInit();
        expect(component.value).toBeNull();
        expect(component.options).toEqual([]);
    });

    it('should setup with manual mode', () => {
        row.value[column.id] = 'two';
        component.ngOnInit();
        expect(component.options).toEqual(column.options);
        expect(component.value).toBe(row.value[column.id]);
    });

    it('should setup empty columns for manual mode', () => {
        column.options = null;
        component.ngOnInit();
        expect(component.options).toEqual([]);
    });

    it('should setup with REST mode', () => {
        column.optionType = 'rest';
        row.value[column.id] = 'twelve';

        let restResults = [
            <DynamicTableColumnOption> {id: '11', name: 'eleven'},
            <DynamicTableColumnOption> {id: '12', name: 'twelve'}
        ];

        spyOn(formService, 'getRestFieldValuesColumn').and.returnValue(
            Observable.create(observer => {
                observer.next(restResults);
                observer.complete();
            })
        );

        component.ngOnInit();

        expect(formService.getRestFieldValuesColumn).toHaveBeenCalledWith(
            form.taskId,
            table.field.id,
            column.id
        );

        expect(column.options).toEqual(restResults);
        expect(component.options).toEqual(restResults);
        expect(component.value).toBe(row.value[column.id]);
    });

    it('should create empty options array on REST response', () => {
        column.optionType = 'rest';

        spyOn(formService, 'getRestFieldValuesColumn').and.returnValue(
            Observable.create(observer => {
                observer.next(null);
                observer.complete();
            })
        );

        component.ngOnInit();

        expect(formService.getRestFieldValuesColumn).toHaveBeenCalledWith(
            form.taskId,
            table.field.id,
            column.id
        );

        expect(column.options).toEqual([]);
        expect(component.options).toEqual([]);
        expect(component.value).toBe(row.value[column.id]);
    });

    it('should handle REST error gettig options with task id', () => {
        column.optionType = 'rest';
        const error = 'error';

        spyOn(formService, 'getRestFieldValuesColumn').and.returnValue(
            Observable.throw(error)
        );
        spyOn(component, 'handleError').and.stub();

        component.ngOnInit();
        expect(component.handleError).toHaveBeenCalledWith(error);
    });

    it('should handle REST error getting option with processDefinitionId', () => {
        column.optionType = 'rest';
        let procForm = new FormModel({processDefinitionId: '<process-definition-id>'});
        let procTable = new DynamicTableModel(new FormFieldModel(procForm, {id: '<field-id>'}));
        component.table = procTable;
        const error = 'error';

        spyOn(formService, 'getRestFieldValuesColumnByProcessId').and.returnValue(
            Observable.throw(error)
        );
        spyOn(component, 'handleError').and.stub();

        component.ngOnInit();
        expect(component.handleError).toHaveBeenCalledWith(error);
    });

    it('should update row on value change', () => {
        let event = {target: {value: 'two'}};
        component.onValueChanged(row, column, event);
        expect(row.value[column.id]).toBe(column.options[1]);
    });

    describe('when template is ready', () => {
        let dropDownEditorComponent: DropdownEditorComponent;
        let fixture: ComponentFixture<DropdownEditorComponent>;
        let element: HTMLElement;
        let stubFormService;
        let fakeOptionList: DynamicTableColumnOption[] = [{
            id: 'opt_1',
            name: 'option_1'
        }, {
            id: 'opt_2',
            name: 'option_2'
        }, {id: 'opt_3', name: 'option_3'}];
        let dynamicTable: DynamicTableModel;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [CoreModule, ...MATERIAL_MODULE],
                declarations: [DropdownEditorComponent],
                providers: [FormService, EcmModelService]
            }).compileComponents().then(() => {
                fixture = TestBed.createComponent(DropdownEditorComponent);
                dropDownEditorComponent = fixture.componentInstance;
                element = fixture.nativeElement;
            });
        }));

        afterEach(() => {
            fixture.destroy();
            TestBed.resetTestingModule();
        });

        describe('and dropdown is populated via taskId', () => {

            beforeEach(async(() => {
                stubFormService = fixture.debugElement.injector.get(FormService);
                spyOn(stubFormService, 'getRestFieldValuesColumn').and.returnValue(Observable.of(fakeOptionList));
                row = <DynamicTableRow> {value: {dropdown: 'one'}};
                column = <DynamicTableColumn> {
                    id: 'column-id',
                    optionType: 'rest',
                    options: [
                        <DynamicTableColumnOption> {id: '1', name: 'one'},
                        <DynamicTableColumnOption> {id: '2', name: 'two'}
                    ]
                };
                form = new FormModel({taskId: '<task-id>'});
                dynamicTable = new DynamicTableModel(new FormFieldModel(form, {id: '<field-id>'}));
                dynamicTable.rows.push(row);
                dynamicTable.columns.push(column);
                dropDownEditorComponent.table = dynamicTable;
                dropDownEditorComponent.column = column;
                dropDownEditorComponent.row = row;
                dropDownEditorComponent.table.field = new FormFieldModel(form, {
                    id: 'dropdown-id',
                    name: 'date-name',
                    type: 'dropdown',
                    readOnly: 'false',
                    restUrl: 'fake-rest-url'
                });
                dropDownEditorComponent.table.field.isVisible = true;
                fixture.detectChanges();
            }));

            it('should show visible dropdown widget', async(() => {
                expect(element.querySelector('#column-id')).toBeDefined();
                expect(element.querySelector('#column-id')).not.toBeNull();

                openSelect();

                const optOne = fixture.debugElement.queryAll(By.css('[id="md-option-1"]'));
                const optTwo = fixture.debugElement.queryAll(By.css('[id="md-option-2"]'));
                const optThree = fixture.debugElement.queryAll(By.css('[id="md-option-3"]'));

                expect(optOne).not.toBeNull();
                expect(optTwo).not.toBeNull();
                expect(optThree).not.toBeNull();
            }));
        });

        describe('and dropdown is populated via processDefinitionId', () => {

            beforeEach(async(() => {
                stubFormService = fixture.debugElement.injector.get(FormService);
                spyOn(stubFormService, 'getRestFieldValuesColumnByProcessId').and.returnValue(Observable.of(fakeOptionList));
                row = <DynamicTableRow> {value: {dropdown: 'one'}};
                column = <DynamicTableColumn> {
                    id: 'column-id',
                    optionType: 'rest',
                    options: [
                        <DynamicTableColumnOption> {id: '1', name: 'one'},
                        <DynamicTableColumnOption> {id: '2', name: 'two'}
                    ]
                };
                form = new FormModel({processDefinitionId: '<proc-id>'});
                dynamicTable = new DynamicTableModel(new FormFieldModel(form, {id: '<field-id>'}));
                dynamicTable.rows.push(row);
                dynamicTable.columns.push(column);
                dropDownEditorComponent.table = dynamicTable;
                dropDownEditorComponent.column = column;
                dropDownEditorComponent.row = row;
                dropDownEditorComponent.table.field = new FormFieldModel(form, {
                    id: 'dropdown-id',
                    name: 'date-name',
                    type: 'dropdown',
                    readOnly: 'false',
                    restUrl: 'fake-rest-url'
                });
                dropDownEditorComponent.table.field.isVisible = true;
                fixture.detectChanges();
            }));

            it('should show visible dropdown widget', async(() => {
                expect(element.querySelector('#column-id')).toBeDefined();
                expect(element.querySelector('#column-id')).not.toBeNull();

                openSelect();

                const optOne = fixture.debugElement.queryAll(By.css('[id="md-option-1"]'));
                const optTwo = fixture.debugElement.queryAll(By.css('[id="md-option-2"]'));
                const optThree = fixture.debugElement.queryAll(By.css('[id="md-option-3"]'));

                expect(optOne).not.toBeNull();
                expect(optTwo).not.toBeNull();
                expect(optThree).not.toBeNull();
            }));

        });

    });

});
