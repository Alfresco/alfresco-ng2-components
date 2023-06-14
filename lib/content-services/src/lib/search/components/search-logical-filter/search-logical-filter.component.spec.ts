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
import { TranslateModule } from '@ngx-translate/core';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { SearchChipInputComponent } from '../search-chip-input/search-chip-input.component';
import { LogicalSearchCondition, LogicalSearchFields, SearchLogicalFilterComponent } from './search-logical-filter.component';

describe('SearchLogicalFilterComponent', () => {
    let component: SearchLogicalFilterComponent;
    let fixture: ComponentFixture<SearchLogicalFilterComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SearchLogicalFilterComponent, SearchChipInputComponent],
            imports: [
                TranslateModule.forRoot(),
                ContentTestingModule
            ]
        });

        fixture = TestBed.createComponent(SearchLogicalFilterComponent);
        component = fixture.componentInstance;
        component.id = 'logic';
        component.context = {
            queryFragments: {
                logic: ''
            },
            update: () => {}
        } as any;
        component.settings = { field: 'field1,field2', allowUpdateOnChange: true, hideDefaultAction: false };
        fixture.detectChanges();
    });

    function getChipInputs(): HTMLInputElement[] {
        return fixture.debugElement.queryAll(By.css('adf-search-chip-input input')).map((input) => input.nativeElement);
    }

    function getChipInputsLabels(): string[] {
        return fixture.debugElement.queryAll(By.css('adf-search-chip-input mat-label')).map((label) => label.nativeElement.innerText);
    }

    function enterNewPhrase(value: string, index: number) {
        const inputs = getChipInputs();
        inputs[index].value = value;
        fixture.detectChanges();
        inputs[index].dispatchEvent(new KeyboardEvent('keydown', {keyCode: 13}));
        fixture.detectChanges();
    }

    it('should update display value on init', () => {
        spyOn(component.displayValue$, 'next');
        component.ngOnInit();
        expect(component.displayValue$.next).toHaveBeenCalledOnceWith('');
    });

    it('should not have valid value initially', () => {
        expect(component.hasValidValue()).toBeFalse();
    });

    it('should contain 3 chip input components with correct labels', () => {
        const labels = getChipInputsLabels();
        expect(labels.length).toBe(3);
        expect(labels[0]).toBe('SEARCH.LOGICAL_SEARCH.MATCH_ALL_LABEL');
        expect(labels[1]).toBe('SEARCH.LOGICAL_SEARCH.MATCH_ANY_LABEL');
        expect(labels[2]).toBe('SEARCH.LOGICAL_SEARCH.EXCLUDE_LABEL');
    });

    it('should has valid value after phrase is entered', () => {
        enterNewPhrase('test', 0);
        expect(component.hasValidValue()).toBeTrue();
    });

    it('should update display value after phrases changes', () => {
        spyOn(component, 'onPhraseChange').and.callThrough();
        spyOn(component.displayValue$, 'next');
        enterNewPhrase('test2', 0);
        expect(component.onPhraseChange).toHaveBeenCalled();
        expect(component.displayValue$.next).toHaveBeenCalledOnceWith(` SEARCH.LOGICAL_SEARCH.${Object.keys(LogicalSearchFields)[0]}:  test2`);
    });

    it('should have correct display value after each field has at least one phrase', () => {
        spyOn(component, 'onPhraseChange').and.callThrough();
        spyOn(component.displayValue$, 'next');
        enterNewPhrase('test1', 0);
        enterNewPhrase('test2', 1);
        enterNewPhrase('test3', 2);
        const displayVal1 = ` SEARCH.LOGICAL_SEARCH.${Object.keys(LogicalSearchFields)[0]}:  test1`;
        const displayVal2 = ` SEARCH.LOGICAL_SEARCH.${Object.keys(LogicalSearchFields)[1]}:  test2`;
        const displayVal3 = ` SEARCH.LOGICAL_SEARCH.${Object.keys(LogicalSearchFields)[2]}:  test3`;
        expect(component.onPhraseChange).toHaveBeenCalled();
        expect(component.displayValue$.next).toHaveBeenCalledWith(displayVal1 + displayVal2 + displayVal3);
    });

    it('should set correct value and update display value', () => {
        spyOn(component.displayValue$, 'next');
        const searchCondition: LogicalSearchCondition = { matchAll: ['test1'], matchAny: ['test2'], exclude: ['test3'] };
        component.setValue(searchCondition);
        expect(component.getCurrentValue()).toEqual(searchCondition);
        expect(component.displayValue$.next).toHaveBeenCalled();
    });

    it('should reset value and display value when reset is called', () => {
        const searchCondition: LogicalSearchCondition = { matchAll: ['test1'], matchAny: ['test2'], exclude: ['test3'] };
        component.setValue(searchCondition);
        fixture.detectChanges();
        spyOn(component.context, 'update');
        spyOn(component.displayValue$, 'next');
        component.reset();
        expect(component.context.queryFragments[component.id]).toBe('');
        expect(component.context.update).toHaveBeenCalled();
        expect(component.getCurrentValue()).toEqual({ matchAll: [], matchAny: [], exclude: [] });
        expect(component.displayValue$.next).toHaveBeenCalledWith('');
    });

    it('should form correct query from match all field', () => {
        spyOn(component.context, 'update');
        enterNewPhrase('test1', 0);
        enterNewPhrase('test2', 0);
        component.submitValues();
        expect(component.context.update).toHaveBeenCalled();
        expect(component.context.queryFragments[component.id]).toBe('((field1:"test1" AND field1:"test2") OR (field2:"test1" AND field2:"test2"))');
    });

    it('should form correct query from match any field', () => {
        spyOn(component.context, 'update');
        enterNewPhrase('test3', 1);
        enterNewPhrase('test4', 1);
        component.submitValues();
        expect(component.context.update).toHaveBeenCalled();
        expect(component.context.queryFragments[component.id]).toBe('((field1:"test3" OR field1:"test4") OR (field2:"test3" OR field2:"test4"))');
    });

    it('should form correct query from exclude field', () => {
        spyOn(component.context, 'update');
        enterNewPhrase('test5', 2);
        enterNewPhrase('test6', 2);
        component.submitValues();
        expect(component.context.update).toHaveBeenCalled();
        expect(component.context.queryFragments[component.id]).toBe('((NOT field1:"test5" AND NOT field1:"test6") AND (NOT field2:"test5" AND NOT field2:"test6"))');
    });

    it('should form correct joined query from all fields', () => {
        spyOn(component.context, 'update');
        enterNewPhrase('test1', 0);
        enterNewPhrase('test2', 1);
        enterNewPhrase('test3', 2);
        component.submitValues();
        const subQuery1 = '((field1:"test1") OR (field2:"test1"))';
        const subQuery2 = '((field1:"test2") OR (field2:"test2"))';
        const subQuery3 = '((NOT field1:"test3") AND (NOT field2:"test3"))';
        expect(component.context.update).toHaveBeenCalled();
        expect(component.context.queryFragments[component.id]).toBe(`${subQuery1} AND ${subQuery2} AND ${subQuery3}`);
    });
});
