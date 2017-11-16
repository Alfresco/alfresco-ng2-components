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

import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DataColumn } from '../../data/data-column.model';
import { DataRow } from '../../data/data-row.model';
import { DataTableAdapter } from '../../data/datatable-adapter';

@Component({
    selector: 'adf-datatable-cell',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <ng-container>
            <span [title]="tooltip" class="adf-datatable-cell-value">{{value}}</span>
        </ng-container>`,
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-datatable-cell' }
})
export class DataTableCellComponent implements OnInit {

    @Input()
    data: DataTableAdapter;

    @Input()
    column: DataColumn;

    @Input()
    row: DataRow;

    @Input()
    value: any;

    @Input()
    tooltip: string;

    ngOnInit() {
        if (!this.value && this.column && this.column.key && this.row && this.data) {
            this.value = this.data.getValue(this.row, this.column);

            if (!this.tooltip) {
                this.tooltip = this.value;
            }
        }
    }

}
