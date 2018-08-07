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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchService, setupTestBed, CoreModule } from '@alfresco/adf-core';
import { QueryBody } from 'alfresco-js-api';
import { differentResult, folderResult, result, SimpleSearchTestComponent } from '../../mock';
import { Observable, of, throwError } from 'rxjs';
import { SearchModule } from '../search.module';

function fakeNodeResultSearch(searchNode: QueryBody): Observable<any> {
    if (searchNode && searchNode.query.query === 'FAKE_SEARCH_EXMPL') {
        return of(differentResult);
    }
    if (searchNode && searchNode.filterQueries.length === 1 &&
        searchNode.filterQueries[0].query === "TYPE:'cm:folder'") {
        return of(folderResult);
    }
    return of(result);
}

describe('SearchComponent', () => {

    let fixture: ComponentFixture<SimpleSearchTestComponent>, element: HTMLElement;
    let component: SimpleSearchTestComponent;
    let searchService: SearchService;

    setupTestBed({
        imports: [
            CoreModule.forRoot(),
            SearchModule
        ],
        declarations: [SimpleSearchTestComponent]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SimpleSearchTestComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        searchService = TestBed.get(SearchService);
    });

    describe('search results', () => {

        it('should clear results straight away when a new search term is entered', (done) => {
            spyOn(searchService, 'search').and.returnValues(
                of(result),
                of(differentResult)
            );

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
                    done();
                });
            });
        });

        it('should display the returned search results', (done) => {
            spyOn(searchService, 'search').and.returnValue(of(result));

            component.setSearchWordTo('searchTerm');
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#result_option_0').textContent.trim()).toBe('MyDoc');
                done();
            });
        });

        it('should emit error event when search call fail', (done) => {
            spyOn(searchService, 'search')
                .and.returnValue(throwError({ status: 402 }));
            component.setSearchWordTo('searchTerm');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let message: HTMLElement = <HTMLElement> element.querySelector('#component-result-message');
                expect(message.textContent).toBe('ERROR');
                done();
            });
        });

        it('should be able to hide the result panel', (done) => {
            spyOn(searchService, 'search').and.returnValues(
                of(result),
                of(differentResult)
            );

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
                    done();
                });
            });
        });
    });

    describe('search node', () => {

        it('should perform a search based on the query node given', (done) => {
            spyOn(searchService, 'searchByQueryBody')
                    .and.callFake((searchObj) => fakeNodeResultSearch(searchObj));
            let fakeSearchNode: QueryBody = {
                query: {
                    query: 'TEST-FAKE-NODE'
                },
                filterQueries: [
                    { 'query': "TYPE:'cm:folder'" }
                ]
            };
            component.setSearchWordTo('searchTerm');
            component.setSearchNodeTo(fakeSearchNode);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let optionShowed = element.querySelectorAll('#autocomplete-search-result-list > li').length;
                expect(optionShowed).toBe(1);
                let folderOption: HTMLElement = <HTMLElement> element.querySelector('#result_option_0');
                expect(folderOption.textContent.trim()).toBe('MyFolder');
                done();
            });
        });

        it('should perform a search with a defaultNode if no search node is given', (done) => {
            spyOn(searchService, 'search').and.returnValue(of(result));
            component.setSearchWordTo('searchTerm');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let optionShowed = element.querySelectorAll('#autocomplete-search-result-list > li').length;
                expect(optionShowed).toBe(1);
                let folderOption: HTMLElement = <HTMLElement> element.querySelector('#result_option_0');
                expect(folderOption.textContent.trim()).toBe('MyDoc');
                done();
            });
        });

        it('should perform a search with the searchNode given', (done) => {
            spyOn(searchService, 'searchByQueryBody')
                .and.callFake((searchObj) => fakeNodeResultSearch(searchObj));
            let fakeSearchNode: QueryBody = {
                query: {
                    query: 'FAKE_SEARCH_EXMPL'
                },
                filterQueries: [
                    { 'query': "TYPE:'cm:folder'" }
                ]
            };
            component.setSearchWordTo('searchTerm');
            component.setSearchNodeTo(fakeSearchNode);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let optionShowed = element.querySelectorAll('#autocomplete-search-result-list > li').length;
                expect(optionShowed).toBe(1);
                let folderOption: HTMLElement = <HTMLElement> element.querySelector('#result_option_0');
                expect(folderOption.textContent.trim()).toBe('TEST_DOC');
                done();
            });
        });
    });
});
