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

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatTabGroup } from '@angular/material/tabs';
import { NoopTranslateModule } from '@alfresco/adf-core';
import { SearchFilterTabbedComponent } from './search-filter-tabbed.component';
import { Component } from '@angular/core';
import { SearchFilterTabDirective } from './search-filter-tab.directive';

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
            imports: [SearchFilterTabbedTestComponent, NoopTranslateModule]
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
        // eslint-disable-next-line
        xit('should double change selectedIndex when element becomes not visible on screen', fakeAsync(() => {
            const originalGetBoundingClientRect = searchFilterTabbedElement.getBoundingClientRect;
            searchFilterTabbedElement.getBoundingClientRect = () =>
                ({
                    top: window.innerHeight + 100,
                    left: 0,
                    bottom: window.innerHeight + 200,
                    right: 100,
                    width: 100,
                    height: 100,
                    x: 0,
                    y: window.innerHeight + 100
                } as DOMRect);

            // Trigger a scroll event to force visibility checking
            window.dispatchEvent(new Event('scroll'));

            // Advance virtual time instead of waiting
            tick(500);

            // Verify expectations
            expect(selectedIndexSpy).toHaveBeenCalledTimes(2);
            expect(selectedIndexSpy).toHaveBeenCalledWith(1);
            expect(tabGroup.selectedIndex).toBe(0);

            // Cleanup
            searchFilterTabbedElement.getBoundingClientRect = originalGetBoundingClientRect;
        }));

        it('should not change selectedIndex when element becomes visible on screen', fakeAsync(() => {
            // First move element out of viewport
            const originalGetBoundingClientRect = searchFilterTabbedElement.getBoundingClientRect;
            searchFilterTabbedElement.getBoundingClientRect = () =>
                ({
                    top: window.innerHeight + 100,
                    left: 0,
                    bottom: window.innerHeight + 200,
                    right: 100,
                    width: 100,
                    height: 100,
                    x: 0,
                    y: window.innerHeight + 100
                } as DOMRect);

            // Trigger initial scroll event
            window.dispatchEvent(new Event('scroll'));
            tick(100);

            // Reset the spy calls
            selectedIndexSpy.calls.reset();

            // Now move element back into viewport
            searchFilterTabbedElement.getBoundingClientRect = () =>
                ({
                    top: 10,
                    left: 0,
                    bottom: 110,
                    right: 100,
                    width: 100,
                    height: 100,
                    x: 0,
                    y: 10
                } as DOMRect);

            // Trigger another scroll event
            window.dispatchEvent(new Event('scroll'));
            tick(100);

            // Verify expectations
            expect(selectedIndexSpy).not.toHaveBeenCalled();
            expect(tabGroup.selectedIndex).toBe(0);

            // Cleanup
            searchFilterTabbedElement.getBoundingClientRect = originalGetBoundingClientRect;
        }));
    });
});
