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

import { ContentTestingModule, SearchFilterTabbedComponent, SearchFilterTabDirective } from '@alfresco/adf-content-services';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatTabGroup } from '@angular/material/tabs';
import { Component } from '@angular/core';

@Component({
    selector: 'adf-search-filter-tabbed-test',
    template: `
        <adf-search-filter-tabbed>
            <div *adf-search-filter-tab="'Tab 1'">Tab 1 content</div>
            <div *adf-search-filter-tab="'Tab 2'">Tab 2 content</div>
            <div *adf-search-filter-tab="'Tab 3'">Tab 3 content</div>
        </adf-search-filter-tabbed>
    `,
    imports: [SearchFilterTabbedComponent, SearchFilterTabDirective]
})
class SearchFilterTabbedTestComponent {}

describe('SearchFilterTabbedComponent', () => {
    let searchFilterTabbedTestFixture: ComponentFixture<SearchFilterTabbedTestComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [SearchFilterTabbedTestComponent, ContentTestingModule]
        });
        searchFilterTabbedTestFixture = TestBed.createComponent(SearchFilterTabbedTestComponent);
    });

    describe('ngOnInit', () => {
        let searchFilterTabbedElement: HTMLElement;
        let selectedIndexSpy: jasmine.Spy<(index: number) => void>;
        let tabGroup: MatTabGroup;

        beforeEach(() => {
            searchFilterTabbedTestFixture.detectChanges();
            searchFilterTabbedElement = searchFilterTabbedTestFixture.debugElement.query(By.directive(SearchFilterTabbedComponent)).nativeElement;
            tabGroup = searchFilterTabbedTestFixture.debugElement.query(By.directive(MatTabGroup)).componentInstance;
            selectedIndexSpy = spyOnProperty(tabGroup, 'selectedIndex', 'set');
            searchFilterTabbedElement.style.position = 'absolute';
        });

        it('should double change selectedIndex when element becomes not visible on screen', (done) => {
            searchFilterTabbedElement.style.top = '200%';
            setTimeout(() => {
                expect(selectedIndexSpy).toHaveBeenCalledTimes(2);
                expect(selectedIndexSpy).toHaveBeenCalledWith(1);
                expect(selectedIndexSpy).toHaveBeenCalled();
                expect(tabGroup.selectedIndex).toBe(0);
                done();
            }, 100);
        });

        it('should not change selectedIndex when element becomes visible on screen', (done) => {
            searchFilterTabbedElement.style.top = '200%';

            setTimeout(() => {
                selectedIndexSpy.calls.reset();
                searchFilterTabbedElement.style.top = '0';
                setTimeout(() => {
                    expect(selectedIndexSpy).not.toHaveBeenCalled();
                    expect(tabGroup.selectedIndex).toBe(0);
                    done();
                }, 100);
            }, 100);
        });
    });
});
