/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ServicesModule, SearchService } from '@adf/core';
import { SearchModule } from '../../index';
import { differentResult, result, SimpleSearchTestComponent } from './../assets/search.component.mock';

describe('SearchComponent', () => {

    let fixture: ComponentFixture<SimpleSearchTestComponent>, element: HTMLElement;
    let component: SimpleSearchTestComponent;
    let searchService: SearchService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ServicesModule,
                SearchModule
            ],
            declarations: [ SimpleSearchTestComponent ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(SimpleSearchTestComponent);
            component = fixture.componentInstance;
            element = fixture.nativeElement;
            searchService = TestBed.get(SearchService);
        });
    }));

    describe('search results', () => {

        afterEach(() => {
            fixture.destroy();
        });

        it('should clear results straight away when a new search term is entered', async(() => {
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValues(Promise.resolve(result), Promise.resolve(differentResult));

            component.setSearchWordTo('searchTerm');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let optionShowed = element.querySelectorAll('#autocomplete-search-result-list > li').length;
                expect(optionShowed).toBe(1);
                component.setSearchWordTo('searchTerm2');
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    optionShowed = element.querySelectorAll('#autocomplete-search-result-list > li').length;
                    expect(optionShowed).toBe(1);
                });
            });
        }));

        it('should display the returned search results', async(() => {
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(result));

            component.setSearchWordTo('searchTerm');
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#result_option_0').textContent.trim()).toBe('MyDoc');
            });
        }));

        it('should emit error event when search call fail', async(() => {
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.reject({ status: 402 }));
            component.setSearchWordTo('searchTerm');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let message: HTMLElement = <HTMLElement> element.querySelector('#component-result-message');
                expect(message.textContent).toBe('ERROR');
            });
        }));

        it('should be able to hide the result panel', async(() => {
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValues(Promise.resolve(result), Promise.resolve(differentResult));

            component.setSearchWordTo('searchTerm');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let optionShowed = element.querySelectorAll('#autocomplete-search-result-list');
                expect(optionShowed).not.toBeNull();
                component.forceHidePanel();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    let elementList = element.querySelector('#adf-search-results-content');
                    expect(elementList.classList).toContain('adf-search-hide');
                });
            });
        }));
    });
});
