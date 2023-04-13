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

import { Subject } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { setupTestBed } from '@alfresco/adf-core';
import { SearchService } from '../../services/search.service';
import { SearchHeaderQueryBuilderService } from '../../services/search-header-query-builder.service';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { SEARCH_QUERY_SERVICE_TOKEN } from '../../search-query-service.token';
import { By } from '@angular/platform-browser';
import { SearchFilterContainerComponent } from './search-filter-container.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { SearchCategory } from '../../models/search-category.interface';

const mockCategory: SearchCategory = {
    id: 'queryName',
    name: 'Name',
    columnKey: 'name',
    enabled: true,
    expanded: true,
    component: {
        selector: 'text',
        settings: {
            pattern: `cm:name:'(.*?)'`,
            field: 'cm:name',
            placeholder: 'Enter the name'
        }
    }
};

describe('SearchFilterContainerComponent', () => {
    let fixture: ComponentFixture<SearchFilterContainerComponent>;
    let component: SearchFilterContainerComponent;
    let queryBuilder: SearchHeaderQueryBuilderService;

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
        fixture = TestBed.createComponent(SearchFilterContainerComponent);
        component = fixture.componentInstance;
        queryBuilder = fixture.componentInstance['searchFilterQueryBuilder'];
        component.col = {key: '123', type: 'text'};
        spyOn(queryBuilder, 'getCategoryForColumn').and.returnValue(mockCategory);
        fixture.detectChanges();
    });

    afterEach(() => {
        queryBuilder.removeActiveFilter(mockCategory.columnKey);
        fixture.destroy();
    });

    it('should show the filter when a category is found', async () => {
        await fixture.whenStable();
        fixture.detectChanges();
        expect(queryBuilder.isFilterServiceActive()).toBe(true);
        const element = fixture.nativeElement.querySelector('.adf-filter');
        expect(element).not.toBeNull();
        expect(element).not.toBeUndefined();
    });

    it('should set/update the active filter after the Apply button is clicked', async () => {
        const menuButton: HTMLButtonElement = fixture.nativeElement.querySelector('[data-automation-id="filter-menu-button"]');
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

        menuButton.click();
        fixture.detectChanges();
        await fixture.whenStable();
        component.widgetContainer.componentRef.instance.value = 'updated text';
        applyButton.triggerEventHandler('click', {});
        fixture.detectChanges();
        await fixture.whenStable();
        expect(queryBuilder.getActiveFilters().length).toBe(1);
        expect(queryBuilder.getActiveFilters()[0].key).toBe('name');
        expect(queryBuilder.getActiveFilters()[0].value).toBe('updated text');
    });

    it('should remove active filter after the Clear button is clicked', async () => {
        queryBuilder.setActiveFilter('name', 'searchText');
        const menuButton: HTMLButtonElement = fixture.nativeElement.querySelector('[data-automation-id="filter-menu-button"]');
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

    it('should emit filterChange after the Enter key is pressed', async () => {
        spyOn(queryBuilder, 'buildQuery').and.returnValue(null);

        let eventRaised = false;
        component.filterChange.subscribe(() => {
            eventRaised = true;
        });
        const menuButton: HTMLButtonElement = fixture.nativeElement.querySelector('[data-automation-id="filter-menu-button"]');
        menuButton.click();

        fixture.detectChanges();
        await fixture.whenStable();

        component.widgetContainer.componentRef.instance.value = 'searchText';
        const widgetContainer = fixture.debugElement.query(By.css('adf-search-widget-container'));
        widgetContainer.triggerEventHandler('keypress', {key: 'Enter'});

        fixture.detectChanges();
        await fixture.whenStable();

        expect(eventRaised).toBe(true);
    });

    it('should hide the red dot after the filter is cleared', async () => {
        const badge: HTMLElement = fixture.nativeElement.querySelector(`[data-automation-id="filter-menu-button"] .mat-badge-content`);
        expect(window.getComputedStyle(badge).display).toBe('none');

        const menuButton: HTMLButtonElement = fixture.nativeElement.querySelector('[data-automation-id="filter-menu-button"]');
        menuButton.click();
        fixture.detectChanges();
        await fixture.whenStable();
        component.widgetContainer.componentRef.instance.value = 'searchText';
        const widgetContainer = fixture.debugElement.query(By.css('adf-search-widget-container'));
        widgetContainer.triggerEventHandler('keypress', {key: 'Enter'});
        fixture.detectChanges();
        await fixture.whenStable();
        expect(window.getComputedStyle(badge).display).not.toBe('none');

        menuButton.click();
        fixture.detectChanges();
        await fixture.whenStable();
        const fakeEvent = jasmine.createSpyObj('event', ['stopPropagation']);
        const clearButton = fixture.debugElement.query(By.css('#clear-filter-button'));
        clearButton.triggerEventHandler('click', fakeEvent);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(window.getComputedStyle(badge).display).toBe('none');
    });

    describe('Accessibility', () => {

        it('should set up a focus trap on the filter when the menu is opened', async () => {
            expect(component.focusTrap).toBeUndefined();

            const menuButton: HTMLButtonElement = fixture.nativeElement.querySelector('[data-automation-id="filter-menu-button"]');
            menuButton.click();
            fixture.detectChanges();

            expect(component.focusTrap).toBeDefined();
            // eslint-disable-next-line no-underscore-dangle
            expect(component.focusTrap._element).toBe(component.filterContainer.nativeElement);
        });

        it('should focus the input element when the menu is opened', async () => {
            const menuButton: HTMLButtonElement = fixture.nativeElement.querySelector('[data-automation-id="filter-menu-button"]');
            menuButton.click();

            fixture.detectChanges();
            await fixture.whenStable();

            const inputElement = fixture.debugElement.query(By.css('.mat-input-element'));
            expect(document.activeElement).toBe(inputElement.nativeElement);

        });

        it('should focus the menu trigger when the menu is closed', async () => {
            const menuButton: HTMLButtonElement = fixture.nativeElement.querySelector('[data-automation-id="filter-menu-button"]');
            menuButton.click();

            fixture.detectChanges();
            await fixture.whenStable();

            const matMenuTrigger = fixture.debugElement.query(By.directive(MatMenuTrigger)).injector.get(MatMenuTrigger);
            matMenuTrigger.closeMenu();

            fixture.detectChanges();
            await fixture.whenStable();

            const matMenuButton = fixture.debugElement.query(By.css('[data-automation-id="filter-menu-button"]'));
            expect(document.activeElement).toBe(matMenuButton.nativeElement);
        });
    });
});
