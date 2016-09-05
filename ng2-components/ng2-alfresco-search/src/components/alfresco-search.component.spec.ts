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

import { it, describe, expect, inject, beforeEachProviders, beforeEach } from '@angular/core/testing';
import { TestComponentBuilder } from '@angular/compiler/testing';
import { RouteParams } from '@angular/router-deprecated';
import { AlfrescoSearchComponent } from './alfresco-search.component';
import { AlfrescoThumbnailService } from './../services/alfresco-thumbnail.service';
import { TranslationMock } from './../assets/translation.service.mock';
import { AlfrescoSearchService } from '../services/alfresco-search.service';
import {
    AlfrescoSettingsService,
    AlfrescoAuthenticationService,
    AlfrescoContentService,
    AlfrescoTranslationService
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
                        isFile : true,
                        content: {
                            mimetype: 'text/plain'
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

    let noResult = {
        list: {
            entries: []
        }
    };

    beforeEachProviders(() => {
        return [
            AlfrescoSearchService,
            {provide: AlfrescoTranslationService, useClass: TranslationMock},
            AlfrescoThumbnailService,
            AlfrescoSettingsService,
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
        let search = new AlfrescoSearchComponent(null, null, null, new RouteParams({q: 'exampleTerm692'}));
        expect(search.searchTerm).toBe('exampleTerm692');
    });

    it('should have a null search term if no query param provided via RouteParams', () => {
        let search = new AlfrescoSearchComponent(null, null, null, new RouteParams({}));
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

            component.searchTerm = 'searchTerm';
            component.ngOnChanges({searchTerm: component.searchTerm});

            component.resultsEmitter.subscribe(x => {
                alfrescoSearchComponentFixture.detectChanges();
                expect( element.querySelector('#result_user_0').innerHTML).toBe('John Doe');
                expect( element.querySelector('#result_name_0').innerHTML).toBe('MyDoc');
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
                expect( element.querySelector('#search_no_result')).not.toBe(null);
                done();
            });

            component.searchTerm = 'searchTerm';
            component.ngOnChanges({searchTerm: component.searchTerm});

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: noResult
            });
        });
    });

    describe('search result actions', () => {

        it('should emit preview when file item clicked', () => {
            component.results = [{
                entry: {
                    id: '123',
                    name: 'MyDoc',
                    content: {
                        mimetype: 'text/plain'
                    },
                    isFile: true
                }
            }];

            alfrescoSearchComponentFixture.detectChanges(component.results[0]);
            component.preview.subscribe(e => {
                expect(e.value).toBe(component.results[0]);
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'text/plain',
                responseText: '<div></div>'
            });
        });
    });

});
