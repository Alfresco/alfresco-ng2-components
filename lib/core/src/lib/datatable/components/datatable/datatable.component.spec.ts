/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { SimpleChange, NO_ERRORS_SCHEMA, QueryList, Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { DataColumn } from '../../data/data-column.model';
import { DataRow } from '../../data/data-row.model';
import { DataSorting } from '../../data/data-sorting.model';
import { ObjectDataColumn } from '../../data/object-datacolumn.model';
import { ObjectDataTableAdapter } from '../../data/object-datatable-adapter';
import { DataTableComponent, ShowHeaderMode } from './datatable.component';
import { setupTestBed } from '../../../testing/setup-test-bed';
import { CoreTestingModule } from '../../../testing/core.testing.module';
import { DataColumnListComponent } from '../../data-column/data-column-list.component';
import { DataColumnComponent } from '../../data-column/data-column.component';
import { TranslateModule } from '@ngx-translate/core';
import { domSanitizerMock } from '../../../mock/dom-sanitizer-mock';
import { matIconRegistryMock } from '../../../mock/mat-icon-registry-mock';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({selector: 'adf-custom-column-template-component', template: `
    <ng-template #tmplRef></ng-template>
`})
class CustomColumnTemplateComponent {
    @ViewChild('tmplRef', { static: true }) templateRef: TemplateRef<any>;
}
@Component({
    selector: 'adf-custom-column-header-component',
    template: `
        <ng-template #tmplRef>
            CUSTOM HEADER
        </ng-template>
    `
})
class CustomColumnHeaderComponent {
    @ViewChild('tmplRef', { static: true }) templateRef: TemplateRef<any>;
}

class FakeDataRow implements DataRow {
    isDropTarget = false;
    isSelected = true;
    id?: string;

    hasValue() {
        return true;
    }

    getValue() {
        return '1';
    }

    imageErrorResolver() {
        return './assets/images/ft_ic_miscellaneous.svg';
    }
}

export const resolverFn = (row: DataRow, col: DataColumn) => {
    const value = row.getValue(col.key);
    if (col.key === 'name') {
        return  `${row.getValue('firstName')} - ${row.getValue('lastName')}`;
    }
    return value;
};

describe('DataTable', () => {

    let fixture: ComponentFixture<DataTableComponent>;
    let dataTable: DataTableComponent;
    let element: any;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ],
        declarations: [CustomColumnHeaderComponent]
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
        const newData = new ObjectDataTableAdapter(
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
        const newData = new ObjectDataTableAdapter(
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

    describe('Header modes', () => {

        const newData = new ObjectDataTableAdapter(
            [
                { name: '1' },
                { name: '2' }
            ],
            [new ObjectDataColumn({ key: 'name' })]
        );
        const emptyData = new ObjectDataTableAdapter();

        it('should show the header if showHeader is `Data` and there is data', () => {

            dataTable.showHeader = ShowHeaderMode.Data;
            dataTable.loading = false;
            dataTable.ngOnChanges({
                data: new SimpleChange(null, newData, false)
            });

            fixture.detectChanges();

            expect(element.querySelector('.adf-datatable-header')).toBeDefined();
        });

        it('should hide the header if showHeader is `Data` and there is no data', () => {

            dataTable.showHeader = ShowHeaderMode.Data;
            dataTable.loading = false;
            dataTable.ngOnChanges({
                data: new SimpleChange(null, emptyData, false)
            });

            fixture.detectChanges();

            expect(element.querySelector('.adf-datatable-header')).toBeNull();
        });

        it('should always show the header if showHeader is `Always`', () => {

            dataTable.showHeader = ShowHeaderMode.Always;
            dataTable.loading = false;

            dataTable.ngOnChanges({
                data: new SimpleChange(null, newData, false)
            });
            fixture.detectChanges();
            expect(element.querySelector('.adf-datatable-header')).toBeDefined();

            dataTable.ngOnChanges({
                data: new SimpleChange(null, emptyData, false)
            });
            fixture.detectChanges();
            expect(element.querySelector('.adf-datatable-header')).toBeDefined();
        });

        it('should never show the header if showHeader is `Never`', () => {

            dataTable.showHeader = ShowHeaderMode.Never;
            dataTable.loading = false;
            dataTable.ngOnChanges({
                data: new SimpleChange(null, newData, false)
            });

            fixture.detectChanges();

            expect(element.querySelector('.adf-datatable-header')).toBeNull();

            dataTable.ngOnChanges({
                data: new SimpleChange(null, emptyData, false)
            });

            fixture.detectChanges();

            expect(element.querySelector('.adf-datatable-header')).toBeNull();
        });

        it('should never show the header if noPermission is true', () => {

            dataTable.loading = false;
            dataTable.noPermission = true;
            dataTable.ngOnChanges({
                data: new SimpleChange(null, emptyData, false)
            });

            dataTable.showHeader = ShowHeaderMode.Data;
            fixture.detectChanges();
            expect(element.querySelector('.adf-datatable-header')).toBeNull();

            dataTable.showHeader = ShowHeaderMode.Always;
            fixture.detectChanges();
            expect(element.querySelector('.adf-datatable-header')).toBeNull();

            dataTable.showHeader = ShowHeaderMode.Never;
            fixture.detectChanges();
            expect(element.querySelector('.adf-datatable-header')).toBeNull();
        });

        it('should never show the header if loading is true', () => {

            dataTable.loading = true;
            dataTable.ngOnChanges({
                data: new SimpleChange(null, emptyData, false)
            });

            dataTable.showHeader = ShowHeaderMode.Data;
            fixture.detectChanges();
            expect(element.querySelector('.adf-datatable-header')).toBeNull();

            dataTable.showHeader = ShowHeaderMode.Always;
            fixture.detectChanges();
            expect(element.querySelector('.adf-datatable-header')).toBeNull();

            dataTable.showHeader = ShowHeaderMode.Never;
            fixture.detectChanges();
            expect(element.querySelector('.adf-datatable-header')).toBeNull();
        });
    });

    it('should emit "sorting-changed" DOM event', (done) => {
        const column = new ObjectDataColumn({ key: 'name', sortable: true, direction: 'asc', sortingKey: 'displayName' });
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
            expect(event.detail.sortingKey).toBe('displayName');
            expect(event.detail.direction).toBe('asc');
            done();
        });

        fixture.detectChanges();
        dataTable.ngAfterViewInit();
        const hedaderColumns = fixture.debugElement.nativeElement.querySelectorAll('.adf-datatable-cell-header-content');

        hedaderColumns[0].click();
        fixture.detectChanges();
    });

    it('should change the rows on changing of the data', () => {
        const newData = new ObjectDataTableAdapter(
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

    it('should double click if keydown "enter key" on row', () => {
        const event = new KeyboardEvent('keydown', {
            code: 'Enter',
            key: 'Enter'
        } as KeyboardEventInit );
        const dataRows =
            [ { name: 'test1'}, { name: 'test2' } ];

        dataTable.data = new ObjectDataTableAdapter([],
            [new ObjectDataColumn({ key: 'name' })]
        );

        dataTable.ngOnChanges({
            rows: new SimpleChange(null, dataRows, false)
        });

        fixture.detectChanges();
        dataTable.ngAfterViewInit();

        const rowElement = document.querySelectorAll('.adf-datatable-body .adf-datatable-row')[0];

        spyOn(dataTable.rowDblClick, 'emit');

        rowElement.dispatchEvent(event);

        expect(dataTable.rowDblClick.emit).toHaveBeenCalled();
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
        fixture.detectChanges();

        dataTable.rowClick.subscribe(() => {
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
        fixture.detectChanges();

        dataTable.rowClick.subscribe(() => {
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
        fixture.detectChanges();

        dataTable.rowClick.subscribe(() => {
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
        fixture.detectChanges();
        dataTable.rowClick.subscribe(() => {
            expect(rows[0].isSelected).toBeFalsy();
            done();
        });

        dataTable.onRowClick(rows[0], {
            metaKey: true,
            preventDefault: () => {}
        } as any);
    });

    it('should unselect the row searching it by row id, when row id is defined', () => {
        const findSelectionByIdSpy = spyOn(dataTable, 'findSelectionById');
        dataTable.data = new ObjectDataTableAdapter([],
            [new ObjectDataColumn({ key: 'name' })]
        );

        const fakeDataRows = [new FakeDataRow(), new FakeDataRow()];
        fakeDataRows[0].id = 'fakeRowId';
        fakeDataRows[1].id = 'fakeRowId2';

        dataTable.data.setRows(fakeDataRows);
        dataTable.selection = [...fakeDataRows];
        const indexOfSpy = spyOn(dataTable.selection, 'indexOf');

        dataTable.selectRow(fakeDataRows[0], false);

        expect(indexOfSpy).not.toHaveBeenCalled();
        expect(findSelectionByIdSpy).toHaveBeenCalledWith(fakeDataRows[0].id);
    });

    it('should unselect the row by searching for the exact same reference of it (indexOf), when row id is not defined ', () => {
        const findSelectionByIdSpy = spyOn(dataTable, 'findSelectionById');
        dataTable.data = new ObjectDataTableAdapter([],
            [new ObjectDataColumn({ key: 'name' })]
        );

        const fakeDataRows = [new FakeDataRow(), new FakeDataRow()];
        dataTable.data.setRows(fakeDataRows);
        dataTable.selection = [...fakeDataRows];
        const indexOfSpy = spyOn(dataTable.selection, 'indexOf').and.returnValue(0);

        dataTable.selectRow(fakeDataRows[0], false);

        expect(indexOfSpy).toHaveBeenCalled();
        expect(findSelectionByIdSpy).not.toHaveBeenCalled();
        expect(dataTable.selection.length).toEqual(1);
        expect(dataTable.selection[0]).toEqual(fakeDataRows[1]);
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
        fixture.detectChanges();
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

        const actions = element.querySelectorAll('[id^=action_menu_right]');
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

        const actions = element.querySelectorAll('[id^=action_menu_left]');
        expect(actions.length).toBe(4);
    });

    it('should show only visible actions', () => {
        const unfilteredActions = [
            { title: 'action1', name: 'view1', visible: true },
            { title: 'action2', name: 'view2', visible: false },
            { title: 'action3', name: 'view3', visible: null },
            { title: 'action4', name: 'view4' }
        ];

        const actions = dataTable.getVisibleActions(unfilteredActions);
        expect(actions.length).toBe(2);
        expect(actions[0].title).toBe('action1');
        expect(actions[1].title).toBe('action4');
    });

    it('should initialize default adapter', () => {
        const table = new DataTableComponent(null, null, matIconRegistryMock, domSanitizerMock);
        expect(table.data).toBeUndefined();
        table.ngOnChanges({ data: new SimpleChange('123', {}, true) });
        expect(table.data).toEqual(jasmine.any(ObjectDataTableAdapter));
    });

    it('should initialize with custom data', () => {
        const data = new ObjectDataTableAdapter([], []);
        dataTable.data = data;
        dataTable.ngAfterContentInit();
        expect(dataTable.data).toBe(data);
    });

    it('should emit row click event', (done) => {
        const row = {} as DataRow;
        dataTable.data = new ObjectDataTableAdapter([], []);

        dataTable.rowClick.subscribe((e) => {
            expect(e.value).toBe(row);
            done();
        });

        dataTable.ngOnChanges({});
        fixture.detectChanges();
        dataTable.onRowClick(row, null);
    });

    it('should emit double click if there are two single click in 250ms', fakeAsync(() => {
        let doubleClickCount = 0;

        const row = {} as DataRow;
        dataTable.data = new ObjectDataTableAdapter([], []);
        dataTable.ngOnChanges({});
        fixture.detectChanges();

        dataTable.rowDblClick.subscribe(() => {
            doubleClickCount += 1;
        });

        dataTable.onRowClick(row, null);
        setTimeout(() => {
            dataTable.onRowClick(row, null);
        }
            , 240);

        tick(490);


        expect(doubleClickCount).toBe(1);
   }));

    it('should emit double click if there are more than two single click in 250ms', fakeAsync(() => {
        let doubleClickCount = 0;
        const row = {} as DataRow;
        dataTable.data = new ObjectDataTableAdapter([], []);
        dataTable.ngOnChanges({});
        fixture.detectChanges();

        dataTable.rowDblClick.subscribe(() => {
            doubleClickCount += 1;
        });

        dataTable.onRowClick(row, null);
        setTimeout(() => {

            dataTable.onRowClick(row, null);
            dataTable.onRowClick(row, null);
        }
            , 240);

        tick(740);

        expect(doubleClickCount).toBe(1);
   }));

    it('should emit single click if there are two single click in more than 250ms',  fakeAsync(() => {
        const row = {} as DataRow;
        let clickCount = 0;

        dataTable.data = new ObjectDataTableAdapter([], []);
        dataTable.ngOnChanges({});
        fixture.detectChanges();

        dataTable.rowClick.subscribe(() => {
            clickCount += 1;
        });

        dataTable.onRowClick(row, null);

        setTimeout(() => {
            dataTable.onRowClick(row, null);
        }
            , 260);

        tick(510);

        expect(clickCount).toBe(2);
    }));

    it('should emit row-click dom event', (done) => {
        const row = {} as DataRow;
        dataTable.data = new ObjectDataTableAdapter([], []);

        fixture.nativeElement.addEventListener('row-click', (e) => {
            expect(e.detail.value).toBe(row);
            done();
        });

        dataTable.ngOnChanges({});
        fixture.detectChanges();
        dataTable.onRowClick(row, null);
    });

    it('should emit row-dblclick dom event', (done) => {
        const row = {} as DataRow;
        dataTable.data = new ObjectDataTableAdapter([], []);

        fixture.nativeElement.addEventListener('row-dblclick', (e) => {
            expect(e.detail.value).toBe(row);
            done();
        });
        dataTable.ngOnChanges({});
        fixture.detectChanges();
        dataTable.onRowClick(row, null);
        dataTable.onRowClick(row, null);
    });

    it('should prevent default behaviour on row click event', () => {
        const e = jasmine.createSpyObj('event', ['preventDefault']);
        dataTable.ngAfterContentInit();
        dataTable.onRowClick(null, e);
        expect(e.preventDefault).toHaveBeenCalled();
    });

    it('should prevent default behaviour on row double-click event', () => {
        const e = jasmine.createSpyObj('event', ['preventDefault']);
        dataTable.ngOnChanges({});
        dataTable.ngAfterContentInit();
        dataTable.onRowDblClick(null, e);
        expect(e.preventDefault).toHaveBeenCalled();
    });

    it('should not sort upon clicking non-sortable column header', () => {
        dataTable.data = new ObjectDataTableAdapter(
            [{ name: '1' }, { name: '2' }],
            [
                new ObjectDataColumn({ key: 'name', sortable: false }),
                new ObjectDataColumn({ key: 'other', sortable: true })
            ]
        );
        fixture.detectChanges();
        dataTable.ngAfterViewInit();
        const adapter = dataTable.data;
        spyOn(adapter, 'setSorting').and.callThrough();

        const hedaderColumns = fixture.debugElement.nativeElement.querySelectorAll('.adf-datatable-cell-header-content');
        hedaderColumns[0].click();
        fixture.detectChanges();

        expect(adapter.setSorting).not.toHaveBeenCalled();
    });

    it('should set sorting upon column header clicked', () => {
        dataTable.data = new ObjectDataTableAdapter(
            [{ name: '1' }],
            [
                new ObjectDataColumn({ key: 'column_1', sortable: true })
            ]
        );
        fixture.detectChanges();
        dataTable.ngAfterViewInit();
        const adapter = dataTable.data;
        spyOn(adapter, 'setSorting').and.callThrough();
        spyOn(dataTable.data, 'getSorting').and.returnValue(new DataSorting('column_1', 'desc'));

        const hedaderColumns = fixture.debugElement.nativeElement.querySelectorAll('.adf-datatable-cell-header-content');
        hedaderColumns[0].click();
        fixture.detectChanges();

        expect(adapter.setSorting).toHaveBeenCalledWith(new DataSorting('column_1', 'asc'));
    });

    it('should invert sorting upon column header clicked', () => {
        dataTable.data = new ObjectDataTableAdapter(
            [{ name: '1' }],
            [
                new ObjectDataColumn({ key: 'column_1', sortable: true })
            ]
        );
        fixture.detectChanges();
        dataTable.ngAfterViewInit();

        const adapter = dataTable.data;
        const sorting = new DataSorting('column_1', 'asc');
        spyOn(adapter, 'setSorting').and.callThrough();
        spyOn(adapter, 'getSorting').and.returnValue(sorting);
        const hedaderColumns = fixture.debugElement.nativeElement.querySelectorAll('.adf-datatable-cell-header-content');

        // // check first click on the header
        hedaderColumns[0].click();
        fixture.detectChanges();

        expect(adapter.setSorting).toHaveBeenCalledWith(new DataSorting('column_1', 'desc'));

        // check second click on the header
        sorting.direction = 'desc';
        hedaderColumns[0].click();
        fixture.detectChanges();

        expect(adapter.setSorting).toHaveBeenCalledWith(new DataSorting('column_1', 'asc'));
   });

    it('should indicate column that has sorting applied', () => {
        dataTable.data = new ObjectDataTableAdapter(
            [{ name: '1' }, { name: '2' }],
            [
                new ObjectDataColumn({ key: 'name', sortable: true }),
                new ObjectDataColumn({ key: 'other', sortable: true })
            ]
        );
        fixture.detectChanges();
        dataTable.ngAfterViewInit();

        const [col1, col2] = dataTable.getSortableColumns();
        const hedaderColumns = fixture.debugElement.nativeElement.querySelectorAll('.adf-datatable-cell-header-content');

        hedaderColumns[1].click();
        fixture.detectChanges();

        expect(dataTable.isColumnSortActive(col1)).toBe(false);
        expect(dataTable.isColumnSortActive(col2)).toBe(true);
    });

    it('should return false for columns that have no sorting', () => {
        dataTable.data = new ObjectDataTableAdapter(
            [{ name: '1' }, { name: '2' }],
            [
                new ObjectDataColumn({ key: 'name', sortable: false }),
                new ObjectDataColumn({ key: 'other', sortable: false })
            ]
        );

        const [col1, col2] = dataTable.getSortableColumns();

        expect(dataTable.isColumnSortActive(col1)).toBe(false);
        expect(dataTable.isColumnSortActive(col2)).toBe(false);
    });

    it('should invert "select all" status', () => {
        expect(dataTable.isSelectAllChecked).toBeFalsy();
        dataTable.onSelectAllClick({ checked: true } as MatCheckboxChange);
        expect(dataTable.isSelectAllChecked).toBeTruthy();
        dataTable.onSelectAllClick({ checked: false } as MatCheckboxChange);
        expect(dataTable.isSelectAllChecked).toBeFalsy();
    });

    it('should update rows on "select all" click', () => {
        const data = new ObjectDataTableAdapter([{}, {}, {}], []);
        const rows = data.getRows();

        dataTable.data = data;
        dataTable.multiselect = true;
        dataTable.ngAfterContentInit();

        dataTable.onSelectAllClick({ checked: true } as MatCheckboxChange);
        expect(dataTable.isSelectAllChecked).toBe(true);
        for (let i = 0; i < rows.length; i++) {
            expect(rows[i].isSelected).toBe(true);
        }

        dataTable.onSelectAllClick({ checked: false } as MatCheckboxChange);
        expect(dataTable.isSelectAllChecked).toBe(false);
        for (let i = 0; i < rows.length; i++) {
            expect(rows[i].isSelected).toBe(false);
        }
    });

    it('should allow "select all" calls with no rows', () => {
        dataTable.multiselect = true;
        dataTable.ngOnChanges({ data: new SimpleChange('123', {}, true) });

        dataTable.onSelectAllClick({ checked: true } as MatCheckboxChange);
        expect(dataTable.isSelectAllChecked).toBe(true);
    });

    it('should have indeterminate state for "select all" when at least 1 row is selected or not all rows', () => {
        dataTable.data = new ObjectDataTableAdapter(
            [{ name: '1' }, { name: '2' }],
            [
                new ObjectDataColumn({ key: 'name', sortable: false }),
                new ObjectDataColumn({ key: 'other', sortable: false })
            ]
        );
        const rows = dataTable.data.getRows();

        dataTable.multiselect = true;
        dataTable.onCheckboxChange(rows[0], { checked: true } as MatCheckboxChange);
        expect(dataTable.isSelectAllIndeterminate).toBe(true);
        expect(dataTable.isSelectAllChecked).toBe(false);

        dataTable.onCheckboxChange(rows[1], { checked: true } as MatCheckboxChange);
        expect(dataTable.isSelectAllIndeterminate).toBe(false);
        expect(dataTable.isSelectAllChecked).toBe(true);

        dataTable.onCheckboxChange(rows[0], { checked: false } as MatCheckboxChange);
        dataTable.onCheckboxChange(rows[1], { checked: false } as MatCheckboxChange);
        expect(dataTable.isSelectAllIndeterminate).toBe(false);
        expect(dataTable.isSelectAllChecked).toBe(false);
    });

    it('should allow select row when multi-select enabled', () => {
        const data = new ObjectDataTableAdapter([{}, {}], []);
        const rows = data.getRows();

        dataTable.multiselect = true;
        dataTable.ngOnChanges({ data: new SimpleChange('123', data, true) });

        expect(rows[0].isSelected).toBe(false);
        expect(rows[1].isSelected).toBe(false);

        dataTable.onCheckboxChange(rows[1], { checked: true } as MatCheckboxChange);
        expect(rows[0].isSelected).toBe(false);
        expect(rows[1].isSelected).toBe(true);

        dataTable.onCheckboxChange(rows[0], { checked: true } as MatCheckboxChange);
        expect(rows[0].isSelected).toBe(true);
        expect(rows[1].isSelected).toBe(true);
    });

    it('should require multiselect option to toggle row state', () => {
        const data = new ObjectDataTableAdapter([{}, {}, {}], []);
        const rows = data.getRows();

        dataTable.data = data;
        dataTable.multiselect = false;
        dataTable.ngAfterContentInit();

        dataTable.onSelectAllClick({ checked: true } as MatCheckboxChange);
        expect(dataTable.isSelectAllChecked).toBe(true);
        for (let i = 0; i < rows.length; i++) {
            expect(rows[i].isSelected).toBe(false);
        }
    });

    it('should require row and column for icon value check', () => {
        expect(dataTable.isIconValue(null, null)).toBeFalsy();
        expect(dataTable.isIconValue({} as DataRow, null)).toBeFalsy();
        expect(dataTable.isIconValue(null, {} as DataColumn)).toBeFalsy();
    });

    it('should use special material url scheme', () => {
        const column = {} as DataColumn;

        const row: any = {
            getValue: () => 'material-icons://android'
        };

        expect(dataTable.isIconValue(row, column)).toBeTruthy();
    });

    it('should not use special material url scheme', () => {
        const column = {} as DataColumn;

        const row: any = {
            getValue: () => 'http://www.google.com'
        };

        expect(dataTable.isIconValue(row, column)).toBeFalsy();
    });

    it('should parse icon value', () => {
        const column = {} as DataColumn;

        const row: any = {
            getValue: () => 'material-icons://android'
        };

        expect(dataTable.asIconValue(row, column)).toBe('android');
    });

    it('should not parse icon value', () => {
        const column = {} as DataColumn;

        const row: any = {
            getValue: () => 'http://www.google.com'
        };

        expect(dataTable.asIconValue(row, column)).toBe(null);
    });

    it('should parse icon values to a valid i18n key', () => {
        expect(dataTable.iconAltTextKey('custom')).toBe('ICONS.custom');
        expect(dataTable.iconAltTextKey('/path/to/custom')).toBe('ICONS.custom');
        expect(dataTable.iconAltTextKey('/path/to/custom.svg')).toBe('ICONS.custom');
    });

    it('should require column and direction to evaluate sorting state', () => {
        expect(dataTable.isColumnSorted(null, null)).toBeFalsy();
        expect(dataTable.isColumnSorted({} as DataColumn, null)).toBeFalsy();
        expect(dataTable.isColumnSorted(null, 'asc')).toBeFalsy();
    });

    it('should require adapter sorting to evaluate sorting state', () => {
        dataTable.ngOnChanges({ data: new SimpleChange('123', {}, true) });
        spyOn(dataTable.data, 'getSorting').and.returnValue(null);
        expect(dataTable.isColumnSorted({} as DataColumn, 'asc')).toBeFalsy();
    });

    it('should evaluate column sorting state', () => {
        dataTable.ngOnChanges({ data: new SimpleChange('123', {}, true) });
        spyOn(dataTable.data, 'getSorting').and.returnValue(new DataSorting('column_1', 'asc'));
        expect(dataTable.isColumnSorted({ key: 'column_1' } as DataColumn, 'asc')).toBeTruthy();
        expect(dataTable.isColumnSorted({ key: 'column_2' } as DataColumn, 'desc')).toBeFalsy();
    });

    it('should replace image source with fallback thumbnail on error', () => {
        const event = {
            target: {
                src: 'missing-image'
            }
        } as any;
        const row = new FakeDataRow();
        dataTable.fallbackThumbnail = '<fallback>';
        dataTable.onImageLoadingError(event, row);
        expect(event.target.src).toBe(dataTable.fallbackThumbnail);
    });

    it('should replace image source with miscellaneous icon when fallback is not available', () => {
        const originalSrc = 'missing-image';
        const event = {
            target: {
                src: originalSrc
            }
        } as any;
        const row = new FakeDataRow();
        dataTable.fallbackThumbnail = null;
        dataTable.onImageLoadingError(event, row);
        expect(event.target.src).toBe('./assets/images/ft_ic_miscellaneous.svg');
    });

    it('should not get cell tooltip when row is not provided', () => {
        const col = { key: 'name', type: 'text' } as DataColumn;
        expect(dataTable.getCellTooltip(null, col)).toBeNull();
    });

    it('should not get cell tooltip when column is not provided', () => {
        const row = {} as DataRow;
        expect(dataTable.getCellTooltip(row, null)).toBeNull();
    });

    it('should not get cell tooltip when formatter is not provided', () => {
        const col = { key: 'name', type: 'text' } as DataColumn;
        const row = {} as DataRow;
        expect(dataTable.getCellTooltip(row, col)).toBeNull();
    });

    it('should use formatter function to generate tooltip', () => {
        const tooltip = 'tooltip value';
        const col = {
            key: 'name',
            type: 'text',
            formatTooltip: () => tooltip
        } as DataColumn;
        const row = {} as DataRow;
        expect(dataTable.getCellTooltip(row, col)).toBe(tooltip);
    });

    it('should return null value from the tooltip formatter', () => {
        const col = {
            key: 'name',
            type: 'text',
            formatTooltip: () => null
        } as DataColumn;
        const row = {} as DataRow;
        expect(dataTable.getCellTooltip(row, col)).toBeNull();
    });

    it('should reset the menu cache after rows change', () => {
        let emitted = 0;
        dataTable.showRowActionsMenu.subscribe(() => {
            emitted++;
        });

        const column = {} as any;
        const row: any = {
            getValue: () => 'id'
        };

        dataTable.getRowActions(row, column);
        dataTable.ngOnChanges({ data: new SimpleChange('123', {}, true) });
        dataTable.getRowActions(row, column);

        expect(emitted).toBe(2);
    });

    it('should enable sticky header if the stickyHeader is set to true and header is visible', () => {
        dataTable.data = new ObjectDataTableAdapter(
            [
                { name: '1' },
                { name: '2' },
                { name: '3' },
                { name: '4' }
            ],
            [new ObjectDataColumn({ key: 'name', title: 'Name' })]
        );

        dataTable.stickyHeader = true;
        dataTable.loading = false;
        dataTable.noPermission = false;
        fixture.detectChanges();
        expect(element.querySelector('.adf-sticky-header')).not.toBeNull();
    });

    it('should disable sticky header if component is loading', () => {
        dataTable.data = new ObjectDataTableAdapter(
            [
                { name: '1' },
                { name: '2' },
                { name: '3' },
                { name: '4' }
            ],
            [new ObjectDataColumn({ key: 'name', title: 'Name' })]
        );

        dataTable.stickyHeader = true;
        dataTable.loading = true;
        dataTable.noPermission = false;
        fixture.detectChanges();
        expect(element.querySelector('.adf-sticky-header')).toBeNull();
    });

    it('should disable sticky header if user has no permissions', () => {
        dataTable.data = new ObjectDataTableAdapter(
            [
                { name: '1' },
                { name: '2' },
                { name: '3' },
                { name: '4' }
            ],
            [new ObjectDataColumn({ key: 'name', title: 'Name' })]
        );

        dataTable.stickyHeader = true;
        dataTable.loading = false;
        dataTable.noPermission = true;
        fixture.detectChanges();
        expect(element.querySelector('.adf-sticky-header')).toBeNull();
    });

    it('should disable sticky header if user has no content', () => {
        dataTable.data = new ObjectDataTableAdapter(
            [],
            [new ObjectDataColumn({ key: 'name', title: 'Name' })]
        );

        dataTable.stickyHeader = true;
        dataTable.loading = false;
        dataTable.noPermission = false;
        fixture.detectChanges();
        expect(element.querySelector('.adf-sticky-header')).toBeNull();
    });

    it('should be able to define values using the resolver function', () => {
        dataTable.data = new ObjectDataTableAdapter([
            { id: 1, firstName: 'foo', lastName: 'bar' },
            { id: 2, firstName: 'bar', lastName: 'baz' }],
            [new ObjectDataColumn({ key: 'id' }), new ObjectDataColumn({ key: 'name' })]
        );
        spyOn(dataTable, 'resolverFn').and.callFake(resolverFn);
        fixture.detectChanges();

        const id1 = element.querySelector('[data-automation-id="text_1"]');
        const id2 = element.querySelector('[data-automation-id="text_2"]');
        const namesId1 = element.querySelector('[data-automation-id="text_foo - bar"]');
        const namesId2 = element.querySelector('[data-automation-id="text_bar - baz"]');

        expect(id1.innerText).toEqual('1');
        expect(namesId1.innerText).toEqual('foo - bar');
        expect(id2.innerText).toEqual('2');
        expect(namesId2.innerText).toEqual('bar - baz');

        expect(dataTable.data.getRows().length).toEqual(2);
    });

    it('should update data columns when columns input changes', () => {
        const existingDataColumnsSchema = [new ObjectDataColumn({ key: 'id' })];
        const existingData = [{ id: 'fake-data' }];
        dataTable.data = new ObjectDataTableAdapter(
            existingData,
            existingDataColumnsSchema
        );

        const newDataColumnsSchema = { key: 'new-column'};
        const columnsChange = new SimpleChange(null, [newDataColumnsSchema], false);
        dataTable.ngOnChanges({ columns: columnsChange });
        const expectedNewDataColumns = [new ObjectDataColumn(newDataColumnsSchema)];
        expect(dataTable.data.getColumns()).toEqual(expectedNewDataColumns);
    });

    it('should render the custom column header', () => {
        const customHeader = TestBed.createComponent(CustomColumnHeaderComponent).componentInstance.templateRef;
        dataTable.data = new ObjectDataTableAdapter([
                { id: 1, name: 'foo' },
                { id: 2, name: 'bar' }
            ],
            [
                new ObjectDataColumn({ key: 'id', title: 'ID' }),
                new ObjectDataColumn({ key: 'name', title: 'Name', header: customHeader })
            ]
        );
        fixture.detectChanges();

        const idColumn = element.querySelector('[data-automation-id="auto_id_id"]');
        const nameColumn = element.querySelector('[data-automation-id="auto_id_name"]');

        expect(idColumn.innerText).toContain('ID');
        expect(nameColumn.innerText).toContain('CUSTOM HEADER');
    });

    it('should set isContextMenuSource to true for row whose id matches selectedRowId', () => {
        const rows = [{
            id: '1234',
            isContextMenuSource: false
        }, {
            id: '2345',
            isContextMenuSource: false
        }, {
            id: '3456',
            isContextMenuSource: false
        }] as DataRow[];
        const row = {
            id: '2345',
            isContextMenuSource: false
        } as DataRow;
        dataTable.data = new ObjectDataTableAdapter(
            rows,
            [new ObjectDataColumn({ key: 'id' }),
            new ObjectDataColumn({ key: 'isContextMenuSource' })]
        );

        dataTable.markRowAsContextMenuSource(row);
        fixture.detectChanges();

        expect(dataTable.selectedRowId).toEqual('2345');
        expect(row.isContextMenuSource).toBeTrue();
    });
});

describe('Accesibility', () => {

    let fixture: ComponentFixture<DataTableComponent>;
    let dataTable: DataTableComponent;
    let element: any;
    let columnCustomTemplate: TemplateRef<any>;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ],
        declarations: [CustomColumnTemplateComponent],
        schemas: [NO_ERRORS_SCHEMA]
    });

    beforeEach(() => {
        columnCustomTemplate = TestBed.createComponent(CustomColumnTemplateComponent).componentInstance.templateRef;
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

    describe('aria-sort', () => {
        let column: DataColumn;

        beforeEach(() => {
            column = new ObjectDataColumn({ key: 'key' });
        });

        it('should return correct translation key when no sort is applied', () => {
            spyOn(dataTable, 'isColumnSortActive').and.returnValue(false);
            expect(dataTable.getAriaSort(column)).toBe('ADF-DATATABLE.ACCESSIBILITY.SORT_NONE');
        });

        it('should return translation key when column sort is ascending', () => {
            const isColumnSortedAsc = true;
            spyOn(dataTable, 'isColumnSortActive').and.returnValue(true);
            spyOn(dataTable, 'isColumnSorted').and.returnValue(isColumnSortedAsc);

            expect(dataTable.getAriaSort(column)).toBe('ADF-DATATABLE.ACCESSIBILITY.SORT_ASCENDING');
        });

        it('should return translation key when column sort is descending', () => {
            const isColumnSortedAsc = false;
            spyOn(dataTable, 'isColumnSortActive').and.returnValue(true);
            spyOn(dataTable, 'isColumnSorted').and.returnValue(isColumnSortedAsc);

            expect(dataTable.getAriaSort(column)).toBe('ADF-DATATABLE.ACCESSIBILITY.SORT_DESCENDING');
        });
    });

    it('should focus next row on ArrowDown event', () => {
        const event = new KeyboardEvent('keyup', {
            code: 'ArrowDown',
            key: 'ArrowDown',
            keyCode: 40
        } as KeyboardEventInit );

        const dataRows =
        [ { name: 'test1'}, { name: 'test2' } ];

        dataTable.data = new ObjectDataTableAdapter([],
            [new ObjectDataColumn({ key: 'name' })]
        );

        dataTable.ngOnChanges({
            rows: new SimpleChange(null, dataRows, false)
        });

        fixture.detectChanges();
        dataTable.ngAfterViewInit();

        const rowElement = document.querySelectorAll('.adf-datatable-body .adf-datatable-row')[0];
        const rowCellElement = rowElement.querySelector('.adf-datatable-cell');

        rowCellElement.dispatchEvent(new MouseEvent('click'));
        fixture.debugElement.nativeElement.dispatchEvent(event);

        expect(document.activeElement.getAttribute('data-automation-id')).toBe('datatable-row-1');
    });

    it('should focus previous row on ArrowUp event', () => {
        const event = new KeyboardEvent('keyup', {
            code: 'ArrowUp',
            key: 'ArrowUp',
            keyCode: 38
        } as KeyboardEventInit );

        const dataRows =
        [ { name: 'test1'}, { name: 'test2' } ];

        dataTable.data = new ObjectDataTableAdapter([],
            [new ObjectDataColumn({ key: 'name' })]
        );

        dataTable.ngOnChanges({
            rows: new SimpleChange(null, dataRows, false)
        });

        fixture.detectChanges();
        dataTable.ngAfterViewInit();

        const rowElement = document.querySelectorAll('.adf-datatable-body .adf-datatable-row')[1];
        const rowCellElement = rowElement.querySelector('.adf-datatable-cell');

        rowCellElement.dispatchEvent(new MouseEvent('click'));
        fixture.debugElement.nativeElement.dispatchEvent(event);

        expect(document.activeElement.getAttribute('data-automation-id')).toBe('datatable-row-0');
    });

    it('should select header row when `showHeader` is `Always`', () => {
        const event = new KeyboardEvent('keyup', {
            code: 'ArrowUp',
            key: 'ArrowUp',
            keyCode: 38
        } as KeyboardEventInit );

        const dataRows =
        [ { name: 'test1'}, { name: 'test2' } ];

        dataTable.data = new ObjectDataTableAdapter([],
            [new ObjectDataColumn({ key: 'name' })]
        );

        dataTable.showHeader = ShowHeaderMode.Always;

        dataTable.ngOnChanges({
            rows: new SimpleChange(null, dataRows, false)
        });

        fixture.detectChanges();
        dataTable.ngAfterViewInit();

        const rowElement = document.querySelector('.adf-datatable-row[data-automation-id="datatable-row-0"]');
        const rowCellElement = rowElement.querySelector('.adf-datatable-cell');

        rowCellElement.dispatchEvent(new MouseEvent('click'));
        fixture.debugElement.nativeElement.dispatchEvent(event);

        expect(document.activeElement.getAttribute('data-automation-id')).toBe('datatable-row-header');
    });

    it('should not select header row when `showHeader` is `Never`', () => {
        const event = new KeyboardEvent('keyup', {
            code: 'ArrowUp',
            key: 'ArrowUp',
            keyCode: 38
        } as KeyboardEventInit );

        const dataRows =
        [ { name: 'test1'}, { name: 'test2' } ];

        dataTable.data = new ObjectDataTableAdapter([],
            [new ObjectDataColumn({ key: 'name' })]
        );

        dataTable.showHeader = ShowHeaderMode.Never;

        dataTable.ngOnChanges({
            rows: new SimpleChange(null, dataRows, false)
        });

        fixture.detectChanges();
        dataTable.ngAfterViewInit();

        const rowElement = document.querySelector('.adf-datatable-row[data-automation-id="datatable-row-0"]');
        const rowCellElement = rowElement.querySelector('.adf-datatable-cell');

        rowCellElement.dispatchEvent(new MouseEvent('click'));
        fixture.debugElement.nativeElement.dispatchEvent(event);

        expect(document.activeElement.getAttribute('data-automation-id')).toBe('datatable-row-1');
    });

    it('should remove cell focus when [focus] is set to false', () => {
        dataTable.showHeader = ShowHeaderMode.Never;
        const dataRows = [ { name: 'name1' } ];

        dataTable.data = new ObjectDataTableAdapter([],
            [new ObjectDataColumn({ key: 'name', template: columnCustomTemplate, focus: false })]
        );

        dataTable.ngOnChanges({
            rows: new SimpleChange(null, dataRows, false)
        });

        fixture.detectChanges();
        dataTable.ngAfterViewInit();

        const cell = document.querySelector('.adf-datatable-row[data-automation-id="datatable-row-0"] .adf-cell-value');
        expect(cell.getAttribute('tabindex')).toBe(null);
    });

    it('should allow element focus when [focus] is set to true', () => {
        dataTable.showHeader = ShowHeaderMode.Never;
        const dataRows = [ { name: 'name1' } ];

        dataTable.data = new ObjectDataTableAdapter([],
            [new ObjectDataColumn({ key: 'name', template: columnCustomTemplate, focus: true })]
        );

        dataTable.ngOnChanges({
            rows: new SimpleChange(null, dataRows, false)
        });

        fixture.detectChanges();
        dataTable.ngAfterViewInit();

        const cell = document.querySelector('.adf-datatable-row[data-automation-id="datatable-row-0"] .adf-cell-value');
        expect(cell.getAttribute('tabindex')).toBe('0');
    });
});

describe('Drag&Drop column header', () => {
    let fixture: ComponentFixture<DataTableComponent>;
    let dataTable: DataTableComponent;
    let data: { id: number; name: string }[] = [];
    let dataTableSchema: DataColumn[] = [];

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ],
        declarations: [CustomColumnTemplateComponent],
        schemas: [NO_ERRORS_SCHEMA]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DataTableComponent);
        dataTable = fixture.componentInstance;
        data = [
            { id: 1, name: 'name1' },
            { id: 2, name: 'name2' }
        ];

        dataTableSchema = [
            new ObjectDataColumn({ key: 'id', title: 'ID', draggable: false }),
            new ObjectDataColumn({ key: 'name', title: 'Name', draggable: true })
        ];

        dataTable.data = new ObjectDataTableAdapter(
            [...data],
            [...dataTableSchema]
        );
    });

    it('should show/hide drag indicator icon', () => {
        fixture.detectChanges();

        const hedaderColumn = fixture.debugElement.nativeElement.querySelector('[data-automation-id="auto_id_name"]');
        hedaderColumn.dispatchEvent(new MouseEvent('mouseenter'));
        fixture.detectChanges();

        let dragIcon = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-datatable-cell-header-drag-icon-name"]');
        let dragIconPlaceholder = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-datatable-cell-header-drag-icon-placeholder-name"]');
        expect(dragIcon).toBeTruthy();
        expect(dragIconPlaceholder).toBeTruthy();

        hedaderColumn.dispatchEvent(new MouseEvent('mouseleave'));
        fixture.detectChanges();

        dragIcon = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-datatable-cell-header-drag-icon-name"]');
        dragIconPlaceholder = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-datatable-cell-header-drag-icon-placeholder-name"]');
        expect(dragIcon).toBeFalsy();
        expect(dragIconPlaceholder).toBeFalsy();
    });

    it('should not show drag indicator icon, when drag and drop is disabled', () => {
        fixture.detectChanges();

        const hedaderColumn = fixture.debugElement.nativeElement.querySelector('[data-automation-id="auto_id_id"]');
        hedaderColumn.dispatchEvent(new MouseEvent('mouseenter'));
        fixture.detectChanges();

        const dragIcon = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-datatable-cell-header-drag-icon-id"]');
        const dragIconPlaceholder = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-datatable-cell-header-drag-icon-placeholder-id"]');

        expect(dragIcon).toBeFalsy();
        expect(dragIconPlaceholder).toBeFalsy();
    });

    it('should emit on change column order', () => {
        const columnOrderChangedSpy = spyOn(dataTable.columnOrderChanged, 'emit');
        const dropEvent: CdkDragDrop<unknown> = {
            previousIndex: 0,
            currentIndex: 1,
            item: undefined,
            container: undefined,
            previousContainer: undefined,
            isPointerOverContainer: true,
            distance: { x: 0, y: 0 }
        } as any;

        dataTable.onDropHeaderColumn(dropEvent);

        expect(columnOrderChangedSpy).toHaveBeenCalledWith(dataTableSchema.reverse());
    });

    it('should change columns order', () => {
        const dropEvent: CdkDragDrop<unknown> = {
            previousIndex: 0,
            currentIndex: 1,
            item: undefined,
            container: undefined,
            previousContainer: undefined,
            isPointerOverContainer: true,
            distance: { x: 0, y: 0 }
        } as any;

        dataTable.onDropHeaderColumn(dropEvent);

        fixture.detectChanges();

        const columns = dataTable.data.getColumns();
        const headerCells = fixture.debugElement.nativeElement.querySelectorAll('.adf-datatable-cell--text.adf-datatable-cell-header');

        expect(columns[0].key).toEqual(dataTableSchema[1].key);
        expect(columns[1].key).toEqual(dataTableSchema[0].key);

        expect(headerCells[0].innerText).toBe(dataTableSchema[1].title);
        expect(headerCells[1].innerText).toBe(dataTableSchema[0].title);
    });
});

describe('Show/hide columns', () => {
    let fixture: ComponentFixture<DataTableComponent>;
    let dataTable: DataTableComponent;
    let data: DataColumn[] = [];
    let dataTableSchema: DataColumn[] = [];

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ],
        declarations: [CustomColumnTemplateComponent],
        schemas: [NO_ERRORS_SCHEMA]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DataTableComponent);
        dataTable = fixture.componentInstance;
        data = [
            { id: '1', title: 'name1', key: 'key', type: 'text' },
            { id: '2', title: 'name1', key: 'key', type: 'text' },
            { id: '3', title: 'name1', key: 'key', type: 'text' }
        ];

        dataTableSchema = [
            new ObjectDataColumn({ key: 'id', title: 'ID' }),
            new ObjectDataColumn({ key: 'name', title: 'Name'}),
            new ObjectDataColumn({ key: 'status', title: 'status', isHidden: true })
        ];

        dataTable.data = new ObjectDataTableAdapter(
            [...data],
            [...dataTableSchema]
        );

        fixture.detectChanges();
    });

    it('should hide columns with isHidden prop', () => {
        const headerCells = fixture.debugElement.nativeElement.querySelectorAll('.adf-datatable-cell--text.adf-datatable-cell-header');

        expect(headerCells.length).toBe(2);
    });

    it('should reload columns after changing columns visibility', () => {
        const columns = [
            new ObjectDataColumn({ key: 'id', title: 'ID' }),
            new ObjectDataColumn({ key: 'name', title: 'Name', isHidden: true }),
            new ObjectDataColumn({ key: 'status', title: 'status', isHidden: true })
        ];

        dataTable.ngOnChanges({
            columns: {
                previousValue: undefined,
                currentValue: columns,
                firstChange: false,
                isFirstChange: () => false
            }
        });

        fixture.detectChanges();

        const headerCells = fixture.debugElement.nativeElement.querySelectorAll('.adf-datatable-cell--text.adf-datatable-cell-header');
        expect(headerCells.length).toBe(1);
    });

    describe('markRowAsContextMenuSource', () => {
        it('should set isContextMenuSource to false for all rows returned by getRows function', () => {
            const rows = [{
                isContextMenuSource: true
            }, {
                isContextMenuSource: true
            }] as DataRow[];
            spyOn(dataTable.data, 'getRows').and.returnValue(rows);
            dataTable.markRowAsContextMenuSource({} as DataRow);
            rows.forEach((row) => expect(row.isContextMenuSource).toBeFalse());
        });

        it('should set isContextMenuSource to true for passed row', () => {
            const row = {
                isContextMenuSource: false
            } as DataRow;
            dataTable.markRowAsContextMenuSource(row);
            expect(row.isContextMenuSource).toBeTrue();
        });
    });
});

