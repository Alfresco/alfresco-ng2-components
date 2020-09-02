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
import { Subject } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SearchService, setupTestBed, AlfrescoApiService } from '@alfresco/adf-core';
import { SearchFilterQueryBuilderService } from '../../search-filter-query-builder.service';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { fakeNodePaging } from './../../../mock/document-list.component.mock';
import { SEARCH_QUERY_SERVICE_TOKEN } from '../../search-query-service.token';
import { By } from '@angular/platform-browser';
import { SearchFilterContainerComponent } from './search-filter-container.component';
import { MatMenuTrigger } from '@angular/material/menu';

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

describe('SearchFilterContainerComponent', () => {
    let fixture: ComponentFixture<SearchFilterContainerComponent>;
    let component: SearchFilterContainerComponent;
    let queryBuilder: SearchFilterQueryBuilderService;
    let alfrescoApiService: AlfrescoApiService;

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
            { provide: SEARCH_QUERY_SERVICE_TOKEN, useClass: SearchFilterQueryBuilderService }
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchFilterContainerComponent);
        component = fixture.componentInstance;
        queryBuilder = fixture.componentInstance['searchHeaderQueryBuilder'];
        alfrescoApiService = TestBed.inject(AlfrescoApiService);
        component.col = {key: '123', type: 'text'};
        spyOn(queryBuilder, 'getCategoryForColumn').and.returnValue(mockCategory);
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should show the filter when a category is found', async () => {
        expect(queryBuilder.isFilterServiceActive()).toBe(true);
        const element = fixture.nativeElement.querySelector('.adf-filter');
        expect(element).not.toBeNull();
        expect(element).not.toBeUndefined();
    });

    it('should set new active filter after the Apply button is clicked', async () => {
        const menuButton: HTMLButtonElement = fixture.nativeElement.querySelector('#filter-menu-button');
        menuButton.click();
        fixture.detectChanges();
        await fixture.whenStable();
        component.widgetContainer.componentRef.instance.value = 'searchText';
        const applyButton = fixture.debugElement.query(By.css('#apply-filter-button'));
        applyButton.triggerEventHandler('click', {});
        fixture.detectChanges();
        await fixture.whenStable();
        expect(queryBuilder.getActiveFilters().length).toBe(1);
        expect(queryBuilder.getActiveFilters()[0].key).toBe('name');
        expect(queryBuilder.getActiveFilters()[0].value).toBe('searchText');
    });

    it('should emit filterChange after the Apply button is clicked', async (done) => {
        spyOn(alfrescoApiService.searchApi, 'search').and.returnValue(Promise.resolve(fakeNodePaging));
        spyOn(queryBuilder, 'buildQuery').and.returnValue({});
        component.filterChange.subscribe(() => {
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

    it('should remove active filter after the Clear button is clicked', async () => {
        queryBuilder.setActiveFilter('name', 'searchText');
        const menuButton: HTMLButtonElement = fixture.nativeElement.querySelector('#filter-menu-button');
        menuButton.click();
        fixture.detectChanges();
        await fixture.whenStable();
        component.widgetContainer.componentRef.instance.value = 'searchText';
        const fakeEvent = jasmine.createSpyObj('event', ['stopPropagation']);
        const clearButton = fixture.debugElement.query(By.css('#clear-filter-button'));
        clearButton.triggerEventHandler('click', fakeEvent);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(queryBuilder.getActiveFilters().length).toBe(0);
    });

    it('should emit filterChange after the Clear button is clicked', async (done) => {
        spyOn(alfrescoApiService.searchApi, 'search').and.returnValue(Promise.resolve(fakeNodePaging));
        spyOn(queryBuilder, 'buildQuery').and.returnValue({});
        component.filterChange.subscribe(() => {
            done();
        });
        const menuButton: HTMLButtonElement = fixture.nativeElement.querySelector('#filter-menu-button');
        menuButton.click();
        fixture.detectChanges();
        await fixture.whenStable();
        component.widgetContainer.componentRef.instance.value = 'searchText';
        const fakeEvent = jasmine.createSpyObj('event', ['stopPropagation']);
        const clearButton = fixture.debugElement.query(By.css('#clear-filter-button'));
        clearButton.triggerEventHandler('click', fakeEvent);
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should emit filterChange after the Enter key is pressed', async (done) => {
        spyOn(queryBuilder, 'buildQuery').and.returnValue({});
        component.filterChange.subscribe(() => {
            done();
        });
        const menuButton: HTMLButtonElement = fixture.nativeElement.querySelector('#filter-menu-button');
        menuButton.click();
        fixture.detectChanges();
        await fixture.whenStable();
        component.widgetContainer.componentRef.instance.value = 'searchText';
        const widgetContainer = fixture.debugElement.query(By.css('adf-search-widget-container'));
        widgetContainer.triggerEventHandler('keypress', {key: 'Enter'});
        fixture.detectChanges();
        await fixture.whenStable();
    });

    describe('Accessibility', () => {

        it('should set up a focus trap on the filter when the menu is opened', async () => {
            expect(component.focusTrap).toBeUndefined();

            const menuButton: HTMLButtonElement = fixture.nativeElement.querySelector('#filter-menu-button');
            menuButton.click();
            fixture.detectChanges();

            expect(component.focusTrap).toBeDefined();
            expect(component.focusTrap._element).toBe(component.filterContainer.nativeElement);
        });

        it('should focus the input element when the menu is opened', async () => {
            const menuButton: HTMLButtonElement = fixture.nativeElement.querySelector('#filter-menu-button');
            menuButton.click();

            fixture.detectChanges();
            await fixture.whenStable();

            const inputElement = fixture.debugElement.query(By.css('.mat-input-element'));
            expect(document.activeElement).toBe(inputElement.nativeElement);

        });

        it('should focus the menu trigger when the menu is closed', async () => {
            const menuButton: HTMLButtonElement = fixture.nativeElement.querySelector('#filter-menu-button');
            menuButton.click();

            fixture.detectChanges();
            await fixture.whenStable();

            const matMenuTrigger = fixture.debugElement.query(By.directive(MatMenuTrigger)).injector.get(MatMenuTrigger);
            matMenuTrigger.closeMenu();

            fixture.detectChanges();
            await fixture.whenStable();

            const matMenuButton = fixture.debugElement.query(By.css('#filter-menu-button'));
            expect(document.activeElement).toBe(matMenuButton.nativeElement);
        });
    });
});
