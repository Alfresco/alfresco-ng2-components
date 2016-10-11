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

import { SimpleChange } from '@angular/core';
import { it, describe, expect, inject, beforeEachProviders, beforeEach, afterEach } from '@angular/core/testing';
import { TestComponentBuilder } from '@angular/compiler/testing';
import { AlfrescoSearchAutocompleteComponent } from './alfresco-search-autocomplete.component';
import { AlfrescoThumbnailService } from './../services/alfresco-thumbnail.service';
import { TranslationMock } from './../assets/translation.service.mock';
import { AlfrescoSearchService } from '../services/alfresco-search.service';
import {
    AlfrescoApiService,
    AlfrescoSettingsService,
    AlfrescoAuthenticationService,
    AlfrescoContentService,
    AlfrescoTranslationService
} from 'ng2-alfresco-core';

declare let jasmine: any;

describe('AlfrescoSearchAutocompleteComponent', () => {

    let alfrescoSearchComponentFixture, element, component: AlfrescoSearchAutocompleteComponent;

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
            {provide: AlfrescoTranslationService, useClass: TranslationMock},
            AlfrescoThumbnailService,
            AlfrescoSettingsService,
            AlfrescoApiService,
            AlfrescoAuthenticationService,
            AlfrescoContentService,
            AlfrescoSearchService
        ];
    });

    beforeEach(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb
            .createAsync(AlfrescoSearchAutocompleteComponent)
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

    it('should setup i18n folder', () => {
        let translation = jasmine.createSpyObj('AlfrescoTranslationService', [
            'addTranslationFolder'
        ]);
        let search = new AlfrescoSearchAutocompleteComponent(null, translation, null);
        expect(search).toBeDefined();

    });

    it('should display search results when a search term is provided', () => {
        let searchTerm = 'customSearchTerm';
        spyOn(component, 'displaySearchResults').and.stub();
        component.searchTerm = searchTerm;
        component.ngOnChanges({searchTerm: new SimpleChange('', component.searchTerm)});
        alfrescoSearchComponentFixture.detectChanges();
        expect(component.displaySearchResults).toHaveBeenCalledWith(searchTerm);
    });

    it('should display the returned search results', (done) => {
        component.resultsEmitter.subscribe(x => {
            alfrescoSearchComponentFixture.detectChanges();
            expect( element.querySelector('#result_user_0').innerHTML).toBe('John Doe');
            expect( element.querySelector('#result_name_0').innerHTML).toBe('<b _ngcontent-a-1="">MyDoc</b>');
            done();
        });

        component.searchTerm = 'searchTerm';
        component.ngOnChanges({searchTerm: new SimpleChange('', component.searchTerm)});

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
        component.ngOnChanges({searchTerm: new SimpleChange('', component.searchTerm)});

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'json',
            responseText: noResult
        });
    });

    it('should emit preview when file item clicked', (done) => {
        component.resultsEmitter.subscribe(x => {
            alfrescoSearchComponentFixture.detectChanges();
            element.querySelector('#result_row_0').click();
        });

        component.searchTerm = 'searchTerm';
        component.ngOnChanges({searchTerm: new SimpleChange('', component.searchTerm)});

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'json',
            responseText: result
        });

        component.preview.subscribe(e => {
           done();
        });
    });

    it('should not emit preview when non-file item is clicked', () => {
        spyOn(component, 'onItemClick').and.stub();

        component.searchTerm = 'searchTerm';
        component.ngOnChanges({searchTerm: new SimpleChange('', component.searchTerm)});

        component.preview.subscribe(e => {
            expect(e.value).toBe(component.results[0]);
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'json',
            responseText: result
        });

        expect(component.onItemClick).not.toHaveBeenCalled();
    });
});
