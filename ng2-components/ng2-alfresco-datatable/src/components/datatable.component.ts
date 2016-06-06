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

import {
    Component,
    // NgZone,
    OnInit,
    Input,
    Output,
    EventEmitter,
    AfterViewChecked
} from 'angular2/core';

import {
    DataTableAdapter,
    DataRow,
    DataColumn,
    DataSorting
} from './../data/datatable-adapter';
import { ObjectDataTableAdapter } from '../data/object-datatable-adapter';

declare var componentHandler;
declare let __moduleName: string;

@Component({
    moduleId: __moduleName,
    selector: 'alfresco-datatable',
    styleUrls: ['./datatable.component.css'],
    templateUrl: './datatable.component.html'
})
export class DataTableComponent implements OnInit, AfterViewChecked {

    @Input()
    data: DataTableAdapter;

    @Input()
    multiselect: boolean = false;

    @Input()
    actions: boolean = false;

    @Output()
    rowClick: EventEmitter<any> = new EventEmitter();

    @Output()
    rowDblClick: EventEmitter<any> = new EventEmitter();

    isSelectAllChecked: boolean = false;

    // TODO: left for reference, will be removed during future revisions
    constructor(/*private _ngZone?: NgZone*/) {
    }

    ngOnInit() {
        if (!this.data) {
            this.data = new ObjectDataTableAdapter([], []);
        }
    }

    ngAfterViewChecked() {
        // workaround for MDL issues with dynamic components
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }
    }

    onRowClick(row: DataRow, e?) {
        if (e) {
            e.preventDefault();
        }

        this.rowClick.emit({
            value: row
        });
    }

    onRowDblClick(row: DataRow, e?: Event) {
        if (e) {
            e.preventDefault();
        }

        this.rowDblClick.emit({
            value: row
        });
    }

    onColumnHeaderClick(column: DataColumn) {
        if (column && column.sortable) {
            let current = this.data.getSorting();
            let newDirection = 'asc';
            if (current && column.key === current.key) {
                newDirection = current.direction === 'asc' ? 'desc' : 'asc';
            }
            this.data.setSorting(new DataSorting(column.key, newDirection));
        }
    }

    onSelectAllClick(e?: Event) {
        if (e) {
            e.preventDefault();
        }

        this.isSelectAllChecked = !this.isSelectAllChecked;

        if (this.multiselect) {
            let rows = this.data.getRows();
            if (rows && rows.length > 0) {
                for (let i = 0; i < rows.length; i++) {
                    rows[i].isSelected = this.isSelectAllChecked;
                }
                // TODO: left for reference, will be removed during future revisions
                /*
                 this._ngZone.run(() => {
                 this.data.getRows()[1].isSelected = true;
                 });
                 */
            }
        }
    }

    isIconValue(row: DataRow, col: DataColumn) {
        if (row && col) {
            return row.getValue(col.key).startsWith('material-icons://');
        }
        return false;
    }

    asIconValue(row: DataRow, col: DataColumn) {
        if (this.isIconValue(row, col)) {
            return row.getValue(col.key).replace('material-icons://', '');
        }
        return null;
    }

    isColumnSorted(col: DataColumn, direction: string) {
        if (col && direction) {
            let sorting = this.data.getSorting();
            return sorting && sorting.key === col.key && sorting.direction === direction;
        }
        return false;
    }
}
