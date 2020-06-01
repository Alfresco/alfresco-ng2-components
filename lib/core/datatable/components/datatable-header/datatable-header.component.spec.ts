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

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreTestingModule } from '../../../testing/core.testing.module';
import { setupTestBed } from '../../../testing/setup-test-bed';
import { TranslateModule } from '@ngx-translate/core';

import { DataTableHeaderComponent } from './datatable-header.component';
import { ObjectDataColumn } from '../../data/object-datacolumn.model';
import { ObjectDataTableAdapter } from '../../data/object-datatable-adapter';
import { DataSorting } from '../../data/data-sorting.model';
import { DataColumn } from '../../data/data-column.model';

describe('DataTableHeader', () => {

    let fixture: ComponentFixture<DataTableHeaderComponent>;
    let dataTable: DataTableHeaderComponent;
    let element: any;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ],
        schemas: [NO_ERRORS_SCHEMA]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DataTableHeaderComponent);
        dataTable = fixture.componentInstance;
        element = fixture.debugElement.nativeElement;
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should hide the header if showHeader is false', () => {
        const newData = new ObjectDataTableAdapter(
            [
                { name: '1' },
                { name: '2' }
            ],
            [new ObjectDataColumn({ key: 'name' })]
        );

        dataTable.showHeader = false;
        dataTable.loading = false;
        dataTable.data = newData;

        fixture.detectChanges();

        expect(element.querySelector('.adf-datatable-header')).toBe(null);
    });

    it('should hide the header if there are no elements inside', () => {
        const newData = new ObjectDataTableAdapter(
        );

        dataTable.data = newData;

        fixture.detectChanges();

        expect(element.querySelector('.adf-datatable-header')).toBe(null);
    });

    it('should hide the header if noPermission is true', () => {
        const newData = new ObjectDataTableAdapter(
        );

        dataTable.noPermission = true;
        dataTable.loading = false;

        dataTable.data = newData;

        fixture.detectChanges();

        expect(element.querySelector('.adf-datatable-header')).toBe(null);
    });

    it('should show the header if showHeader is true', () => {
        const newData = new ObjectDataTableAdapter(
            [
                { name: '1' },
                { name: '2' }
            ],
            [new ObjectDataColumn({ key: 'name' })]
        );
        dataTable.showHeader = true;
        dataTable.loading = false;

        dataTable.data = newData;

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

        fixture.detectChanges();
        dataTable.onColumnHeaderClick(column);
    });

    // it('should not sort if column is missing', () => {
    //     dataTable.ngOnChanges({ 'data': new SimpleChange('123', {}, true) });
    //     fixture.detectChanges();
    //     dataTable.ngAfterViewInit();
    //     const adapter = dataTable.data;
    //     spyOn(adapter, 'setSorting').and.callThrough();
    //     dataTable.onColumnHeaderClick(null);
    //     expect(adapter.setSorting).not.toHaveBeenCalled();
    // });

    // it('should not sort upon clicking non-sortable column header', () => {
    //     dataTable.ngOnChanges({ 'data': new SimpleChange('123', {}, true) });
    //     fixture.detectChanges();
    //     dataTable.ngAfterViewInit();
    //     const adapter = dataTable.data;
    //     spyOn(adapter, 'setSorting').and.callThrough();

    //     const column = new ObjectDataColumn({
    //         key: 'column_1'
    //     });

    //     dataTable.onColumnHeaderClick(column);
    //     expect(adapter.setSorting).not.toHaveBeenCalled();
    // });

    // it('should set sorting upon column header clicked', () => {
    //     dataTable.ngOnChanges({ 'data': new SimpleChange('123', {}, true) });
    //     fixture.detectChanges();
    //     dataTable.ngAfterViewInit();
    //     const adapter = dataTable.data;
    //     spyOn(adapter, 'setSorting').and.callThrough();

    //     const column = new ObjectDataColumn({
    //         key: 'column_1',
    //         sortable: true
    //     });

    //     dataTable.onColumnHeaderClick(column);
    //     expect(adapter.setSorting).toHaveBeenCalledWith(
    //         jasmine.objectContaining({
    //             key: 'column_1',
    //             direction: 'asc'
    //         })
    //     );
    // });

//     it('should invert sorting upon column header clicked', () => {
//         dataTable.ngOnChanges({ 'data': new SimpleChange('123', {}, true) });
//         fixture.detectChanges();
//         dataTable.ngAfterViewInit();

//         const adapter = dataTable.data;
//         const sorting = new DataSorting('column_1', 'asc');
//         spyOn(adapter, 'setSorting').and.callThrough();
//         spyOn(adapter, 'getSorting').and.returnValue(sorting);

//         const column = new ObjectDataColumn({
//             key: 'column_1',
//             sortable: true
//         });

//         // check first click on the header
//         dataTable.onColumnHeaderClick(column);
//         expect(adapter.setSorting).toHaveBeenCalledWith(
//             jasmine.objectContaining({
//                 key: 'column_1',
//                 direction: 'desc'
//             })
//         );

//         // check second click on the header
//         sorting.direction = 'desc';
//         dataTable.onColumnHeaderClick(column);
//         expect(adapter.setSorting).toHaveBeenCalledWith(
//             jasmine.objectContaining({
//                 key: 'column_1',
//                 direction: 'asc'
//             })
//         );
//    });

    it('should indicate column that has sorting applied', () => {
        dataTable.data = new ObjectDataTableAdapter(
            [{ name: '1' }, { name: '2' }],
            [
                new ObjectDataColumn({ key: 'name', sortable: true }),
                new ObjectDataColumn({ key: 'other', sortable: true })
            ]
        );
        fixture.detectChanges();

        const [col1, col2] = dataTable.getSortableColumns();

        dataTable.onColumnHeaderClick(col2);

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
});
