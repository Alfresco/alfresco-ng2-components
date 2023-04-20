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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable, throwError } from 'rxjs';
import {
    AlfrescoApiService,
    setupTestBed,
    CoreTestingModule,
    FormFieldModel,
    FormModel,
    FormService
} from '@alfresco/adf-core';
import { DynamicTableColumnOption } from '../models/dynamic-table-column-option.model';
import { DynamicTableColumn } from '../models/dynamic-table-column.model';
import { DynamicTableRow } from '../models/dynamic-table-row.model';
import { DynamicTableModel } from '../models/dynamic-table.widget.model';
import { DropdownEditorComponent } from './dropdown.editor';
import { TranslateModule } from '@ngx-translate/core';
import { TaskFormService } from '../../../../services/task-form.service';
import { ProcessDefinitionService } from '../../../../services/process-definition.service';

describe('DropdownEditorComponent', () => {

    let component: DropdownEditorComponent;
    let formService: FormService;
    let taskFormService: TaskFormService;
    let processDefinitionService: ProcessDefinitionService;
    let alfrescoApiService: AlfrescoApiService;
    let form: FormModel;
    let table: DynamicTableModel;
    let column: DynamicTableColumn;
    let row: DynamicTableRow;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(() => {
        alfrescoApiService = TestBed.inject(AlfrescoApiService);

        formService = new FormService();
        taskFormService = new TaskFormService(alfrescoApiService, null);
        processDefinitionService = new ProcessDefinitionService(alfrescoApiService, null);

        row = {value: {dropdown: 'one'}} as DynamicTableRow;
        column = {
            id: 'dropdown',
            options: [
                {id: '1', name: 'one'},
                {id: '2', name: 'two'}
            ]
        } as DynamicTableColumn;

        form = new FormModel({taskId: '<task-id>'});
        table = new DynamicTableModel(new FormFieldModel(form, {id: '<field-id>'}), formService);
        table.rows.push(row);
        table.columns.push(column);

        component = new DropdownEditorComponent(formService, taskFormService, processDefinitionService, null);
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

        const restResults: DynamicTableColumnOption[] = [
            {id: '11', name: 'eleven'},
            {id: '12', name: 'twelve'}
        ];

        spyOn(taskFormService, 'getRestFieldValuesColumn').and.returnValue(
            new Observable((observer) => {
                observer.next(restResults);
                observer.complete();
            })
        );

        component.ngOnInit();

        expect(taskFormService.getRestFieldValuesColumn).toHaveBeenCalledWith(
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

        spyOn(taskFormService, 'getRestFieldValuesColumn').and.returnValue(
            new Observable((observer) => {
                observer.next(null);
                observer.complete();
            })
        );

        component.ngOnInit();

        expect(taskFormService.getRestFieldValuesColumn).toHaveBeenCalledWith(
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

        spyOn(taskFormService, 'getRestFieldValuesColumn').and.returnValue(
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

        spyOn(processDefinitionService, 'getRestFieldValuesColumnByProcessId').and.returnValue(
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
        let dynamicTable: DynamicTableModel;

        const openSelect = () => {
            const dropdown = fixture.debugElement.query(By.css('.mat-select-trigger'));
            dropdown.triggerEventHandler('click', null);
            fixture.detectChanges();
        };

        beforeEach(() => {
            fixture = TestBed.createComponent(DropdownEditorComponent);
            dropDownEditorComponent = fixture.componentInstance;
            element = fixture.nativeElement;
        });

        afterEach(() => {
            fixture.destroy();
        });

        describe('and dropdown is populated via taskId', () => {

            beforeEach(() => {
                row = {value: {dropdown: 'one'}} as DynamicTableRow;
                column = {
                    id: 'column-id',
                    optionType: 'rest',
                    options: [
                        {id: '1', name: 'one'},
                        {id: '2', name: 'two'}
                    ]
                } as DynamicTableColumn;
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
            });

            it('should show visible dropdown widget', () => {
                expect(element.querySelector('#column-id')).toBeDefined();
                expect(element.querySelector('#column-id')).not.toBeNull();

                openSelect();

                const optOne = fixture.debugElement.queryAll(By.css('[id="mat-option-1"]'));
                const optTwo = fixture.debugElement.queryAll(By.css('[id="mat-option-2"]'));
                const optThree = fixture.debugElement.queryAll(By.css('[id="mat-option-3"]'));

                expect(optOne).not.toBeNull();
                expect(optTwo).not.toBeNull();
                expect(optThree).not.toBeNull();
            });
        });

        describe('and dropdown is populated via processDefinitionId', () => {

            beforeEach(() => {
                row = {value: {dropdown: 'one'}} as DynamicTableRow;
                column = {
                    id: 'column-id',
                    optionType: 'rest',
                    options: [
                        {id: '1', name: 'one'},
                        {id: '2', name: 'two'}
                    ]
                } as DynamicTableColumn;
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
            });

            it('should show visible dropdown widget', () => {
                expect(element.querySelector('#column-id')).toBeDefined();
                expect(element.querySelector('#column-id')).not.toBeNull();

                openSelect();

                const optOne = fixture.debugElement.queryAll(By.css('[id="mat-option-1"]'));
                const optTwo = fixture.debugElement.queryAll(By.css('[id="mat-option-2"]'));
                const optThree = fixture.debugElement.queryAll(By.css('[id="mat-option-3"]'));

                expect(optOne).not.toBeNull();
                expect(optTwo).not.toBeNull();
                expect(optThree).not.toBeNull();
            });
        });
    });
});
