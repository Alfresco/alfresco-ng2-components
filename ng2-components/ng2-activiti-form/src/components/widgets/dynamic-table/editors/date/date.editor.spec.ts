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

import { ElementRef } from '@angular/core';
import * as moment from 'moment';
import { FormFieldModel, FormModel } from '../../../index';
import { DynamicTableColumn, DynamicTableModel, DynamicTableRow } from './../../dynamic-table.widget.model';
import { DateEditorComponent } from './date.editor';

describe('DateEditorComponent', () => {

    let nativeElement: any;
    let elementRef: ElementRef;
    let component: DateEditorComponent;
    let row: DynamicTableRow;
    let column: DynamicTableColumn;
    let table: DynamicTableModel;

    beforeEach(() => {
        nativeElement = {
            querySelector: function () { return null; }
        };

        row = <DynamicTableRow> { value: { date: '1879-03-14T00:00:00.000Z' } };
        column = <DynamicTableColumn> { id: 'date', type: 'Date' };
        const field = new FormFieldModel(new FormModel());
        table = new DynamicTableModel(field);
        table.rows.push(row);
        table.columns.push(column);

        elementRef = new ElementRef(nativeElement);
        component = new DateEditorComponent(elementRef);
        component.table = table;
        component.row = row;
        component.column = column;
    });

});
