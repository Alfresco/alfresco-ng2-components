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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentTestingModule } from '../../../../testing/content.testing.module';
import { By } from '@angular/platform-browser';
import { SearchFilterList } from '../../../models/search-filter-list.model';
import { SearchFacetChipTabbedComponent } from './search-facet-chip-tabbed.component';
import { FacetField } from '../../../models/facet-field.interface';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HarnessLoader, TestKey } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatChipHarness } from '@angular/material/chips/testing';
import { MatIconHarness } from '@angular/material/icon/testing';

describe('SearchFacetChipTabbedComponent', () => {
    let loader: HarnessLoader;
    let component: SearchFacetChipTabbedComponent;
    let fixture: ComponentFixture<SearchFacetChipTabbedComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule],
            schemas: [NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent(SearchFacetChipTabbedComponent);
        component = fixture.componentInstance;

        const facet1: FacetField = { type: 'field', label: 'field', field: 'field', buckets: new SearchFilterList() };
        const facet2: FacetField = { type: 'field', label: 'field2', field: 'field2', buckets: new SearchFilterList() };

        component.tabbedFacet = {
            fields: ['field', 'field2'],
            label: 'LABEL',
            facets: {
                field: facet1,
                field2: facet2
            }
        };
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    /**
     * Get the filter display value
     * @returns filter value
     */
    function getDisplayValue(): string {
        return fixture.debugElement.query(By.css('.adf-search-filter-ellipsis.adf-filter-value')).nativeElement.innerText.trim();
    }

    /**
     * Emit the event for the tabbed content
     * @param eventName event name to trigger
     * @param event event to trigger
     */
    function emitChildEvent(eventName: string, event: any) {
        const debugElem = fixture.debugElement.query(By.css('adf-search-facet-tabbed-content'));
        debugElem.triggerEventHandler(eventName, event);
        fixture.detectChanges();
    }

    it('should display correct label for tabbed facet', () => {
        const label = fixture.debugElement.query(By.css('.adf-search-filter-placeholder')).nativeElement.innerText;
        expect(label).toBe(component.tabbedFacet.label + ':');
    });

    it('should display any as display value when nothing is selected', () => {
        const displayValue = getDisplayValue();
        expect(displayValue).toBe('SEARCH.FILTER.ANY');
    });

    it('should display remove icon and disable facet when no items are loaded', async () => {
        const chip = await loader.getHarness(MatChipHarness);
        const icon = await chip.getHarness(MatIconHarness);

        expect(await chip.isDisabled()).toBe(true);
        expect(await icon.getName()).toEqual('remove');
    });

    it('should not open context menu when no items are loaded', async () => {
        spyOn(component.menuTrigger, 'openMenu');

        const chip = await loader.getHarness(MatChipHarness);
        const host = await chip.host();
        await host.sendKeys(TestKey.ENTER);

        expect(component.menuTrigger.openMenu).not.toHaveBeenCalled();
    });

    it('should display correct title when facet is opened', async () => {
        const chip = await loader.getHarness(MatChipHarness);
        await (await chip.host()).click();

        const title = fixture.debugElement.query(By.css('.adf-search-filter-title')).nativeElement.innerText.split('\n')[0];
        expect(title).toBe(component.tabbedFacet.label);
    });

    it('should display adf-search-facet-tabbed-content component', async () => {
        const chip = await loader.getHarness(MatChipHarness);
        await (await chip.host()).click();

        const activeTabLabel = fixture.debugElement.query(By.css('adf-search-facet-tabbed-content'));
        expect(activeTabLabel).toBeTruthy();
    });

    it('should display arrow down icon and not disable the chip when items are loaded', async () => {
        component.isPopulated = true;
        fixture.detectChanges();
        const chip = await loader.getHarness(MatChipHarness);
        const icon = await chip.getHarness(MatIconHarness);

        expect(await chip.isDisabled()).toBe(false);
        expect(await icon.getName()).toBe('keyboard_arrow_down');
    });

    it('should display arrow up icon when menu is opened', async () => {
        const chip = await loader.getHarness(MatChipHarness);
        await (await chip.host()).click();

        emitChildEvent('isPopulated', true);
        await fixture.whenStable();

        const icon = await chip.getHarness(MatIconHarness);

        expect(await icon.getName()).toBe('keyboard_arrow_up');
    });

    it('should update isPopulated and call detectChanges on ChangeDetectorRef', () => {
        spyOn(component['changeDetectorRef'], 'detectChanges').and.callThrough();

        component.onIsPopulatedEventChange(true);
        expect(component.isPopulated).toBe(true);
        expect(component['changeDetectorRef'].detectChanges).toHaveBeenCalled();

        component.onIsPopulatedEventChange(false);
        expect(component.isPopulated).toBe(false);
        expect(component['changeDetectorRef'].detectChanges).toHaveBeenCalledTimes(2);
    });

    it('should update display value when new displayValue$ emitted', async () => {
        const displayValue = 'field_LABEL: test, test2';
        const chip = await loader.getHarness(MatChipHarness);
        await (await chip.host()).click();

        emitChildEvent('displayValue$', displayValue);
        fixture.detectChanges();
        expect(getDisplayValue()).toBe(displayValue);
    });

    it('should call onApply and close modal when apply btn is clicked', async () => {
        spyOn(component.menuTrigger, 'closeMenu').and.callThrough();
        spyOn(component, 'onApply').and.callThrough();

        const chip = await loader.getHarness(MatChipHarness);
        await (await chip.host()).click();

        const applyButton = fixture.debugElement.query(By.css('#apply-filter-button'));
        applyButton.triggerEventHandler('click', {});
        expect(component.menuTrigger.closeMenu).toHaveBeenCalled();
        expect(component.onApply).toHaveBeenCalled();
    });

    it('should call onRemove and close modal when cancel btn is clicked', async () => {
        spyOn(component.menuTrigger, 'closeMenu').and.callThrough();
        spyOn(component, 'onRemove').and.callThrough();

        const chip = await loader.getHarness(MatChipHarness);
        await (await chip.host()).click();

        const applyButton = fixture.debugElement.query(By.css('#cancel-filter-button'));
        applyButton.triggerEventHandler('click', {});
        expect(component.menuTrigger.closeMenu).toHaveBeenCalled();
        expect(component.onRemove).toHaveBeenCalled();
    });
});
