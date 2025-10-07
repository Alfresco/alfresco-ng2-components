/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { Observable, of } from 'rxjs';
import { FormFieldModel, FormModel, FormService } from '@alfresco/adf-core';
import { DynamicTableColumnOption } from '../models/dynamic-table-column-option.model';
import { DynamicTableColumn } from '../models/dynamic-table-column.model';
import { DynamicTableRow } from '../models/dynamic-table-row.model';
import { DynamicTableModel } from '../models/dynamic-table.widget.model';
import { DropdownEditorComponent } from './dropdown.editor';
import { TaskFormService } from '../../../../services/task-form.service';
import { ProcessDefinitionService } from '../../../../services/process-definition.service';
import { MatSelectHarness } from '@angular/material/select/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

describe('DropdownEditorComponent', () => {
    let fixture: ComponentFixture<DropdownEditorComponent>;
    let component: DropdownEditorComponent;
    let loader: HarnessLoader;
    let formService: FormService;
    let taskFormService: TaskFormService;
    let processDefinitionService: ProcessDefinitionService;
    let form: FormModel;
    let table: DynamicTableModel;
    let column: DynamicTableColumn;
    let row: DynamicTableRow;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DropdownEditorComponent]
        });
        formService = TestBed.inject(FormService);
        taskFormService = TestBed.inject(TaskFormService);
        processDefinitionService = TestBed.inject(ProcessDefinitionService);

        fixture = TestBed.createComponent(DropdownEditorComponent);
        component = fixture.componentInstance;

        row = { value: { dropdown: 'one' } } as DynamicTableRow;
        column = {
            id: 'dropdown',
            options: [
                { id: '1', name: 'one' },
                { id: '2', name: 'two' }
            ],
            editable: true
        } as DynamicTableColumn;

        form = new FormModel({ taskId: '<task-id>' });
        table = new DynamicTableModel(new FormFieldModel(form, { id: '<field-id>', isVisible: true }), formService);
        table.rows.push(row);
        table.columns.push(column);

        component.table = table;
        component.row = row;
        component.column = column;
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    describe('dropdown is populated manually', () => {
        beforeEach(() => {
            column = {
                id: 'dropdown',
                options: [
                    { id: '1', name: 'one' },
                    { id: '2', name: 'two' }
                ]
            } as DynamicTableColumn;

            component.column = column;
        });

        it('should require table field to setup', () => {
            table.field = null;
            fixture.detectChanges();
            expect(component.value).toBeNull();
            expect(component.options).toEqual([]);
        });

        it('should setup with manual mode', () => {
            row.value[column.id] = 'two';
            fixture.detectChanges();
            expect(component.options).toEqual(column.options);
            expect(component.value).toBe(row.value[column.id]);
        });

        it('should setup empty columns for manual mode', () => {
            column.options = null;
            fixture.detectChanges();
            expect(component.options).toEqual([]);
        });

        it('should setup with REST mode', () => {
            column.optionType = 'rest';
            row.value[column.id] = 'twelve';

            const restResults: DynamicTableColumnOption[] = [
                { id: '11', name: 'eleven' },
                { id: '12', name: 'twelve' }
            ];

            spyOn(taskFormService, 'getRestFieldValuesColumn').and.returnValue(
                new Observable((observer) => {
                    observer.next(restResults);
                    observer.complete();
                })
            );

            fixture.detectChanges();

            expect(taskFormService.getRestFieldValuesColumn).toHaveBeenCalledWith(form.taskId, table.field.id, column.id);

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

            fixture.detectChanges();

            expect(taskFormService.getRestFieldValuesColumn).toHaveBeenCalledWith(form.taskId, table.field.id, column.id);

            expect(column.options).toEqual([]);
            expect(component.options).toEqual([]);
            expect(component.value).toBe(row.value[column.id]);
        });

        it('should update row on value change', () => {
            const event = { value: 'two' };
            component.onValueChanged(row, column, event);
            expect(row.value[column.id]).toBe(column.options[1]);
        });
    });

    describe('dropdown is populated via taskId', () => {
        let getRestFieldValuesColumnSpy: jasmine.Spy;

        beforeEach(async () => {
            form = new FormModel({ taskId: '<task-id>' });
            table = new DynamicTableModel(new FormFieldModel(form, { id: '<field-id>' }), formService);
            component.table = table;
            component.table.field = new FormFieldModel(form, {
                id: 'dropdown-id',
                name: 'date-name',
                type: 'dropdown',
                readOnly: 'false',
                restUrl: 'fake-rest-url'
            });
            component.column.optionType = 'rest';
            component.table.field.isVisible = true;
            getRestFieldValuesColumnSpy = spyOn(taskFormService, 'getRestFieldValuesColumn').and.returnValue(of(column.options));
        });

        it('should show visible dropdown widget', async () => {
            const select = await loader.getHarness(MatSelectHarness.with({ selector: '#dropdown' }));
            await select.open();
            const options = await select.getOptions();

            expect(getRestFieldValuesColumnSpy).toHaveBeenCalled();
            expect(component.options.length).toBe(2);
            expect(options.length).toBe(3);
        });
    });

    describe('dropdown is populated via processDefinitionId', () => {
        let getRestFieldValuesColumnByProcessId: jasmine.Spy;

        beforeEach(() => {
            form = new FormModel({ processDefinitionId: '<proc-id>' });
            table = new DynamicTableModel(new FormFieldModel(form, { id: '<field-id>' }), formService);
            component.table = table;
            component.table.field = new FormFieldModel(form, {
                id: 'dropdown-id',
                name: 'date-name',
                type: 'dropdown',
                readOnly: 'false',
                restUrl: 'fake-rest-url'
            });
            component.column.optionType = 'rest';
            component.table.field.isVisible = true;
            getRestFieldValuesColumnByProcessId = spyOn(processDefinitionService, 'getRestFieldValuesColumnByProcessId').and.returnValue(
                of(column.options)
            );
        });

        it('should show visible dropdown widget', async () => {
            const select = await loader.getHarness(MatSelectHarness.with({ selector: '#dropdown' }));
            await select.open();

            const options = await select.getOptions();
            expect(getRestFieldValuesColumnByProcessId).toHaveBeenCalled();
            expect(component.options.length).toBe(2);
            expect(options.length).toBe(3);
        });
    });
});
