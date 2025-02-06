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
import { By } from '@angular/platform-browser';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { LogicalSearchCondition, LogicalSearchFields, SearchLogicalFilterComponent } from './search-logical-filter.component';
import { ReplaySubject } from 'rxjs';

describe('SearchLogicalFilterComponent', () => {
    let component: SearchLogicalFilterComponent;
    let fixture: ComponentFixture<SearchLogicalFilterComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule, SearchLogicalFilterComponent]
        });

        fixture = TestBed.createComponent(SearchLogicalFilterComponent);
        component = fixture.componentInstance;
        component.id = 'logic';
        component.context = {
            queryFragments: {
                logic: ''
            },
            filterRawParams: {},
            populateFilters: new ReplaySubject(1),
            update: jasmine.createSpy('update')
        } as any;
        component.settings = { field: 'field1,field2', allowUpdateOnChange: true, hideDefaultAction: false };
        fixture.detectChanges();
    });

    /**
     * Get search input elements
     *
     * @returns list of native elements
     */
    function getInputs(): HTMLInputElement[] {
        return fixture.debugElement.queryAll(By.css('.adf-search-input input')).map((input) => input.nativeElement);
    }

    /**
     * Get input label elements
     *
     * @returns list of labels
     */
    function getInputsLabels(): string[] {
        return fixture.debugElement.queryAll(By.css(`[data-automation-id="adf-search-input-label"]`)).map((label) => label.nativeElement.innerText);
    }

    /**
     * Enters a new phrase
     *
     * @param value new value
     * @param index value index
     */
    function enterNewPhrase(value: string, index: number) {
        const inputs = getInputs();
        inputs[index].value = value;
        inputs[index].dispatchEvent(new Event('input'));
        inputs[index].dispatchEvent(new Event('change'));
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

    it('should contain 4 inputs with correct labels', () => {
        const labels = getInputsLabels();
        expect(labels.length).toBe(4);
        expect(labels[0]).toBe('SEARCH.LOGICAL_SEARCH.MATCH_ALL_LABEL');
        expect(labels[1]).toBe('SEARCH.LOGICAL_SEARCH.MATCH_ANY_LABEL');
        expect(labels[2]).toBe('SEARCH.LOGICAL_SEARCH.EXCLUDE_LABEL');
        expect(labels[3]).toBe('SEARCH.LOGICAL_SEARCH.MATCH_EXACT_LABEL');
    });

    it('should has valid value after phrase is entered', () => {
        enterNewPhrase('test', 0);
        expect(component.hasValidValue()).toBeTrue();
    });

    it('should update display value after phrases changes and user user clicks submit', () => {
        spyOn(component.displayValue$, 'next');
        enterNewPhrase('test2', 0);
        component.submitValues();
        expect(component.displayValue$.next).toHaveBeenCalledOnceWith(` SEARCH.LOGICAL_SEARCH.${Object.keys(LogicalSearchFields)[0]}: test2`);
    });

    it('should have correct display value after each field has at least one phrase and user clicks submit', () => {
        spyOn(component.displayValue$, 'next');
        enterNewPhrase('test1', 0);
        enterNewPhrase('test2', 1);
        enterNewPhrase('test3', 2);
        enterNewPhrase('test4', 3);
        const displayVal1 = ` SEARCH.LOGICAL_SEARCH.${Object.keys(LogicalSearchFields)[0]}: test1`;
        const displayVal2 = ` SEARCH.LOGICAL_SEARCH.${Object.keys(LogicalSearchFields)[1]}: test2`;
        const displayVal3 = ` SEARCH.LOGICAL_SEARCH.${Object.keys(LogicalSearchFields)[2]}: test3`;
        const displayVal4 = ` SEARCH.LOGICAL_SEARCH.${Object.keys(LogicalSearchFields)[3]}: test4`;
        component.submitValues();
        expect(component.displayValue$.next).toHaveBeenCalledWith(displayVal1 + displayVal2 + displayVal4 + displayVal3);
    });

    it('should set correct value and update display value', () => {
        spyOn(component.displayValue$, 'next');
        const searchCondition: LogicalSearchCondition = { matchAll: 'test1', matchAny: 'test2', exclude: 'test3', matchExact: 'test4' };
        component.setValue(searchCondition);
        expect(component.getCurrentValue()).toEqual(searchCondition);
        expect(component.displayValue$.next).toHaveBeenCalled();
    });

    it('should reset value and display value when reset is called', () => {
        const searchCondition: LogicalSearchCondition = { matchAll: 'test1', matchAny: 'test2', exclude: 'test3', matchExact: 'test4' };
        component.setValue(searchCondition);
        fixture.detectChanges();
        spyOn(component.displayValue$, 'next');
        component.reset();
        expect(component.context.queryFragments[component.id]).toBe('');
        expect(component.context.update).toHaveBeenCalled();
        expect(component.getCurrentValue()).toEqual({ matchAll: '', matchAny: '', exclude: '', matchExact: '' });
        expect(component.displayValue$.next).toHaveBeenCalledWith('');
        expect(component.context.filterRawParams[component.id]).toEqual(component.getCurrentValue());
    });

    it('should form correct query from match all field', () => {
        enterNewPhrase('  test1   test2  ', 0);
        component.submitValues();
        expect(component.context.update).toHaveBeenCalled();
        expect(component.context.queryFragments[component.id]).toBe('((field1:"test1" AND field1:"test2") OR (field2:"test1" AND field2:"test2"))');
        expect(component.context.filterRawParams[component.id]).toEqual(component.getCurrentValue());
    });

    it('should form correct query from match any field', () => {
        enterNewPhrase('  test3  test4', 1);
        component.submitValues();
        expect(component.context.update).toHaveBeenCalled();
        expect(component.context.queryFragments[component.id]).toBe('((field1:"test3" OR field1:"test4") OR (field2:"test3" OR field2:"test4"))');
        expect(component.context.filterRawParams[component.id]).toEqual(component.getCurrentValue());
    });

    it('should form correct query from exclude field', () => {
        enterNewPhrase('test5   test6  ', 2);
        component.submitValues();
        expect(component.context.update).toHaveBeenCalled();
        expect(component.context.queryFragments[component.id]).toBe(
            '((NOT field1:"test5" AND NOT field1:"test6") AND (NOT field2:"test5" AND NOT field2:"test6"))'
        );
        expect(component.context.filterRawParams[component.id]).toEqual(component.getCurrentValue());
    });

    it('should form correct query from match exact field and trim it', () => {
        enterNewPhrase('   test7 test8   ', 3);
        component.submitValues();
        expect(component.context.update).toHaveBeenCalled();
        expect(component.context.queryFragments[component.id]).toBe('((field1:"test7 test8") OR (field2:"test7 test8"))');
        expect(component.context.filterRawParams[component.id]).toEqual(component.getCurrentValue());
    });

    it('should form correct joined query from all fields', () => {
        enterNewPhrase('test1', 0);
        enterNewPhrase('test2', 1);
        enterNewPhrase('test3', 2);
        enterNewPhrase('test4', 3);
        component.submitValues();
        const subQuery1 = '((field1:"test1") OR (field2:"test1"))';
        const subQuery2 = '((field1:"test2") OR (field2:"test2"))';
        const subQuery3 = '((NOT field1:"test3") AND (NOT field2:"test3"))';
        const subQuery4 = '((field1:"test4") OR (field2:"test4"))';
        expect(component.context.update).toHaveBeenCalled();
        expect(component.context.queryFragments[component.id]).toBe(`${subQuery1} AND ${subQuery2} AND ${subQuery4} AND ${subQuery3}`);
        expect(component.context.filterRawParams[component.id]).toEqual(component.getCurrentValue());
    });

    it('should populate filter state when populate filters event has been observed', () => {
        component.context.filterLoaded = new ReplaySubject(1);
        spyOn(component.context.filterLoaded, 'next').and.stub();
        spyOn(component.displayValue$, 'next').and.stub();
        fixture.detectChanges();
        component.context.populateFilters.next({ logic: { matchAll: 'test', matchAny: 'test2', matchExact: '', exclude: '' } });
        fixture.detectChanges();

        expect(component.displayValue$.next).toHaveBeenCalledWith(' SEARCH.LOGICAL_SEARCH.MATCH_ALL: test SEARCH.LOGICAL_SEARCH.MATCH_ANY: test2');
        expect(component.context.filterRawParams[component.id]).toEqual({ matchAll: 'test', matchAny: 'test2', matchExact: '', exclude: '' });
        expect(component.searchCondition).toEqual({ matchAll: 'test', matchAny: 'test2', matchExact: '', exclude: '' });
        expect(component.context.filterLoaded.next).toHaveBeenCalled();
    });
});
