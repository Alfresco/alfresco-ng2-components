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

import { DebugElement, ReflectiveInjector, SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AlfrescoTranslationService, CoreModule, NotificationService } from 'ng2-alfresco-core';
import { DocumentListModule } from 'ng2-alfresco-documentlist';
import { PermissionModel } from 'ng2-alfresco-documentlist';
import { Observable } from 'rxjs/Rx';
import { SearchService } from '../services/search.service';
import { TranslationMock } from './../assets/translation.service.mock';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {

    let fixture: ComponentFixture<SearchComponent>, element: HTMLElement;
    let component: SearchComponent;

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
                        isFile: false,
                        isFolder: true,
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

    let componentHandler;

    beforeEach(async(() => {
        componentHandler = jasmine.createSpyObj('componentHandler', ['upgradeAllRegistered', 'upgradeElement']);
        window['componentHandler'] = componentHandler;

        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot(),
                DocumentListModule.forRoot()
            ],
            declarations: [SearchComponent], // declare the test component
            providers: [
                SearchService,
                {provide: AlfrescoTranslationService, useClass: TranslationMock},
                {provide: NotificationService, useClass: NotificationService}
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(SearchComponent);
            component = fixture.componentInstance;
            element = fixture.nativeElement;
        });
    }));

    afterEach(() => {
        fixture.detectChanges();
    });

    it('should not have a search term by default', () => {
        expect(component.searchTerm).toBe('');
    });

    it('should take the provided search term from query param provided via RouteParams', () => {
        let injector = ReflectiveInjector.resolveAndCreate([
            {provide: ActivatedRoute, useValue: {params: Observable.from([{q: 'exampleTerm692'}])}}
        ]);

        let search = new SearchComponent(null, null, null, injector.get(ActivatedRoute));

        search.ngOnInit();

        expect(search.searchTerm).toBe('exampleTerm692');
    });

    it('should setup i18n folder', () => {
        let translationService = TestBed.get(AlfrescoTranslationService);
        spyOn(translationService, 'addTranslationFolder');

        fixture.detectChanges();

        expect(translationService.addTranslationFolder).toHaveBeenCalledWith('ng2-alfresco-search', 'assets/ng2-alfresco-search');
    });

    it('should show the Notification snackbar on permission error', () => {
        const notoficationService = TestBed.get(NotificationService);
        spyOn(notoficationService, 'openSnackMessage');

        component.handlePermission(new PermissionModel());

        expect(notoficationService.openSnackMessage).toHaveBeenCalledWith('PERMISSON.LACKOF', 3000);
    });

    describe('Search results', () => {

        it('should add wildcard in the search parameters', (done) => {
            let searchTerm = 'searchTerm6368';
            let searchTermOut = 'searchTerm6368*';
            let options = {
                include: ['path', 'allowableOperations'],
                skipCount: 0,
                rootNodeId: '-my-',
                nodeType: 'my:type',
                maxItems: 20,
                orderBy: null
            };

            component.searchTerm = searchTerm;
            component.rootNodeId = '-my-';
            component.resultType = 'my:type';
            let searchService = fixture.debugElement.injector.get(SearchService);
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(result));
            fixture.detectChanges();

            component.resultsLoad.subscribe(() => {
                fixture.detectChanges();
                expect(searchService.getQueryNodesPromise).toHaveBeenCalledWith(searchTermOut, options);
                done();
            });
        });

        it('should display search results when a search term is provided', (done) => {

            let searchService = TestBed.get(SearchService);
            spyOn(searchService, 'getQueryNodesPromise').and.returnValue(Promise.resolve(result));
            component.searchTerm = '';

            fixture.detectChanges();

            fixture.whenStable().then(() => {
                component.resultsLoad.subscribe(() => {
                    fixture.detectChanges();
                    let resultsEl = element.querySelector('[data-automation-id="text_MyDoc"]');
                    expect(resultsEl).not.toBeNull();
                    expect(resultsEl.innerHTML.trim()).toContain('MyDoc');
                    done();
                });

                component.ngOnChanges({searchTerm: new SimpleChange('', 'searchTerm', true)});
            });
        });

        it('should display no result if no result are returned', (done) => {

            let searchService = TestBed.get(SearchService);
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(noResult));

            component.searchTerm = '';

            fixture.detectChanges();

            fixture.whenStable().then(() => {

                component.resultsLoad.subscribe(() => {
                    fixture.detectChanges();
                    expect(element.querySelector('.no-result-message')).not.toBeNull();
                    done();
                });

                component.ngOnChanges({searchTerm: new SimpleChange('', 'searchTerm', true)});
            });
        });

        it('should display an error if an error is encountered running the search', (done) => {

            let searchService = TestBed.get(SearchService);
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.reject(errorJson));

            component.searchTerm = '';

            fixture.detectChanges();

            fixture.whenStable().then(() => {

                component.resultsLoad.subscribe(() => {
                }, () => {
                    fixture.detectChanges();
                    let errorEl = element.querySelector('[data-automation-id="search_error_message"]');
                    expect(errorEl).not.toBeNull();
                    expect((<any> errorEl).innerText).toBe('SEARCH.RESULTS.ERROR');
                    done();
                });

                component.ngOnChanges({searchTerm: new SimpleChange('', 'searchTerm', true)});
            });
        });

        it('should update search results when the search term input is changed', (done) => {

            let searchService = TestBed.get(SearchService);
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(result));

            component.searchTerm = '';

            fixture.detectChanges();

            fixture.whenStable().then(() => {
                component.resultsLoad.subscribe(() => {
                    fixture.detectChanges();
                    expect(searchService.getQueryNodesPromise).toHaveBeenCalled();
                    let resultsEl = element.querySelector('[data-automation-id="text_MyDoc"]');
                    expect(resultsEl).not.toBeNull();
                    expect(resultsEl.innerHTML.trim()).toContain('MyDoc');
                    done();
                });

                component.ngOnChanges({searchTerm: new SimpleChange('', 'searchTerm2', true)});
            });
        });
    });

    describe('search result interactions', () => {

        let debugElement: DebugElement;
        let searchService: SearchService;
        let querySpy: jasmine.Spy;
        let emitSpy: jasmine.Spy;

        beforeEach(() => {
            debugElement = fixture.debugElement;
            searchService = TestBed.get(SearchService);
            querySpy = spyOn(searchService, 'getQueryNodesPromise').and.returnValue(Promise.resolve(result));
            emitSpy = spyOn(component.preview, 'emit');
        });

        describe('click results', () => {

            beforeEach(() => {
                component.navigationMode = SearchComponent.SINGLE_CLICK_NAVIGATION;
            });

            it('should emit preview event when file item clicked', (done) => {

                component.searchTerm = '';

                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    component.resultsLoad.subscribe(() => {
                        fixture.detectChanges();

                        let resultsEl = element.querySelector('[data-automation-id="text_MyDoc"]');
                        resultsEl.dispatchEvent(new Event('click'));

                        done();
                    });

                    component.ngOnChanges({searchTerm: new SimpleChange('', 'searchTerm', true)});
                });
            });

            it('should emit preview event when non-file item is clicked', (done) => {
                querySpy.and.returnValue(Promise.resolve(folderResult));

                component.searchTerm = '';

                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    component.resultsLoad.subscribe(() => {
                        fixture.detectChanges();

                        let resultsEl = element.querySelector('[data-automation-id="text_MyFolder"]');
                        resultsEl.dispatchEvent(new Event('click'));

                        done();
                    });

                    component.ngOnChanges({searchTerm: new SimpleChange('', 'searchTerm', true)});
                });
            });
        });

        describe('double click results', () => {

            beforeEach(() => {
                component.navigationMode = SearchComponent.DOUBLE_CLICK_NAVIGATION;
            });

            it('should emit preview event when file item clicked', (done) => {
                component.searchTerm = '';

                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    component.resultsLoad.subscribe(() => {
                        fixture.detectChanges();

                        let resultsEl = element.querySelector('[data-automation-id="text_MyDoc"]');
                        resultsEl.dispatchEvent(new Event('dblclick'));

                        done();
                    });

                    component.ngOnChanges({searchTerm: new SimpleChange('', 'searchTerm', true)});
                });
            });

            it('should emit preview event when non-file item is clicked', (done) => {

                querySpy.and.returnValue(Promise.resolve(folderResult));

                component.searchTerm = '';

                fixture.detectChanges();

                fixture.whenStable().then(() => {

                    component.resultsLoad.subscribe(() => {
                        fixture.detectChanges();

                        let resultsEl = element.querySelector('[data-automation-id="text_MyFolder"]');
                        resultsEl.dispatchEvent(new Event('dblclick'));

                        done();
                    });

                    component.ngOnChanges({searchTerm: new SimpleChange('', 'searchTerm', true)});
                });
            });
        });
    });
});