describe('Column Resizing', () => {
    let fixture: ComponentFixture<DataTableComponent>;
    let dataTable: DataTableComponent;
    let data: { id: number; name: string }[] = [];
    let dataTableSchema: DataColumn[] = [];

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ],
        declarations: [CustomColumnTemplateComponent],
        schemas: [NO_ERRORS_SCHEMA]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DataTableComponent);
        dataTable = fixture.componentInstance;
        data = [
            { id: 1, name: 'name1' },
            { id: 2, name: 'name2' }
        ];

        dataTableSchema = [
            new ObjectDataColumn({ key: 'id', title: 'ID', draggable: true }),
            new ObjectDataColumn({ key: 'name', title: 'Name', draggable: true })
        ];

        dataTable.data = new ObjectDataTableAdapter(
            [...data],
            [...dataTableSchema]
        );

        dataTable.isResizingEnabled = false;
        fixture.detectChanges();
    });

    it('should NOT display resize handle when the feature is Disabled [isResizingEnabled=false]', () => {
        const resizeHandle = fixture.debugElement.nativeElement.querySelector('.adf-datatable__resize-handle');

        expect(resizeHandle).toBeNull();
        const headerColumns = fixture.debugElement.nativeElement.querySelectorAll('.adf-datatable-cell-header');

        headerColumns.forEach((header: HTMLElement) => {
            expect(header.classList).toContain('adf-datatable__cursor--pointer');
        });
    });

    it('should display resize handle when the feature is Enabled [isResizingEnabled=true]', () => {
        dataTable.isResizingEnabled = true;

        fixture.detectChanges();
        const resizeHandle = fixture.debugElement.nativeElement.querySelector('.adf-datatable__resize-handle');

        expect(resizeHandle).not.toBeNull();
        const headerColumns = fixture.debugElement.nativeElement.querySelectorAll('.adf-datatable-cell-header');

        headerColumns.forEach((header: HTMLElement) => {
            expect(header.classList).toContain('adf-datatable__cursor--pointer');
        });
    });

    it('should NOT have the cursor pointer class in the header upon resizing starts', () => {
        dataTable.isResizingEnabled = true;
        fixture.detectChanges();

        const resizeHandle: HTMLElement = fixture.debugElement.nativeElement.querySelector('.adf-datatable__resize-handle');
        resizeHandle.dispatchEvent(new MouseEvent('mousedown'));
        fixture.detectChanges();

        const headerColumns = fixture.debugElement.nativeElement.querySelectorAll('.adf-datatable-cell-header');

        expect(dataTable.isResizing).toBeTrue();
        headerColumns.forEach((header: HTMLElement) => {
            expect(header.classList).not.toContain('adf-datatable__cursor--pointer');
        });
    });

    it('should NOT have the [adf-datatable-cell-header-content--hovered] class in the header upon resizing starts', () => {
        dataTable.isResizingEnabled = true;
        fixture.detectChanges();

        const resizeHandle: HTMLElement = fixture.debugElement.nativeElement.querySelector('.adf-datatable__resize-handle');
        resizeHandle.dispatchEvent(new MouseEvent('mousedown'));
        fixture.detectChanges();

        const headerColumns = fixture.debugElement.nativeElement.querySelectorAll('.adf-datatable-cell-header-content');

        expect(dataTable.isResizing).toBeTrue();
        headerColumns.forEach((header: HTMLElement) => {
            expect(header.classList).not.toContain('adf-datatable-cell-header-content--hovered');
        });
    });

    it('should NOT display drag icon upon resizing starts', () => {
        dataTable.isResizingEnabled = true;
        fixture.detectChanges();

        const hedaderColumn = fixture.debugElement.nativeElement.querySelector('[data-automation-id="auto_id_id"]');
        hedaderColumn.dispatchEvent(new MouseEvent('mouseenter'));
        fixture.detectChanges();
        let dragIcon = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-datatable-cell-header-drag-icon-id"]');

        expect(dragIcon).not.toBeNull();

        const resizeHandle: HTMLElement[] = fixture.debugElement.nativeElement.querySelectorAll('.adf-datatable__resize-handle');
        resizeHandle[0].dispatchEvent(new MouseEvent('mousedown'));
        fixture.detectChanges();

        dragIcon = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-datatable-cell-header-drag-icon-id"]');

        expect(dataTable.isResizing).toBeTrue();
        expect(dragIcon).toBeNull();
    });

    it('should blur the table body upon resizing starts', () => {
        dataTable.isResizingEnabled = true;
        fixture.detectChanges();

        const resizeHandle: HTMLElement = fixture.debugElement.nativeElement.querySelector('.adf-datatable__resize-handle');
        resizeHandle.dispatchEvent(new MouseEvent('mousedown'));
        fixture.detectChanges();

        const tableBody = fixture.debugElement.nativeElement.querySelector('.adf-datatable-body');

        expect(dataTable.isResizing).toBeTrue();
        expect(tableBody.classList).toContain('adf-blur-datatable-body');
    });

    it('should set column width on resizing', fakeAsync(() => {
        const adapter = dataTable.data;
        spyOn(adapter, 'setColumns').and.callThrough();

        dataTable.onResizing({ rectangle: { top: 0, bottom: 10, left: 0, right: 20, width: 65 } }, 0);
        tick();

        const columns = dataTable.data.getColumns();
        expect(columns[0].width).toBe(65);
        expect(adapter.setColumns).toHaveBeenCalledWith(columns);
    }));

    it('should set column widths while resizing ONLY on visible columns', fakeAsync(() => {
        const adapter = dataTable.data;
        spyOn(adapter, 'getColumns').and.returnValue([
            {
                key: 'name',
                type: 'text',
                width: 110,
                isHidden: true
            },
            {
                key: 'status',
                type: 'text',
                width: 120,
                isHidden: false
            },
            {
                key: 'created',
                type: 'text',
                width: 150
            }
        ]);
        spyOn(adapter, 'setColumns').and.callThrough();

        dataTable.onResizing({ rectangle: { top: 0, bottom: 10, left: 0, right: 20, width: 65 } }, 0);
        tick();

        expect(adapter.setColumns).toHaveBeenCalledWith([
            { key: 'status', type: 'text', width: 65, isHidden: false },
            { key: 'created', type: 'text', width: 150 }
        ]);
    }));

    it('should set the column header style on resizing', fakeAsync(() => {
        dataTable.onResizing({ rectangle: { top: 0, bottom: 10, left: 0, right: 20, width: 125 } }, 0);
        tick();
        fixture.detectChanges();

        const headerColumns: HTMLElement[] = fixture.debugElement.nativeElement.querySelectorAll('.adf-datatable-cell-header');
        expect(headerColumns[0].style.flex).toBe('0 1 125px');
    }));

    it('should set the column header to 100px on resizing when its width goes below 100', fakeAsync(() => {
        dataTable.onResizing({ rectangle: { top: 0, bottom: 10, left: 0, right: 20, width: 85 } }, 0);
        tick();
        fixture.detectChanges();

        const headerColumns: HTMLElement[] = fixture.debugElement.nativeElement.querySelectorAll('.adf-datatable-cell-header');
        expect(headerColumns[0].style.flex).toBe('0 1 100px');
    }));

    it('should set the style of all the table cells under the resizing header on resizing', fakeAsync(() => {
        dataTable.onResizing({ rectangle: { top: 0, bottom: 10, left: 0, right: 20, width: 130 } }, 0);
        tick();
        fixture.detectChanges();

        const tableBody = fixture.debugElement.nativeElement.querySelector('.adf-datatable-body');
        const firstCell: HTMLElement = tableBody.querySelector('[data-automation-id="name1"]');
        const secondCell: HTMLElement = tableBody.querySelector('[data-automation-id="name2"]');

        expect(firstCell.style.flex).toBe('0 1 130px');
        expect(secondCell.style.flex).toBe('0 1 130px');
    }));

    it('should set the style of all the table cells under the resizing header to 100px on resizing when its width goes below 100', fakeAsync(() => {
        dataTable.onResizing({ rectangle: { top: 0, bottom: 10, left: 0, right: 20, width: 85 } }, 0);
        tick();
        fixture.detectChanges();

        const tableBody = fixture.debugElement.nativeElement.querySelector('.adf-datatable-body');
        const firstCell: HTMLElement = tableBody.querySelector('[data-automation-id="name1"]');
        const secondCell: HTMLElement = tableBody.querySelector('[data-automation-id="name2"]');

        expect(firstCell.style.flex).toBe('0 1 100px');
        expect(secondCell.style.flex).toBe('0 1 100px');
    }));

    it('should unblur the body and set the resizing to false upon resizing ends', () => {
        dataTable.isResizingEnabled = true;
        fixture.detectChanges();

        const resizeHandle: HTMLElement = fixture.debugElement.nativeElement.querySelector('.adf-datatable__resize-handle');
        resizeHandle.dispatchEvent(new MouseEvent('mousedown'));
        fixture.detectChanges();

        const tableBody = fixture.debugElement.nativeElement.querySelector('.adf-datatable-body');

        expect(dataTable.isResizing).toBeTrue();
        expect(tableBody.classList).toContain('adf-blur-datatable-body');

        resizeHandle.dispatchEvent(new MouseEvent('mousemove'));
        fixture.detectChanges();

        document.dispatchEvent(new MouseEvent('mouseup'));
        fixture.detectChanges();

        expect(dataTable.isResizing).toBeFalse();
        expect(tableBody.classList).not.toContain('adf-blur-datatable-body');
    });

    it('should emit on columns width change when resizing ends', () => {
        spyOn(dataTable.columnsWidthChanged,'emit');

        dataTable.isResizingEnabled = true;
        fixture.detectChanges();

        const resizeHandle: HTMLElement = fixture.debugElement.nativeElement.querySelector('.adf-datatable__resize-handle');
        resizeHandle.dispatchEvent(new MouseEvent('mousedown'));
        fixture.detectChanges();

        expect(dataTable.isResizing).toBeTrue();

        resizeHandle.dispatchEvent(new MouseEvent('mousemove'));
        fixture.detectChanges();

        document.dispatchEvent(new MouseEvent('mouseup'));
        fixture.detectChanges();

        expect(dataTable.isResizing).toBeFalse();
        expect(dataTable.columnsWidthChanged.emit).toHaveBeenCalled();
    });

});
