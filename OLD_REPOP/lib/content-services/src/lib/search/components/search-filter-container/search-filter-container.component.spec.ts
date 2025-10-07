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
import { SearchService } from '../../services/search.service';
import { SearchHeaderQueryBuilderService } from '../../services/search-header-query-builder.service';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { By } from '@angular/platform-browser';
import { SearchFilterContainerComponent } from './search-filter-container.component';
import { SearchCategory } from '../../models/search-category.interface';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatBadgeHarness } from '@angular/material/badge/testing';
import { MatInputHarness } from '@angular/material/input/testing';

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
    let loader: HarnessLoader;
    let fixture: ComponentFixture<SearchFilterContainerComponent>;
    let component: SearchFilterContainerComponent;
    let queryBuilder: SearchHeaderQueryBuilderService;

    const searchMock: any = {
        dataLoaded: new Subject()
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule],
            providers: [{ provide: SearchService, useValue: searchMock }]
        });
        fixture = TestBed.createComponent(SearchFilterContainerComponent);
        component = fixture.componentInstance;
        queryBuilder = fixture.componentInstance['searchFilterQueryBuilder'];
        component.col = { key: '123', type: 'text' };
        spyOn(queryBuilder, 'getCategoryForColumn').and.returnValue(mockCategory);
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
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
        const menu = await loader.getHarness(MatMenuHarness);
        await menu.open();

        component.widgetContainer.componentRef.instance.value = 'searchText';

        const applyButton = await menu.getHarness(MatButtonHarness.with({ selector: '#apply-filter-button' }));
        await applyButton.click();

        expect(queryBuilder.getActiveFilters().length).toBe(1);
        expect(queryBuilder.getActiveFilters()[0].key).toBe('name');
        expect(queryBuilder.getActiveFilters()[0].value).toBe('searchText');

        await menu.open();

        component.widgetContainer.componentRef.instance.value = 'updated text';

        await applyButton.click();
        expect(queryBuilder.getActiveFilters().length).toBe(1);
        expect(queryBuilder.getActiveFilters()[0].key).toBe('name');
        expect(queryBuilder.getActiveFilters()[0].value).toBe('updated text');
    });

    it('should remove active filter after the Clear button is clicked', async () => {
        queryBuilder.setActiveFilter('name', 'searchText');

        const menu = await loader.getHarness(MatMenuHarness);
        await menu.open();

        component.widgetContainer.componentRef.instance.value = 'searchText';

        const clearButton = await menu.getHarness(MatButtonHarness.with({ selector: '#clear-filter-button' }));
        await clearButton.click();

        expect(queryBuilder.getActiveFilters().length).toBe(0);
    });

    it('should emit filterChange after the Enter key is pressed', async () => {
        spyOn(queryBuilder, 'buildQuery').and.returnValue(null);

        let eventRaised = false;
        component.filterChange.subscribe(() => {
            eventRaised = true;
        });

        const menu = await loader.getHarness(MatMenuHarness);
        await menu.open();

        component.widgetContainer.componentRef.instance.value = 'searchText';
        const widgetContainer = fixture.debugElement.query(By.css('adf-search-widget-container'));
        widgetContainer.triggerEventHandler('keypress', { key: 'Enter' });

        fixture.detectChanges();
        await fixture.whenStable();

        expect(eventRaised).toBe(true);
    });

    it('should hide the red dot after the filter is cleared', async () => {
        const badge = await loader.getHarness(MatBadgeHarness);
        expect(await badge.isHidden()).toBe(true);

        const menu = await loader.getHarness(MatMenuHarness);
        await menu.open();

        component.widgetContainer.componentRef.instance.value = 'searchText';
        const widgetContainer = fixture.debugElement.query(By.css('adf-search-widget-container'));
        widgetContainer.triggerEventHandler('keypress', { key: 'Enter' });
        fixture.detectChanges();
        await fixture.whenStable();
        expect(await badge.isHidden()).toBe(false);

        await menu.open();

        const clearButton = await menu.getHarness(MatButtonHarness.with({ selector: '#clear-filter-button' }));
        await clearButton.click();

        expect(await badge.isHidden()).toBe(true);
    });

    describe('Accessibility', () => {
        it('should set up a focus trap on the filter when the menu is opened', async () => {
            expect(component.focusTrap).toBeUndefined();

            const menu = await loader.getHarness(MatMenuHarness);
            await menu.open();

            expect(component.focusTrap).toBeDefined();
            // eslint-disable-next-line no-underscore-dangle
            expect(component.focusTrap._element).toBe(component.filterContainer.nativeElement);
        });

        // TODO: very flaky test, need to be refactored
        // eslint-disable-next-line ban/ban
        xit('should focus the input element when the menu is opened', async () => {
            const menu = await loader.getHarness(MatMenuHarness);
            await menu.open();

            const input = await menu.getHarness(MatInputHarness);
            expect(await input.isFocused()).toBe(true);
        });

        it('should focus the menu trigger when the menu is closed', async () => {
            const menu = await loader.getHarness(MatMenuHarness);
            await menu.open();

            await menu.close();
            expect(await menu.isFocused()).toBe(true);
        });
    });
});
