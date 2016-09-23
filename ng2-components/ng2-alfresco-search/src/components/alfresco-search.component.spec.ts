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

import { PLATFORM_PIPES, ReflectiveInjector } from '@angular/core';
import { it, describe, expect, inject, beforeEachProviders, beforeEach } from '@angular/core/testing';
import { TestComponentBuilder } from '@angular/compiler/testing';
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
    AlfrescoPipeTranslate
} from 'ng2-alfresco-core';

declare let jasmine: any;

describe('AlfrescoSearchComponent', () => {

    let alfrescoSearchComponentFixture, element, component;

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

    beforeEachProviders(() => {
        return [
            { provide: PLATFORM_PIPES, useValue: AlfrescoPipeTranslate, multi: true },
            AlfrescoSearchService,
            {provide: AlfrescoTranslationService, useClass: TranslationMock},
            AlfrescoThumbnailService,
            AlfrescoSettingsService,
            AlfrescoApiService,
            AlfrescoAuthenticationService,
            AlfrescoContentService
        ];
    });

    beforeEach(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb
            .createAsync(AlfrescoSearchComponent)
            .then(fixture => {
                jasmine.Ajax.install();
                alfrescoSearchComponentFixture = fixture;
                element = alfrescoSearchComponentFixture.nativeElement;
                component = alfrescoSearchComponentFixture.componentInstance;
            });
    }));

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

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
            { provide: ActivatedRoute, useValue: { params: Observable.from([{}]) } }
        ]);
        let search = new AlfrescoSearchComponent(null, null, null, injector.get(ActivatedRoute));
        search.ngOnInit();
        expect(search.searchTerm).toBeNull();
    });

    it('should setup i18n folder', () => {

        let translation = jasmine.createSpyObj('AlfrescoTranslationService', [
            'addTranslationFolder'
        ]);

        let search = new AlfrescoSearchComponent(null, translation, null, null);
        expect(search).toBeDefined();
        expect(translation.addTranslationFolder).toHaveBeenCalledWith('node_modules/ng2-alfresco-search/dist/src');
    });

    describe('Rendering search results', () => {

        it('should display search results when a search term is provided', (done) => {

            component.searchTerm =  { currentValue: 'searchTerm', previousValue: ''};
            component.ngOnChanges({searchTerm: component.searchTerm});

            component.resultsEmitter.subscribe(x => {
                alfrescoSearchComponentFixture.detectChanges();
                expect(element.querySelector('#result_user_0').innerHTML).toBe('John Doe');
                expect(element.querySelector('#result_name_0').innerHTML).toBe('MyDoc');
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: result
            });
        });

        it('should display no result if no result are returned', (done) => {
            component.resultsEmitter.subscribe(x => {
                alfrescoSearchComponentFixture.detectChanges();
                expect(element.querySelector('#search_no_result')).not.toBeNull();
                done();
            });

            component.searchTerm =  { currentValue: 'searchTerm', previousValue: ''};
            component.ngOnChanges({searchTerm: component.searchTerm});

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: noResult
            });
        });

        it('should display an error if an error is encountered running the search', (done) => {
            component.errorEmitter.subscribe(() => {
                alfrescoSearchComponentFixture.detectChanges();
                let resultsEl = element.querySelector('[data-automation-id="search_result_table"]');
                let errorEl = element.querySelector('[data-automation-id="search_error_message"]');
                expect(resultsEl).toBeNull();
                expect(errorEl).not.toBeNull();
                expect(errorEl.innerText).toBe('SEARCH.RESULTS.ERROR');
                done();
            });

            component.searchTerm =  { currentValue: 'searchTerm', previousValue: ''};
            component.ngOnChanges({searchTerm: component.searchTerm});

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 500,
                contentType: 'json',
                responseText: errorJson
            });
        });
    });

    describe('search result actions', () => {

        it('should emit preview when file item clicked', (done) => {
            component.resultsEmitter.subscribe(() => {
                alfrescoSearchComponentFixture.detectChanges();
                element.querySelector('#result_row_0').click();
            });

            component.searchTerm =  { currentValue: 'searchTerm', previousValue: ''};
            component.ngOnChanges({searchTerm: component.searchTerm});

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: result
            });

            component.preview.subscribe(e => {
                done();
            });
        });

        it('should not emit preview when non-file item is clicked', (done) => {
            spyOn(component.preview, 'emit');
            component.resultsEmitter.subscribe(x => {
                alfrescoSearchComponentFixture.detectChanges();
                element.querySelector('#result_row_0').click();
                expect(component.preview.emit).not.toHaveBeenCalled();
                done();
            });

            component.searchTerm =  { currentValue: 'searchTerm', previousValue: ''};
            component.ngOnChanges({searchTerm: component.searchTerm});

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: folderResult
            });
        });
    });

});
