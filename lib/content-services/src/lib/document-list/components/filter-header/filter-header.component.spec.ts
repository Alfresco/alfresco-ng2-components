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

import { Subject, BehaviorSubject } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SearchService, setupTestBed, DataTableComponent } from '@alfresco/adf-core';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { SimpleChange } from '@angular/core';
import { SearchFilterQueryBuilderService } from './../../../search/search-filter-query-builder.service';
import { SEARCH_QUERY_SERVICE_TOKEN } from './../../../search/search-query-service.token';
import { DocumentListComponent } from './../document-list.component';
import { FilterHeaderComponent } from './filter-header.component';
import { Pagination } from '@alfresco/js-api';

describe('FilterHeaderComponent', () => {
    let fixture: ComponentFixture<FilterHeaderComponent>;
    let component: FilterHeaderComponent;
    let queryBuilder: SearchFilterQueryBuilderService;

    const searchMock: any = {
        dataLoaded: new Subject()
    };

    const paginationMock = <Pagination> { maxItems: 10, skipCount: 0 };

    const documentListMock = {
        node: 'my-node',
        sorting: ['name', 'asc'],
        pagination: new BehaviorSubject<Pagination>(paginationMock),
        reload: () => jasmine.createSpy('reload')
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ],
        providers: [
            { provide: SearchService, useValue: searchMock },
            { provide: SEARCH_QUERY_SERVICE_TOKEN, useClass: SearchFilterQueryBuilderService },
            { provide: DocumentListComponent, useValue: documentListMock },
            DataTableComponent
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FilterHeaderComponent);
        component = fixture.componentInstance;
        queryBuilder = fixture.componentInstance['searchHeaderQueryBuilder'];
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should set pagination when pagination in document list changes', async () => {
        const setupCurrentPaginationSpy = spyOn(queryBuilder, 'setupCurrentPagination');
        const currentFolderNodeIdChange = new SimpleChange('current-node-id', 'next-node-id', true);
        component.ngOnChanges({ currentFolderNodeId: currentFolderNodeIdChange });
        fixture.detectChanges();

        await fixture.whenStable();
        expect(setupCurrentPaginationSpy).toHaveBeenCalled();
    });

    // it('should execute a new query when a new sorting is requested', async (done) => {
    //     spyOn(alfrescoApiService.searchApi, 'search').and.returnValue(Promise.resolve(fakeNodePaging));
    //     spyOn(queryBuilder, 'buildQuery').and.returnValue({});
    //     component.update.subscribe((newNodePaging) => {
    //         expect(newNodePaging).toBe(fakeNodePaging);
    //         done();
    //     });

    //     const skipCount = new SimpleChange(null, '123-asc', false);
    //     component.ngOnChanges({ 'sorting': skipCount });
    //     fixture.detectChanges();
    //     await fixture.whenStable();
    // });

    // it('should emit the clear event when no filter has valued applied', async (done) => {
    //     spyOn(queryBuilder, 'isNoFilterActive').and.returnValue(true);
    //     spyOn(alfrescoApiService.searchApi, 'search').and.returnValue(Promise.resolve(fakeNodePaging));
    //     spyOn(queryBuilder, 'buildQuery').and.returnValue({});
    //     spyOn(component, 'isActive').and.returnValue(true);
    //     spyOn(component.widgetContainer, 'resetInnerWidget').and.stub();
    //     component.widgetContainer.componentRef.instance.value = '';
    //     const fakeEvent = jasmine.createSpyObj('event', ['stopPropagation']);
    //     component.clear.subscribe(() => {
    //         done();
    //     });

    //     const menuButton: HTMLButtonElement = fixture.nativeElement.querySelector('#filter-menu-button');
    //     menuButton.click();
    //     fixture.detectChanges();
    //     await fixture.whenStable();
    //     const applyButton = fixture.debugElement.query(By.css('#apply-filter-button'));
    //     applyButton.triggerEventHandler('click', fakeEvent);
    //     fixture.detectChanges();
    //     await fixture.whenStable();
    // });

    // it('should not emit clear event when currentFolderNodeId changes and no filter was applied', async () => {
    //     const currentFolderNodeIdChange = new SimpleChange('current-node-id', 'next-node-id', true);
    //     spyOn(component, 'isActive').and.returnValue(false);
    //     spyOn(component.clear, 'emit');

    //     component.ngOnChanges({ currentFolderNodeId: currentFolderNodeIdChange });
    //     fixture.detectChanges();
    //     expect(component.clear.emit).not.toHaveBeenCalled();
    // });

    // it('should emit clear event when currentFolderNodeId changes and filter was applied', async () => {
    //     const currentFolderNodeIdChange = new SimpleChange('current-node-id', 'next-node-id', true);
    //     spyOn(component.clear, 'emit');
    //     spyOn(component, 'isActive').and.returnValue(true);

    //     component.ngOnChanges({ currentFolderNodeId: currentFolderNodeIdChange });
    //     fixture.detectChanges();
    //     expect(component.clear.emit).toHaveBeenCalled();
    // });
});
