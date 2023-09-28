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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentTestingModule } from '../../../../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { SearchFilterList } from '../../../models/search-filter-list.model';
import { SearchFacetChipTabbedComponent } from './search-facet-chip-tabbed.component';
import { FacetField } from '../../../models/facet-field.interface';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SearchFacetChipTabbedComponent', () => {
    let component: SearchFacetChipTabbedComponent;
    let fixture: ComponentFixture<SearchFacetChipTabbedComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot(), ContentTestingModule],
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
    });

    /**
     * Open the facet
     */
    function openFacet() {
        const chip = fixture.debugElement.query(By.css('mat-chip'));
        chip.triggerEventHandler('click', {});
        fixture.detectChanges();
    }

    /**
     * Get the filter display value
     *
     * @returns filter value
     */
    function getDisplayValue(): string {
        return fixture.debugElement.query(By.css('.adf-search-filter-ellipsis.adf-filter-value')).nativeElement.innerText.trim();
    }

    /**
     * Emit the event for the tabbed content
     *
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

    it('should display remove icon and disable facet when no items are loaded', () => {
        const chip = fixture.debugElement.query(By.css('mat-chip'));
        const icon = fixture.debugElement.query(By.css('mat-chip mat-icon')).nativeElement.innerText;
        expect(chip.classes['mat-chip-disabled']).toBeTrue();
        expect(icon).toEqual('remove');
    });

    it('should not open context menu when no items are loaded', () => {
        spyOn(component.menuTrigger, 'openMenu');
        const chip = fixture.debugElement.query(By.css('mat-chip')).nativeElement;
        chip.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
        expect(component.menuTrigger.openMenu).not.toHaveBeenCalled();
    });

    it('should display correct title when facet is opened', () => {
        openFacet();
        const title = fixture.debugElement.query(By.css('.adf-search-filter-title')).nativeElement.innerText.split('\n')[0];
        expect(title).toBe(component.tabbedFacet.label);
    });

    it('should display adf-search-facet-tabbed-content component', () => {
        openFacet();
        const activeTabLabel = fixture.debugElement.query(By.css('adf-search-facet-tabbed-content'));
        expect(activeTabLabel).toBeTruthy();
    });

    it('should display arrow down icon and not disable the chip when items are loaded', () => {
        component.isPopulated = true;
        fixture.detectChanges();
        const chip = fixture.debugElement.query(By.css('mat-chip'));
        const icon = fixture.debugElement.query(By.css('mat-chip mat-icon')).nativeElement.innerText;
        expect(chip.classes['mat-chip-disabled']).toBeUndefined();
        expect(icon).toEqual('keyboard_arrow_down');
    });

    it('should display arrow up icon when menu is opened', async () => {
        openFacet();
        emitChildEvent('isPopulated', true);
        await fixture.whenStable();
        const icon = fixture.debugElement.query(By.css('mat-chip mat-icon')).nativeElement.innerText;
        expect(icon).toEqual('keyboard_arrow_up');
    });

    it('should update display value when new displayValue$ emitted', () => {
        const displayValue = 'field_LABEL: test, test2';
        openFacet();
        emitChildEvent('displayValue$', displayValue);
        fixture.detectChanges();
        expect(getDisplayValue()).toBe(displayValue);
    });

    it('should call onApply and close modal when apply btn is clicked', () => {
        spyOn(component.menuTrigger, 'closeMenu').and.callThrough();
        spyOn(component, 'onApply').and.callThrough();
        openFacet();
        const applyButton = fixture.debugElement.query(By.css('#apply-filter-button'));
        applyButton.triggerEventHandler('click', {});
        expect(component.menuTrigger.closeMenu).toHaveBeenCalled();
        expect(component.onApply).toHaveBeenCalled();
    });

    it('should call onRemove and close modal when cancel btn is clicked', () => {
        spyOn(component.menuTrigger, 'closeMenu').and.callThrough();
        spyOn(component, 'onRemove').and.callThrough();
        openFacet();
        const applyButton = fixture.debugElement.query(By.css('#cancel-filter-button'));
        applyButton.triggerEventHandler('click', {});
        expect(component.menuTrigger.closeMenu).toHaveBeenCalled();
        expect(component.onRemove).toHaveBeenCalled();
    });
});
