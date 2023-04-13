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

import { Subject, BehaviorSubject } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { setupTestBed, DataTableComponent, DataSorting } from '@alfresco/adf-core';
import { SearchService  } from '../../../search/services/search.service';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { SimpleChange } from '@angular/core';
import { SearchHeaderQueryBuilderService } from './../../../search/services/search-header-query-builder.service';
import { SEARCH_QUERY_SERVICE_TOKEN } from './../../../search/search-query-service.token';
import { DocumentListComponent } from './../document-list.component';
import { FilterHeaderComponent } from './filter-header.component';
import { Pagination } from '@alfresco/js-api';
import { ADF_DOCUMENT_PARENT_COMPONENT } from '../document-list.token';

describe('FilterHeaderComponent', () => {
    let fixture: ComponentFixture<FilterHeaderComponent>;
    let component: FilterHeaderComponent;
    let queryBuilder: SearchHeaderQueryBuilderService;

    const searchMock: any = {
        dataLoaded: new Subject()
    };

    const paginationMock = { maxItems: 10, skipCount: 0 };

    const documentListMock = {
        node: 'my-node',
        sorting: ['name', 'asc'],
        pagination: new BehaviorSubject<Pagination>(paginationMock),
        sortingSubject: new BehaviorSubject<DataSorting[]>([]),
        reload: () => jasmine.createSpy('reload')
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ],
        providers: [
            { provide: ADF_DOCUMENT_PARENT_COMPONENT, useExisting: DocumentListComponent },
            { provide: SearchService, useValue: searchMock },
            { provide: SEARCH_QUERY_SERVICE_TOKEN, useClass: SearchHeaderQueryBuilderService },
            { provide: DocumentListComponent, useValue: documentListMock },
            DataTableComponent
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FilterHeaderComponent);
        component = fixture.componentInstance;
        queryBuilder = fixture.componentInstance['searchFilterQueryBuilder'];
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should subscribe to changes in document list pagination', async () => {
        const setupCurrentPaginationSpy = spyOn(queryBuilder, 'setupCurrentPagination');

        const currentFolderNodeIdChange = new SimpleChange('current-node-id', 'next-node-id', true);
        component.ngOnChanges({ currentFolderId: currentFolderNodeIdChange });
        fixture.detectChanges();
        await fixture.whenStable();

        expect(setupCurrentPaginationSpy).toHaveBeenCalled();
    });

    it('should subscribe to changes in document list sorting', async () => {
        const setSortingSpy = spyOn(queryBuilder, 'setSorting');

        const currentFolderNodeIdChange = new SimpleChange('current-node-id', 'next-node-id', true);
        component.ngOnChanges({ currentFolderId: currentFolderNodeIdChange });
        fixture.detectChanges();
        await fixture.whenStable();

        expect(setSortingSpy).toHaveBeenCalled();
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

    it('should set active filters when an initial value is set', async () => {
        spyOn(queryBuilder, 'setCurrentRootFolderId');
        spyOn(queryBuilder, 'isCustomSourceNode').and.returnValue(false);

        fixture.detectChanges();
        await fixture.whenStable();
        expect(queryBuilder.getActiveFilters().length).toBe(0);

        const initialFilterValue = { name: 'pinocchio' };
        component.value = initialFilterValue;
        const currentFolderNodeIdChange = new SimpleChange('current-node-id', 'next-node-id', true);
        component.ngOnChanges({ currentFolderId: currentFolderNodeIdChange });
        fixture.detectChanges();
        await fixture.whenStable();

        expect(queryBuilder.getActiveFilters().length).toBe(1);
        expect(queryBuilder.getActiveFilters()[0].key).toBe('name');
        expect(queryBuilder.getActiveFilters()[0].value).toBe('pinocchio');
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

});
