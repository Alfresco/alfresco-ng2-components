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
    it,
    describe,
    expect,
    beforeEach
} from 'angular2/testing';

import { DataTableComponent } from './datatable.component';
import {
    DataRow,
    DataSorting
} from './../data/datatable-adapter';
import {
    ObjectDataTableAdapter,
    ObjectDataColumn
} from './../data/object-datatable-adapter';

describe('DataTable', () => {

    let dataTable: DataTableComponent;
    let eventMock: any;

    beforeEach(() => {
        dataTable = new DataTableComponent();

        eventMock = {
            preventDefault: function () {}
        };
    });

    it('should initialize default adapter', () => {
        expect(dataTable.data).toBeUndefined();
        dataTable.ngOnInit();
        expect(dataTable.data).toEqual(jasmine.any(ObjectDataTableAdapter));
    });

    it('should initialize with custom data', () => {
        let data = new ObjectDataTableAdapter([], []);
        dataTable.data = data;
        dataTable.ngOnInit();
        expect(dataTable.data).toBe(data);
    });

    it('should emit row click event', (done) => {
        let row = <DataRow> {};

        dataTable.rowClick.subscribe(e => {
            expect(e.value).toBe(row);
            done();
        });

        dataTable.onRowClick(row, null);
    });

    it('should prevent default event on row click event', () => {
        let e = jasmine.createSpyObj('event', ['preventDefault']);
        dataTable.ngOnInit();
        dataTable.onRowClick(null, e);
        expect(e.preventDefault).toHaveBeenCalled();
    });

    it('should not sort if column is missing', () => {
        dataTable.ngOnInit();
        let adapter = dataTable.data;
        spyOn(adapter, 'setSorting').and.callThrough();
        dataTable.onColumnHeaderClick(null);
        expect(adapter.setSorting).not.toHaveBeenCalled();
    });

    it('should not sort upon clicking non-sortable column header', () => {
        dataTable.ngOnInit();
        let adapter = dataTable.data;
        spyOn(adapter, 'setSorting').and.callThrough();

        let column = new ObjectDataColumn({
            key: 'column_1'
        });

        dataTable.onColumnHeaderClick(column);
        expect(adapter.setSorting).not.toHaveBeenCalled();
    });

    it('should set sorting upon column header clicked', () => {
        dataTable.ngOnInit();
        let adapter = dataTable.data;
        spyOn(adapter, 'setSorting').and.callThrough();

        let column = new ObjectDataColumn({
            key: 'column_1',
            sortable: true
        });

        dataTable.onColumnHeaderClick(column);
        expect(adapter.setSorting).toHaveBeenCalledWith(
            jasmine.objectContaining({
                key: 'column_1',
                direction: 'asc'
            })
        );
    });

    it('should invert sorting upon column header clicked', () => {
        dataTable.ngOnInit();

        let adapter = dataTable.data;
        spyOn(adapter, 'setSorting').and.callThrough();
        spyOn(adapter, 'getSorting').and.returnValue(new DataSorting('column_1', 'asc'));

        let column = new ObjectDataColumn({
            key: 'column_1',
            sortable: true
        });

        dataTable.onColumnHeaderClick(column);
        expect(adapter.setSorting).toHaveBeenCalledWith(
            jasmine.objectContaining({
                key: 'column_1',
                direction: 'desc'
            })
        );

    });

});
