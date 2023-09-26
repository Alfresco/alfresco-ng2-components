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
import { MatChip, MatChipRemove } from '@angular/material/chips';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { SearchChipAutocompleteInputComponent } from './search-chip-autocomplete-input.component';
import { DebugElement } from '@angular/core';

describe('SearchChipAutocompleteInputComponent', () => {
    let component: SearchChipAutocompleteInputComponent;
    let fixture: ComponentFixture<SearchChipAutocompleteInputComponent>;
    const onResetSubject = new Subject<void>();

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SearchChipAutocompleteInputComponent],
            imports: [
                TranslateModule.forRoot(),
                ContentTestingModule
            ]
        });

        fixture = TestBed.createComponent(SearchChipAutocompleteInputComponent);
        component = fixture.componentInstance;
        component.onReset$ = onResetSubject.asObservable();
        component.autocompleteOptions = [{value: 'option1'}, {value: 'option2'}];
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
        inputElement.dispatchEvent(new KeyboardEvent('keydown', {keyCode: 13}));
        fixture.detectChanges();
    }

    /**
     * Get material chip list
     *
     * @returns list of chips
     */
    function getChipList(): MatChip[] {
        return fixture.debugElement.queryAll(By.css('mat-chip')).map((chip) => chip.nativeElement);
    }

    /**
     * Get chip value by specific index
     *
     * @param index index of the chip
     * @returns chip value
     */
    function getChipValue(index: number): string {
        return fixture.debugElement.queryAll(By.css('mat-chip span')).map((chip) => chip.nativeElement)[index].innerText;
    }

    /**
     * Get material option elements
     *
     * @returns list of debug elements
     */
    function getOptionElements(): DebugElement[] {
        return fixture.debugElement.queryAll(By.css('mat-option'));
    }

    /**
     * Get added options for auto-complete
     *
     * @returns list of debug elements
     */
    function getAddedOptionElements(): DebugElement[] {
        return fixture.debugElement.queryAll(By.css('.adf-autocomplete-added-option'));
    }

    it('should add new option only if value is predefined when allowOnlyPredefinedValues = true', () => {
        addNewOption('test');
        addNewOption('option1');
        expect(getChipList().length).toBe(1);
        expect(getChipValue(0)).toBe('option1');
    });

    it('should add new option even if value is not predefined when allowOnlyPredefinedValues = false', () => {
        component.allowOnlyPredefinedValues = false;
        addNewOption('test');
        addNewOption('option1');
        expect(getChipList().length).toBe(2);
        expect(getChipValue(0)).toBe('test');
    });

    it('should add new formatted option based on formatChipValue', () => {
        component.allowOnlyPredefinedValues = false;
        const option = 'abc';
        component.formatChipValue = (value) => value.replace('.', '');

        addNewOption(`.${option}`);
        expect(getChipList().length).toBe(1);
        expect(getChipValue(0)).toBe(option);
    });

    it('should add new option upon clicking on option from autocomplete', async () => {
        const optionsChangedSpy = spyOn(component.optionsChanged, 'emit');
        enterNewInputValue('op');
        await fixture.whenStable();
        fixture.detectChanges();

        const matOptions = getOptionElements();
        expect(matOptions.length).toBe(2);

        const optionToClick = matOptions[0].nativeElement as HTMLElement;
        optionToClick.click();

        expect(optionsChangedSpy).toHaveBeenCalledOnceWith([{value: 'option1'}]);
        expect(component.selectedOptions).toEqual([{value: 'option1'}]);
        expect(getChipList().length).toBe(1);
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
        component.autocompleteOptions = [{value: '.test1'}, {value: 'test3'}, {value: '.test2.'}, {value: 'test1'}];
        component.compareOption = (option1, option2) => option1.value.split('.')[1] === option2.value;

        addNewOption('test1');
        enterNewInputValue('t');

        await fixture.whenStable();
        fixture.detectChanges();

        expect(getAddedOptionElements().length).toBe(1);
    });

    it('should limit autocomplete list to 15 values max', async () => {
        component.autocompleteOptions = Array.from({length: 16}, (_, i) => ({value: `a${i}`}));
        enterNewInputValue('a');

        await fixture.whenStable();
        fixture.detectChanges();

        expect(getOptionElements().length).toBe(15);
    });

    it('should not add a value if same value has already been added', () => {
        addNewOption('option1');
        addNewOption('option1');
        expect(getChipList().length).toBe(1);
    });

    it('should show autocomplete list if similar predefined values exists', async () => {
        enterNewInputValue('op');
        await fixture.whenStable();
        fixture.detectChanges();
        expect(getOptionElements().length).toBe(2);
    });

    it('should show autocomplete list based on custom filtering', async () => {
        component.autocompleteOptions = [{value: '.test1'}, {value: 'test1'}, {value: 'test1.'}, {value: '.test2'}, {value: '.test12'}];
        component.filter = (options, value) => options.filter((option) => option.value.split('.')[1] === value);
        enterNewInputValue('test1');
        await fixture.whenStable();
        fixture.detectChanges();
        expect(getOptionElements().length).toBe(1);
    });

    it('should not show autocomplete list if there are no similar predefined values', async () => {
        enterNewInputValue('test');
        await fixture.whenStable();
        fixture.detectChanges();
        expect(getOptionElements().length).toBe(0);
    });

    it('should emit new value when selected options changed', () => {
        const optionsChangedSpy = spyOn(component.optionsChanged, 'emit');
        addNewOption('option1');
        expect(optionsChangedSpy).toHaveBeenCalledOnceWith([{value: 'option1'}]);
        expect(getChipList().length).toBe(1);
        expect(getChipValue(0)).toBe('option1');
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

    it('should reset all options when onReset$ event is emitted', () => {
        addNewOption('option1');
        addNewOption('option2');
        const optionsChangedSpy = spyOn(component.optionsChanged, 'emit');
        onResetSubject.next();
        fixture.detectChanges();

        expect(optionsChangedSpy).toHaveBeenCalledOnceWith([]);
        expect(getChipList()).toEqual([]);
        expect(component.selectedOptions).toEqual([]);
    });

    it('should remove option upon clicking remove button', () => {
        addNewOption('option1');
        addNewOption('option2');
        const optionsChangedSpy = spyOn(component.optionsChanged, 'emit');

        fixture.debugElement.query(By.directive(MatChipRemove)).nativeElement.click();
        fixture.detectChanges();

        expect(optionsChangedSpy).toHaveBeenCalledOnceWith([{value: 'option2'}]);
        expect(getChipList().length).toEqual(1);
    });

    it('should show full category path when fullPath provided', () => {
        component.filteredOptions = [{id: 'test-id', value: 'test-value', fullPath: 'test-full-path'}];
        enterNewInputValue('test-value');
        const matOption = fixture.debugElement.query(By.css('.mat-option span')).nativeElement;
        fixture.detectChanges();

        expect(matOption.innerHTML).toEqual(' test-full-path ');
    });

    it('should emit input value when input changed', async () => {
        const inputChangedSpy = spyOn(component.inputChanged, 'emit');
        enterNewInputValue('test-value');
        await fixture.whenStable();
        expect(inputChangedSpy).toHaveBeenCalledOnceWith('test-value');
    });
});
