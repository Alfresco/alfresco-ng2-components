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
import { SearchQueryBuilderService } from '../../../services/search-query-builder.service';
import { SearchFilterList } from '../../../models/search-filter-list.model';
import { SearchFacetChipTabbedComponent } from './search-facet-chip-tabbed.component';
import { FacetField } from '../../../models/facet-field.interface';
import { SearchFacetFiltersService } from '../../../services/search-facet-filters.service';
import { SimpleChange } from '@angular/core';

describe('SearchFacetChipTabbedComponent', () => {
    let component: SearchFacetChipTabbedComponent;
    let fixture: ComponentFixture<SearchFacetChipTabbedComponent>;
    let queryBuilder: SearchQueryBuilderService;
    let searchFacetService: SearchFacetFiltersService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot(), ContentTestingModule]
        });
        fixture = TestBed.createComponent(SearchFacetChipTabbedComponent);
        component = fixture.componentInstance;
        queryBuilder = TestBed.inject(SearchQueryBuilderService);
        searchFacetService = TestBed.inject(SearchFacetFiltersService);
        spyOn(queryBuilder, 'update').and.stub();

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

    function openFacet() {
        const chip = fixture.debugElement.query(By.css('mat-chip'));
        chip.triggerEventHandler('click', {});
        fixture.detectChanges();
    }

    function getDisplayValue(): string {
        return fixture.debugElement.query(By.css('.adf-search-filter-ellipsis.adf-filter-value')).nativeElement.innerText.trim();
    }

    function getTabs(): HTMLDivElement[] {
        return fixture.debugElement.queryAll(By.css('.mat-tab-label-content')).map((element) => element.nativeElement);
    }

    function changeTab(tabIndex: number) {
        getTabs()[tabIndex].click();
        fixture.detectChanges();
    }

    function triggerComponentChanges() {
        component.ngOnChanges({
            tabbedFacet: new SimpleChange(null, component.tabbedFacet, false)
        });
        fixture.detectChanges();
    }

    function addBucketItem(field: string, displayValue: string) {
        component.tabbedFacet.facets[field].buckets.items.push({
            count: 1,
            label: displayValue,
            display: displayValue,
            filterQuery: ''
        });
        triggerComponentChanges();
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

    it('should display 2 tabs with specific labels', () => {
        openFacet();
        const tabLabels = getTabs();
        expect(tabLabels.length).toBe(2);
        expect(tabLabels[0].innerText).toBe(component.tabbedFacet.facets['field'].label);
        expect(tabLabels[1].innerText).toBe(component.tabbedFacet.facets['field2'].label);
    });

    it('should display creator tab as active initially and allow navigation', () => {
        openFacet();
        let activeTabLabel = fixture.debugElement.query(By.css('.mat-tab-label-active .mat-tab-label-content')).nativeElement.innerText;
        expect(activeTabLabel).toBe(component.tabbedFacet.facets['field'].label);

        changeTab(1);
        activeTabLabel = fixture.debugElement.query(By.css('.mat-tab-label-active .mat-tab-label-content')).nativeElement.innerText;
        expect(activeTabLabel).toBe(component.tabbedFacet.facets['field2'].label);
    });

    it('should display arrow down icon and not disable the chip when items are loaded', () => {
        addBucketItem('field', 'test');
        const chip = fixture.debugElement.query(By.css('mat-chip'));
        const icon = fixture.debugElement.query(By.css('mat-chip mat-icon')).nativeElement.innerText;
        expect(chip.classes['mat-chip-disabled']).toBeUndefined();
        expect(icon).toEqual('keyboard_arrow_down');
    });

    it('should display arrow up icon when menu is opened', () => {
        addBucketItem('field', 'test');
        openFacet();
        const icon = fixture.debugElement.query(By.css('mat-chip mat-icon')).nativeElement.innerText;
        expect(icon).toEqual('keyboard_arrow_up');
    });

    it('should create empty selected options for each tab initially', () => {
        expect(component.selectedOptions['field']).toEqual([]);
        expect(component.selectedOptions['field2']).toEqual([]);
    });

    it('should update autocomplete options when buckets change', () => {
        addBucketItem('field', 'test');
        addBucketItem('field2', 'test2');
        expect(component.autocompleteOptions['field'].length).toBe(1);
        expect(component.autocompleteOptions['field'][0]).toEqual({value: 'test'});
        expect(component.autocompleteOptions['field2'].length).toBe(1);
        expect(component.autocompleteOptions['field2'][0]).toEqual({value: 'test2'});
    });

    it('should add buckets when items are selected', () => {
        spyOn(queryBuilder, 'addUserFacetBucket');
        addBucketItem('field', 'test');
        addBucketItem('field2', 'test2');
        component.onOptionsChange([{ value: 'test' }], 'field');
        expect(queryBuilder.addUserFacetBucket).toHaveBeenCalledWith('field',component.tabbedFacet.facets['field'].buckets.items[0]);
    });

    it('should remove buckets when items are unselected', () => {
        spyOn(queryBuilder, 'removeUserFacetBucket');
        addBucketItem('field', 'test');
        addBucketItem('field2', 'test2');
        component.onOptionsChange([], 'field');
        expect(queryBuilder.removeUserFacetBucket).toHaveBeenCalledWith('field',component.tabbedFacet.facets['field'].buckets.items[0]);
    });

    it('should update display value when next elements are selected', () => {
        const selectedOption1 = 'test';
        const selectedOption2 = 'test2';
        addBucketItem('field', selectedOption1);
        addBucketItem('field', selectedOption2);
        component.onOptionsChange([{ value: selectedOption1 }, { value: selectedOption2 }],'field');
        fixture.detectChanges();
        expect(getDisplayValue()).toBe(`${component.tabbedFacet.facets['field'].label}_LABEL: ${selectedOption1}, ${selectedOption2}`);
    });

    it('should update display value when elements from both tabs are selected', () => {
        const selectedOption1 = 'test';
        const selectedOption2 = 'test2';
        addBucketItem('field', selectedOption1);
        addBucketItem('field2', selectedOption2);
        component.onOptionsChange([{ value: selectedOption1 }], 'field');
        component.onOptionsChange([{ value: selectedOption2 }], 'field2');
        fixture.detectChanges();
        expect(getDisplayValue()).toBe(`${component.tabbedFacet.facets['field'].label}_LABEL: ${selectedOption1} ${component.tabbedFacet.facets['field2'].label}_LABEL: ${selectedOption2}`);
    });

    it('should update search query and display value when apply btn is clicked', () => {
        spyOn(component.menuTrigger, 'closeMenu').and.callThrough();
        spyOn(component, 'updateDisplayValue').and.callThrough();
        spyOn(searchFacetService, 'updateSelectedBuckets').and.callThrough();
        openFacet();
        const applyButton = fixture.debugElement.query(By.css('#apply-filter-button'));
        applyButton.triggerEventHandler('click', {});
        expect(queryBuilder.update).toHaveBeenCalled();
        expect(component.menuTrigger.closeMenu).toHaveBeenCalled();
        expect(component.updateDisplayValue).toHaveBeenCalled();
        expect(searchFacetService.updateSelectedBuckets).toHaveBeenCalled();
    });

    it('should update search query and display value when cancel btn is clicked', () => {
        spyOn(component.menuTrigger, 'closeMenu').and.callThrough();
        spyOn(component, 'updateDisplayValue').and.callThrough();
        openFacet();
        const applyButton = fixture.debugElement.query(By.css('#cancel-filter-button'));
        applyButton.triggerEventHandler('click', {});
        expect(queryBuilder.update).toHaveBeenCalled();
        expect(component.menuTrigger.closeMenu).toHaveBeenCalled();
        expect(component.updateDisplayValue).toHaveBeenCalled();
    });
});
