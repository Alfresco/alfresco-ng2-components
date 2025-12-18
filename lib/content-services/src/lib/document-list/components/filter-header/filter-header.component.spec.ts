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

import { Subject } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataTableComponent, DataSorting, PaginationModel } from '@alfresco/adf-core';
import { SearchService } from '../../../search/services/search.service';
import { SimpleChange } from '@angular/core';
import { SearchHeaderQueryBuilderService } from './../../../search/services/search-header-query-builder.service';
import { FilterHeaderComponent } from './filter-header.component';
import { provideRouter } from '@angular/router';

describe('FilterHeaderComponent', () => {
    let fixture: ComponentFixture<FilterHeaderComponent>;
    let component: FilterHeaderComponent;
    let queryBuilder: SearchHeaderQueryBuilderService;

    const searchMock: any = {
        dataLoaded: new Subject()
    };

    const paginationMock: PaginationModel = { maxItems: 10, skipCount: 0, totalItems: 0, hasMoreItems: false };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FilterHeaderComponent],
            providers: [provideRouter([]), { provide: SearchService, useValue: searchMock }, DataTableComponent]
        });
        fixture = TestBed.createComponent(FilterHeaderComponent);
        component = fixture.componentInstance;
        component.currentFolderId = 'test-folder-id';
        queryBuilder = fixture.componentInstance['searchFilterQueryBuilder'];
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should subscribe to changes in document list pagination', async () => {
        const setupCurrentPaginationSpy = spyOn(queryBuilder, 'setupCurrentPagination');

        component.pagination = paginationMock;
        const paginationChange = new SimpleChange(undefined, paginationMock, true);
        component.ngOnChanges({ pagination: paginationChange });
        fixture.detectChanges();
        await fixture.whenStable();

        expect(setupCurrentPaginationSpy).toHaveBeenCalledWith(paginationMock.maxItems, paginationMock.skipCount);
    });

    it('should subscribe to changes in document list sorting', async () => {
        const setSortingSpy = spyOn(queryBuilder, 'setSorting');
        const sortingMock: DataSorting[] = [new DataSorting('name', 'asc')];

        component.sorting = sortingMock;
        const sortingChange = new SimpleChange(undefined, sortingMock, true);
        component.ngOnChanges({ sorting: sortingChange });
        fixture.detectChanges();
        await fixture.whenStable();

        expect(setSortingSpy).toHaveBeenCalledWith(sortingMock);
    });

    it('should reset filters after changing the folder node', async () => {
        const resetActiveFiltersSpy = spyOn(queryBuilder, 'resetActiveFilters');
        spyOn(queryBuilder, 'isCustomSourceNode').and.returnValue(false);

        const currentFolderNodeIdChange = new SimpleChange('current-node-id', 'next-node-id', true);
        component.ngOnChanges({ currentFolderId: currentFolderNodeIdChange });
        fixture.detectChanges();
        await fixture.whenStable();

        expect(resetActiveFiltersSpy).toHaveBeenCalled();
    });

    it('should init filters after changing the folder node', async () => {
        const setCurrentRootFolderIdSpy = spyOn(queryBuilder, 'setCurrentRootFolderId');
        spyOn(queryBuilder, 'isCustomSourceNode').and.returnValue(false);
        const currentFolderNodeIdChange = new SimpleChange('current-node-id', 'next-node-id', true);
        component.ngOnChanges({ currentFolderId: currentFolderNodeIdChange });
        fixture.detectChanges();
        await fixture.whenStable();
        expect(setCurrentRootFolderIdSpy).toHaveBeenCalled();
    });

    it('should set filters if initial value is provided', async () => {
        spyOn(queryBuilder, 'setCurrentRootFolderId');
        spyOn(queryBuilder, 'isCustomSourceNode').and.returnValue(false);
        spyOn(queryBuilder, 'setActiveFilter');

        component.value = { name: 'pinocchio' };
        const currentFolderNodeIdChange = new SimpleChange('current-node-id', 'next-node-id', true);
        component.ngOnChanges({ currentFolderId: currentFolderNodeIdChange });
        fixture.detectChanges();
        await fixture.whenStable();

        expect(queryBuilder.setActiveFilter).toHaveBeenCalledWith('name', 'pinocchio');
    });

    it('should NOT set filters if initial value is not provided', async () => {
        spyOn(queryBuilder, 'setCurrentRootFolderId');
        spyOn(queryBuilder, 'isCustomSourceNode').and.returnValue(false);
        spyOn(queryBuilder, 'setActiveFilter');

        component.value = undefined;
        const currentFolderNodeIdChange = new SimpleChange('current-node-id', 'next-node-id', true);
        component.ngOnChanges({ currentFolderId: currentFolderNodeIdChange });
        fixture.detectChanges();
        await fixture.whenStable();

        expect(queryBuilder.setActiveFilter).not.toHaveBeenCalled();
    });

    it('should set active filters correctly', async () => {
        spyOn(queryBuilder, 'setCurrentRootFolderId');
        spyOn(queryBuilder, 'isCustomSourceNode').and.returnValue(false);

        fixture.detectChanges();
        await fixture.whenStable();
        expect(queryBuilder.getActiveFilters().length).toBe(0);

        component.value = { name: 'pinocchio' };
        const currentFolderNodeIdChange = new SimpleChange('current-node-id', 'next-node-id', true);
        component.ngOnChanges({ currentFolderId: currentFolderNodeIdChange });
        fixture.detectChanges();
        await fixture.whenStable();

        expect(queryBuilder.getActiveFilters().length).toBe(1);
        expect(queryBuilder.getActiveFilters()[0].key).toBe('name');
        expect(queryBuilder.getActiveFilters()[0].value).toBe('pinocchio');
    });

    it('should update queryParams if initial value is provided', async () => {
        spyOn(queryBuilder, 'setCurrentRootFolderId');
        spyOn(queryBuilder, 'isCustomSourceNode').and.returnValue(false);

        fixture.detectChanges();
        await fixture.whenStable();
        expect(Object.keys(queryBuilder.filterRawParams).length).toBe(0);

        component.value = { name: 'pinocchio' };
        const currentFolderNodeIdChange = new SimpleChange('current-node-id', 'next-node-id', true);
        component.ngOnChanges({ currentFolderId: currentFolderNodeIdChange });
        fixture.detectChanges();
        await fixture.whenStable();

        expect(Object.keys(queryBuilder.filterRawParams).length).toBe(1);
        expect(queryBuilder.filterRawParams['name']).toBe('pinocchio');
        expect(queryBuilder.queryFragments['name']).toBe('pinocchio');
    });

    it('should emit filterSelection when a filter is changed', (done) => {
        spyOn(queryBuilder, 'getActiveFilters').and.returnValue([{ key: 'name', value: 'pinocchio' }]);

        component.filterSelection.subscribe((selectedFilters) => {
            expect(selectedFilters.length).toBe(1);
            expect(selectedFilters[0].key).toBe('name');
            expect(selectedFilters[0].value).toBe('pinocchio');
            done();
        });

        component.onFilterSelectionChange();
        fixture.detectChanges();
        fixture.whenStable();
    });

    it('should emit filtersCleared when no filters are active', (done) => {
        spyOn(queryBuilder, 'getActiveFilters').and.returnValue([]);
        spyOn(queryBuilder, 'isNoFilterActive').and.returnValue(true);

        component.filtersCleared.subscribe(() => {
            done();
        });

        component.onFilterSelectionChange();
        fixture.detectChanges();
    });

    it('should emit searchResultsReady when search query builder executes', (done) => {
        fixture.detectChanges(); // Initialize component (triggers ngOnInit)

        const mockNodePaging: any = { list: { entries: [] } };

        component.searchResultsReady.subscribe((nodePaging) => {
            expect(nodePaging).toBe(mockNodePaging);
            done();
        });

        queryBuilder.executed.next(mockNodePaging);
    });

    it('should set isFilterServiceActive on initialization', () => {
        spyOn(queryBuilder, 'isFilterServiceActive').and.returnValue(true);

        fixture = TestBed.createComponent(FilterHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        expect(component.isFilterServiceActive).toBeTrue();
    });
});
