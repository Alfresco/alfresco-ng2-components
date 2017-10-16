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

import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as moment from 'moment';
import { CoreModule } from 'ng2-alfresco-core';
import { MaterialModule } from '../../../../material.module';
import { FormFieldModel, FormModel } from '../../../index';
import { DynamicTableColumn, DynamicTableModel, DynamicTableRow } from './../../dynamic-table.widget.model';
import { DateEditorComponent } from './date.editor';

describe('DateEditorComponent', () => {
    let debugElement: DebugElement;
    let element: HTMLElement;
    let component: DateEditorComponent;
    let fixture: ComponentFixture<DateEditorComponent>;
    let row: DynamicTableRow;
    let column: DynamicTableColumn;
    let table: DynamicTableModel;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                DateEditorComponent
            ],
            imports: [
                CoreModule,
                MaterialModule
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DateEditorComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        debugElement = fixture.debugElement;

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
        const input = '14-03-2016';

        component.ngOnInit();
        component.onDateChanged(input);

        let actual = row.value[column.id];
        expect(actual).toBe('2016-03-14T00:00:00.000Z');
    });

    it('should flush value on user input', () => {
        spyOn(table, 'flushValue').and.callThrough();
        const input = '14-03-2016';

        component.ngOnInit();
        component.onDateChanged(input);

        expect(table.flushValue).toHaveBeenCalled();
    });

});
