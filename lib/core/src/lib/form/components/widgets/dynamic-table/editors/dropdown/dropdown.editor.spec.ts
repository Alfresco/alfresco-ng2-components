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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable, of, throwError } from 'rxjs';
import { FormService } from './../../../../../services/form.service';
import { FormFieldModel, FormModel } from './../../../core/index';
import { DynamicTableColumnOption  } from './../../dynamic-table-column-option.model';
import { DynamicTableColumn  } from './../../dynamic-table-column.model';
import { DynamicTableRow  } from './../../dynamic-table-row.model';
import { DynamicTableModel } from './../../dynamic-table.widget.model';
import { DropdownEditorComponent } from './dropdown.editor';
import { setupTestBed } from '../../../../../../testing/setupTestBed';
import { CoreModule } from '../../../../../../core.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DropdownEditorComponent', () => {

    let component: DropdownEditorComponent;
    let formService: FormService;
    let form: FormModel;
    let table: DynamicTableModel;
    let column: DynamicTableColumn;
    let row: DynamicTableRow;

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot()
        ]
    });

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
        table = new DynamicTableModel(new FormFieldModel(form, {id: '<field-id>'}), formService);
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

        const restResults = [
            <DynamicTableColumnOption> {id: '11', name: 'eleven'},
            <DynamicTableColumnOption> {id: '12', name: 'twelve'}
        ];

        spyOn(formService, 'getRestFieldValuesColumn').and.returnValue(
            new Observable((observer) => {
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
            new Observable((observer) => {
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

    it('should handle REST error getting options with task id', () => {
        column.optionType = 'rest';
        const error = 'error';

        spyOn(formService, 'getRestFieldValuesColumn').and.returnValue(
            throwError(error)
        );
        spyOn(component, 'handleError').and.stub();

        component.ngOnInit();
        expect(component.handleError).toHaveBeenCalledWith(error);
    });

    it('should handle REST error getting option with processDefinitionId', () => {
        column.optionType = 'rest';
        const procForm = new FormModel({processDefinitionId: '<process-definition-id>'});
        const procTable = new DynamicTableModel(new FormFieldModel(procForm, {id: '<field-id>'}), formService);
        component.table = procTable;
        const error = 'error';

        spyOn(formService, 'getRestFieldValuesColumnByProcessId').and.returnValue(
            throwError(error)
        );
        spyOn(component, 'handleError').and.stub();

        component.ngOnInit();
        expect(component.handleError).toHaveBeenCalledWith(error);
    });

    it('should update row on value change', () => {
        const event = {value: 'two'};
        component.onValueChanged(row, column, event);
        expect(row.value[column.id]).toBe(column.options[1]);
    });

    describe('when template is ready', () => {
        let dropDownEditorComponent: DropdownEditorComponent;
        let fixture: ComponentFixture<DropdownEditorComponent>;
        let element: HTMLElement;
        let stubFormService;
        const fakeOptionList: DynamicTableColumnOption[] = [{
            id: 'opt_1',
            name: 'option_1'
        }, {
            id: 'opt_2',
            name: 'option_2'
        }, {id: 'opt_3', name: 'option_3'}];
        let dynamicTable: DynamicTableModel;

        function openSelect() {
            const dropdown = fixture.debugElement.query(By.css('[class="mat-select-trigger"]'));
            dropdown.triggerEventHandler('click', null);
            fixture.detectChanges();
        }

        beforeEach(async(() => {
            fixture = TestBed.createComponent(DropdownEditorComponent);
            dropDownEditorComponent = fixture.componentInstance;
            element = fixture.nativeElement;
        }));

        afterEach(() => {
            fixture.destroy();
        });

        describe('and dropdown is populated via taskId', () => {

            beforeEach(async(() => {
                stubFormService = fixture.debugElement.injector.get(FormService);
                spyOn(stubFormService, 'getRestFieldValuesColumn').and.returnValue(of(fakeOptionList));
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
                dynamicTable = new DynamicTableModel(new FormFieldModel(form, {id: '<field-id>'}), formService);
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

                const optOne = fixture.debugElement.queryAll(By.css('[id="mat-option-1"]'));
                const optTwo = fixture.debugElement.queryAll(By.css('[id="mat-option-2"]'));
                const optThree = fixture.debugElement.queryAll(By.css('[id="mat-option-3"]'));

                expect(optOne).not.toBeNull();
                expect(optTwo).not.toBeNull();
                expect(optThree).not.toBeNull();
            }));
        });

        describe('and dropdown is populated via processDefinitionId', () => {

            beforeEach(async(() => {
                stubFormService = fixture.debugElement.injector.get(FormService);
                spyOn(stubFormService, 'getRestFieldValuesColumnByProcessId').and.returnValue(of(fakeOptionList));
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
                dynamicTable = new DynamicTableModel(new FormFieldModel(form, {id: '<field-id>'}), formService);
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

                const optOne = fixture.debugElement.queryAll(By.css('[id="mat-option-1"]'));
                const optTwo = fixture.debugElement.queryAll(By.css('[id="mat-option-2"]'));
                const optThree = fixture.debugElement.queryAll(By.css('[id="mat-option-3"]'));

                expect(optOne).not.toBeNull();
                expect(optTwo).not.toBeNull();
                expect(optThree).not.toBeNull();
            }));

        });

    });

});
