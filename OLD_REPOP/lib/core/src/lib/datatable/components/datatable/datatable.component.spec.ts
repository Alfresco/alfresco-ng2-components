/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, NO_ERRORS_SCHEMA, QueryList, SimpleChange, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { DataColumn } from '../../data/data-column.model';
import { DataRow } from '../../data/data-row.model';
import { DataSorting } from '../../data/data-sorting.model';
import { ObjectDataColumn } from '../../data/object-datacolumn.model';
import { ObjectDataTableAdapter } from '../../data/object-datatable-adapter';
import { DataTableComponent, ShowHeaderMode } from './datatable.component';
import { DataColumnListComponent } from '../../data-column/data-column-list.component';
import { DataColumnComponent } from '../../data-column/data-column.component';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { take } from 'rxjs/operators';
import { mockCarsData, mockCarsSchemaDefinition } from '../mocks/datatable.mock';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { UnitTestingUtils } from '../../../testing/unit-testing-utils';
import { HarnessLoader } from '@angular/cdk/testing';
import { ConfigurableFocusTrapFactory } from '@angular/cdk/a11y';
import { provideRouter } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'adf-custom-column-template-component',
    template: ` <ng-template #tmplRef /> `
})
class CustomColumnTemplateComponent {
    @ViewChild('tmplRef', { static: true }) templateRef: TemplateRef<any>;
}

@Component({
    selector: 'adf-custom-column-header-component',
    template: ` <ng-template #tmplRef> CUSTOM HEADER </ng-template> `
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
        return `${row.getValue('firstName')} - ${row.getValue('lastName')}`;
    }
    return value;
};

