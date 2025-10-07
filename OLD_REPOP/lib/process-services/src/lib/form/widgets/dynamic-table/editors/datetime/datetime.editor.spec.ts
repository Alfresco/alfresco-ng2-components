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
import { FormFieldModel, FormModel } from '@alfresco/adf-core';
import { DynamicTableColumn } from '../models/dynamic-table-column.model';
import { DynamicTableRow } from '../models/dynamic-table-row.model';
import { DynamicTableModel } from '../models/dynamic-table.widget.model';
import { DateTimeEditorComponent } from './datetime.editor';

describe('DateTimeEditorComponent', () => {
    let component: DateTimeEditorComponent;
    let fixture: ComponentFixture<DateTimeEditorComponent>;
    let row: DynamicTableRow;
    let column: DynamicTableColumn;
    let table: DynamicTableModel;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DateTimeEditorComponent]
        });
        fixture = TestBed.createComponent(DateTimeEditorComponent);
        component = fixture.componentInstance;

        row = { value: { date: '1879-03-14T00:00:00.000Z' } } as DynamicTableRow;
        column = { id: 'datetime', type: 'Datetime' } as DynamicTableColumn;
        const field = new FormFieldModel(new FormModel());
        table = new DynamicTableModel(field, null);
        table.rows.push(row);
        table.columns.push(column);
        component.table = table;
        component.row = row;
        component.column = column;
    });

    it('should update row value on change', () => {
        component.ngOnInit();
        const newDate = new Date('2018-6-22 04:20 AM');
        component.onDateChanged({ value: newDate } as any);

        expect(row.value[column.id]).toBe('22/06/2018 04:20');
    });

    it('should update row value upon user input', () => {
        const input = '22/6/2018 04:20';

        component.ngOnInit();
        component.onDateChanged(input);

        const actual = row.value[column.id];
        expect(actual).toBe('2018-06-22T04:20:00.000Z');
    });

    it('should flush value on user input', () => {
        spyOn(table, 'flushValue').and.callThrough();
        const input = '22/6/2018 04:20';

        component.ngOnInit();
        component.onDateChanged(input);

        expect(table.flushValue).toHaveBeenCalled();
    });
});
