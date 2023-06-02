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
import { SearchChipInputComponent } from './search-chip-input.component';

describe('SearchChipInputComponent', () => {
    let component: SearchChipInputComponent;
    let fixture: ComponentFixture<SearchChipInputComponent>;
    const onResetSubject = new Subject<void>();

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SearchChipInputComponent],
            imports: [
                TranslateModule.forRoot(),
                ContentTestingModule
            ]
        });

        fixture = TestBed.createComponent(SearchChipInputComponent);
        component = fixture.componentInstance;
        component.onReset = onResetSubject.asObservable();
        fixture.detectChanges();
    });

    afterEach(() => removeAllChips());

    function getChipInput(): HTMLInputElement {
        return fixture.debugElement.query(By.css('input')).nativeElement;
    }

    function getChipList(): MatChip[] {
        return fixture.debugElement.queryAll(By.css('mat-chip')).map((chip) => chip.nativeElement);
    }

    function getChipValue(index: number): string {
        return fixture.debugElement.queryAll(By.css('mat-chip span')).map((chip) => chip.nativeElement)[index].innerText;
    }

    function enterNewChip(value: string) {
        const input = getChipInput();
        input.value = value;
        fixture.detectChanges();
        input.dispatchEvent(new KeyboardEvent('keydown', {keyCode: 13}));
        fixture.detectChanges();
    }

    function removeAllChips() {
        const chips = getChipList();
        if (!!chips && chips.length > 0) {
            chips.forEach((chip) => chip.remove());
        }
    }

    function removeChip(index: number) {
        const removeBtns = fixture.debugElement.queryAll(By.directive(MatChipRemove)).map((removeBtn) => removeBtn.nativeElement);
        removeBtns[index].click();
        fixture.detectChanges();
    }

    it('should display label provided as component input', () => {
        const label = 'Test';
        component.label = label;
        fixture.detectChanges();
        const matLabel = fixture.debugElement.query(By.css('mat-label')).nativeElement.innerText;
        expect(matLabel).toBe(label);
    });

    it('should display proper placeholder for chip input', () => {
        const input = getChipInput();
        expect(input.placeholder).toBe('SEARCH.LOGICAL_SEARCH.SEARCH_CHIP_INPUT.ADD_PHRASE');
    });

    it('should not display any chips initially', () => {
        const chips = getChipList();
        expect(chips).toEqual([]);
    });

    it('should add new chip when input has value and enter was hit', () => {
        const phrasesChangedSpy = spyOn(component.phrasesChanged, 'emit');
        enterNewChip('test');
        expect(phrasesChangedSpy).toHaveBeenCalledOnceWith(['test']);
        expect(getChipList().length).toBe(1);
        expect(getChipValue(0)).toBe('test');
    });

    it('should add input value as whole phrase even if it contains whitespaces and special signs', () => {
        const phrase = 'test another world &*,.;""!@#$$%^*()[]-+=';
        enterNewChip(phrase);
        expect(getChipList().length).toBe(1);
        expect(getChipValue(0)).toBe(phrase);
    });

    it('should add new chip when input is blurred', () => {
        const input = getChipInput();
        input.value = 'test';
        fixture.detectChanges();
        input.dispatchEvent(new InputEvent('blur'));
        fixture.detectChanges();
        expect(input.value).toBe('');
        expect(getChipList().length).toBe(1);
        expect(getChipValue(0)).toBe('test');
    });

    it('should not add new chip when input is blurred if addOnBlur is false', () => {
        component.addOnBlur = false;
        const input = getChipInput();
        input.value = 'test';
        fixture.detectChanges();
        input.dispatchEvent(new InputEvent('blur'));
        fixture.detectChanges();
        expect(input.value).toBe('test');
        expect(getChipList().length).toBe(0);
    });

    it('should clear the input after new chip is added', () => {
        const input = getChipInput();
        enterNewChip('test2');
        expect(input.value).toBe('');
    });

    it('should reset all chips when onReset event is emitted', () => {
        enterNewChip('test1');
        enterNewChip('test2');
        enterNewChip('test3');
        const phrasesChangedSpy = spyOn(component.phrasesChanged, 'emit');
        onResetSubject.next();
        fixture.detectChanges();
        expect(phrasesChangedSpy).toHaveBeenCalledOnceWith([]);
        expect(getChipList()).toEqual([]);
    });

    it('should remove chip upon clicking remove button', () => {
        enterNewChip('test1');
        enterNewChip('test2');
        const phrasesChangedSpy = spyOn(component.phrasesChanged, 'emit');
        removeChip(0);
        expect(phrasesChangedSpy).toHaveBeenCalledOnceWith(['test2']);
        expect(getChipList().length).toEqual(1);
    });
});