describe('DataTable', () => {
    let fixture: ComponentFixture<DataTableComponent>;
    let dataTable: DataTableComponent;
    let loader: HarnessLoader;
    let testingUtils: UnitTestingUtils;

    const testNotShownHeader = (data: ObjectDataTableAdapter) => {
        dataTable.ngOnChanges({
            data: new SimpleChange(null, data, false)
        });

        dataTable.showHeader = ShowHeaderMode.Data;
        fixture.detectChanges();
        expect(testingUtils.getByCSS('.adf-datatable-header')).toBeNull();

        dataTable.showHeader = ShowHeaderMode.Always;
        fixture.detectChanges();
        expect(testingUtils.getByCSS('.adf-datatable-header')).toBeNull();

        dataTable.showHeader = ShowHeaderMode.Never;
        fixture.detectChanges();
        expect(testingUtils.getByCSS('.adf-datatable-header')).toBeNull();
    };

    const testIfRowIsSelected = (data: any[], done?: DoneFn) => {
        dataTable.selectionMode = 'single';
        dataTable.data = new ObjectDataTableAdapter(data, [new ObjectDataColumn({ key: 'name' })]);
        const rows = dataTable.data.getRows();

        dataTable.ngOnChanges({});
        if (done) {
            fixture.detectChanges();

            dataTable.rowClick.subscribe(() => {
                expect(rows[0].isSelected).toBeFalsy();
                expect(rows[1].isSelected).toBeTruthy();
                done();
            });
        }
        return rows;
    };

    const testDoubleClickCount = (tickTime = 490, rowClickNumber = 1) => {
        let doubleClickCount = 0;

        const row = {} as DataRow;
        dataTable.data = new ObjectDataTableAdapter([], []);
        dataTable.ngOnChanges({});
        fixture.detectChanges();

        dataTable.rowDblClick.subscribe(() => {
            doubleClickCount += 1;
        });

        dataTable.onRowClick(row, new MouseEvent('click'));
        setTimeout(() => {
            for (let i = 0; i < rowClickNumber; i++) {
                dataTable.onRowClick(row, new MouseEvent('click'));
            }
        }, 240);

        tick(tickTime);

        expect(doubleClickCount).toBe(1);
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CustomColumnHeaderComponent],
            providers: [provideRouter([])]
        });
        fixture = TestBed.createComponent(DataTableComponent);
        dataTable = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);
        testingUtils = new UnitTestingUtils(fixture.debugElement, loader);
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should not emit showRowContextMenu when the component is loaded with rows', () => {
        spyOn(dataTable.showRowContextMenu, 'emit');
        const newData = new ObjectDataTableAdapter([{ name: 'TEST' }, { name: 'FAKE' }], [new ObjectDataColumn({ key: 'name' })]);
        dataTable.data = new ObjectDataTableAdapter([{ name: '1' }, { name: '2' }], [new ObjectDataColumn({ key: 'name' })]);

        dataTable.ngOnChanges({
            data: new SimpleChange(null, newData, false)
        });

        fixture.detectChanges();

        expect(dataTable.showRowContextMenu.emit).not.toHaveBeenCalled();
    });

    it('should return only visible columns', () => {
        const columns = [
            { key: 'col1', isHidden: false },
            { key: 'col2', isHidden: true },
            { key: 'col3', isHidden: false }
        ] as DataColumn[];
        dataTable.data = new ObjectDataTableAdapter([], columns);
        fixture.detectChanges();

        const visibleColumns = dataTable.getVisibleColumns();
        expect(visibleColumns.length).toBe(2);
        expect(visibleColumns[0].key).toBe('col1');
        expect(visibleColumns[1].key).toBe('col3');
    });

    it('should return an empty array if all columns are hidden', () => {
        const columns = [
            { key: 'col1', isHidden: true },
            { key: 'col2', isHidden: true }
        ] as DataColumn[];
        dataTable.data = new ObjectDataTableAdapter([], columns);
        fixture.detectChanges();

        const visibleColumns = dataTable.getVisibleColumns();
        expect(visibleColumns.length).toBe(0);
    });

    it('should return an empty array if there are no columns', () => {
        dataTable.data = new ObjectDataTableAdapter([], []);
        fixture.detectChanges();

        const visibleColumns = dataTable.getVisibleColumns();
        expect(visibleColumns.length).toBe(0);
    });

    it('should preserve the historical selection order', () => {
        spyOn(dataTable.selectedItemsCountChanged, 'emit');
        dataTable.data = new ObjectDataTableAdapter([{ id: 0 }, { id: 1 }, { id: 2 }], [new ObjectDataColumn({ key: 'id' })]);

        const rows = dataTable.data.getRows();

        dataTable.selectRow(rows[2], true);
        dataTable.selectRow(rows[0], true);
        dataTable.selectRow(rows[1], true);

        const selection = dataTable.selection;
        expect(selection[0].getValue('id')).toBe(2);
        expect(selection[1].getValue('id')).toBe(0);
        expect(selection[2].getValue('id')).toBe(1);

        expect(dataTable.selectedItemsCountChanged.emit).toHaveBeenCalledTimes(3);
    });

    it('should selectedItemsCountChanged be emitted 4 times', () => {
        spyOn(dataTable.selectedItemsCountChanged, 'emit');
        dataTable.data = new ObjectDataTableAdapter([{ id: 0 }, { id: 1 }, { id: 2 }], [new ObjectDataColumn({ key: 'id' })]);

        const rows = dataTable.data.getRows();

        dataTable.selectRow(rows[2], true);
        dataTable.selectRow(rows[0], true);
        dataTable.selectRow(rows[1], true);
        dataTable.selectRow(rows[1], false);

        expect(dataTable.selectedItemsCountChanged.emit).toHaveBeenCalledWith(1);
        expect(dataTable.selectedItemsCountChanged.emit).toHaveBeenCalledWith(2);
        expect(dataTable.selectedItemsCountChanged.emit).toHaveBeenCalledWith(3);
        expect(dataTable.selectedItemsCountChanged.emit).toHaveBeenCalledTimes(4);
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

    it('should use the cardview style if cardview is false', () => {
        const newData = new ObjectDataTableAdapter([{ name: '1' }, { name: '2' }], [new ObjectDataColumn({ key: 'name' })]);

        dataTable.ngOnChanges({
            data: new SimpleChange(null, newData, false)
        });

        fixture.detectChanges();

        expect(testingUtils.getByCSS('.adf-datatable-card')).toBeNull();
        expect(testingUtils.getByCSS('.adf-datatable-list')).not.toBeNull();
    });

    describe('Header modes', () => {
        const newData = new ObjectDataTableAdapter([{ name: '1' }, { name: '2' }], [new ObjectDataColumn({ key: 'name' })]);
        const emptyData = new ObjectDataTableAdapter();
        const getDropList = (): CdkDropList => {
            dataTable.showHeader = ShowHeaderMode.Data;
            dataTable.loading = false;
            dataTable.data = newData;
            fixture.detectChanges();
            return testingUtils.getByDirective(CdkDropList).injector.get(CdkDropList);
        };

        it('should show the header if showHeader is `Data` and there is data', () => {
            dataTable.showHeader = ShowHeaderMode.Data;
            dataTable.loading = false;
            dataTable.ngOnChanges({
                data: new SimpleChange(null, newData, false)
            });

            fixture.detectChanges();

            expect(testingUtils.getByCSS('.adf-datatable-header')).toBeDefined();
        });

        it('should hide the header if showHeader is `Data` and there is no data', () => {
            dataTable.showHeader = ShowHeaderMode.Data;
            dataTable.loading = false;
            dataTable.ngOnChanges({
                data: new SimpleChange(null, emptyData, false)
            });

            fixture.detectChanges();

            expect(testingUtils.getByCSS('.adf-datatable-header')).toBeNull();
        });

        it('should always show the header if showHeader is `Always`', () => {
            dataTable.showHeader = ShowHeaderMode.Always;
            dataTable.loading = false;

            dataTable.ngOnChanges({
                data: new SimpleChange(null, newData, false)
            });
            fixture.detectChanges();
            expect(testingUtils.getByCSS('.adf-datatable-header')).toBeDefined();

            dataTable.ngOnChanges({
                data: new SimpleChange(null, emptyData, false)
            });
            fixture.detectChanges();
            expect(testingUtils.getByCSS('.adf-datatable-header')).toBeDefined();
        });

        it('should never show the header if showHeader is `Never`', () => {
            dataTable.showHeader = ShowHeaderMode.Never;
            dataTable.loading = false;
            dataTable.ngOnChanges({
                data: new SimpleChange(null, newData, false)
            });

            fixture.detectChanges();

            expect(testingUtils.getByCSS('.adf-datatable-header')).toBeNull();

            dataTable.ngOnChanges({
                data: new SimpleChange(null, emptyData, false)
            });

            fixture.detectChanges();

            expect(testingUtils.getByCSS('.adf-datatable-header')).toBeNull();
        });

        it('should never show the header if noPermission is true', () => {
            dataTable.loading = false;
            dataTable.noPermission = true;
            testNotShownHeader(emptyData);
        });

        it('should never show the header if loading is true', () => {
            dataTable.loading = true;
            testNotShownHeader(emptyData);
        });

        it('should have assigned filterDisabledColumns to sortPredicate of CdkDropList', () => {
            expect(getDropList().sortPredicate).toBe(dataTable.filterDisabledColumns);
        });

        it('should sortPredicate from CdkDropList return true if column is enabled', () => {
            const dropList = getDropList();
            spyOn(dropList, 'getSortedItems').and.returnValue([
                {
                    disabled: true
                },
                {
                    disabled: false
                }
            ] as CdkDrag[]);

            expect(dropList.sortPredicate(1, undefined, dropList)).toBeTrue();
        });

        it('should sortPredicate from CdkDropList return false if column is disabled', () => {
            const dropList = getDropList();
            spyOn(dropList, 'getSortedItems').and.returnValue([
                {
                    disabled: true
                },
                {
                    disabled: true
                }
            ] as CdkDrag[]);

            expect(dropList.sortPredicate(1, undefined, dropList)).toBeFalse();
        });
    });

    it('should emit "sorting-changed" DOM event', (done) => {
        const column = new ObjectDataColumn({ key: 'name', sortable: true, direction: 'asc', sortingKey: 'displayName' });
        dataTable.data = new ObjectDataTableAdapter([{ name: '1' }, { name: '2' }], [column]);
        dataTable.data.setSorting(new DataSorting('name', 'desc'));

        fixture.nativeElement.addEventListener('sorting-changed', (event: CustomEvent) => {
            expect(event.detail.key).toBe('name');
            expect(event.detail.sortingKey).toBe('displayName');
            expect(event.detail.direction).toBe('asc');
            done();
        });

        fixture.detectChanges();
        dataTable.ngAfterViewInit();
        const headerColumns = testingUtils.getAllByCSS('.adf-datatable-cell-header-content');

        headerColumns[0].nativeElement.click();
        fixture.detectChanges();
    });

    it('should change the rows on changing of the data', () => {
        const newData = new ObjectDataTableAdapter([{ name: 'TEST' }, { name: 'FAKE' }], [new ObjectDataColumn({ key: 'name' })]);
        dataTable.data = new ObjectDataTableAdapter([{ name: '1' }, { name: '2' }], [new ObjectDataColumn({ key: 'name' })]);

        dataTable.ngOnChanges({
            data: new SimpleChange(null, newData, false)
        });
        fixture.detectChanges();

        expect(testingUtils.getByDataAutomationId('text_TEST')).not.toBeNull();
        expect(testingUtils.getByDataAutomationId('text_FAKE')).not.toBeNull();
    });

    it('should set rows to the data when rows defined', () => {
        const dataRows = [{ name: 'test1' }, { name: 'test2' }, { name: 'test3' }, { name: 'test4' }];
        dataTable.data = new ObjectDataTableAdapter([], [new ObjectDataColumn({ key: 'name' })]);

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
        } as KeyboardEventInit);
        const dataRows = [{ name: 'test1' }, { name: 'test2' }];

        dataTable.data = new ObjectDataTableAdapter([], [new ObjectDataColumn({ key: 'name' })]);

        dataTable.ngOnChanges({
            rows: new SimpleChange(null, dataRows, false)
        });

        fixture.detectChanges();
        dataTable.ngAfterViewInit();

        const rowElement = testingUtils.getAllByCSS('.adf-datatable-body .adf-datatable-row')[0].nativeElement;

        spyOn(dataTable.rowDblClick, 'emit');

        rowElement.dispatchEvent(event);

        expect(dataTable.rowDblClick.emit).toHaveBeenCalled();
    });

    it('should set custom sort order', () => {
        const dataSortObj = new DataSorting('dummyName', 'asc');
        const dataRows = [{ name: 'test1' }, { name: 'test2' }, { name: 'test3' }, { name: 'test4' }];
        dataTable.sorting = ['dummyName', 'asc'];
        dataTable.ngOnChanges({
            rows: new SimpleChange(null, dataRows, false)
        });
        fixture.detectChanges();
        const dataSort = dataTable.data.getSorting();
        expect(dataSort).toEqual(dataSortObj);
    });

    describe('Selection reset', () => {
        beforeEach(() => {
            spyOn(dataTable, 'resetSelection').and.callThrough();
            spyOn(dataTable.selectedItemsCountChanged, 'emit');

            dataTable.data = new ObjectDataTableAdapter([{ name: '1' }, { name: '2' }], [new ObjectDataColumn({ key: 'name' })]);
            const rows = dataTable.data.getRows();

            rows[0].isSelected = true;
            rows[1].isSelected = true;

            expect(rows[0].isSelected).toBeTruthy();
            expect(rows[1].isSelected).toBeTruthy();
        });

        it('should reset selection on mode change', () => {
            dataTable.ngOnChanges({
                selectionMode: new SimpleChange(null, 'multiple', false)
            });

            expect(dataTable.selection).toEqual([]);
            expect(dataTable.selectedItemsCountChanged.emit).toHaveBeenCalledWith(0);
            expect(dataTable.isSelectAllIndeterminate).toBe(false);
            expect(dataTable.isSelectAllChecked).toBe(false);
        });

        it('should reset selection on multiselect change', () => {
            dataTable.ngOnChanges({
                multiselect: new SimpleChange(true, false, false)
            });

            expect(dataTable.selection).toEqual([]);
            expect(dataTable.selectedItemsCountChanged.emit).toHaveBeenCalledWith(0);
            expect(dataTable.isSelectAllIndeterminate).toBe(false);
            expect(dataTable.isSelectAllChecked).toBe(false);
        });
    });

    it('should select the row where isSelected is true', () => {
        dataTable.rows = [{ name: 'TEST1' }, { name: 'FAKE2' }, { name: 'TEST2', isSelected: true }, { name: 'FAKE2' }];
        dataTable.data = new ObjectDataTableAdapter([], [new ObjectDataColumn({ key: 'name' })]);
        fixture.detectChanges();
        const rows = dataTable.data.getRows();
        expect(rows[0].isSelected).toBeFalsy();
        expect(rows[1].isSelected).toBeFalsy();
        expect(rows[2].isSelected).toBeTruthy();
        expect(rows[3].isSelected).toBeFalsy();
    });

    it('should not select any row when isSelected is not defined', () => {
        const dataRows = [{ name: 'TEST1' }, { name: 'FAKE2' }, { name: 'TEST2' }];
        dataTable.data = new ObjectDataTableAdapter(dataRows, [new ObjectDataColumn({ key: 'name' })]);

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
        const rows = testIfRowIsSelected([{ name: '1', isSelected: true }, { name: '2' }], done);
        dataTable.onRowClick(rows[1], new MouseEvent('click'));
    });

    it('should select only one row with [single] selection mode and key modifier', (done) => {
        const rows = testIfRowIsSelected([{ name: '1', isSelected: true }, { name: '2' }], done);
        dataTable.onRowClick(
            rows[1],
            new MouseEvent('click', {
                metaKey: true
            })
        );
    });

    it('should select only one row with [single] selection mode pressing enter key', () => {
        const rows = testIfRowIsSelected([{ name: '1' }, { name: '2' }]);
        dataTable.onEnterKeyPressed(rows[0], new KeyboardEvent('enter'));
        expect(rows[0].isSelected).toBeTruthy();
        expect(rows[1].isSelected).toBeFalsy();

        dataTable.onEnterKeyPressed(rows[1], new KeyboardEvent('enter'));
        expect(rows[0].isSelected).toBeFalsy();
        expect(rows[1].isSelected).toBeTruthy();
    });

    it('should select multiple rows with [multiple] selection mode pressing enter key', () => {
        dataTable.selectionMode = 'multiple';
        dataTable.data = new ObjectDataTableAdapter([{ name: '1' }, { name: '2' }], [new ObjectDataColumn({ key: 'name' })]);
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

    it('should unselect the row with [single] selection mode', (done) => {
        dataTable.selectionMode = 'single';
        dataTable.data = new ObjectDataTableAdapter([{ name: '1' }, { name: '2' }], [new ObjectDataColumn({ key: 'name' })]);
        const rows = dataTable.data.getRows();
        dataTable.ngOnChanges({});
        fixture.detectChanges();
        dataTable.onRowClick(rows[0], new MouseEvent('click'));
        dataTable.rowClick.pipe(take(1)).subscribe(() => {
            expect(rows[0].isSelected).toBeTrue();
            expect(rows[1].isSelected).toBeFalse();
            dataTable.onRowClick(rows[0], new MouseEvent('click'));
            dataTable.rowClick.pipe(take(1)).subscribe(() => {
                expect(rows[0].isSelected).toBeFalse();
                expect(rows[1].isSelected).toBeFalse();
                done();
            });
        });
    });

    it('should unselect the row with [multiple] selection mode and modifier key', (done) => {
        dataTable.selectionMode = 'multiple';
        dataTable.data = new ObjectDataTableAdapter([{ name: '1', isSelected: true }], [new ObjectDataColumn({ key: 'name' })]);
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
            preventDefault: () => {},
            composedPath: () => []
        } as any);
    });

    it('should unselect the row searching it by row id, when row id is defined', () => {
        spyOn(dataTable.selectedItemsCountChanged, 'emit');
        const findSelectionByIdSpy = spyOn(dataTable, 'findSelectionById');
        dataTable.data = new ObjectDataTableAdapter([], [new ObjectDataColumn({ key: 'name' })]);

        const fakeDataRows = [new FakeDataRow(), new FakeDataRow()];
        fakeDataRows[0].id = 'fakeRowId';
        fakeDataRows[1].id = 'fakeRowId2';

        dataTable.data.setRows(fakeDataRows);
        dataTable.selection = [...fakeDataRows];
        const indexOfSpy = spyOn(dataTable.selection, 'indexOf');

        dataTable.selectRow(fakeDataRows[0], false);

        expect(indexOfSpy).not.toHaveBeenCalled();
        expect(findSelectionByIdSpy).toHaveBeenCalledWith(fakeDataRows[0].id);
        expect(dataTable.selectedItemsCountChanged.emit).toHaveBeenCalledTimes(1);
        expect(dataTable.selectedItemsCountChanged.emit).toHaveBeenCalledWith(2);
    });

    it('should unselect the row by searching for the exact same reference of it (indexOf), when row id is not defined ', () => {
        const findSelectionByIdSpy = spyOn(dataTable, 'findSelectionById');
        dataTable.data = new ObjectDataTableAdapter([], [new ObjectDataColumn({ key: 'name' })]);

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
        dataTable.data = new ObjectDataTableAdapter([{ name: '1', isSelected: true }, { name: '2' }], [new ObjectDataColumn({ key: 'name' })]);
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
            [{ name: '1' }, { name: '2' }, { name: '3' }, { name: '4' }],
            [new ObjectDataColumn({ key: 'name' })]
        );

        dataTable.actions = true;
        fixture.detectChanges();

        const actions = testingUtils.getAllByCSS('[id^=action_menu_right]');
        expect(actions.length).toBe(4);
    });

    it('should put actions menu to the left', () => {
        dataTable.data = new ObjectDataTableAdapter(
            [{ name: '1' }, { name: '2' }, { name: '3' }, { name: '4' }],
            [new ObjectDataColumn({ key: 'name' })]
        );

        dataTable.actions = true;
        dataTable.actionsPosition = 'left';
        fixture.detectChanges();

        const actions = testingUtils.getAllByCSS('[id^=action_menu_left]');
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
        const table = TestBed.createComponent(DataTableComponent).componentInstance;
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
        dataTable.onRowClick(row, new MouseEvent('click'));
    });

    it('should emit double click if there are two single click in 250ms', fakeAsync(() => {
        testDoubleClickCount();
    }));

    it('should emit double click if there are more than two single click in 250ms', fakeAsync(() => {
        testDoubleClickCount(740, 2);
    }));

    it('should emit single click if there are two single click in more than 250ms', fakeAsync(() => {
        const row = {} as DataRow;
        let clickCount = 0;

        dataTable.data = new ObjectDataTableAdapter([], []);
        dataTable.ngOnChanges({});
        fixture.detectChanges();

        dataTable.rowClick.subscribe(() => {
            clickCount += 1;
        });

        dataTable.onRowClick(row, new MouseEvent('click'));

        setTimeout(() => {
            dataTable.onRowClick(row, new MouseEvent('click'));
        }, 260);

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
        dataTable.onRowClick(row, new MouseEvent('click'));
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
        dataTable.onRowClick(row, new MouseEvent('click'));
        dataTable.onRowClick(row, new MouseEvent('click'));
    });

    it('should prevent default behaviour on row click event', () => {
        const e = new MouseEvent('click');
        spyOn(e, 'preventDefault');
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
            [new ObjectDataColumn({ key: 'name', sortable: false }), new ObjectDataColumn({ key: 'other', sortable: true })]
        );
        fixture.detectChanges();
        dataTable.ngAfterViewInit();
        const adapter = dataTable.data;
        spyOn(adapter, 'setSorting').and.callThrough();

        const headerColumns = testingUtils.getAllByCSS('.adf-datatable-cell-header-content');
        headerColumns[0].nativeElement.click();
        fixture.detectChanges();

        expect(adapter.setSorting).not.toHaveBeenCalled();
    });

    it('should set sorting upon column header clicked', () => {
        dataTable.data = new ObjectDataTableAdapter([{ name: '1' }], [new ObjectDataColumn({ key: 'column_1', sortable: true })]);
        fixture.detectChanges();
        dataTable.ngAfterViewInit();
        const adapter = dataTable.data;
        spyOn(adapter, 'setSorting').and.callThrough();
        spyOn(dataTable.data, 'getSorting').and.returnValue(new DataSorting('column_1', 'desc', { numeric: true }));

        const headerColumns = testingUtils.getAllByCSS('.adf-datatable-cell-header-content');
        headerColumns[0].nativeElement.click();
        fixture.detectChanges();

        expect(adapter.setSorting).toHaveBeenCalledWith(new DataSorting('column_1', 'asc', { numeric: true }));
    });

    it('should invert sorting upon column header clicked', () => {
        dataTable.data = new ObjectDataTableAdapter([{ name: '1' }], [new ObjectDataColumn({ key: 'column_1', sortable: true })]);
        fixture.detectChanges();
        dataTable.ngAfterViewInit();

        const adapter = dataTable.data;
        const sorting = new DataSorting('column_1', 'asc', { numeric: true });
        spyOn(adapter, 'setSorting').and.callThrough();
        spyOn(adapter, 'getSorting').and.returnValue(sorting);
        const headerColumns = testingUtils.getAllByCSS('.adf-datatable-cell-header-content');
        headerColumns[0].nativeElement.click();
        fixture.detectChanges();

        expect(adapter.setSorting).toHaveBeenCalledWith(new DataSorting('column_1', 'desc', { numeric: true }));

        // check second click on the header
        sorting.direction = 'desc';
        headerColumns[0].nativeElement.click();
        fixture.detectChanges();

        expect(adapter.setSorting).toHaveBeenCalledWith(new DataSorting('column_1', 'asc', { numeric: true }));
    });

    it('should indicate column that has sorting applied', () => {
        dataTable.data = new ObjectDataTableAdapter(
            [{ name: '1' }, { name: '2' }],
            [new ObjectDataColumn({ key: 'name', sortable: true }), new ObjectDataColumn({ key: 'other', sortable: true })]
        );
        fixture.detectChanges();
        dataTable.ngAfterViewInit();

        const [col1, col2] = dataTable.getSortableColumns();
        const headerColumns = testingUtils.getAllByCSS('.adf-datatable-cell-header-content');
        headerColumns[1].nativeElement.click();
        fixture.detectChanges();

        expect(dataTable.isColumnSortActive(col1)).toBe(false);
        expect(dataTable.isColumnSortActive(col2)).toBe(true);
    });

    it('should return false for columns that have no sorting', () => {
        dataTable.data = new ObjectDataTableAdapter(
            [{ name: '1' }, { name: '2' }],
            [new ObjectDataColumn({ key: 'name', sortable: false }), new ObjectDataColumn({ key: 'other', sortable: false })]
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

    it('should update only selectable rows on "select all" click', () => {
        const data = new ObjectDataTableAdapter([{}, {}, {}], []);
        const rows = data.getRows();

        rows[0].isSelectable = false;

        dataTable.data = data;
        dataTable.multiselect = true;
        dataTable.ngAfterContentInit();

        dataTable.onSelectAllClick({ checked: true } as MatCheckboxChange);
        expect(dataTable.isSelectAllChecked).toBe(true);
        for (let i = 0; i < rows.length; i++) {
            if (i === 0) {
                expect(rows[i].isSelected).toBe(false);
                continue;
            }

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
            [new ObjectDataColumn({ key: 'name', sortable: false }), new ObjectDataColumn({ key: 'other', sortable: false })]
        );
        const rows = dataTable.data.getRows();

        dataTable.multiselect = true;
        dataTable.onCheckboxChange(rows[0], { checked: true } as MatCheckboxChange);
        expect(dataTable.isSelectAllIndeterminate).toBe(true);

        dataTable.onCheckboxChange(rows[1], { checked: true } as MatCheckboxChange);
        expect(dataTable.isSelectAllIndeterminate).toBe(false);

        dataTable.onCheckboxChange(rows[0], { checked: false } as MatCheckboxChange);
        dataTable.onCheckboxChange(rows[1], { checked: false } as MatCheckboxChange);
        expect(dataTable.isSelectAllIndeterminate).toBe(false);
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

    it('should call onRowClick when checkbox label clicked and target is not checkbox', () => {
        dataTable.data = new ObjectDataTableAdapter(
            [{ name: '1' }, { name: '2' }],
            [new ObjectDataColumn({ key: 'name', sortable: false }), new ObjectDataColumn({ key: 'other', sortable: false })]
        );
        const rows = dataTable.data.getRows();
        const event = new MouseEvent('click');
        Object.defineProperty(event, 'target', { value: { hasAttribute: () => null, closest: () => null } });
        spyOn(dataTable, 'onRowClick');

        dataTable.onCheckboxLabelClick(rows[0], event);
        expect(dataTable.onRowClick).toHaveBeenCalledWith(rows[0], event);
    });

    it('should not call onRowClick when checkbox label clicked and target is checkbox', () => {
        const data = new ObjectDataTableAdapter([{}, {}], []);
        const rows = data.getRows();
        const event = new MouseEvent('click');
        Object.defineProperty(event, 'target', {
            value: {
                getAttribute: (attr: string) => (attr === 'data-adf-datatable-row-checkbox' ? 'data-adf-datatable-row-checkbox' : null),
                hasAttribute: (attr: string) => attr === 'data-adf-datatable-row-checkbox',
                closest: () => null
            }
        });
        spyOn(dataTable, 'onRowClick');

        dataTable.onCheckboxLabelClick(rows[0], event);
        expect(dataTable.onRowClick).not.toHaveBeenCalled();
    });

    it('should not call onRowClick when checkbox label clicked and target is inside checkbox', () => {
        const data = new ObjectDataTableAdapter([{}, {}], []);
        const rows = data.getRows();
        const event = new MouseEvent('click');
        Object.defineProperty(event, 'target', { value: { hasAttribute: () => null, closest: () => 'element' } });
        spyOn(dataTable, 'onRowClick');

        dataTable.onCheckboxLabelClick(rows[0], event);
        expect(dataTable.onRowClick).not.toHaveBeenCalled();
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
        dataTable.data = new ObjectDataTableAdapter([{}, {}, {}], []);
        const column = {} as DataColumn;

        const row: any = {
            getValue: () => 'material-icons://android'
        };

        expect(dataTable.isIconValue(row, column)).toBeTruthy();
    });

    it('should not use special material url scheme', () => {
        dataTable.data = new ObjectDataTableAdapter([{}, {}, {}], []);
        const column = { type: 'image' } as DataColumn;

        const row: any = {
            getValue: () => 'http://www.google.com'
        };

        expect(dataTable.isIconValue(row, column)).toBeFalsy();
    });

    it('should parse icon value', () => {
        dataTable.data = new ObjectDataTableAdapter([{}, {}, {}], []);
        const column = { type: 'image' } as DataColumn;

        const row: any = {
            getValue: () => 'material-icons://android'
        };

        expect(dataTable.asIconValue(row, column)).toBe('android');
    });

    it('should not parse icon value', () => {
        dataTable.data = new ObjectDataTableAdapter([{}, {}, {}], []);
        const column = { type: 'image' } as DataColumn;

        const row: any = {
            getValue: () => 'http://www.google.com'
        };

        expect(dataTable.asIconValue(row, column)).toBe(null);
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
            [{ name: '1' }, { name: '2' }, { name: '3' }, { name: '4' }],
            [new ObjectDataColumn({ key: 'name', title: 'Name' })]
        );

        dataTable.stickyHeader = true;
        dataTable.loading = false;
        dataTable.noPermission = false;
        fixture.detectChanges();
        expect(testingUtils.getByCSS('.adf-sticky-header')).not.toBeNull();
    });

    it('should disable sticky header if component is loading', () => {
        dataTable.data = new ObjectDataTableAdapter(
            [{ name: '1' }, { name: '2' }, { name: '3' }, { name: '4' }],
            [new ObjectDataColumn({ key: 'name', title: 'Name' })]
        );

        dataTable.stickyHeader = true;
        dataTable.loading = true;
        dataTable.noPermission = false;
        fixture.detectChanges();
        expect(testingUtils.getByCSS('.adf-sticky-header')).toBeNull();
    });

    it('should disable sticky header if user has no permissions', () => {
        dataTable.data = new ObjectDataTableAdapter(
            [{ name: '1' }, { name: '2' }, { name: '3' }, { name: '4' }],
            [new ObjectDataColumn({ key: 'name', title: 'Name' })]
        );

        dataTable.stickyHeader = true;
        dataTable.loading = false;
        dataTable.noPermission = true;
        fixture.detectChanges();
        expect(testingUtils.getByCSS('.adf-sticky-header')).toBeNull();
    });

    it('should disable sticky header if user has no content', () => {
        dataTable.data = new ObjectDataTableAdapter([], [new ObjectDataColumn({ key: 'name', title: 'Name' })]);

        dataTable.stickyHeader = true;
        dataTable.loading = false;
        dataTable.noPermission = false;
        fixture.detectChanges();
        expect(testingUtils.getByCSS('.adf-sticky-header')).toBeNull();
    });

    it('should be able to define values using the resolver function', () => {
        dataTable.data = new ObjectDataTableAdapter(
            [
                { id: 1, firstName: 'foo', lastName: 'bar' },
                { id: 2, firstName: 'bar', lastName: 'baz' }
            ],
            [new ObjectDataColumn({ key: 'id' }), new ObjectDataColumn({ key: 'name' })]
        );
        spyOn(dataTable, 'resolverFn').and.callFake(resolverFn);
        fixture.detectChanges();

        expect(testingUtils.getInnerTextByDataAutomationId('text_1')).toEqual('1');
        expect(testingUtils.getInnerTextByDataAutomationId('text_foo - bar')).toEqual('foo - bar');
        expect(testingUtils.getInnerTextByDataAutomationId('text_2')).toEqual('2');
        expect(testingUtils.getInnerTextByDataAutomationId('text_bar - baz')).toEqual('bar - baz');
        expect(dataTable.data.getRows().length).toEqual(2);
    });

    it('should update data columns when columns input changes', () => {
        const existingDataColumnsSchema = [new ObjectDataColumn({ key: 'id' })];
        const existingData = [{ id: 'fake-data' }];
        dataTable.data = new ObjectDataTableAdapter(existingData, existingDataColumnsSchema);

        const newDataColumnsSchema = { key: 'new-column' };
        const columnsChange = new SimpleChange(null, [newDataColumnsSchema], false);
        dataTable.ngOnChanges({ columns: columnsChange });
        const expectedNewDataColumns = [new ObjectDataColumn(newDataColumnsSchema)];
        expect(dataTable.data.getColumns()).toEqual(expectedNewDataColumns);
    });

    it('should render the custom column header', async () => {
        const customHeader = TestBed.createComponent(CustomColumnHeaderComponent).componentInstance.templateRef;
        dataTable.data = new ObjectDataTableAdapter(
            [
                { id: 1, name: 'foo' },
                { id: 2, name: 'bar' }
            ],
            [new ObjectDataColumn({ key: 'id', title: 'ID' }), new ObjectDataColumn({ key: 'name', title: 'Name', header: customHeader })]
        );
        fixture.detectChanges();
        await fixture.whenStable();

        expect(testingUtils.getInnerTextByDataAutomationId('auto_id_id')).toContain('ID');
        expect(testingUtils.getInnerTextByDataAutomationId('auto_id_name')).toContain('CUSTOM HEADER');
    });

    it('should set isContextMenuSource to true for row whose id matches selectedRowId', () => {
        const rows = [
            {
                id: '1234',
                isContextMenuSource: false
            },
            {
                id: '2345',
                isContextMenuSource: false
            },
            {
                id: '3456',
                isContextMenuSource: false
            }
        ] as DataRow[];
        const row = {
            id: '2345',
            isContextMenuSource: false
        } as DataRow;
        dataTable.data = new ObjectDataTableAdapter(rows, [
            new ObjectDataColumn({ key: 'id' }),
            new ObjectDataColumn({ key: 'isContextMenuSource' })
        ]);

        dataTable.markRowAsContextMenuSource(row);
        fixture.detectChanges();

        expect(dataTable.selectedRowId).toEqual('2345');
        expect(row.isContextMenuSource).toBeTrue();
    });

    it('should select the row, regardless of where the user clicks in the row.', async () => {
        dataTable.selectionMode = 'single';
        const dataRows = [{ id: 0 }, { id: 1 }];
        dataTable.data = new ObjectDataTableAdapter(dataRows, [new ObjectDataColumn({ key: 'id' })]);
        dataTable.ngOnChanges({
            rows: new SimpleChange(null, dataRows, false)
        });
        fixture.detectChanges();

        const rows = dataTable.data.getRows();
        expect(rows[0].isSelected).toBeFalsy();
        expect(rows[1].isSelected).toBeFalsy();

        dataTable.resetSelection();
        const rowClickPromise = firstValueFrom(dataTable.rowClick.pipe(take(1)));
        testingUtils.clickByCSS('[data-automation-id="datatable-row-0"] > div');
        fixture.detectChanges();
        await rowClickPromise;

        const rows2 = dataTable.data.getRows();
        expect(rows2[0].isSelected).toBeTruthy();
        expect(rows2[1].isSelected).toBeFalsy();

        dataTable.resetSelection();
        const cellClickPromise = firstValueFrom(dataTable.rowClick.pipe(take(1)));
        testingUtils.clickByCSS('[data-automation-id="datatable-row-1"] > div');
        fixture.detectChanges();
        await cellClickPromise;

        const rows3 = dataTable.data.getRows();
        expect(rows3[0].isSelected).toBeFalsy();
        expect(rows3[1].isSelected).toBeTruthy();
    });

    it('should select the corresponding row when a checkbox is checked', async () => {
        const petRows = [{ pet: 'dog' }, { pet: 'cat' }];
        dataTable.multiselect = true;
        dataTable.data = new ObjectDataTableAdapter(petRows, [new ObjectDataColumn({ key: 'pet' })]);
        dataTable.ngOnChanges({ rows: new SimpleChange(null, petRows, false) });
        fixture.detectChanges();

        const checkboxes = await loader.getAllHarnesses(MatCheckboxHarness);

        await checkboxes[2].check();
        fixture.detectChanges();
        await fixture.whenStable();

        expect(await checkboxes[1].isChecked()).toBe(false);
        expect(await checkboxes[2].isChecked()).toBe(true);

        const rows = dataTable.data.getRows();
        expect(rows[0].isSelected).toBeFalse();
        expect(rows[1].isSelected).toBeTrue();
    });

    it('should be able to display column of type boolean', () => {
        dataTable.data = new ObjectDataTableAdapter(mockCarsData, mockCarsSchemaDefinition);

        fixture.detectChanges();
        const rows = dataTable.data.getRows();

        expect(rows[0].getValue('is_available')).toBe('false');
        expect(rows[1].getValue('is_available')).toBe('true');
        expect(rows[2].getValue('is_available')).toBe('true');
    });

    it('should be able to display column of type amount', () => {
        dataTable.data = new ObjectDataTableAdapter(mockCarsData, mockCarsSchemaDefinition);

        fixture.detectChanges();
        const rows = dataTable.data.getRows();

        expect(rows[0].getValue('car_price')).toBe(599);
        expect(rows[1].getValue('car_price')).toBe(15000.12345);
        expect(rows[2].getValue('car_price')).toBe(10000);
    });

    it('should be able to display column of type number', () => {
        dataTable.data = new ObjectDataTableAdapter(mockCarsData, mockCarsSchemaDefinition);

        fixture.detectChanges();
        const rows = dataTable.data.getRows();

        expect(rows[0].getValue('fuel_consumption')).toBe(5.25789);
        expect(rows[1].getValue('fuel_consumption')).toBe(6);
        expect(rows[2].getValue('fuel_consumption')).toBe(4.9);
    });

    it('should be able to display column of type date', () => {
        dataTable.data = new ObjectDataTableAdapter(mockCarsData, mockCarsSchemaDefinition);

        fixture.detectChanges();
        const rows = dataTable.data.getRows();

        expect(rows[0].getValue('production_start')).toBe('1972-04-23');
        expect(rows[1].getValue('production_start')).toBe('1998-06-25T12:25:20');
        expect(rows[2].getValue('production_start')).toBe('2004-02-10T12:25:43.511Z');
    });

    it('should be able to display column of type icon', () => {
        dataTable.data = new ObjectDataTableAdapter(mockCarsData, mockCarsSchemaDefinition);

        fixture.detectChanges();
        const rows = dataTable.data.getRows();

        expect(rows[0].getValue('icon')).toBe('airport_shuttle');
        expect(rows[1].getValue('icon')).toBe('directions_car');
        expect(rows[2].getValue('icon')).toBe('local_shipping');
    });

    describe('displayCheckboxesOnHover', () => {
        beforeEach(() => {
            dataTable.data = new ObjectDataTableAdapter([{ name: '1' }, { name: '2' }], [new ObjectDataColumn({ key: 'name' })]);
            dataTable.multiselect = true;
        });

        it('should always display checkboxes when displayCheckboxesOnHover is set to false', async () => {
            dataTable.displayCheckboxesOnHover = false;
            fixture.detectChanges();

            expect(await testingUtils.checkIfMatCheckboxesHaveClass('adf-datatable-hover-only')).toBeTrue();
        });

        it('should display checkboxes on hover when displayCheckboxesOnHover is set to true', async () => {
            dataTable.displayCheckboxesOnHover = true;
            fixture.detectChanges();

            expect(await testingUtils.checkIfMatCheckboxesHaveClass('adf-datatable-hover-only')).toBeTrue();
        });
    });

    it('should scroll back to the top when new data is set', async () => {
        const columnDefinitions = [
            {
                type: 'text',
                key: 'id',
                title: ''
            },
            {
                type: 'text',
                key: 'name',
                title: 'Name'
            }
        ] as DataColumn[];
        const initialRows = Array.from({ length: 20 }, (_, i) => ({ id: `${i + 1}`, name: `Row ${i + 1}` }));
        const nextRows = Array.from({ length: 20 }, (_, i) => ({ id: `${i + 21}`, name: `Row ${i + 21}` }));

        // Load first 20 records
        dataTable.data = new ObjectDataTableAdapter(initialRows, columnDefinitions);
        fixture.detectChanges();

        // Check that scroll body height > 0
        const scrollBody = fixture.nativeElement.querySelector('.adf-datatable-body');
        expect(scrollBody.scrollHeight).toBeGreaterThan(0);

        // Scroll to bottom
        scrollBody.scrollTop = scrollBody.scrollHeight;
        scrollBody.dispatchEvent(new Event('scroll'));
        fixture.detectChanges();

        // Set new records
        dataTable.data = new ObjectDataTableAdapter(nextRows, columnDefinitions);
        fixture.detectChanges();

        // Verify new records are loaded and first record is at top
        expect(scrollBody.scrollTop).toBe(0);
        expect(testingUtils.getInnerTextByDataAutomationId('text_Row 21')).toContain('Row 21');
    });
});

describe('Accessibility', () => {
    let fixture: ComponentFixture<DataTableComponent>;
    let dataTable: DataTableComponent;
    let columnCustomTemplate: TemplateRef<any>;
    let testingUtils: UnitTestingUtils;

    const focusTrapFactory = jasmine.createSpyObj('ConfigurableFocusTrapFactory', ['create']);
    const focusTrap = jasmine.createSpyObj('ConfigurableFocusTrap', ['focusInitialElement', 'destroy']);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CustomColumnTemplateComponent],
            providers: [{ provide: ConfigurableFocusTrapFactory, useValue: focusTrapFactory }],
            schemas: [NO_ERRORS_SCHEMA]
        });
        columnCustomTemplate = TestBed.createComponent(CustomColumnTemplateComponent).componentInstance.templateRef;
        fixture = TestBed.createComponent(DataTableComponent);
        dataTable = fixture.componentInstance;
        testingUtils = new UnitTestingUtils(fixture.debugElement);
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should have accessibility tags', () => {
        const dataRows = [{ name: 'test1' }, { name: 'test2' }, { name: 'test3' }, { name: 'test4' }];
        dataTable.data = new ObjectDataTableAdapter([], [new ObjectDataColumn({ key: 'name' })]);

        dataTable.ngOnChanges({
            rows: new SimpleChange(null, dataRows, false)
        });

        fixture.detectChanges();
        const datatableAttributes = testingUtils.getByCSS('.adf-datatable-list').attributes;
        const datatableHeaderAttributes = testingUtils.getByCSS('.adf-datatable-list .adf-datatable-header').attributes;
        const datatableHeaderCellAttributes = testingUtils.getByCSS('.adf-datatable-cell-header').attributes;
        const datatableBodyAttributes = testingUtils.getByCSS('.adf-datatable-body').attributes;
        const datatableBodyRowAttributes = testingUtils.getByCSS('.adf-datatable-body .adf-datatable-row').attributes;
        const datatableBodyCellAttributes = testingUtils.getByCSS('.adf-datatable-body .adf-datatable-cell').attributes;

        expect(datatableAttributes['role']).toEqual('grid');
        expect(datatableHeaderAttributes['role']).toEqual('rowgroup');
        expect(datatableHeaderCellAttributes['role']).toEqual('columnheader');
        expect(datatableBodyAttributes['role']).toEqual('rowgroup');
        expect(datatableBodyRowAttributes['role']).toEqual('row');
        expect(datatableBodyCellAttributes['role']).toEqual('gridcell');
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

    describe('Focus row', () => {
        let event: KeyboardEvent;
        let dataRows: { name: string }[];

        beforeEach(() => {
            event = new KeyboardEvent('keyup', {
                code: 'ArrowUp',
                key: 'ArrowUp',
                keyCode: 38
            } as KeyboardEventInit);
            dataRows = [{ name: 'test1' }, { name: 'test2' }];
            dataTable.data = new ObjectDataTableAdapter([], [new ObjectDataColumn({ key: 'name' })]);
        });

        it('should focus next row on ArrowDown event', () => {
            event = new KeyboardEvent('keyup', {
                code: 'ArrowDown',
                key: 'ArrowDown',
                keyCode: 40
            } as KeyboardEventInit);

            dataTable.ngOnChanges({
                rows: new SimpleChange(null, dataRows, false)
            });

            fixture.detectChanges();
            dataTable.ngAfterViewInit();

            const rowElement = testingUtils.getAllByCSS('.adf-datatable-body .adf-datatable-row')[0];
            testingUtils.setDebugElement(rowElement);
            testingUtils.clickByCSS('.adf-datatable-cell');

            fixture.debugElement.nativeElement.dispatchEvent(event);

            expect(document.activeElement?.getAttribute('data-automation-id')).toBe('datatable-row-1');
        });

        it('should focus previous row on ArrowUp event', () => {
            dataTable.ngOnChanges({
                rows: new SimpleChange(null, dataRows, false)
            });

            fixture.detectChanges();
            dataTable.ngAfterViewInit();

            const rowElement = testingUtils.getAllByCSS('.adf-datatable-body .adf-datatable-row')[1];
            testingUtils.setDebugElement(rowElement);
            testingUtils.clickByCSS('.adf-datatable-cell');

            fixture.debugElement.nativeElement.dispatchEvent(event);

            expect(document.activeElement?.getAttribute('data-automation-id')).toBe('datatable-row-0');
        });

        it('should select header row when `showHeader` is `Always`', () => {
            dataTable.showHeader = ShowHeaderMode.Always;

            dataTable.ngOnChanges({
                rows: new SimpleChange(null, dataRows, false)
            });

            fixture.detectChanges();
            dataTable.ngAfterViewInit();

            const rowElement = testingUtils.getAllByCSS('.adf-datatable-body .adf-datatable-row')[0];
            testingUtils.setDebugElement(rowElement);
            testingUtils.clickByCSS('.adf-datatable-cell');

            fixture.debugElement.nativeElement.dispatchEvent(event);

            expect(document.activeElement?.getAttribute('data-automation-id')).toBe('datatable-row-header');
        });

        it('should not select header row when `showHeader` is `Never`', () => {
            dataTable.showHeader = ShowHeaderMode.Never;

            dataTable.ngOnChanges({
                rows: new SimpleChange(null, dataRows, false)
            });

            fixture.detectChanges();
            dataTable.ngAfterViewInit();

            const rowElement = testingUtils.getAllByCSS('.adf-datatable-body .adf-datatable-row')[0];
            testingUtils.setDebugElement(rowElement);
            testingUtils.clickByCSS('.adf-datatable-cell');

            fixture.debugElement.nativeElement.dispatchEvent(event);

            expect(document.activeElement?.getAttribute('data-automation-id')).toBe('datatable-row-1');
        });
    });

    it('should remove cell focus when [focus] is set to false', () => {
        dataTable.showHeader = ShowHeaderMode.Never;
        const dataRows = [{ name: 'name1' }];

        dataTable.data = new ObjectDataTableAdapter([], [new ObjectDataColumn({ key: 'name', template: columnCustomTemplate, focus: false })]);

        dataTable.ngOnChanges({
            rows: new SimpleChange(null, dataRows, false)
        });

        fixture.detectChanges();
        dataTable.ngAfterViewInit();

        const cell = testingUtils.getByCSS('.adf-datatable-row[data-automation-id="datatable-row-0"] .adf-cell-value');
        expect(cell?.nativeElement.getAttribute('tabindex')).toBe(null);
    });

    it('should allow element focus when [focus] is set to true', () => {
        dataTable.showHeader = ShowHeaderMode.Never;
        const dataRows = [{ name: 'name1' }];

        dataTable.data = new ObjectDataTableAdapter([], [new ObjectDataColumn({ key: 'name', template: columnCustomTemplate, focus: true })]);

        dataTable.ngOnChanges({
            rows: new SimpleChange(null, dataRows, false)
        });

        fixture.detectChanges();
        dataTable.ngAfterViewInit();

        const cell = testingUtils.getByCSS('.adf-datatable-row[data-automation-id="datatable-row-0"] .adf-cell-value');
        expect(cell?.nativeElement.getAttribute('tabindex')).toBe('0');
    });

    it('should create focus trap on main menu open', () => {
        dataTable.showHeader = ShowHeaderMode.Always;
        dataTable.showMainDatatableActions = true;
        dataTable.mainActionTemplate = columnCustomTemplate;
        focusTrapFactory.create.and.returnValue(focusTrap);
        spyOn(dataTable, 'onMainMenuOpen').and.callThrough();

        dataTable.ngOnChanges({
            rows: new SimpleChange(null, [{ name: 'test1' }, { name: 'test2' }], false)
        });
        fixture.detectChanges();
        dataTable.ngAfterViewInit();

        testingUtils.clickByDataAutomationId('adf-datatable-main-menu-button');
        fixture.detectChanges();

        expect(dataTable.onMainMenuOpen).toHaveBeenCalled();
        expect(focusTrapFactory.create).toHaveBeenCalledWith(dataTable.mainMenuTemplate.nativeElement);
        expect(focusTrap.focusInitialElement).toHaveBeenCalled();
    });

    it('should destroy focus trap on main menu closed', () => {
        dataTable.focusTrap = focusTrap;

        dataTable.onMainMenuClosed();

        expect(focusTrap.destroy).toHaveBeenCalled();
        expect(dataTable.focusTrap).toBeNull();
    });
});

