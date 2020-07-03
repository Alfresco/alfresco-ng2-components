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
import { Subject, Subscription } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SearchService, setupTestBed, AlfrescoApiService } from '@alfresco/adf-core';
import { SearchHeaderComponent } from './search-header.component';
import { SearchHeaderQueryBuilderService } from '../../search-header-query-builder.service';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { fakeNodePaging } from '../../../mock';
import { SEARCH_QUERY_SERVICE_TOKEN } from '../../search-query-service.token';
import { By } from '@angular/platform-browser';
import { SimpleChange } from '@angular/core';

const mockCategory: any = {
    'id': 'queryName',
    'name': 'Name',
    'columnKey': 'name',
    'enabled': true,
    'expanded': true,
    'component': {
        'selector': 'text',
        'settings': {
            'pattern': "cm:name:'(.*?)'",
            'field': 'cm:name',
            'placeholder': 'Enter the name'
        }
    }
};

describe('SearchHeaderComponent', () => {
    let fixture: ComponentFixture<SearchHeaderComponent>;
    let component: SearchHeaderComponent;
    let queryBuilder: SearchHeaderQueryBuilderService;
    let alfrescoApiService: AlfrescoApiService;
    let eventSub: Subscription;

    const searchMock: any = {
        dataLoaded: new Subject()
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ],
        providers: [
            { provide: SearchService, useValue: searchMock },
            { provide: SEARCH_QUERY_SERVICE_TOKEN, useClass: SearchHeaderQueryBuilderService }
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchHeaderComponent);
        component = fixture.componentInstance;
        queryBuilder = fixture.componentInstance['searchHeaderQueryBuilder'];
        alfrescoApiService = TestBed.get(AlfrescoApiService);
        component.col = {key: '123', type: 'text'};
        spyOn(queryBuilder, 'getCategoryForColumn').and.returnValue(mockCategory);
        fixture.detectChanges();
    });

    afterEach(() => {
        eventSub.unsubscribe();
        fixture.destroy();
    });

    it('should show the filter when a category is found', async () => {
        expect(queryBuilder.isFilterServiceActive()).toBe(true);
        const element = fixture.nativeElement.querySelector('.adf-filter');
        expect(element).not.toBeNull();
        expect(element).not.toBeUndefined();
    });

    it('should emit the node paging received from the queryBuilder after the filter gets applied', async (done) => {
        spyOn(alfrescoApiService.searchApi, 'search').and.returnValue(Promise.resolve(fakeNodePaging));
        spyOn(queryBuilder, 'buildQuery').and.returnValue({});
        eventSub = component.update.subscribe((newNodePaging) => {
            expect(newNodePaging).toBe(fakeNodePaging);
            done();
        });
        const menuButton: HTMLButtonElement = fixture.nativeElement.querySelector('#filter-menu-button');
        menuButton.click();
        fixture.detectChanges();
        await fixture.whenStable();
        component.widgetContainer.componentRef.instance.value = 'searchText';
        const applyButton = fixture.debugElement.query(By.css('#apply-filter-button'));
        applyButton.triggerEventHandler('click', {});
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should execute a new query when the page size is changed', async (done) => {
        spyOn(alfrescoApiService.searchApi, 'search').and.returnValue(Promise.resolve(fakeNodePaging));
        spyOn(queryBuilder, 'buildQuery').and.returnValue({});
        eventSub = component.update.subscribe((newNodePaging) => {
            expect(newNodePaging).toBe(fakeNodePaging);
            done();
        });

        const maxItem = new SimpleChange(10, 20, false);
        component.ngOnChanges({ 'maxItems': maxItem });
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should execute a new query when a new page is requested', async (done) => {
        spyOn(alfrescoApiService.searchApi, 'search').and.returnValue(Promise.resolve(fakeNodePaging));
        spyOn(queryBuilder, 'buildQuery').and.returnValue({});
        eventSub = component.update.subscribe((newNodePaging) => {
            expect(newNodePaging).toBe(fakeNodePaging);
            done();
        });

        const skipCount = new SimpleChange(0, 10, false);
        component.ngOnChanges({ 'skipCount': skipCount });
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should emit the clear event when no filter has been selected', async (done) => {
        spyOn(queryBuilder, 'isNoFilterActive').and.returnValue(true);
        spyOn(alfrescoApiService.searchApi, 'search').and.returnValue(Promise.resolve(fakeNodePaging));
        spyOn(queryBuilder, 'buildQuery').and.returnValue({});
        spyOn(component.widgetContainer, 'resetInnerWidget').and.stub();
        const fakeEvent = jasmine.createSpyObj('event', ['stopPropagation']);
        eventSub = component.clear.subscribe(() => {
            done();
        });

        const menuButton: HTMLButtonElement = fixture.nativeElement.querySelector('#filter-menu-button');
        menuButton.click();
        fixture.detectChanges();
        await fixture.whenStable();
        const clearButton = fixture.debugElement.query(By.css('#clear-filter-button'));
        clearButton.triggerEventHandler('click', fakeEvent);
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should execute the query again if there are more filter actives after a clear', async (done) => {
        spyOn(queryBuilder, 'isNoFilterActive').and.returnValue(false);
        spyOn(alfrescoApiService.searchApi, 'search').and.returnValue(Promise.resolve(fakeNodePaging));
        spyOn(queryBuilder, 'buildQuery').and.returnValue({});
        spyOn(component.widgetContainer, 'resetInnerWidget').and.stub();
        const fakeEvent = jasmine.createSpyObj('event', ['stopPropagation']);
        const menuButton: HTMLButtonElement = fixture.nativeElement.querySelector('#filter-menu-button');
        eventSub = component.update.subscribe((newNodePaging) => {
            expect(newNodePaging).toBe(fakeNodePaging);
            done();
        });

        menuButton.click();
        fixture.detectChanges();
        await fixture.whenStable();
        const clearButton = fixture.debugElement.query(By.css('#clear-filter-button'));
        clearButton.triggerEventHandler('click', fakeEvent);
        fixture.detectChanges();
        await fixture.whenStable();
    });
});
