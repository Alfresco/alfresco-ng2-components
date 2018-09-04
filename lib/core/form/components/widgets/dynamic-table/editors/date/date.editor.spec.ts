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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import moment from 'moment-es6';
import { FormFieldModel, FormModel } from '../../../index';
import { DynamicTableColumn  } from './../../dynamic-table-column.model';
import { DynamicTableRow  } from './../../dynamic-table-row.model';
import { DynamicTableModel } from './../../dynamic-table.widget.model';
import { DateEditorComponent } from './date.editor';
import { setupTestBed } from '../../../../../../testing/setupTestBed';
import { CoreModule } from '../../../../../../core.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DateEditorComponent', () => {
    let component: DateEditorComponent;
    let fixture: ComponentFixture<DateEditorComponent>;
    let row: DynamicTableRow;
    let column: DynamicTableColumn;
    let table: DynamicTableModel;

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot()
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DateEditorComponent);
        component = fixture.componentInstance;

        row = <DynamicTableRow> { value: { date: '1879-03-14T00:00:00.000Z' } };
        column = <DynamicTableColumn> { id: 'date', type: 'Date' };
        const field = new FormFieldModel(new FormModel());
        table = new DynamicTableModel(field, null);
        table.rows.push(row);
        table.columns.push(column);
        component.table = table;
        component.row = row;
        component.column = column;
    });

    it('should create instance of DateEditorComponent', () => {
        expect(fixture.componentInstance instanceof DateEditorComponent).toBe(true, 'should create DateEditorComponent');
    });

    it('should update fow value on change', () => {
        component.ngOnInit();
        let newDate = moment('14-03-1879', 'DD-MM-YYYY');
        component.onDateChanged(newDate);
        expect(row.value[column.id]).toBe('1879-03-14T00:00:00.000Z');
    });

    it('should update row value upon user input', () => {
        const input = {value: '14-03-2016' };

        component.ngOnInit();
        component.onDateChanged(input);

        let actual = row.value[column.id];
        expect(actual).toBe('2016-03-14T00:00:00.000Z');
    });

    it('should flush value on user input', () => {
        spyOn(table, 'flushValue').and.callThrough();
        const input = {value: '14-03-2016' };

        component.ngOnInit();
        component.onDateChanged(input);

        expect(table.flushValue).toHaveBeenCalled();
    });

});