describe('Drag&Drop column header', () => {
    let fixture: ComponentFixture<DataTableComponent>;
    let dataTable: DataTableComponent;
    let data: { id: number; name: string }[] = [];
    let dataTableSchema: DataColumn[] = [];
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CustomColumnTemplateComponent],
            schemas: [NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent(DataTableComponent);
        testingUtils = new UnitTestingUtils(fixture.debugElement);
        dataTable = fixture.componentInstance;
        data = [
            { id: 1, name: 'name1' },
            { id: 2, name: 'name2' }
        ];

        dataTableSchema = [
            new ObjectDataColumn({ key: 'id', title: 'ID', draggable: false }),
            new ObjectDataColumn({ key: 'name', title: 'Name', draggable: true })
        ];

        dataTable.data = new ObjectDataTableAdapter([...data], [...dataTableSchema]);
    });

    it('should show/hide drag indicator icon', () => {
        fixture.detectChanges();

        testingUtils.hoverOverByDataAutomationId('auto_id_name');
        fixture.detectChanges();

        expect(testingUtils.getByDataAutomationId('adf-datatable-cell-header-drag-icon-name')).toBeTruthy();

        testingUtils.mouseLeaveByDataAutomationId('auto_id_name');
        fixture.detectChanges();

        expect(testingUtils.getByDataAutomationId('adf-datatable-cell-header-drag-icon-name')).toBeFalsy();
    });

    it('should not show drag indicator icon, when drag and drop is disabled', () => {
        fixture.detectChanges();

        testingUtils.hoverOverByDataAutomationId('auto_id_id');
        fixture.detectChanges();

        expect(testingUtils.getByDataAutomationId('adf-datatable-cell-header-drag-icon-id')).toBeFalsy();
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
        const headerCells = testingUtils.getAllByCSS('.adf-datatable-cell--text.adf-datatable-cell-header');

        expect(columns[0].key).toEqual(dataTableSchema[1].key);
        expect(columns[1].key).toEqual(dataTableSchema[0].key);

        expect(headerCells[0].nativeElement.innerText).toBe(dataTableSchema[1].title);
        expect(headerCells[1].nativeElement.innerText).toBe(dataTableSchema[0].title);
    });
});

