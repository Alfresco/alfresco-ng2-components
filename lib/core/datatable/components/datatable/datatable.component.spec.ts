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

import { SimpleChange, NO_ERRORS_SCHEMA, QueryList } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatCheckboxChange } from '@angular/material';
import { DataColumn } from '../../data/data-column.model';
import { DataRow } from '../../data/data-row.model';
import { DataSorting } from '../../data/data-sorting.model';
import { ObjectDataColumn } from '../../data/object-datacolumn.model';
import { ObjectDataTableAdapter } from '../../data/object-datatable-adapter';
import { DataTableComponent } from './datatable.component';
import { setupTestBed } from '../../../testing/setupTestBed';
import { CoreTestingModule } from '../../../testing/core.testing.module';
import { DataColumnListComponent } from '../../../data-column/data-column-list.component';
import { DataColumnComponent } from '../../../data-column/data-column.component';

class FakeDataRow implements DataRow {
    isDropTarget = false;
    isSelected = true;

    hasValue(key: any) {
        return true;
    }

    getValue() {
        return '1';
    }

    imageErrorResolver() {
        return './assets/images/ft_ic_miscellaneous.svg';
    }
}

describe('DataTable', () => {

    let fixture: ComponentFixture<DataTableComponent>;
    let dataTable: DataTableComponent;
    let element: any;

    setupTestBed({
        imports: [
            CoreTestingModule
        ],
        schemas: [NO_ERRORS_SCHEMA]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DataTableComponent);
        dataTable = fixture.componentInstance;
        element = fixture.debugElement.nativeElement;
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should preserve the historical selection order', () => {
        dataTable.data = new ObjectDataTableAdapter(
            [{ id: 0 }, { id: 1 }, { id: 2 }],
            [new ObjectDataColumn({ key: 'id' })]
        );

        const rows = dataTable.data.getRows();

        dataTable.selectRow(rows[2], true);
        dataTable.selectRow(rows[0], true);
        dataTable.selectRow(rows[1], true);

        const selection = dataTable.selection;
        expect(selection[0].getValue('id')).toBe(2);
        expect(selection[1].getValue('id')).toBe(0);
        expect(selection[2].getValue('id')).toBe(1);
    });

    it('should update schema if columns change', fakeAsync(() => {

        dataTable.columnList = new DataColumnListComponent();
        dataTable.columnList.columns = new QueryList<DataColumnComponent>();
        dataTable.data = new ObjectDataTableAdapter([], []);

        spyOn(dataTable.data, 'setColumns').and.callThrough();

        dataTable.ngAfterContentInit();
        dataTable.columnList.columns.reset([new DataColumnComponent()]);
        dataTable.columnList.columns.notifyOnChanges();

        tick(100);

        expect(dataTable.data.setColumns).toHaveBeenCalled();
    }));

    it('should use the cardview style if cardview is true', () => {
        let newData = new ObjectDataTableAdapter(
            [
                { name: '1' },
                { name: '2' }
            ],
            [new ObjectDataColumn({ key: 'name' })]
        );

        dataTable.display = 'gallery';
        dataTable.ngOnChanges({
            data: new SimpleChange(null, newData, false)
        });

        fixture.detectChanges();

        expect(element.querySelector('.adf-datatable-card')).not.toBeNull();
        expect(element.querySelector('.adf-datatable')).toBeNull();
    });

    it('should use the cardview style if cardview is false', () => {
        let newData = new ObjectDataTableAdapter(
            [
                { name: '1' },
                { name: '2' }
            ],
            [new ObjectDataColumn({ key: 'name' })]
        );

        dataTable.ngOnChanges({
            data: new SimpleChange(null, newData, false)
        });

        fixture.detectChanges();

        expect(element.querySelector('.adf-datatable-card')).toBeNull();
        expect(element.querySelector('.adf-datatable-list')).not.toBeNull();
    });

    it('should hide the header if showHeader is false', () => {
        let newData = new ObjectDataTableAdapter(
            [
                { name: '1' },
                { name: '2' }
            ],
            [new ObjectDataColumn({ key: 'name' })]
        );

        dataTable.showHeader = false;
        dataTable.loading = false;
        dataTable.ngOnChanges({
            data: new SimpleChange(null, newData, false)
        });

        fixture.detectChanges();

        expect(element.querySelector('.adf-datatable-header')).toBe(null);
    });

    it('should hide the header if there are no elements inside', () => {
        let newData = new ObjectDataTableAdapter(
        );

        dataTable.ngOnChanges({
            data: new SimpleChange(null, newData, false)
        });

        fixture.detectChanges();

        expect(element.querySelector('.adf-datatable-header')).toBe(null);
    });

    it('should hide the header if noPermission is true', () => {
        let newData = new ObjectDataTableAdapter(
        );

        dataTable.noPermission = true;
        dataTable.loading = false;

        dataTable.ngOnChanges({
            data: new SimpleChange(null, newData, false)
        });

        fixture.detectChanges();

        expect(element.querySelector('.adf-datatable-header')).toBe(null);
    });

    it('should show the header if showHeader is true', () => {
        let newData = new ObjectDataTableAdapter(
            [
                { name: '1' },
                { name: '2' }
            ],
            [new ObjectDataColumn({ key: 'name' })]
        );
        dataTable.showHeader = true;
        dataTable.loading = false;

        dataTable.ngOnChanges({
            data: new SimpleChange(null, newData, false)
        });

        fixture.detectChanges();

        expect(element.querySelector('.adf-datatable-header')).toBeDefined();
    });

    it('should emit "sorting-changed" DOM event', (done) => {
        const column = new ObjectDataColumn({ key: 'name', sortable: true, direction: 'asc' });
        dataTable.data = new ObjectDataTableAdapter(
            [
                { name: '1' },
                { name: '2' }
            ],
            [column]
        );
        dataTable.data.setSorting(new DataSorting('name', 'desc'));

        fixture.nativeElement.addEventListener('sorting-changed', (event: CustomEvent) => {
            expect(event.detail.key).toBe('name');
            expect(event.detail.direction).toBe('asc');
            done();
        });

        dataTable.ngOnChanges({});
        dataTable.onColumnHeaderClick(column);
    });

    it('should change the rows on changing of the data', () => {
        let newData = new ObjectDataTableAdapter(
            [
                { name: 'TEST' },
                { name: 'FAKE' }
            ],
            [new ObjectDataColumn({ key: 'name' })]
        );
        dataTable.data = new ObjectDataTableAdapter(
            [
                { name: '1' },
                { name: '2' }
            ],
            [new ObjectDataColumn({ key: 'name' })]
        );

        dataTable.ngOnChanges({
            data: new SimpleChange(null, newData, false)
        });
        fixture.detectChanges();

        expect(element.querySelector('[data-automation-id="text_TEST"]')).not.toBeNull();
        expect(element.querySelector('[data-automation-id="text_FAKE"]')).not.toBeNull();
    });

    it('should set rows to the data when rows defined', () => {
        const dataRows =
            [
                { name: 'test1' },
                { name: 'test2' },
                { name: 'test3' },
                { name: 'test4' }
            ];
        dataTable.data = new ObjectDataTableAdapter([],
            [new ObjectDataColumn({ key: 'name' })]
        );

        dataTable.ngOnChanges({
            rows: new SimpleChange(null, dataRows, false)
        });
        fixture.detectChanges();

        const rows = dataTable.data.getRows();
        expect(rows[0].getValue('name')).toEqual('test1');
        expect(rows[1].getValue('name')).toEqual('test2');
    });

    it('should set custom sort order', () => {
        const dataSortObj = new DataSorting('dummyName', 'asc');
        const dataRows =
            [
                { name: 'test1' },
                { name: 'test2' },
                { name: 'test3' },
                { name: 'test4' }
            ];
        dataTable.sorting = ['dummyName', 'asc'];
        dataTable.ngOnChanges({
            rows: new SimpleChange(null, dataRows, false)
        });
        fixture.detectChanges();
        const dataSort = dataTable.data.getSorting();
        expect(dataSort).toEqual(dataSortObj);
    });

    it('should reset selection on mode change', () => {
        spyOn(dataTable, 'resetSelection').and.callThrough();

        dataTable.data = new ObjectDataTableAdapter(
            [
                { name: '1' },
                { name: '2' }
            ],
            [new ObjectDataColumn({ key: 'name' })]
        );
        const rows = dataTable.data.getRows();
        rows[0].isSelected = true;
        rows[1].isSelected = true;

        expect(rows[0].isSelected).toBeTruthy();
        expect(rows[1].isSelected).toBeTruthy();

        dataTable.ngOnChanges({
            selectionMode: new SimpleChange(null, 'multiple', false)
        });

        expect(dataTable.resetSelection).toHaveBeenCalled();
    });

    it('should select the row where isSelected is true', () => {
        dataTable.rows = [
            { name: 'TEST1' },
            { name: 'FAKE2' },
            { name: 'TEST2', isSelected: true },
            { name: 'FAKE2' }];
        dataTable.data = new ObjectDataTableAdapter([],
            [new ObjectDataColumn({ key: 'name' })]
        );
        fixture.detectChanges();
        const rows = dataTable.data.getRows();
        expect(rows[0].isSelected).toBeFalsy();
        expect(rows[1].isSelected).toBeFalsy();
        expect(rows[2].isSelected).toBeTruthy();
        expect(rows[3].isSelected).toBeFalsy();
    });

    it('should not select any row when isSelected is not defined', () => {
        const dataRows =
            [
                { name: 'TEST1' },
                { name: 'FAKE2' },
                { name: 'TEST2' }
            ];
        dataTable.data = new ObjectDataTableAdapter(dataRows,
            [new ObjectDataColumn({ key: 'name' })]
        );

        dataTable.ngOnChanges({
            rows: new SimpleChange(null, dataRows, false)
        });
        fixture.detectChanges();

        const rows = dataTable.data.getRows();
        expect(rows[0].isSelected).toBeFalsy();
        expect(rows[1].isSelected).toBeFalsy();
        expect(rows[2].isSelected).toBeFalsy();
    });

    it('should select only one row with [single] selection mode', (done) => {
        dataTable.selectionMode = 'single';
        dataTable.data = new ObjectDataTableAdapter(
            [
                { name: '1', isSelected: true },
                { name: '2' }
            ],
            [new ObjectDataColumn({ key: 'name' })]
        );
        const rows = dataTable.data.getRows();

        dataTable.ngOnChanges({});

        dataTable.rowClick.subscribe((event) => {
            expect(rows[0].isSelected).toBeFalsy();
            expect(rows[1].isSelected).toBeTruthy();
            done();
        });

        dataTable.onRowClick(rows[1], new MouseEvent('click'));
    });

    it('should select only one row with [single] selection mode and key modifier', (done) => {
        dataTable.selectionMode = 'single';
        dataTable.data = new ObjectDataTableAdapter(
            [
                { name: '1', isSelected: true },
                { name: '2' }
            ],
            [new ObjectDataColumn({ key: 'name' })]
        );
        const rows = dataTable.data.getRows();

        dataTable.ngOnChanges({});

        dataTable.rowClick.subscribe((event) => {
            expect(rows[0].isSelected).toBeFalsy();
            expect(rows[1].isSelected).toBeTruthy();
            done();
        });

        dataTable.onRowClick(rows[1], new MouseEvent('click', {
            metaKey: true
        }));
    });

    it('should select only one row with [single] selection mode pressing enter key', () => {
        dataTable.selectionMode = 'single';
        dataTable.data = new ObjectDataTableAdapter(
            [
                { name: '1' },
                { name: '2' }
            ],
            [new ObjectDataColumn({ key: 'name' })]
        );
        const rows = dataTable.data.getRows();

        dataTable.ngOnChanges({});
        dataTable.onEnterKeyPressed(rows[0], null);
        expect(rows[0].isSelected).toBeTruthy();
        expect(rows[1].isSelected).toBeFalsy();

        dataTable.onEnterKeyPressed(rows[1], null);
        expect(rows[0].isSelected).toBeFalsy();
        expect(rows[1].isSelected).toBeTruthy();
    });

    it('should select multiple rows with [multiple] selection mode pressing enter key', () => {
        dataTable.selectionMode = 'multiple';
        dataTable.data = new ObjectDataTableAdapter(
            [
                { name: '1' },
                { name: '2' }
            ],
            [new ObjectDataColumn({ key: 'name' })]
        );
        const rows = dataTable.data.getRows();

        const event = new KeyboardEvent('enter', {
            metaKey: true
        });

        dataTable.ngOnChanges({});
        dataTable.onEnterKeyPressed(rows[0], event);
        dataTable.onEnterKeyPressed(rows[1], event);

        expect(rows[0].isSelected).toBeTruthy();
        expect(rows[1].isSelected).toBeTruthy();
    });

    it('should NOT unselect the row with [single] selection mode', (done) => {
        dataTable.selectionMode = 'single';
        dataTable.data = new ObjectDataTableAdapter(
            [
                { name: '1', isSelected: true },
                { name: '2' }
            ],
            [new ObjectDataColumn({ key: 'name' })]
        );
        const rows = dataTable.data.getRows();
        dataTable.ngOnChanges({});

        dataTable.rowClick.subscribe((event) => {
            expect(rows[0].isSelected).toBeTruthy();
            expect(rows[1].isSelected).toBeFalsy();
            done();
        });
        dataTable.onRowClick(rows[0], null);
    });

    it('should unselect the row with [multiple] selection mode and modifier key', (done) => {
        dataTable.selectionMode = 'multiple';
        dataTable.data = new ObjectDataTableAdapter(
            [{ name: '1', isSelected: true }],
            [new ObjectDataColumn({ key: 'name' })]
        );
        const rows = dataTable.data.getRows();
        rows[0].isSelected = true;

        dataTable.ngOnChanges({});
        dataTable.rowClick.subscribe(() => {
            expect(rows[0].isSelected).toBeFalsy();
            done();
        });

        dataTable.onRowClick(rows[0], <any> {
            metaKey: true, preventDefault() {
            }
        });
    });

    it('should select multiple rows with [multiple] selection mode and modifier key', (done) => {
        dataTable.selectionMode = 'multiple';
        dataTable.data = new ObjectDataTableAdapter(
            [
                { name: '1', isSelected: true },
                { name: '2' }
            ],
            [new ObjectDataColumn({ key: 'name' })]
        );
        const rows = dataTable.data.getRows();
        rows[0].isSelected = true;

        const event = new MouseEvent('click', {
            metaKey: true
        });
        dataTable.selection.push(rows[0]);
        dataTable.ngOnChanges({});
        dataTable.rowClick.subscribe(() => {
            expect(rows[0].isSelected).toBeTruthy();
            expect(rows[1].isSelected).toBeTruthy();
            done();
        });
        dataTable.onRowClick(rows[1], event);
    });

    it('should put actions menu to the right by default', () => {
        dataTable.data = new ObjectDataTableAdapter(
            [
                { name: '1' },
                { name: '2' },
                { name: '3' },
                { name: '4' }
            ],
            [new ObjectDataColumn({ key: 'name' })]
        );

        dataTable.actions = true;
        fixture.detectChanges();

        let actions = element.querySelectorAll('[id^=action_menu_right]');
        expect(actions.length).toBe(4);
    });

    it('should put actions menu to the left', () => {
        dataTable.data = new ObjectDataTableAdapter(
            [
                { name: '1' },
                { name: '2' },
                { name: '3' },
                { name: '4' }
            ],
            [new ObjectDataColumn({ key: 'name' })]
        );

        dataTable.actions = true;
        dataTable.actionsPosition = 'left';
        fixture.detectChanges();

        let actions = element.querySelectorAll('[id^=action_menu_left]');
        expect(actions.length).toBe(4);
    });

    it('should initialize default adapter', () => {
        let table = new DataTableComponent(null, null);
        expect(table.data).toBeUndefined();
        table.ngOnChanges({ 'data': new SimpleChange('123', {}, true) });
        expect(table.data).toEqual(jasmine.any(ObjectDataTableAdapter));
    });

    it('should initialize with custom data', () => {
        let data = new ObjectDataTableAdapter([], []);
        dataTable.data = data;
        dataTable.ngAfterContentInit();
        expect(dataTable.data).toBe(data);
    });

    it('should emit row click event', (done) => {
        let row = <DataRow> {};

        dataTable.rowClick.subscribe((e) => {
            expect(e.value).toBe(row);
            done();
        });

        dataTable.ngOnChanges({});
        dataTable.onRowClick(row, null);
    });

    it('should emit double click if there are two single click in 250ms', (done) => {

        let row = <DataRow> {};
        dataTable.ngOnChanges({});

        dataTable.rowDblClick.subscribe(() => {
            done();
        });

        dataTable.onRowClick(row, null);
        setTimeout(() => {
                dataTable.onRowClick(row, null);
            }
            , 240);

    });

    it('should emit double click if there are more than two single click in 250ms', (done) => {

        let row = <DataRow> {};
        dataTable.ngOnChanges({});

        dataTable.rowDblClick.subscribe(() => {
            done();
        });

        dataTable.onRowClick(row, null);
        setTimeout(() => {

                dataTable.onRowClick(row, null);
                dataTable.onRowClick(row, null);
            }
            , 240);

    });

    it('should emit single click if there are two single click in more than 250ms', (done) => {

        let row = <DataRow> {};
        let clickCount = 0;

        dataTable.ngOnChanges({});

        dataTable.rowClick.subscribe(() => {
            clickCount += 1;
            if (clickCount === 2) {
                done();
            }
        });

        dataTable.onRowClick(row, null);
        setTimeout(() => {
                dataTable.onRowClick(row, null);
            }
            , 260);
    });

    it('should emit row-click dom event', (done) => {
        let row = <DataRow> {};

        fixture.nativeElement.addEventListener('row-click', (e) => {
            expect(e.detail.value).toBe(row);
            done();
        });

        dataTable.ngOnChanges({});
        dataTable.onRowClick(row, null);
    });

    it('should emit row-dblclick dom event', (done) => {
        let row = <DataRow> {};

        fixture.nativeElement.addEventListener('row-dblclick', (e) => {
            expect(e.detail.value).toBe(row);
            done();
        });
        dataTable.ngOnChanges({});
        dataTable.onRowClick(row, null);
        dataTable.onRowClick(row, null);
    });

    it('should prevent default behaviour on row click event', () => {
        let e = jasmine.createSpyObj('event', ['preventDefault']);
        dataTable.ngAfterContentInit();
        dataTable.onRowClick(null, e);
        expect(e.preventDefault).toHaveBeenCalled();
    });

    it('should prevent default behaviour on row double-click event', () => {
        let e = jasmine.createSpyObj('event', ['preventDefault']);
        dataTable.ngOnChanges({});
        dataTable.ngAfterContentInit();
        dataTable.onRowDblClick(null, e);
        expect(e.preventDefault).toHaveBeenCalled();
    });

    it('should not sort if column is missing', () => {
        dataTable.ngOnChanges({ 'data': new SimpleChange('123', {}, true) });
        let adapter = dataTable.data;
        spyOn(adapter, 'setSorting').and.callThrough();
        dataTable.onColumnHeaderClick(null);
        expect(adapter.setSorting).not.toHaveBeenCalled();
    });

    it('should not sort upon clicking non-sortable column header', () => {
        dataTable.ngOnChanges({ 'data': new SimpleChange('123', {}, true) });
        let adapter = dataTable.data;
        spyOn(adapter, 'setSorting').and.callThrough();

        let column = new ObjectDataColumn({
            key: 'column_1'
        });

        dataTable.onColumnHeaderClick(column);
        expect(adapter.setSorting).not.toHaveBeenCalled();
    });

    it('should set sorting upon column header clicked', () => {
        dataTable.ngOnChanges({ 'data': new SimpleChange('123', {}, true) });
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
        dataTable.ngOnChanges({ 'data': new SimpleChange('123', {}, true) });

        let adapter = dataTable.data;
        let sorting = new DataSorting('column_1', 'asc');
        spyOn(adapter, 'setSorting').and.callThrough();
        spyOn(adapter, 'getSorting').and.returnValue(sorting);

        let column = new ObjectDataColumn({
            key: 'column_1',
            sortable: true
        });

        // check first click on the header
        dataTable.onColumnHeaderClick(column);
        expect(adapter.setSorting).toHaveBeenCalledWith(
            jasmine.objectContaining({
                key: 'column_1',
                direction: 'desc'
            })
        );

        // check second click on the header
        sorting.direction = 'desc';
        dataTable.onColumnHeaderClick(column);
        expect(adapter.setSorting).toHaveBeenCalledWith(
            jasmine.objectContaining({
                key: 'column_1',
                direction: 'asc'
            })
        );

    });

    it('should invert "select all" status', () => {
        expect(dataTable.isSelectAllChecked).toBeFalsy();
        dataTable.onSelectAllClick(<MatCheckboxChange> { checked: true });
        expect(dataTable.isSelectAllChecked).toBeTruthy();
        dataTable.onSelectAllClick(<MatCheckboxChange> { checked: false });
        expect(dataTable.isSelectAllChecked).toBeFalsy();
    });

    it('should reset selection upon data rows change', () => {
        let data = new ObjectDataTableAdapter([{}, {}, {}], []);

        dataTable.data = data;
        dataTable.multiselect = true;
        dataTable.ngAfterContentInit();
        dataTable.onSelectAllClick(<MatCheckboxChange> {checked: true });

        expect(dataTable.selection.every((entry) => entry.isSelected));

        data.setRows([]);
        fixture.detectChanges();

        expect(dataTable.selection.every((entry) => !entry.isSelected));
    });

    it('should update rows on "select all" click', () => {
        let data = new ObjectDataTableAdapter([{}, {}, {}], []);
        let rows = data.getRows();

        dataTable.data = data;
        dataTable.multiselect = true;
        dataTable.ngAfterContentInit();

        dataTable.onSelectAllClick(<MatCheckboxChange> {checked: true });
        expect(dataTable.isSelectAllChecked).toBe(true);
        for (let i = 0; i < rows.length; i++) {
            expect(rows[i].isSelected).toBe(true);
        }

        dataTable.onSelectAllClick(<MatCheckboxChange> {checked: false });
        expect(dataTable.isSelectAllChecked).toBe(false);
        for (let i = 0; i < rows.length; i++) {
            expect(rows[i].isSelected).toBe(false);
        }
    });

    it('should allow "select all" calls with no rows', () => {
        dataTable.multiselect = true;
        dataTable.ngOnChanges({ 'data': new SimpleChange('123', {}, true) });

        dataTable.onSelectAllClick(<MatCheckboxChange> {checked: true });
        expect(dataTable.isSelectAllChecked).toBe(true);
    });

    it('should require multiselect option to toggle row state', () => {
        let data = new ObjectDataTableAdapter([{}, {}, {}], []);
        let rows = data.getRows();

        dataTable.data = data;
        dataTable.multiselect = false;
        dataTable.ngAfterContentInit();

        dataTable.onSelectAllClick(<MatCheckboxChange> {checked: true });
        expect(dataTable.isSelectAllChecked).toBe(true);
        for (let i = 0; i < rows.length; i++) {
            expect(rows[i].isSelected).toBe(false);
        }
    });

    it('should require row and column for icon value check', () => {
        expect(dataTable.isIconValue(null, null)).toBeFalsy();
        expect(dataTable.isIconValue(<DataRow> {}, null)).toBeFalsy();
        expect(dataTable.isIconValue(null, <DataColumn> {})).toBeFalsy();
    });

    it('should use special material url scheme', () => {
        let column = <DataColumn> {};

        let row = {
            getValue: function (key: string) {
                return 'material-icons://android';
            }
        };

        expect(dataTable.isIconValue(<DataRow> row, column)).toBeTruthy();
    });

    it('should not use special material url scheme', () => {
        let column = <DataColumn> {};

        let row = {
            getValue: function (key: string) {
                return 'http://www.google.com';
            }
        };

        expect(dataTable.isIconValue(<DataRow> row, column)).toBeFalsy();
    });

    it('should parse icon value', () => {
        let column = <DataColumn> {};

        let row = {
            getValue: function (key: string) {
                return 'material-icons://android';
            }
        };

        expect(dataTable.asIconValue(<DataRow> row, column)).toBe('android');
    });

    it('should not parse icon value', () => {
        let column = <DataColumn> {};

        let row = {
            getValue: function (key: string) {
                return 'http://www.google.com';
            }
        };

        expect(dataTable.asIconValue(<DataRow> row, column)).toBe(null);
    });

    it('should parse icon values to a valid i18n key', () => {
        expect(dataTable.iconAltTextKey('custom')).toBe('ICONS.custom');
        expect(dataTable.iconAltTextKey('/path/to/custom')).toBe('ICONS.custom');
        expect(dataTable.iconAltTextKey('/path/to/custom.svg')).toBe('ICONS.custom');
    });

    it('should require column and direction to evaluate sorting state', () => {
        expect(dataTable.isColumnSorted(null, null)).toBeFalsy();
        expect(dataTable.isColumnSorted(<DataColumn> {}, null)).toBeFalsy();
        expect(dataTable.isColumnSorted(null, 'asc')).toBeFalsy();
    });

    it('should require adapter sorting to evaluate sorting state', () => {
        dataTable.ngOnChanges({ 'data': new SimpleChange('123', {}, true) });
        spyOn(dataTable.data, 'getSorting').and.returnValue(null);
        expect(dataTable.isColumnSorted(<DataColumn> {}, 'asc')).toBeFalsy();
    });

    it('should evaluate column sorting state', () => {
        dataTable.ngOnChanges({ 'data': new SimpleChange('123', {}, true) });
        spyOn(dataTable.data, 'getSorting').and.returnValue(new DataSorting('column_1', 'asc'));
        expect(dataTable.isColumnSorted(<DataColumn> { key: 'column_1' }, 'asc')).toBeTruthy();
        expect(dataTable.isColumnSorted(<DataColumn> { key: 'column_2' }, 'desc')).toBeFalsy();
    });

    it('should replace image source with fallback thumbnail on error', () => {
        let event = <any> {
            target: {
                src: 'missing-image'
            }
        };
        const row = new FakeDataRow();
        dataTable.fallbackThumbnail = '<fallback>';
        dataTable.onImageLoadingError(event, row);
        expect(event.target.src).toBe(dataTable.fallbackThumbnail);
    });

    it('should replace image source with miscellaneous icon when fallback is not available', () => {
        const originalSrc = 'missing-image';
        let event = <any> {
            target: {
                src: originalSrc
            }
        };
        const row = new FakeDataRow();
        dataTable.fallbackThumbnail = null;
        dataTable.onImageLoadingError(event, row);
        expect(event.target.src).toBe('./assets/images/ft_ic_miscellaneous.svg');
    });

    it('should not get cell tooltip when row is not provided', () => {
        const col = <DataColumn> { key: 'name', type: 'text' };
        expect(dataTable.getCellTooltip(null, col)).toBeNull();
    });

    it('should not get cell tooltip when column is not provided', () => {
        const row = <DataRow> {};
        expect(dataTable.getCellTooltip(row, null)).toBeNull();
    });

    it('should not get cell tooltip when formatter is not provided', () => {
        const col = <DataColumn> { key: 'name', type: 'text' };
        const row = <DataRow> {};
        expect(dataTable.getCellTooltip(row, col)).toBeNull();
    });

    it('should use formatter function to generate tooltip', () => {
        const tooltip = 'tooltip value';
        const col = <DataColumn> {
            key: 'name',
            type: 'text',
            formatTooltip: () => tooltip
        };
        const row = <DataRow> {};
        expect(dataTable.getCellTooltip(row, col)).toBe(tooltip);
    });

    it('should return null value from the tooltip formatter', () => {
        const col = <DataColumn> {
            key: 'name',
            type: 'text',
            formatTooltip: () => null
        };
        const row = <DataRow> {};
        expect(dataTable.getCellTooltip(row, col)).toBeNull();
    });

    it('should reset the menu cache after rows change', () => {
        let emitted = 0;
        dataTable.showRowActionsMenu.subscribe(() => {
            emitted++;
        });

        const column = <DataColumn> {};
        const row = <DataRow> {
            getValue: function (key: string) {
                return 'id';
            }
        };

        dataTable.getRowActions(row, column);
        dataTable.ngOnChanges({ 'data': new SimpleChange('123', {}, true) });
        dataTable.getRowActions(row, column);

        expect(emitted).toBe(2);
    });
});

