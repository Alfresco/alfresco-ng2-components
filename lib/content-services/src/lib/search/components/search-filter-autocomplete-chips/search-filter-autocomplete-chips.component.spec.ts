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
import { By } from '@angular/platform-browser';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { SearchFilterAutocompleteChipsComponent } from './search-filter-autocomplete-chips.component';
import { TagService } from '@alfresco/adf-content-services';
import { EMPTY, of } from 'rxjs';
import { AutocompleteField } from '../../models/autocomplete-option.interface';

describe('SearchFilterAutocompleteChipsComponent', () => {
    let component: SearchFilterAutocompleteChipsComponent;
    let fixture: ComponentFixture<SearchFilterAutocompleteChipsComponent>;
    let tagService: TagService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SearchFilterAutocompleteChipsComponent],
            imports: [
                TranslateModule.forRoot(),
                ContentTestingModule
            ],
            providers: [{
                provide: TagService,
                useValue: { getAllTheTags: () => EMPTY }
            }]
        });

        fixture = TestBed.createComponent(SearchFilterAutocompleteChipsComponent);
        component = fixture.componentInstance;
        tagService = TestBed.inject(TagService);
        component.id = 'test-id';
        component.context = {
            queryFragments: {},
            update: () => EMPTY
        } as any;
        component.settings = {
            field: 'test', allowUpdateOnChange: true, hideDefaultAction: false, allowOnlyPredefinedValues: false,
            autocompleteOptions: [{value: 'option1'}, {value: 'option2'}]
        };
        fixture.detectChanges();
    });

    /**
     * Add new auto-complete input
     *
     * @param value value to add
     */
    function addNewOption(value: string) {
        const inputElement = fixture.debugElement.query(By.css('adf-search-chip-autocomplete-input input')).nativeElement;
        inputElement.value = value;
        inputElement.dispatchEvent(new KeyboardEvent('keydown', {keyCode: 13}));
        fixture.detectChanges();
    }

    it('should set autocomplete options on init', (done) => {
        component.settings.autocompleteOptions = [{value: 'test 1'}, {value: 'test 2'}];
        component.ngOnInit();
        component.autocompleteOptions$.subscribe(result => {
            expect(result).toEqual([{value: 'test 1'}, {value: 'test 2'}]);
            done();
        });
    });

    it('should load tags if field = TAG', (done) => {
        const tagPagingMock = {
            list: {
                pagination: {},
                entries: [{entry: {tag: 'tag1', id: 'id1'}}, {entry: {tag: 'tag2', id: 'id2'}}]
            }
        };

        component.settings.field = AutocompleteField.TAG;
        spyOn(tagService, 'getAllTheTags').and.returnValue(of(tagPagingMock));
        component.ngOnInit();
        component.autocompleteOptions$.subscribe(result => {
            expect(result).toEqual([{value: 'tag1'},{value: 'tag2'}]);
            done();
        });
    });

    it('should update display value when options changes', () => {
        const newOption = 'option1';
        spyOn(component, 'onOptionsChange').and.callThrough();
        spyOn(component.displayValue$, 'next');
        addNewOption(newOption);

        expect(component.onOptionsChange).toHaveBeenCalled();
        expect(component.displayValue$.next).toHaveBeenCalledOnceWith(newOption);
    });

    it('should reset value and display value when reset button is clicked', () => {
        component.setValue([{value: 'option1'}, {value: 'option2'}]);
        fixture.detectChanges();
        expect(component.selectedOptions).toEqual([{value: 'option1'}, {value: 'option2'}]);
        spyOn(component.context, 'update');
        spyOn(component.displayValue$, 'next');
        const clearBtn: HTMLButtonElement = fixture.debugElement.query(By.css('[data-automation-id="adf-search-chip-autocomplete-btn-clear"]')).nativeElement;
        clearBtn.click();

        expect(component.context.queryFragments[component.id]).toBe('');
        expect(component.context.update).toHaveBeenCalled();
        expect(component.selectedOptions).toEqual( [] );
        expect(component.displayValue$.next).toHaveBeenCalledWith('');
    });

    it('should correctly compose the search query', () => {
        spyOn(component.context, 'update');
        component.selectedOptions = [{value: 'option2'}, {value: 'option1'}];
        const applyBtn: HTMLButtonElement = fixture.debugElement.query(By.css('[data-automation-id="adf-search-chip-autocomplete-btn-apply"]')).nativeElement;
        applyBtn.click();
        fixture.detectChanges();

        expect(component.context.update).toHaveBeenCalled();
        expect(component.context.queryFragments[component.id]).toBe('test:"option2" OR test:"option1"');

        component.settings.field = AutocompleteField.CATEGORIES;
        component.selectedOptions = [{id: 'test-id', value: 'test'}];
        applyBtn.click();
        fixture.detectChanges();
        expect(component.context.queryFragments[component.id]).toBe('cm:categories:"workspace://SpacesStore/test-id"');
    });
});
