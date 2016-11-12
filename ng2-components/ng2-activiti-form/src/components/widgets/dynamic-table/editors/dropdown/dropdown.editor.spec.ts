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

import { Observable } from 'rxjs/Rx';
import { DropdownEditorComponent } from './dropdown.editor';
import {
    DynamicTableModel,
    DynamicTableRow,
    DynamicTableColumn,
    DynamicTableColumnOption,
    FormFieldModel,
    FormModel
} from './../../../core/index';
import { FormService } from './../../../../../services/form.service';

describe('DropdownEditorComponent', () => {

    let component: DropdownEditorComponent;
    let formService: FormService;
    let form: FormModel;
    let table: DynamicTableModel;
    let column: DynamicTableColumn;
    let row: DynamicTableRow;

    beforeEach(() => {
        formService = new FormService(null, null);

        row = <DynamicTableRow> { value: { dropdown: 'one' } };
        column = <DynamicTableColumn> {
            id: 'dropdown',
            options: [
                <DynamicTableColumnOption> { id: '1', name: 'one' },
                <DynamicTableColumnOption> { id: '2', name: 'two' }
            ]
        };

        table = new DynamicTableModel(null);
        form = new FormModel({ taskId: '<task-id>' });
        table.field = new FormFieldModel(form, { id: '<field-id>' });
        table.rows.push(row);
        table.columns.push(column);

        component = new DropdownEditorComponent(formService);
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
            <DynamicTableColumnOption> { id: '11', name: 'eleven' },
            <DynamicTableColumnOption> { id: '12', name: 'twelve' }
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

    it('should handle REST error', () => {
        column.optionType = 'rest';
        const error = 'error';

        spyOn(formService, 'getRestFieldValuesColumn').and.returnValue(
            Observable.throw(error)
        );
        spyOn(component, 'handleError').and.stub();

        component.ngOnInit();
        expect(component.handleError).toHaveBeenCalledWith(error);
    });

    it('should update row on value change', () => {
        let event = { target: { value: 'two' } };
        component.onValueChanged(row, column, event);
        expect(row.value[column.id]).toBe(column.options[1]);
    });

});