describe('Accesibility', () => {

    let fixture: ComponentFixture<DataTableComponent>;
    let dataTable: DataTableComponent;
    let element: any;

    setupTestBed({
        imports: [
            CoreTestingModule
        ],
        schemas: [NO_ERRORS_SCHEMA]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DataTableComponent);
        dataTable = fixture.componentInstance;
        element = fixture.debugElement.nativeElement;
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should have accessibility tags', () => {

        const dataRows =
            [
                { name: 'test1' },
                { name: 'test2' },
                { name: 'test3' },
                { name: 'test4' }
            ];
        dataTable.data = new ObjectDataTableAdapter([],
            [new ObjectDataColumn({ key: 'name' })]
        );

        dataTable.ngOnChanges({
            rows: new SimpleChange(null, dataRows, false)
        });

        fixture.detectChanges();
        const datatableAttributes = element.querySelector('.adf-datatable-list').attributes;
        const datatableHeaderAttributes = element.querySelector('.adf-datatable-list .adf-datatable-header').attributes;
        const datatableHeaderCellAttributes = element.querySelector('.adf-datatable-cell-header').attributes;
        const datatableBodyAttributes = element.querySelector('.adf-datatable-body').attributes;
        const datatableBodyRowAttributes = element.querySelector('.adf-datatable-body .adf-datatable-row').attributes;
        const datatableBodyCellAttributes = element.querySelector('.adf-datatable-body .adf-datatable-cell').attributes;

        expect(datatableAttributes.getNamedItem('role').value).toEqual('grid');
        expect(datatableHeaderAttributes.getNamedItem('role').value).toEqual('rowgroup');
        expect(datatableHeaderCellAttributes.getNamedItem('role').value).toEqual('columnheader');
        expect(datatableBodyAttributes.getNamedItem('role').value).toEqual('rowgroup');
        expect(datatableBodyRowAttributes.getNamedItem('role').value).toEqual('row');
        expect(datatableBodyCellAttributes.getNamedItem('role').value).toEqual('gridcell');
    });
});
