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
import { MatChipRemove } from '@angular/material/chips';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { SearchChipAutocompleteInputComponent } from './search-chip-autocomplete-input.component';
import { DebugElement } from '@angular/core';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatChipHarness, MatChipGridHarness } from '@angular/material/chips/testing';
import { MatAutocompleteHarness } from '@angular/material/autocomplete/testing';
import { MatOptionHarness } from '@angular/material/core/testing';

describe('SearchChipAutocompleteInputComponent', () => {
    let component: SearchChipAutocompleteInputComponent;
    let fixture: ComponentFixture<SearchChipAutocompleteInputComponent>;
    let loader: HarnessLoader;
    const onResetSubject = new Subject<void>();

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule, SearchChipAutocompleteInputComponent]
        });

        fixture = TestBed.createComponent(SearchChipAutocompleteInputComponent);
        loader = TestbedHarnessEnvironment.loader(fixture);
        component = fixture.componentInstance;
        component.onReset$ = onResetSubject.asObservable();
        component.autocompleteOptions = [{ value: 'option1' }, { value: 'option2' }];
        fixture.detectChanges();
    });

    /**
     * Get the input element
     *
     * @returns native element
     */
    function getInput(): HTMLInputElement {
        return fixture.debugElement.query(By.css('input')).nativeElement;
    }

    /**
     * Enter the new input value
     *
     * @param value value to input
     */
    function enterNewInputValue(value: string) {
        const inputElement = getInput();
        inputElement.dispatchEvent(new Event('focusin'));
        inputElement.value = value;
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
    }

    /**
     * Add new option
     *
     * @param value value to input
     */
    function addNewOption(value: string) {
        const inputElement = getInput();
        inputElement.value = value;
        fixture.detectChanges();
        inputElement.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 13 }));
        fixture.detectChanges();
    }

    /**
     * Get material chip list
     *
     * @returns list of chips
     */
    async function getChipList(): Promise<MatChipHarness[]> {
        const harness = await loader.getHarness(MatChipGridHarness);
        return harness.getRows();
    }

    /**
     * Get chip value by specific index
     *
     * @param index index of the chip
     * @returns chip value
     */
    async function getChipValue(index: number): Promise<string> {
        const chipList = await getChipList();
        return chipList[index].getText();
    }

    /**
     * Get material option elements
     *
     * @returns list of debug elements
     */
    async function getOptionElements(): Promise<MatOptionHarness[]> {
        const autocomplete = await loader.getHarness(MatAutocompleteHarness);
        return autocomplete.getOptions();
    }

    /**
     * Get added options for auto-complete
     *
     * @returns list of debug elements
     */
    function getAddedOptionElements(): DebugElement[] {
        return fixture.debugElement.queryAll(By.css('.adf-autocomplete-added-option'));
    }

    it('should assign preselected values to selected options on init', () => {
        component.preselectedOptions = [{ value: 'option1' }];
        component.ngOnInit();
        expect(component.selectedOptions).toEqual([{ value: 'option1' }]);
    });

    it('should add new option only if value is predefined when allowOnlyPredefinedValues = true', async () => {
        addNewOption('test');
        addNewOption('option1');
        expect((await getChipList()).length).toBe(1);
        expect(await getChipValue(0)).toBe('option1');
    });

    it('should add new option even if value is not predefined when allowOnlyPredefinedValues = false', async () => {
        component.allowOnlyPredefinedValues = false;
        addNewOption('test');
        addNewOption('option1');
        expect((await getChipList()).length).toBe(2);
        expect(await getChipValue(0)).toBe('test');
    });

    it('should add new formatted option based on formatChipValue', async () => {
        component.allowOnlyPredefinedValues = false;
        const option = 'abc';
        component.formatChipValue = (value) => value.replace('.', '');

        addNewOption(`.${option}`);
        expect((await getChipList()).length).toBe(1);
        expect(await getChipValue(0)).toBe(option);
    });

    it('should add new option upon clicking on option from autocomplete', async () => {
        const optionsChangedSpy = spyOn(component.optionsChanged, 'emit');
        enterNewInputValue('op');
        await fixture.whenStable();
        fixture.detectChanges();

        const matOptions = await getOptionElements();
        expect(matOptions.length).toBe(2);

        const optionToClick = matOptions[0];
        await optionToClick.click();

        expect(optionsChangedSpy).toHaveBeenCalledOnceWith([{ value: 'option1' }]);
        expect(component.selectedOptions).toEqual([{ value: 'option1' }]);
        expect((await getChipList()).length).toBe(1);
    });

    it('should apply class to already selected options', async () => {
        addNewOption('option1');
        enterNewInputValue('op');

        await fixture.whenStable();
        fixture.detectChanges();

        const addedOptions = getAddedOptionElements();
        expect(addedOptions[0]).toBeTruthy();
        expect(addedOptions.length).toBe(1);
    });

    it('should apply class to already selected options based on custom compareOption function', async () => {
        component.allowOnlyPredefinedValues = false;
        component.autocompleteOptions = [{ value: '.test1' }, { value: 'test3' }, { value: '.test2.' }, { value: 'test1' }];
        component.compareOption = (option1, option2) => option1.value.split('.')[1] === option2.value;

        addNewOption('test1');
        enterNewInputValue('t');

        await fixture.whenStable();
        fixture.detectChanges();

        expect(getAddedOptionElements().length).toBe(1);
    });

    it('should limit autocomplete list to 15 values max', async () => {
        component.autocompleteOptions = Array.from({ length: 16 }, (_, i) => ({ value: `a${i}` }));
        enterNewInputValue('a');

        await fixture.whenStable();
        fixture.detectChanges();

        expect((await getOptionElements()).length).toBe(15);
    });

    it('should not add a value if same value has already been added', async () => {
        addNewOption('option1');
        addNewOption('option1');
        expect((await getChipList()).length).toBe(1);
    });

    it('should show autocomplete list if similar predefined values exists', async () => {
        enterNewInputValue('op');
        await fixture.whenStable();
        fixture.detectChanges();
        expect((await getOptionElements()).length).toBe(2);
    });

    it('should show autocomplete list based on custom filtering', async () => {
        component.autocompleteOptions = [{ value: '.test1' }, { value: 'test1' }, { value: 'test1.' }, { value: '.test2' }, { value: '.test12' }];
        component.filter = (options, value) => options.filter((option) => option.value.split('.')[1] === value);
        enterNewInputValue('test1');
        await fixture.whenStable();
        fixture.detectChanges();
        expect((await getOptionElements()).length).toBe(1);
    });

    it('should not show autocomplete list if there are no similar predefined values', async () => {
        enterNewInputValue('test');

        const autocomplete = await loader.getHarness(MatAutocompleteHarness);

        expect(await autocomplete.isOpen()).toBeFalse();
    });

    it('should emit new value when selected options changed', async () => {
        const optionsChangedSpy = spyOn(component.optionsChanged, 'emit');
        addNewOption('option1');
        expect(optionsChangedSpy).toHaveBeenCalledOnceWith([{ value: 'option1' }]);
        expect((await getChipList()).length).toBe(1);
        expect(await getChipValue(0)).toBe('option1');
    });

    it('should clear the input after a new value is added', () => {
        const input = getInput();
        addNewOption('option1');
        expect(input.value).toBe('');
    });

    it('should use correct default placeholder for input', () => {
        expect(getInput().placeholder).toBe('SEARCH.FILTER.ACTIONS.ADD_OPTION');
    });

    it('should use placeholder for input passed as component input', () => {
        component.placeholder = 'Some placeholder';
        fixture.detectChanges();
        expect(getInput().placeholder).toBe(component.placeholder);
    });

    it('should reset all options when onReset$ event is emitted', async () => {
        addNewOption('option1');
        addNewOption('option2');
        const optionsChangedSpy = spyOn(component.optionsChanged, 'emit');
        onResetSubject.next();
        fixture.detectChanges();

        expect(optionsChangedSpy).toHaveBeenCalledOnceWith([]);
        expect(await getChipList()).toEqual([]);
        expect(component.selectedOptions).toEqual([]);
    });

    it('should remove option upon clicking remove button', async () => {
        addNewOption('option1');
        addNewOption('option2');
        const optionsChangedSpy = spyOn(component.optionsChanged, 'emit');

        fixture.debugElement.query(By.directive(MatChipRemove)).nativeElement.click();
        fixture.detectChanges();

        expect(optionsChangedSpy).toHaveBeenCalledOnceWith([{ value: 'option2' }]);
        expect((await getChipList()).length).toEqual(1);
    });

    it('should show full category path when fullPath provided', async () => {
        component.filteredOptions = [{ id: 'test-id', value: 'test-value', fullPath: 'test-full-path' }];

        enterNewInputValue('test-value');

        const matOption = fixture.debugElement.query(By.css('.adf-search-chip-autocomplete-added-option')).nativeElement;
        expect(matOption.textContent).toEqual(' test-full-path ');
    });

    it('should emit input value when input changed', async () => {
        const inputChangedSpy = spyOn(component.inputChanged, 'emit');
        enterNewInputValue('test-value');
        await fixture.whenStable();
        expect(inputChangedSpy).toHaveBeenCalledOnceWith('test-value');
    });

    describe('isOptionSelected', () => {
        beforeEach(() => {
            component.autocompleteOptions = [{ value: 'option1' }, { value: 'option2' }];
            fixture.detectChanges();
        });

        it('should return true if option is already selected', () => {
            const option = { value: 'option1' };
            component.selectedOptions = [option];
            expect(component.isOptionSelected(option)).toBeTrue();
        });

        it('should return false if option is not selected', () => {
            component.selectedOptions = [{ value: 'option1' }];
            expect(component.isOptionSelected({ value: 'option2' })).toBeFalse();
        });

        it('should return true if custom compare function finds a match', () => {
            component.compareOption = (option1, option2) => option1.value.charAt(0) === option2.value.charAt(0);
            component.selectedOptions = [{ value: 'apple' }];
            expect(component.isOptionSelected({ value: 'apricot' })).toBeTrue();
        });

        it('should return false if custom compare function does not find a match', () => {
            component.compareOption = (option1, option2) => option1.value.charAt(0) === option2.value.charAt(0);
            component.selectedOptions = [{ value: 'banana' }];
            expect(component.isOptionSelected({ value: 'cherry' })).toBeFalse();
        });

        it('should return false if there are no selected options', () => {
            component.selectedOptions = [];
            expect(component.isOptionSelected({ value: 'option1' })).toBeFalse();
        });

        it('should handle undefined compareOption gracefully', () => {
            component.compareOption = undefined;
            const option = { value: 'option1' };
            component.selectedOptions = [option];
            expect(component.isOptionSelected(option)).toBeTrue();
        });
    });
});
