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

import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { DynamicTableModel, DynamicTableRow, DynamicTableColumn } from './../../dynamic-table.widget.model';

@Component({
    moduleId: module.id,
    selector: 'alf-date-editor',
    templateUrl: './date.editor.html',
    styleUrls: ['./date.editor.css']
})
export class DateEditorComponent implements OnInit {

    DATE_FORMAT: string = 'DD-MM-YYYY';

    datePicker: any;
    settings: any;
    value: any;

    @Input()
    table: DynamicTableModel;

    @Input()
    row: DynamicTableRow;

    @Input()
    column: DynamicTableColumn;

    constructor(private elementRef: ElementRef) {}

    ngOnInit() {
        this.settings = {
            type: 'date',
            past: moment().subtract(100, 'years'),
            future: moment().add(100, 'years')
        };

        this.value = this.table.getCellValue(this.row, this.column);
        if (this.value) {
            this.settings.init = moment(this.value, this.DATE_FORMAT);
        }

        this.datePicker = new mdDateTimePicker.default(this.settings);
        if (this.elementRef) {
            this.datePicker.trigger = this.elementRef.nativeElement.querySelector('#dateInput');
        }
    }

    onDateChanged(event: any) {
        let newValue = (<HTMLInputElement> event.target).value;
        let dateValue = moment(newValue, this.DATE_FORMAT);
        this.datePicker.time = dateValue;
        this.row.value[this.column.id] = `${dateValue.format('YYYY-MM-DD')}T00:00:00.000Z`;
        this.table.flushValue();
    };

    onDateSelected(event: CustomEvent) {
        this.value = this.datePicker.time.format('DD-MM-YYYY');
        let newValue = this.datePicker.time.format('YYYY-MM-DD');
        this.row.value[this.column.id] = `${newValue}T00:00:00.000Z`;
        this.table.flushValue();

        if (this.elementRef) {
            this.updateMaterialTextField(this.elementRef, newValue);
        }
    }

    updateMaterialTextField(elementRef: ElementRef, value: string): boolean {
        if (elementRef) {
            let el = elementRef.nativeElement;
            if (el) {
                let container = el.querySelector('.mdl-textfield');
                if (container) {
                    container.MaterialTextfield.change(value);
                    return true;
                }
            }
        }
        return false;
    }
}
