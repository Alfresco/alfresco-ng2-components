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

import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MdCheckboxChange } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule } from 'ng2-alfresco-core';
import { MaterialModule } from '../../material.module';
import {
    DataColumn,
    DataRow,
    DataSorting,
    ObjectDataColumn,
    ObjectDataTableAdapter
} from './../../data/index';
import { DataTableCellComponent } from './datatable-cell.component';
import { DataTableComponent } from './datatable.component';
import { LocationCellComponent } from './location-cell.component';

describe('DataTable', () => {

    let fixture: ComponentFixture<DataTableComponent>;
    let dataTable: DataTableComponent;
    let element: any;
    let eventMock: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                CoreModule,
                MaterialModule
            ],
            declarations: [
                DataTableCellComponent,
                LocationCellComponent,
                DataTableComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DataTableComponent);
        dataTable = fixture.componentInstance;
        element = fixture.debugElement.nativeElement;
    });

    beforeEach(() => {
        eventMock = {
            preventDefault: function () {
            }
        };
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

    it('should reset selection on mode change', () => {
        spyOn(dataTable, 'resetSelection').and.callThrough();

        dataTable.data = new ObjectDataTableAdapter(
            [
                { name: '1' },
                { name: '2' }
            ],
            [ new ObjectDataColumn({ key: 'name'}) ]
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

    it('should select only one row with [single] selection mode', () => {
        dataTable.selectionMode = 'single';
        dataTable.data = new ObjectDataTableAdapter(
            [
                { name: '1' },
                { name: '2' }
            ],
            [ new ObjectDataColumn({ key: 'name'}) ]
        );
        const rows = dataTable.data.getRows();

        dataTable.ngOnChanges({});
        dataTable.onRowClick(rows[0], null);
        expect(rows[0].isSelected).toBeTruthy();
        expect(rows[1].isSelected).toBeFalsy();

        dataTable.onRowClick(rows[1], null);
        expect(rows[0].isSelected).toBeFalsy();
        expect(rows[1].isSelected).toBeTruthy();
    });

    it('should not unselect the row with [single] selection mode', () => {
        dataTable.selectionMode = 'single';
        dataTable.data = new ObjectDataTableAdapter(
            [
                { name: '1' },
                { name: '2' }
            ],
            [ new ObjectDataColumn({ key: 'name'}) ]
        );
        const rows = dataTable.data.getRows();

        dataTable.ngOnChanges({});
        dataTable.onRowClick(rows[0], null);
        expect(rows[0].isSelected).toBeTruthy();
        expect(rows[1].isSelected).toBeFalsy();

        dataTable.onRowClick(rows[0], null);
        expect(rows[0].isSelected).toBeTruthy();
        expect(rows[1].isSelected).toBeFalsy();
    });

    it('should unselect the row with [multiple] selection mode and modifier key', () => {
        dataTable.selectionMode = 'multiple';
        dataTable.data = new ObjectDataTableAdapter(
            [ { name: '1' } ],
            [ new ObjectDataColumn({ key: 'name'}) ]
        );
        const rows = dataTable.data.getRows();

        dataTable.ngOnChanges({});
        dataTable.onRowClick(rows[0], null);
        expect(rows[0].isSelected).toBeTruthy();

        dataTable.onRowClick(rows[0], null);
        expect(rows[0].isSelected).toBeTruthy();

        dataTable.onRowClick(rows[0], <any> { metaKey: true, preventDefault() {} });
        expect(rows[0].isSelected).toBeFalsy();
    });

    it('should select multiple rows with [multiple] selection mode', () => {
        dataTable.selectionMode = 'multiple';
        dataTable.data = new ObjectDataTableAdapter(
            [
                { name: '1' },
                { name: '2' }
            ],
            [ new ObjectDataColumn({ key: 'name'}) ]
        );
        const rows = dataTable.data.getRows();

        const event = new MouseEvent('click', {
            metaKey: true
        });

        dataTable.ngOnChanges({});
        dataTable.onRowClick(rows[0], event);
        dataTable.onRowClick(rows[1], event);

        expect(rows[0].isSelected).toBeTruthy();
        expect(rows[1].isSelected).toBeTruthy();
    });

    it('should put actions menu to the right by default', () => {
        dataTable.data = new ObjectDataTableAdapter([], [
            <DataColumn> {},
            <DataColumn> {},
            <DataColumn> {}
        ]);
        dataTable.actions = true;
        fixture.detectChanges();

        let headers = element.querySelectorAll('th');
        expect(headers.length).toBe(4);
        expect(headers[headers.length - 1].classList.contains('actions-column')).toBeTruthy();
    });

    it('should put actions menu to the left', () => {
        dataTable.data = new ObjectDataTableAdapter([], [
            <DataColumn> {},
            <DataColumn> {},
            <DataColumn> {}
        ]);
        dataTable.actions = true;
        dataTable.actionsPosition = 'left';
        fixture.detectChanges();

        let headers = element.querySelectorAll('th');
        expect(headers.length).toBe(4);
        expect(headers[0].classList.contains('actions-column')).toBeTruthy();
    });

    it('should initialize default adapter', () => {
        let table = new DataTableComponent(null, null);
        expect(table.data).toBeUndefined();
        table.ngOnChanges({'data': new SimpleChange('123', {}, true)});
        expect(table.data).toEqual(jasmine.any(ObjectDataTableAdapter));
    });

    it('should load data table on onChange', () => {
        let table = new DataTableComponent(null, null);
        let data = new ObjectDataTableAdapter([], []);

        expect(table.data).toBeUndefined();
        table.ngOnChanges({'data': new SimpleChange('123', data, true)});
        expect(table.data).toEqual(data);
    });

    it('should initialize with custom data', () => {
        let data = new ObjectDataTableAdapter([], []);
        dataTable.data = data;
        dataTable.ngAfterContentInit();
        expect(dataTable.data).toBe(data);
    });

    it('should emit row click event', done => {
        let row = <DataRow> {};

        dataTable.rowClick.subscribe(e => {
            expect(e.value).toBe(row);
            done();
        });

        dataTable.ngOnChanges({});
        dataTable.onRowClick(row, null);
    });

    it('should emit double click if there are two single click in 250ms', (done) => {

        let row = <DataRow> {};
        dataTable.ngOnChanges({});

        dataTable.rowDblClick.subscribe( () => {
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

        dataTable.rowDblClick.subscribe( () => {
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

        dataTable.rowClick.subscribe( () => {
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
        dataTable.ngOnChanges({'data': new SimpleChange('123', {}, true)});
        let adapter = dataTable.data;
        spyOn(adapter, 'setSorting').and.callThrough();
        dataTable.onColumnHeaderClick(null);
        expect(adapter.setSorting).not.toHaveBeenCalled();
    });

    it('should not sort upon clicking non-sortable column header', () => {
        dataTable.ngOnChanges({'data': new SimpleChange('123', {}, true)});
        let adapter = dataTable.data;
        spyOn(adapter, 'setSorting').and.callThrough();

        let column = new ObjectDataColumn({
            key: 'column_1'
        });

        dataTable.onColumnHeaderClick(column);
        expect(adapter.setSorting).not.toHaveBeenCalled();
    });

    it('should set sorting upon column header clicked', () => {
        dataTable.ngOnChanges({'data': new SimpleChange('123', {}, true)});
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
        dataTable.ngOnChanges({'data': new SimpleChange('123', {}, true)});

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
        dataTable.onSelectAllClick(<MdCheckboxChange> { checked: true });
        expect(dataTable.isSelectAllChecked).toBeTruthy();
        dataTable.onSelectAllClick(<MdCheckboxChange> { checked: false });
        expect(dataTable.isSelectAllChecked).toBeFalsy();
    });

    it('should update rows on "select all" click', () => {
        let data = new ObjectDataTableAdapter([{}, {}, {}], []);
        let rows = data.getRows();

        dataTable.data = data;
        dataTable.multiselect = true;
        dataTable.ngAfterContentInit();

        dataTable.onSelectAllClick(<MdCheckboxChange> { checked: true });
        expect(dataTable.isSelectAllChecked).toBe(true);
        for (let i = 0; i < rows.length; i++) {
            expect(rows[i].isSelected).toBe(true);
        }

        dataTable.onSelectAllClick(<MdCheckboxChange> { checked: false });
        expect(dataTable.isSelectAllChecked).toBe(false);
        for (let i = 0; i < rows.length; i++) {
            expect(rows[i].isSelected).toBe(false);
        }
    });

    it('should allow "select all" calls with no rows', () => {
        dataTable.multiselect = true;
        dataTable.ngOnChanges({'data': new SimpleChange('123', {}, true)});

        dataTable.onSelectAllClick(<MdCheckboxChange> { checked: true });
        expect(dataTable.isSelectAllChecked).toBe(true);
    });

    it('should require multiselect option to toggle row state', () => {
        let data = new ObjectDataTableAdapter([{}, {}, {}], []);
        let rows = data.getRows();

        dataTable.data = data;
        dataTable.multiselect = false;
        dataTable.ngAfterContentInit();

        dataTable.onSelectAllClick(<MdCheckboxChange> { checked: true });
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
        dataTable.ngOnChanges({'data': new SimpleChange('123', {}, true)});
        spyOn(dataTable.data, 'getSorting').and.returnValue(null);
        expect(dataTable.isColumnSorted(<DataColumn> {}, 'asc')).toBeFalsy();
    });

    it('should evaluate column sorting state', () => {
        dataTable.ngOnChanges({'data': new SimpleChange('123', {}, true)});
        spyOn(dataTable.data, 'getSorting').and.returnValue(new DataSorting('column_1', 'asc'));
        expect(dataTable.isColumnSorted(<DataColumn> {key: 'column_1'}, 'asc')).toBeTruthy();
        expect(dataTable.isColumnSorted(<DataColumn> {key: 'column_2'}, 'desc')).toBeFalsy();
    });

    it('should replace image source with fallback thumbnail on error', () => {
        let event = <any> {
            target: {
                src: 'missing-image'
            }
        };

        dataTable.fallbackThumbnail = '<fallback>';
        dataTable.onImageLoadingError(event);
        expect(event.target.src).toBe(dataTable.fallbackThumbnail);
    });

    it('should replace image source only when fallback available', () => {
        const originalSrc = 'missing-image';
        let event = <any> {
            target: {
                src: originalSrc
            }
        };

        dataTable.fallbackThumbnail = null;
        dataTable.onImageLoadingError(event);
        expect(event.target.src).toBe(originalSrc);
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
            formatTooltip: () =>  tooltip
        };
        const row = <DataRow> {};
        expect(dataTable.getCellTooltip(row, col)).toBe(tooltip);
    });

    it('should return null value from the tooltip formatter', () => {
        const col = <DataColumn> {
            key: 'name',
            type: 'text',
            formatTooltip: () =>  null
        };
        const row = <DataRow> {};
        expect(dataTable.getCellTooltip(row, col)).toBeNull();
    });

});
