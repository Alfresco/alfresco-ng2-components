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

import { ReflectiveInjector, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { AlfrescoSearchComponent } from './alfresco-search.component';
import { AlfrescoThumbnailService } from './../services/alfresco-thumbnail.service';
import { TranslationMock } from './../assets/translation.service.mock';
import { AlfrescoSearchService } from '../services/alfresco-search.service';
import {
    AlfrescoSettingsService,
    AlfrescoApiService,
    AlfrescoAuthenticationService,
    AlfrescoContentService,
    AlfrescoTranslationService,
    CoreModule,
    StorageService
} from 'ng2-alfresco-core';

describe('AlfrescoSearchComponent', () => {

    let fixture: ComponentFixture<AlfrescoSearchComponent>, element: HTMLElement;
    let component: AlfrescoSearchComponent;

    let result = {
        list: {
            entries: [
                {
                    entry: {
                        id: '123',
                        name: 'MyDoc',
                        isFile: true,
                        content: {
                            mimeType: 'text/plain'
                        },
                        createdByUser: {
                            displayName: 'John Doe'
                        },
                        modifiedByUser: {
                            displayName: 'John Doe'
                        }
                    }
                }
            ]
        }
    };

    let folderResult = {
        list: {
            entries: [
                {
                    entry: {
                        id: '123',
                        name: 'MyFolder',
                        isFile : false,
                        isFolder : true,
                        createdByUser: {
                            displayName: 'John Doe'
                        },
                        modifiedByUser: {
                            displayName: 'John Doe'
                        }
                    }
                }
            ]
        }
    };

    let noResult = {
        list: {
            entries: []
        }
    };

    let errorJson = {
        error: {
            errorKey: 'Search failed',
            statusCode: 400,
            briefSummary: '08220082 search failed',
            stackTrace: 'For security reasons the stack trace is no longer displayed, but the property is kept for previous versions.',
            descriptionURL: 'https://api-explorer.alfresco.com'
        }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule
            ],
            declarations: [ AlfrescoSearchComponent ], // declare the test component
            providers: [
                AlfrescoSearchService,
                {provide: AlfrescoTranslationService, useClass: TranslationMock},
                AlfrescoThumbnailService,
                AlfrescoSettingsService,
                AlfrescoApiService,
                AlfrescoAuthenticationService,
                AlfrescoContentService,
                StorageService
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(AlfrescoSearchComponent);
            component = fixture.componentInstance;
            element = fixture.nativeElement;
        });
    }));

    it('should not have a search term by default', () => {
        let search = new AlfrescoSearchComponent(null, null, null, null);
        expect(search).toBeDefined();
        expect(search.searchTerm).toBe('');
    });

    it('should take the provided search term from query param provided via RouteParams', () => {
        let injector = ReflectiveInjector.resolveAndCreate([
            { provide: ActivatedRoute, useValue: { params: Observable.from([{ q: 'exampleTerm692' }]) } }
        ]);
        let search = new AlfrescoSearchComponent(null, null, null, injector.get(ActivatedRoute));
        search.ngOnInit();
        expect(search.searchTerm).toBe('exampleTerm692');
    });

    it('should have a null search term if no query param provided via RouteParams', () => {
        let injector = ReflectiveInjector.resolveAndCreate([
            AlfrescoSearchService,
            AlfrescoAuthenticationService,
            AlfrescoSettingsService,
            AlfrescoApiService,
            StorageService,
            { provide: ActivatedRoute, useValue: { params: Observable.from([{}]) } }
        ]);
        let search = new AlfrescoSearchComponent(injector.get(AlfrescoSearchService), null, null, injector.get(ActivatedRoute));
        search.ngOnInit();
        expect(search.searchTerm).toBeNull();
    });

    it('should setup i18n folder', () => {
        let translationService = fixture.debugElement.injector.get(AlfrescoTranslationService);
        spyOn(translationService, 'addTranslationFolder');
        fixture.detectChanges();
        expect(translationService.addTranslationFolder).toHaveBeenCalledWith('ng2-alfresco-search', 'node_modules/ng2-alfresco-search/dist/src');
    });

    describe('Search results', () => {

        it('should call search service with the correct parameters', (done) => {
            let searchTerm = 'searchTerm63688', options = {
                include: ['path'],
                rootNodeId: '-my-',
                nodeType: 'my:type',
                maxItems: 20,
                orderBy: null
            };
            component.searchTerm = searchTerm;
            component.rootNodeId = '-my-';
            component.resultType = 'my:type';
            let searchService = fixture.debugElement.injector.get(AlfrescoSearchService);
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(result));
            fixture.detectChanges();

            component.resultsLoad.subscribe(() => {
                fixture.detectChanges();
                expect(searchService.getQueryNodesPromise).toHaveBeenCalledWith(searchTerm, options);
                done();
            });
        });

        it('should display search results when a search term is provided', (done) => {

            let searchService = fixture.debugElement.injector.get(AlfrescoSearchService);
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(result));

            component.resultsLoad.subscribe(() => {
                fixture.detectChanges();
                expect(searchService.getQueryNodesPromise).toHaveBeenCalled();
                expect(element.querySelector('#result_user_0')).not.toBeNull();
                expect(element.querySelector('#result_user_0').innerHTML).toBe('John Doe');
                expect(element.querySelector('#result_name_0').innerHTML).toBe('MyDoc');
                done();
            });

            component.searchTerm = 'searchTerm';
            component.ngOnInit();
        });

        it('should display no result if no result are returned', (done) => {

            let searchService = fixture.debugElement.injector.get(AlfrescoSearchService);
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(noResult));

            component.resultsLoad.subscribe(() => {
                fixture.detectChanges();
                expect(element.querySelector('#search_no_result')).not.toBeNull();
                done();
            });

            component.searchTerm = 'searchTerm';
            component.ngOnInit();
        });

        it('should display an error if an error is encountered running the search', (done) => {

            let searchService = fixture.debugElement.injector.get(AlfrescoSearchService);
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.reject(errorJson));

            component.resultsLoad.subscribe(() => {}, () => {
                fixture.detectChanges();
                let resultsEl = element.querySelector('[data-automation-id="search_result_table"]');
                let errorEl = element.querySelector('[data-automation-id="search_error_message"]');
                expect(resultsEl).toBeNull();
                expect(errorEl).not.toBeNull();
                expect((<any>errorEl).innerText).toBe('SEARCH.RESULTS.ERROR');
                done();
            });

            component.searchTerm = 'searchTerm';
            component.ngOnInit();
        });

        it('should update search results when the search term input is changed', (done) => {

            let searchService = fixture.debugElement.injector.get(AlfrescoSearchService);
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(result));

            component.resultsLoad.subscribe(() => {
                fixture.detectChanges();
                expect(searchService.getQueryNodesPromise.calls.mostRecent().args[0]).toBe('searchTerm2');
                expect(element.querySelector('#result_user_0')).not.toBeNull();
                expect(element.querySelector('#result_user_0').innerHTML).toBe('John Doe');
                expect(element.querySelector('#result_name_0').innerHTML).toBe('MyDoc');
                done();
            });

            component.ngOnChanges({searchTerm: new SimpleChange('', 'searchTerm2')});
        });
    });

    describe('search result actions', () => {

        it('should emit preview when file item clicked', (done) => {

            let searchService = fixture.debugElement.injector.get(AlfrescoSearchService);
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(result));

            component.resultsLoad.subscribe(() => {
                fixture.detectChanges();
                (<HTMLTableRowElement> element.querySelector('#result_row_0')).click();
            });

            component.searchTerm = 'searchTerm';
            component.ngOnInit();

            component.preview.subscribe(() => {
                done();
            });
        });

        it('should not emit preview when non-file item is clicked', (done) => {

            let searchService = fixture.debugElement.injector.get(AlfrescoSearchService);
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(folderResult));

            spyOn(component.preview, 'emit');
            component.resultsLoad.subscribe(() => {
                fixture.detectChanges();
                (<HTMLTableRowElement> element.querySelector('#result_row_0')).click();
                expect(component.preview.emit).not.toHaveBeenCalled();
                done();
            });

            component.searchTerm = 'searchTerm';
            component.ngOnInit();
        });
    });

});
