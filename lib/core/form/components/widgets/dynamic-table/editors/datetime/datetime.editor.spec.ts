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
import moment from 'moment-es6';
import { FormFieldModel, FormModel } from '../../../index';
import { DynamicTableColumn  } from './../../dynamic-table-column.model';
import { DynamicTableRow  } from './../../dynamic-table-row.model';
import { DynamicTableModel } from './../../dynamic-table.widget.model';
import { DateTimeEditorComponent } from './datetime.editor';
import { setupTestBed } from '../../../../../../testing/setupTestBed';
import { CoreModule } from '../../../../../../core.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DateTimeEditorComponent', () => {
    let component: DateTimeEditorComponent;
    let fixture: ComponentFixture<DateTimeEditorComponent>;
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
        fixture = TestBed.createComponent(DateTimeEditorComponent);
        component = fixture.componentInstance;

        row = <DynamicTableRow> { value: { date: '1879-03-14T00:00:00.000Z' } };
        column = <DynamicTableColumn> { id: 'datetime', type: 'Datetime' };
        const field = new FormFieldModel(new FormModel());
        table = new DynamicTableModel(field, null);
        table.rows.push(row);
        table.columns.push(column);
        component.table = table;
        component.row = row;
        component.column = column;
    });

    it('should create instance of DateTimeEditorComponent', () => {
        expect(fixture.componentInstance instanceof DateTimeEditorComponent).toBe(true, 'should create DateTimeEditorComponent');
    });

    it('should update fow value on change', () => {
        component.ngOnInit();
        const newDate = moment('22-6-2018 04:20 AM', 'D-M-YYYY hh:mm A');
        component.onDateChanged(newDate);
        expect(moment(row.value[column.id]).isSame(newDate)).toBeTruthy();
    });

    it('should update row value upon user input', () => {
        const input = '22-6-2018 04:20 AM';

        component.ngOnInit();
        component.onDateChanged(input);

        const actual = row.value[column.id];
        expect(actual).toBe('22-6-2018 04:20 AM');
    });

    it('should flush value on user input', () => {
        spyOn(table, 'flushValue').and.callThrough();
        const input = '22-6-2018 04:20 AM';

        component.ngOnInit();
        component.onDateChanged(input);

        expect(table.flushValue).toHaveBeenCalled();
    });

});
