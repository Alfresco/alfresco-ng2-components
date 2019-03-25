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

import { DataColumn } from './data-column.model';
import { DataRow } from './data-row.model';
import { DataSorting } from './data-sorting.model';
import { ObjectDataTableAdapter } from './object-datatable-adapter';
import { ObjectDataRow } from './object-datarow.model';
import { ObjectDataColumn } from './object-datacolumn.model';

describe('ObjectDataTableAdapter', () => {

    it('should init with empty row collection', () => {
        const adapter = new ObjectDataTableAdapter(null, []);
        expect(adapter.getRows()).toBeDefined();
        expect(adapter.getRows().length).toBe(0);
    });

    it('should init with empty column collection', () => {
        const adapter = new ObjectDataTableAdapter([], null);
        expect(adapter.getColumns()).toBeDefined();
        expect(adapter.getColumns().length).toBeDefined();
    });

    it('should map rows', () => {
        const adapter = new ObjectDataTableAdapter([{}, {}], null);
        const rows = adapter.getRows();

        expect(rows.length).toBe(2);
        expect(rows[0] instanceof ObjectDataRow).toBe(true);
        expect(rows[1] instanceof ObjectDataRow).toBe(true);
    });

    it('should map columns without rows', () => {
        const adapter = new ObjectDataTableAdapter(null, [
            <DataColumn> {},
            <DataColumn> {}
        ]);
        const columns = adapter.getColumns();

        expect(columns.length).toBe(2);
        expect(columns[0] instanceof ObjectDataColumn).toBe(true);
        expect(columns[1] instanceof ObjectDataColumn).toBe(true);
    });

    it('should sort by first column if column is available', () => {
        const adapter = new ObjectDataTableAdapter(null, null);
        expect(adapter.getSorting()).toBeUndefined();
    });

    it('should apply new rows array', () => {
        const adapter = new ObjectDataTableAdapter([], []);
        const newRows = [
            <DataRow> {},
            <DataRow> {}
        ];

        adapter.setRows(newRows);
        expect(adapter.getRows()).toBe(newRows);
    });

    it('should accept null for new rows array', () => {
        const adapter = new ObjectDataTableAdapter([], []);
        expect(adapter.getRows()).toBeDefined();
        expect(adapter.getRows().length).toBe(0);

        adapter.setRows(null);
        expect(adapter.getRows()).toBeDefined();
        expect(adapter.getRows().length).toBe(0);
    });

    it('should reset rows by null value', () => {
        const adapter = new ObjectDataTableAdapter([{}, {}], []);
        expect(adapter.getRows()).toBeDefined();
        expect(adapter.getRows().length).toBe(2);

        adapter.setRows(null);
        expect(adapter.getRows()).toBeDefined();
        expect(adapter.getRows().length).toBe(0);
    });

    it('should sort new row collection', () => {
        const adapter = new ObjectDataTableAdapter([], []);
        spyOn(adapter, 'sort').and.callThrough();
        adapter.setRows([]);
        expect(adapter.sort).toHaveBeenCalled();
    });

    it('should apply new columns array', () => {
        const adapter = new ObjectDataTableAdapter([], []);
        const columns = [
            <DataColumn> {},
            <DataColumn> {}
        ];

        adapter.setColumns(columns);
        expect(adapter.getColumns()).toBe(columns);
    });

    it('should accept null for new columns array', () => {
        const adapter = new ObjectDataTableAdapter([], []);
        expect(adapter.getColumns()).toBeDefined();
        expect(adapter.getColumns().length).toBe(0);

        adapter.setColumns(null);
        expect(adapter.getColumns()).toBeDefined();
        expect(adapter.getColumns().length).toBe(0);
    });

    it('should reset columns by null value', () => {
        const adapter = new ObjectDataTableAdapter([], [
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
        const adapter = new ObjectDataTableAdapter([], []);
        expect(() => { adapter.getValue(null, null); }).toThrowError('Row not found');
    });

    it('should fail getting value with column not defined', () => {
        const adapter = new ObjectDataTableAdapter([], []);
        expect(() => { adapter.getValue(<DataRow> {}, null); }).toThrowError('Column not found');
    });

    it('should get value from row with column key', () => {
        const value = 'hello world';

        const row = jasmine.createSpyObj('row', ['getValue']);
        row.getValue.and.returnValue(value);

        const adapter = new ObjectDataTableAdapter([], []);
        const result = adapter.getValue(row, <DataColumn> { key: 'col1' });

        expect(row.getValue).toHaveBeenCalledWith('col1');
        expect(result).toBe(value);
    });

    it('should set new sorting', () => {
        const sorting = new DataSorting('key', 'direction');
        const adapter = new ObjectDataTableAdapter([], []);

        adapter.setSorting(sorting);
        expect(adapter.getSorting()).toBe(sorting);

        adapter.setSorting(null);
        expect(adapter.getSorting()).toBe(null);
    });

    it('should sort rows with new sorting value', () => {
        const adapter = new ObjectDataTableAdapter([{}, {}], []);
        spyOn(adapter.getRows(), 'sort').and.stub();

        adapter.setSorting(new DataSorting('key', 'direction'));
        expect(adapter.getRows().sort).toHaveBeenCalled();
    });

    it('should sort rows only when sorting key provided', () => {
        const adapter = new ObjectDataTableAdapter([{}, {}], []);
        spyOn(adapter.getRows(), 'sort').and.stub();

        adapter.setSorting(new DataSorting());
        expect(adapter.getRows().sort).not.toHaveBeenCalled();
    });

    it('should sort by first column by default', () => {
        const adapter = new ObjectDataTableAdapter(
            [
                { id: 2, name: 'abs' },
                { id: 1, name: 'xyz' }
            ],
            [
                new ObjectDataColumn({ key: 'id', sortable: true })
            ]
        );

        const rows = adapter.getRows();
        expect(rows[0].getValue('id')).toBe(1);
        expect(rows[1].getValue('id')).toBe(2);
    });

    it('should take first sortable column by default', () => {
        const adapter = new ObjectDataTableAdapter([], [
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
        const adapter = new ObjectDataTableAdapter(
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

        const rows = adapter.getRows();
        expect(rows[0].getValue('id')).toBe(2);
        expect(rows[1].getValue('id')).toBe(1);
    });

    it('should be sorting undefined if no sortable found', () => {
        const adapter = new ObjectDataTableAdapter(
            [
                { id: 2, name: 'abs' },
                { id: 1, name: 'xyz' }
            ],
            [
                new ObjectDataColumn({ key: 'id' }),
                new ObjectDataColumn({ key: 'name' })
            ]
        );

        expect(adapter.getSorting()).toBeUndefined();
    });

    it('should sort asc and desc', () => {
        const adapter = new ObjectDataTableAdapter(
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
        const adapter = new ObjectDataTableAdapter([], []);
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
        const adapter = new ObjectDataTableAdapter([], []);
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
        const row = new ObjectDataRow({
            id: 1
        });
        expect(row.getValue('id')).toBe(1);
    });

    it('should not get top level property value', () => {
        const row = new ObjectDataRow({});
        expect(row.getValue('missing')).toBeUndefined();
    });

    it('should get nested property value', () => {
        const row = new ObjectDataRow({
           name: {
               firstName: 'John',
               lastName: 'Doe'
           }
        });

        expect(row.getValue('name.lastName')).toBe('Doe');
    });

    it('should not get nested property value', () => {
        const row = new ObjectDataRow({});
        expect(row.getValue('some.missing.property')).toBeUndefined();
    });

    it('should check top level value exists', () => {
        const row = new ObjectDataRow({ id: 1 });

        expect(row.hasValue('id')).toBeTruthy();
        expect(row.hasValue('other')).toBeFalsy();
    });

    it('should check nested value exists', () => {
        const row = new ObjectDataRow({
            name: {
                firstName: 'John',
                lastName: 'Doe'
            }
        });

        expect(row.hasValue('name')).toBeTruthy();
        expect(row.hasValue('name.firstName')).toBeTruthy();
        expect(row.hasValue('some.other.prop')).toBeFalsy();
    });

    it('should generateSchema generate a schema from data', () => {
        const data =  [
            { id: 2, name: 'abs' },
            { id: 1, name: 'xyz' }
        ];

        const schema = ObjectDataTableAdapter.generateSchema(data);

        expect(schema.length).toBe(2);
        expect(schema[0].title).toBe('id');
        expect(schema[1].title).toBe('name');
    });

});
