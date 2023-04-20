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
import { FormFieldModel, FormModel, setupTestBed, CoreTestingModule } from '@alfresco/adf-core';
import { DynamicTableColumn } from '../models/dynamic-table-column.model';
import { DynamicTableRow } from '../models/dynamic-table-row.model';
import { DynamicTableModel } from '../models/dynamic-table.widget.model';
import { DateEditorComponent } from './date.editor';
import { By } from '@angular/platform-browser';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { TranslateModule } from '@ngx-translate/core';

describe('DateEditorComponent', () => {
    let component: DateEditorComponent;
    let fixture: ComponentFixture<DateEditorComponent>;
    let row: DynamicTableRow;
    let column: DynamicTableColumn;
    let table: DynamicTableModel;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DateEditorComponent);
        component = fixture.componentInstance;

        row = {value: {date: '1879-03-14T00:00:00.000Z'}} as DynamicTableRow;
        column = {id: 'date', type: 'Date'} as DynamicTableColumn;
        const field = new FormFieldModel(new FormModel());
        table = new DynamicTableModel(field, null);
        table.rows.push(row);
        table.columns.push(column);
        component.table = table;
        component.row = row;
        component.column = column;
    });

    describe('using Date Piker', () => {
        it('should update row value on change', () => {
            const input = {value: '14-03-2016'} as MatDatepickerInputEvent<any>;

            component.ngOnInit();
            component.onDateChanged(input);

            const actual = row.value[column.id];
            expect(actual).toBe('2016-03-14T00:00:00.000Z');
        });

        it('should flush value on user input', () => {
            spyOn(table, 'flushValue').and.callThrough();
            const input = {value: '14-03-2016'} as MatDatepickerInputEvent<any>;

            component.ngOnInit();
            component.onDateChanged(input);

            expect(table.flushValue).toHaveBeenCalled();
        });
    });

    describe('user manual input', () => {

        beforeEach(() => {
            spyOn(component, 'onDateChanged').and.callThrough();
            spyOn(table, 'flushValue').and.callThrough();
        });

        it('should update row value upon user input', () => {
            const inputElement = fixture.debugElement.query(By.css('input'));
            inputElement.nativeElement.value = '14-03-1879';
            inputElement.nativeElement.dispatchEvent(new Event('focusout'));
            fixture.detectChanges();

            expect(component.onDateChanged).toHaveBeenCalled();
            const actual = row.value[column.id];
            expect(actual).toBe('1879-03-14T00:00:00.000Z');
        });

        it('should flush value on user input', () => {
            const inputElement = fixture.debugElement.query(By.css('input'));
            inputElement.nativeElement.value = '14-03-1879';
            inputElement.nativeElement.dispatchEvent(new Event('focusout'));
            fixture.detectChanges();

            expect(table.flushValue).toHaveBeenCalled();
        });

        it('should not flush value when user input is wrong', () => {
            const inputElement = fixture.debugElement.query(By.css('input'));
            inputElement.nativeElement.value = 'ab-bc-de';
            inputElement.nativeElement.dispatchEvent(new Event('focusout'));

            fixture.detectChanges();
            expect(table.flushValue).not.toHaveBeenCalled();

            inputElement.nativeElement.value = '12';
            inputElement.nativeElement.dispatchEvent(new Event('focusout'));
            fixture.detectChanges();
            expect(table.flushValue).not.toHaveBeenCalled();

            inputElement.nativeElement.value = '12-11';
            inputElement.nativeElement.dispatchEvent(new Event('focusout'));
            fixture.detectChanges();
            expect(table.flushValue).not.toHaveBeenCalled();

            inputElement.nativeElement.value = '12-13-12';
            inputElement.nativeElement.dispatchEvent(new Event('focusout'));
            fixture.detectChanges();
            expect(table.flushValue).not.toHaveBeenCalled();
        });

        it('should remove the date when user removes manually', () => {
            const inputElement = fixture.debugElement.query(By.css('input'));
            inputElement.nativeElement.value = '';
            inputElement.nativeElement.dispatchEvent(new Event('focusout'));
            fixture.detectChanges();

            expect(component.onDateChanged).toHaveBeenCalled();
            const actual = row.value[column.id];
            expect(actual).toBe('');
        });
    });
});
