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

    @Output()
    rowClick: EventEmitter<any> = new EventEmitter();

    @Output()
    rowDblClick: EventEmitter<any> = new EventEmitter();

    ngOnInit() {
        if (this.data) {
            console.log(this.data);
        } else {
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

    onRowDblClick(row: DataRow, e?) {
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
            if (column.key === current.key) {
                newDirection = current.direction === 'asc' ? 'desc' : 'asc';
            }
            this.data.setSorting(new DataSorting(column.key, newDirection));
        }
    }

    isIconValue(row: DataRow, col: DataColumn) {
        return row.getValue(col.key).startsWith('material-icons://');
    }

    asIconValue(row: DataRow, col: DataColumn) {
        return row.getValue(col.key).replace('material-icons://', '');
    }

    isColumnSorted(col: DataColumn, direction: string) {
        let sorting = this.data.getSorting();
        return sorting.key === col.key && sorting.direction === direction;
    }
}