describe('Show/hide columns', () => {
    let fixture: ComponentFixture<DataTableComponent>;
    let dataTable: DataTableComponent;
    let data: DataColumn[] = [];
    let dataTableSchema: DataColumn[] = [];
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CustomColumnTemplateComponent],
            schemas: [NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent(DataTableComponent);
        dataTable = fixture.componentInstance;
        data = [
            { id: '1', title: 'name1', key: 'key', type: 'text' },
            { id: '2', title: 'name1', key: 'key', type: 'text' },
            { id: '3', title: 'name1', key: 'key', type: 'text' }
        ];

        dataTableSchema = [
            new ObjectDataColumn({ key: 'id', title: 'ID' }),
            new ObjectDataColumn({ key: 'name', title: 'Name' }),
            new ObjectDataColumn({ key: 'status', title: 'status', isHidden: true })
        ];

        dataTable.data = new ObjectDataTableAdapter([...data], [...dataTableSchema]);
        testingUtils = new UnitTestingUtils(fixture.debugElement);

        fixture.detectChanges();
    });

    it('should hide columns with isHidden prop', () => {
        const headerCells = testingUtils.getAllByCSS('.adf-datatable-cell--text.adf-datatable-cell-header');

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

        const headerCells = testingUtils.getAllByCSS('.adf-datatable-cell--text.adf-datatable-cell-header');
        expect(headerCells.length).toBe(1);
    });

    describe('markRowAsContextMenuSource', () => {
        it('should set isContextMenuSource to false for all rows returned by getRows function', () => {
            const rows = [
                {
                    isContextMenuSource: true
                },
                {
                    isContextMenuSource: true
                }
            ] as DataRow[];
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
    let testingUtils: UnitTestingUtils;

    const getTableBody = (): HTMLDivElement => testingUtils.getByCSS('.adf-datatable-body').nativeElement;

    const getResizeHandler = (): HTMLDivElement => testingUtils.getByCSS('.adf-datatable__resize-handle')?.nativeElement;

    const getResizeHandlersCount = (): number => {
        const resizeHandlers = testingUtils.getAllByCSS('.adf-datatable__resize-handle');
        return resizeHandlers.length;
    };

    const testClassesAfterResizing = (headerColumnsSelector = '.adf-datatable-cell-header', excludedClass = 'adf-datatable__cursor--pointer') => {
        dataTable.isResizingEnabled = true;
        fixture.detectChanges();

        const resizeHandle = getResizeHandler();
        resizeHandle.dispatchEvent(new MouseEvent('mousedown'));
        fixture.detectChanges();

        const headerColumns = testingUtils.getAllByCSS(headerColumnsSelector);

        expect(dataTable.isResizing).toBeTrue();
        headerColumns.forEach((header) => expect(header.nativeElement.classList).not.toContain(excludedClass));
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CustomColumnTemplateComponent],
            schemas: [NO_ERRORS_SCHEMA]
        });
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

        dataTable.data = new ObjectDataTableAdapter([...data], [...dataTableSchema]);

        dataTable.isResizingEnabled = false;
        testingUtils = new UnitTestingUtils(fixture.debugElement);

        fixture.detectChanges();
    });

    it('should NOT display resize handle when the feature is Disabled [isResizingEnabled=false]', () => {
        const resizeHandle = getResizeHandler();

        expect(resizeHandle).toBeUndefined();
        const headerColumns = testingUtils.getAllByCSS('.adf-datatable-cell-header');

        headerColumns.forEach((header) => {
            expect(header.nativeElement.classList).toContain('adf-datatable__cursor--pointer');
        });
    });

    it('should display resize handle for each column, but not for the last one, by default', () => {
        dataTable.isResizingEnabled = true;
        fixture.detectChanges();

        expect(getResizeHandlersCount()).toBe(1);
    });

    it('should NOT display resize handle for the column when the column has resizable param set to false and column is not the last one', () => {
        dataTable.isResizingEnabled = true;
        dataTableSchema[0].resizable = false;
        dataTable.data = new ObjectDataTableAdapter([...data], [...dataTableSchema]);
        fixture.detectChanges();

        expect(getResizeHandlersCount()).toBe(0);
    });

    it('should display resize handle when the feature is Enabled [isResizingEnabled=true]', () => {
        dataTable.isResizingEnabled = true;

        fixture.detectChanges();
        const resizeHandle = getResizeHandler();

        expect(resizeHandle).not.toBeNull();
        const headerColumns = testingUtils.getAllByCSS('.adf-datatable-cell-header');

        headerColumns.forEach((header) => {
            expect(header.nativeElement.classList).toContain('adf-datatable__cursor--pointer');
        });
    });

    it('should NOT have the cursor pointer class in the header upon resizing starts', () => {
        testClassesAfterResizing();
    });

    it('should NOT have the [adf-datatable-cell-header-content--hovered] class in the header upon resizing starts', () => {
        testClassesAfterResizing('.adf-datatable-cell-header-content', 'adf-datatable-cell-header-content--hovered');
    });

    it('should NOT display drag icon upon resizing starts', () => {
        dataTable.isResizingEnabled = true;
        fixture.detectChanges();

        testingUtils.hoverOverByDataAutomationId('auto_id_id');
        fixture.detectChanges();
        let dragIcon = testingUtils.getByDataAutomationId('adf-datatable-cell-header-drag-icon-id');

        expect(dragIcon).not.toBeNull();

        const resizeHandles = testingUtils.getAllByCSS('.adf-datatable__resize-handle');
        resizeHandles[0].nativeElement.dispatchEvent(new MouseEvent('mousedown'));
        fixture.detectChanges();

        dragIcon = testingUtils.getByDataAutomationId('adf-datatable-cell-header-drag-icon-id');

        expect(dataTable.isResizing).toBeTrue();
        expect(dragIcon).toBeNull();
    });

    describe('Datatable blur', () => {
        beforeEach(() => {
            dataTable.isResizingEnabled = true;
            fixture.detectChanges();

            const resizeHandle = getResizeHandler();
            resizeHandle.dispatchEvent(new MouseEvent('mousedown'));
            fixture.detectChanges();
        });

        it('should blur the table body upon resizing starts', () => {
            const tableBody = getTableBody();
            expect(dataTable.isResizing).toBeTrue();
            expect(tableBody.classList).toContain('adf-blur-datatable-body');
        });

        it('should not blur the table body upon resizing starts when blurOnResize is false', () => {
            dataTable.blurOnResize = false;
            fixture.detectChanges();
            const tableBody = getTableBody();
            expect(dataTable.isResizing).toBeTrue();
            expect(tableBody.classList).not.toContain('adf-blur-datatable-body');
        });
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

    it('should stop propagation on resize handler click event', () => {
        dataTable.isResizingEnabled = true;
        fixture.detectChanges();

        const resizeHandle = getResizeHandler();
        const clickEvent = new MouseEvent('click');
        const stopPropagationSpy = spyOn(clickEvent, 'stopPropagation');

        resizeHandle.dispatchEvent(clickEvent);

        expect(stopPropagationSpy).toHaveBeenCalled();
    });

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

        const headerColumns = testingUtils.getAllByCSS('.adf-datatable-cell-header');
        expect(headerColumns[0].nativeElement.style.flex).toBe('0 1 125px');
    }));

    it('should set the column header to 100px on resizing when its width goes below 100', fakeAsync(() => {
        dataTable.onResizing({ rectangle: { top: 0, bottom: 10, left: 0, right: 20, width: 85 } }, 0);
        tick();
        fixture.detectChanges();

        const headerColumns = testingUtils.getAllByCSS('.adf-datatable-cell-header');
        expect(headerColumns[0].nativeElement.style.flex).toBe('0 1 100px');
    }));

    it('should set the style of all the table cells under the resizing header on resizing', fakeAsync(() => {
        dataTable.onResizing({ rectangle: { top: 0, bottom: 10, left: 0, right: 20, width: 130 } }, 0);
        tick();
        fixture.detectChanges();

        const tableBody = getTableBody();
        const firstCell: HTMLElement = tableBody.querySelector('[data-automation-id="name1"]');
        const secondCell: HTMLElement = tableBody.querySelector('[data-automation-id="name2"]');

        expect(firstCell.style.flex).toBe('0 1 130px');
        expect(secondCell.style.flex).toBe('0 1 130px');
    }));

    it('should set the style of all the table cells under the resizing header to 100px on resizing when its width goes below 100', fakeAsync(() => {
        dataTable.onResizing({ rectangle: { top: 0, bottom: 10, left: 0, right: 20, width: 85 } }, 0);
        tick();
        fixture.detectChanges();

        const tableBody = getTableBody();
        const firstCell: HTMLElement = tableBody.querySelector('[data-automation-id="name1"]');
        const secondCell: HTMLElement = tableBody.querySelector('[data-automation-id="name2"]');

        expect(firstCell.style.flex).toBe('0 1 100px');
        expect(secondCell.style.flex).toBe('0 1 100px');
    }));

    it('should unblur the body and set the resizing to false upon resizing ends', () => {
        dataTable.isResizingEnabled = true;
        fixture.detectChanges();

        const resizeHandle: HTMLElement = getResizeHandler();
        resizeHandle.dispatchEvent(new MouseEvent('mousedown'));
        fixture.detectChanges();

        const tableBody = getTableBody();

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
        spyOn(dataTable.columnsWidthChanged, 'emit');

        dataTable.isResizingEnabled = true;
        fixture.detectChanges();

        const resizeHandle: HTMLElement = getResizeHandler();
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

    it('should not have drag and drop directive enabled and not emit event when drag rows is disabled', () => {
        spyOn(dataTable.dragDropped, 'emit');
        dataTable.enableDragRows = false;
        dataTable.showHeader = ShowHeaderMode.Never;
        fixture.detectChanges();
        const dragAndDrop = testingUtils.getByDirective(CdkDropList).injector.get(CdkDropList);
        dataTable.onDragDrop({} as CdkDragDrop<any>);
        expect(dataTable.dragDropped.emit).not.toHaveBeenCalled();
        expect(dragAndDrop.disabled).toBeTrue();
    });

    it('should emit event when drag rows is enabled', () => {
        spyOn(dataTable.dragDropped, 'emit');
        dataTable.enableDragRows = true;
        fixture.detectChanges();
        const data = { previousIndex: 1, currentIndex: 0 };
        dataTable.onDragDrop(data as CdkDragDrop<any>);
        expect(dataTable.dragDropped.emit).toHaveBeenCalledWith(data);
    });

    describe('show correct column count', () => {
        it('should display 2 columns for no provided actions and no default actions', () => {
            dataTable.data = new ObjectDataTableAdapter(
                [{ name: '1' }],
                [
                    new ObjectDataColumn({ key: 'name', title: 'Name', sortable: true }),
                    new ObjectDataColumn({ key: 'other', title: 'Other', sortable: true })
                ]
            );

            fixture.detectChanges();

            const visibleColumns = dataTable.getVisibleColumns();

            const datatableCellHeaders = testingUtils.getAllByCSS('.adf-datatable-cell-header');
            const datatableCells = testingUtils.getAllByCSS('.adf-datatable-cell');

            expect(visibleColumns.length).toBe(2);

            const expectedNumberOfColumns = 2;

            expect(datatableCellHeaders.length).toBe(expectedNumberOfColumns);
            expect(datatableCells.length).toBe(expectedNumberOfColumns);
        });

        it('should display 2 columns if last column has no title and there are no provided actions and no default actions', () => {
            dataTable.data = new ObjectDataTableAdapter(
                [{ name: '1' }],
                [new ObjectDataColumn({ key: 'name', title: 'Name', sortable: true }), new ObjectDataColumn({ key: 'other', sortable: true })]
            );

            fixture.detectChanges();

            const visibleColumns = dataTable.getVisibleColumns();

            const datatableCellHeaders = testingUtils.getAllByCSS('.adf-datatable-cell-header');
            const datatableCells = testingUtils.getAllByCSS('.adf-datatable-cell');

            expect(visibleColumns.length).toBe(2);

            const expectedNumberOfColumns = 2;

            expect(datatableCellHeaders.length).toBe(expectedNumberOfColumns);
            expect(datatableCells.length).toBe(expectedNumberOfColumns);
        });

        it('should display 3 columns if there are default actions', () => {
            dataTable.data = new ObjectDataTableAdapter(
                [{ name: '1' }],
                [
                    new ObjectDataColumn({ key: 'name', title: 'Name', sortable: true }),
                    new ObjectDataColumn({ key: 'other', title: 'Other', sortable: true })
                ]
            );

            dataTable.actions = true;

            fixture.detectChanges();

            const visibleColumns = dataTable.getVisibleColumns();

            const datatableCellHeaders = testingUtils.getAllByCSS('.adf-datatable-cell-header');
            const datatableCells = testingUtils.getAllByCSS('.adf-datatable-cell');

            expect(visibleColumns.length).toBe(2);

            const expectedNumberOfColumns = 3;

            expect(datatableCellHeaders.length).toBe(expectedNumberOfColumns);
            expect(datatableCells.length).toBe(expectedNumberOfColumns);
        });

        it('should display 2 columns if there are default actions and provided actions', () => {
            dataTable.data = new ObjectDataTableAdapter(
                [{ name: '1' }],
                [new ObjectDataColumn({ key: 'name', title: 'Name', sortable: true }), new ObjectDataColumn({ key: 'other', sortable: true })]
            );

            dataTable.actions = true;
            dataTable.showProvidedActions = true;

            fixture.detectChanges();

            const visibleColumns = dataTable.getVisibleColumns();

            const datatableCellHeaders = testingUtils.getAllByCSS('.adf-datatable-cell-header');
            const datatableCells = testingUtils.getAllByCSS('.adf-datatable-cell');

            expect(visibleColumns.length).toBe(2);

            const expectedNumberOfColumns = 2;

            expect(datatableCellHeaders.length).toBe(expectedNumberOfColumns);
            expect(datatableCells.length).toBe(expectedNumberOfColumns);
        });
    });
});
