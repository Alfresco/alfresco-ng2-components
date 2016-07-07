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
    expect
} from '@angular/core/testing';

import {
    DataColumn,
    DataRow, DataSorting
} from './datatable-adapter';

import {
    ObjectDataTableAdapter,
    ObjectDataRow,
    ObjectDataColumn
} from './object-datatable-adapter';

describe('ObjectDataTableAdapter', () => {

    it('should init with empty row collection', () => {
        let adapter = new ObjectDataTableAdapter(null, []);
        expect(adapter.getRows()).toBeDefined();
        expect(adapter.getRows().length).toBe(0);
    });

    it('should init with empty column collection', () => {
        let adapter = new ObjectDataTableAdapter([], null);
        expect(adapter.getColumns()).toBeDefined();
        expect(adapter.getColumns().length).toBeDefined();
    });

    it('should map rows', () => {
        let adapter = new ObjectDataTableAdapter([{}, {}], null);
        let rows = adapter.getRows();

        expect(rows.length).toBe(2);
        expect(rows[0] instanceof ObjectDataRow).toBe(true);
        expect(rows[1] instanceof ObjectDataRow).toBe(true);
    });

    it('should map columns without rows', () => {
        let adapter = new ObjectDataTableAdapter(null, [
            <DataColumn> {},
            <DataColumn> {}
        ]);
        let columns = adapter.getColumns();

        expect(columns.length).toBe(2);
        expect(columns[0] instanceof ObjectDataColumn).toBe(true);
        expect(columns[1] instanceof ObjectDataColumn).toBe(true);
    });

    it('should sort by first column if column is available', () => {
        let adapter = new ObjectDataTableAdapter(null, null);
        expect(adapter.getSorting()).toBeUndefined();
    });

    it('should apply new rows array', () => {
        let adapter = new ObjectDataTableAdapter([], []);
        let newRows = [
            <DataRow> {},
            <DataRow> {}
        ];

        adapter.setRows(newRows);
        expect(adapter.getRows()).toBe(newRows);
    });

    it('should accept null for new rows array', () => {
        let adapter = new ObjectDataTableAdapter([], []);
        expect(adapter.getRows()).toBeDefined();
        expect(adapter.getRows().length).toBe(0);

        adapter.setRows(null);
        expect(adapter.getRows()).toBeDefined();
        expect(adapter.getRows().length).toBe(0);
    });

    it('should reset rows by null value', () => {
        let adapter = new ObjectDataTableAdapter([{}, {}], []);
        expect(adapter.getRows()).toBeDefined();
        expect(adapter.getRows().length).toBe(2);

        adapter.setRows(null);
        expect(adapter.getRows()).toBeDefined();
        expect(adapter.getRows().length).toBe(0);
    });

    it('should sort new row collection', () => {
        let adapter = new ObjectDataTableAdapter([], []);
        spyOn(adapter, 'sort').and.callThrough();
        adapter.setRows([]);
        expect(adapter.sort).toHaveBeenCalled();
    });

    it('should apply new columns array', () => {
        let adapter = new ObjectDataTableAdapter([], []);
        let columns = [
            <DataColumn> {},
            <DataColumn> {}
        ];

        adapter.setColumns(columns);
        expect(adapter.getColumns()).toBe(columns);
    });

    it('should accept null for new columns array', () => {
        let adapter = new ObjectDataTableAdapter([], []);
        expect(adapter.getColumns()).toBeDefined();
        expect(adapter.getColumns().length).toBe(0);

        adapter.setColumns(null);
        expect(adapter.getColumns()).toBeDefined();
        expect(adapter.getColumns().length).toBe(0);
    });

    it('should reset columns by null value', () => {
        let adapter = new ObjectDataTableAdapter([], [
            <DataColumn> {},
            <DataColumn> {}
        ]);
        expect(adapter.getColumns()).toBeDefined();
        expect(adapter.getColumns().length).toBe(2);

        adapter.setColumns(null);
        expect(adapter.getColumns()).toBeDefined();
        expect(adapter.getColumns().length).toBe(0);
    });

    it('should fail getting value with row not defined', () => {
        let adapter = new ObjectDataTableAdapter([], []);
        expect(() => { adapter.getValue(null, null); }).toThrowError('Row not found');
    });

    it('should fail getting value with column not defined', () => {
        let adapter = new ObjectDataTableAdapter([], []);
        expect(() => { adapter.getValue(<DataRow> {}, null); }).toThrowError('Column not found');
    });

    it('should get value from row with column key', () => {
        let value = 'hello world';

        let row = jasmine.createSpyObj('row', ['getValue']);
        row.getValue.and.returnValue(value);

        let adapter = new ObjectDataTableAdapter([], []);
        let result = adapter.getValue(row, <DataColumn> { key: 'col1' });

        expect(row.getValue).toHaveBeenCalledWith('col1');
        expect(result).toBe(value);
    });

    it('should set new sorting', () => {
        let sorting = new DataSorting('key', 'direction');
        let adapter = new ObjectDataTableAdapter([], []);

        adapter.setSorting(sorting);
        expect(adapter.getSorting()).toBe(sorting);

        adapter.setSorting(null);
        expect(adapter.getSorting()).toBe(null);
    });

    it('should sort rows with new sorting value', () => {
        let adapter = new ObjectDataTableAdapter([{}, {}], []);
        spyOn(adapter.getRows(), 'sort').and.stub();

        adapter.setSorting(new DataSorting('key', 'direction'));
        expect(adapter.getRows().sort).toHaveBeenCalled();
    });

    it('should sort rows only when sorting key provided', () => {
        let adapter = new ObjectDataTableAdapter([{}, {}], []);
        spyOn(adapter.getRows(), 'sort').and.stub();

        adapter.setSorting(new DataSorting());
        expect(adapter.getRows().sort).not.toHaveBeenCalled();
    });

    it('should sort by first column by default', () => {
        let adapter = new ObjectDataTableAdapter(
            [
                { id: 2, name: 'abs' },
                { id: 1, name: 'xyz' }
            ],
            [
                new ObjectDataColumn({ key: 'id', sortable: true })
            ]
        );

        let rows = adapter.getRows();
        expect(rows[0].getValue('id')).toBe(1);
        expect(rows[1].getValue('id')).toBe(2);
    });

    it('should take first sortable column by default', () => {
        let adapter = new ObjectDataTableAdapter([], [
            <DataColumn> { key: 'icon' },
            new ObjectDataColumn({ key: 'id', sortable: true })
        ]);

        expect(adapter.getSorting()).toEqual(
            jasmine.objectContaining({
                key: 'id',
                direction: 'asc'
            })
        );
    });

    it('should sort by dates', () => {
        let adapter = new ObjectDataTableAdapter(
            [
                { id: 1, created: new Date(2016, 7, 6, 15, 7, 2) },
                { id: 2, created: new Date(2016, 7, 6, 15, 7, 1) }
            ],
            [
                <DataColumn> { key: 'id' },
                <DataColumn> { key: 'created' }
            ]
        );

        adapter.setSorting(new DataSorting('created', 'asc'));

        let rows = adapter.getRows();
        expect(rows[0].getValue('id')).toBe(2);
        expect(rows[1].getValue('id')).toBe(1);
    });

    it('should sort by first column if no sortable found', () => {
        let adapter = new ObjectDataTableAdapter(
            [
                { id: 2, name: 'abs' },
                { id: 1, name: 'xyz' }
            ],
            [
                new ObjectDataColumn({ key: 'id' }),
                new ObjectDataColumn({ key: 'name' })
            ]
        );

        expect(adapter.getSorting()).toEqual(
            jasmine.objectContaining({
                key: 'id',
                direction: 'asc'
            })
        );
    });

    it('should sort asc and desc', () => {
        let adapter = new ObjectDataTableAdapter(
            [
                { id: 2, name: 'abs' },
                { id: 1, name: 'xyz' }
            ],
            [
                new ObjectDataColumn({ key: 'id', sortable: true })
            ]
        );

        adapter.setSorting(new DataSorting('id', 'asc'));
        expect(adapter.getRows()[0].getValue('id')).toBe(1);
        expect(adapter.getRows()[1].getValue('id')).toBe(2);

        adapter.setSorting(new DataSorting('id', 'desc'));
        expect(adapter.getRows()[0].getValue('id')).toBe(2);
        expect(adapter.getRows()[1].getValue('id')).toBe(1);
    });

    it('should use asc for sort command by default', () => {
        let adapter = new ObjectDataTableAdapter([], []);
        adapter.setSorting(null);
        expect(adapter.getSorting()).toBe(null);

        adapter.sort('id', null);
        expect(adapter.getSorting()).toEqual(
            jasmine.objectContaining({
                key: 'id',
                direction: 'asc'
            })
        );
    });

    it('should use direction for sort command', () => {
        let adapter = new ObjectDataTableAdapter([], []);
        adapter.setSorting(null);
        expect(adapter.getSorting()).toBe(null);

        adapter.sort('id', 'desc');
        expect(adapter.getSorting()).toEqual(
            jasmine.objectContaining({
                key: 'id',
                direction: 'desc'
            })
        );
    });

});

