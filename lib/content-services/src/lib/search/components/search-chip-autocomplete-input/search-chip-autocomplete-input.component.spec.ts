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
        fixture.detectChanges();
        component.autocompleteOptions = ['option1', 'option2'];
    });

    function enterNewInputValue(value: string) {
        const inputElement = fixture.debugElement.query(By.css('input'));
        inputElement.nativeElement.dispatchEvent(new Event('focusin'));
        inputElement.nativeElement.value = value;
        inputElement.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
    }

    function addNewOption(value: string) {
        const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        inputElement.value = value;
        fixture.detectChanges();
        inputElement.dispatchEvent(new KeyboardEvent('keydown', {keyCode: 13}));
        fixture.detectChanges();
    }

    function getChipList(): MatChip[] {
        return fixture.debugElement.queryAll(By.css('mat-chip')).map((chip) => chip.nativeElement);
    }

    function getChipValue(index: number): string {
        return fixture.debugElement.queryAll(By.css('mat-chip span')).map((chip) => chip.nativeElement)[index].innerText;
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

    it('should add new option upon clicking on option from autocomplete', async () => {
        const optionsChangedSpy = spyOn(component.optionsChanged, 'emit');
        enterNewInputValue('op');
        await fixture.whenStable();

        const matOptions = document.querySelectorAll('mat-option');
        expect(matOptions.length).toBe(2);

        const optionToClick = matOptions[0] as HTMLElement;
        optionToClick.click();

        expect(optionsChangedSpy).toHaveBeenCalledOnceWith(['option1']);
        expect(component.selectedOptions).toEqual(['option1']);
        expect(getChipList().length).toBe(1);
    });

    it('should apply class to already selected options', async () => {
        addNewOption('option1');
        enterNewInputValue('op');

        const addedOptions = fixture.debugElement.queryAll(By.css('.adf-autocomplete-added-option'));

        await fixture.whenStable();

        expect(addedOptions[0]).toBeTruthy();
        expect(addedOptions.length).toBe(1);
    });

    it('should limit autocomplete list to 15 values max', () => {
        component.autocompleteOptions = ['a1','a2','a3','a4','a5','a6','a7','a8','a9','a10','a11','a12','a13','a14','a15','a16'];
        enterNewInputValue('a');

        const matOptions = document.querySelectorAll('mat-option');
        expect(matOptions.length).toBe(15);
    });

    it('should not add a value if same value has already been added', () => {
        addNewOption('option1');
        addNewOption('option1');
        expect(getChipList().length).toBe(1);
    });

    it('should show autocomplete list if similar predefined values exists', () => {
        enterNewInputValue('op');
        const matOptions = document.querySelectorAll('mat-option');
        expect(matOptions.length).toBe(2);
    });

    it('should not show autocomplete list if there are no similar predefined values', () => {
        enterNewInputValue('test');
        const matOptions = document.querySelectorAll('mat-option');
        expect(matOptions.length).toBe(0);
    });

    it('should emit new value when selected options changed', () => {
        const optionsChangedSpy = spyOn(component.optionsChanged, 'emit');
        addNewOption('option1');
        expect(optionsChangedSpy).toHaveBeenCalledOnceWith(['option1']);
        expect(getChipList().length).toBe(1);
        expect(getChipValue(0)).toBe('option1');
    });

    it('should clear the input after a new value is added', () => {
        const input = fixture.debugElement.query(By.css('input')).nativeElement;
        addNewOption('option1');
        expect(input.value).toBe('');
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

        expect(optionsChangedSpy).toHaveBeenCalledOnceWith(['option2']);
        expect(getChipList().length).toEqual(1);
    });
});