describe('ObjectDataRow', () => {

    it('should require object source', () => {
        expect(() => { return new ObjectDataRow(null); }).toThrowError('Object source not found');
    });

    it('should get top level property value', () => {
        let row = new ObjectDataRow({
            id: 1
        });
        expect(row.getValue('id')).toBe(1);
    });

    it('should not get top level property value', () => {
        let row = new ObjectDataRow({});
        expect(row.getValue('missing')).toBeUndefined();
    });

    it('should get nested property value', () => {
        let row = new ObjectDataRow({
           name: {
               firstName: 'John',
               lastName: 'Doe'
           }
        });

        expect(row.getValue('name.lastName')).toBe('Doe');
    });

    it('should not get nested property value', () => {
        let row = new ObjectDataRow({});
        expect(row.getValue('some.missing.property')).toBeUndefined();
    });

    it('should check top level value exists', () => {
        let row = new ObjectDataRow({ id: 1 });

        expect(row.hasValue('id')).toBeTruthy();
        expect(row.hasValue('other')).toBeFalsy();
    });

    it('should check nested value exists', () => {
        let row = new ObjectDataRow({
            name: {
                firstName: 'John',
                lastName: 'Doe'
            }
        });

        expect(row.hasValue('name')).toBeTruthy();
        expect(row.hasValue('name.firstName')).toBeTruthy();
        expect(row.hasValue('some.other.prop')).toBeFalsy();
    });

});
