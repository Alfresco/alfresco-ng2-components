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

import { provide } from '@angular/core';
import { it, describe, expect, inject, beforeEachProviders } from '@angular/core/testing';
import { TestComponentBuilder } from '@angular/compiler/testing';
import { AlfrescoSearchAutocompleteComponent } from './alfresco-search-autocomplete.component';
import { SearchServiceMock } from './../assets/alfresco-search.service.mock';
import { AlfrescoThumbnailService } from './../services/alfresco-thumbnail.service';
import { AlfrescoSearchService } from '../services/alfresco-search.service';
import {
    AlfrescoSettingsService,
    AlfrescoAuthenticationService,
    AlfrescoContentService,
    AlfrescoTranslationService } from 'ng2-alfresco-core';

describe('AlfrescoSearchAutocompleteComponent', () => {

    beforeEachProviders(() => {
        return [
            provide(AlfrescoSearchService, {useClass: SearchServiceMock}),
            provide(AlfrescoThumbnailService, {}),
            provide(AlfrescoTranslationService, {}),
            provide(AlfrescoSettingsService, {}),
            provide(AlfrescoAuthenticationService, {}),
            provide(AlfrescoContentService, {})
        ];
    });

    it('should setup i18n folder', () => {

        let translation = jasmine.createSpyObj('AlfrescoTranslationService', [
            'addTranslationFolder'
        ]);
        let search = new AlfrescoSearchAutocompleteComponent(null, translation, null);
        expect(search).toBeDefined();

    });

    it('should display search results when a search term is provided',
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(AlfrescoSearchAutocompleteComponent)
                .then((fixture) => {
                    let componentInstance = fixture.componentInstance,
                        searchTerm = 'customSearchTerm';
                    spyOn(componentInstance, 'displaySearchResults').and.stub();
                    componentInstance.searchTerm = searchTerm;
                    componentInstance.ngOnChanges({
                        searchTerm: searchTerm
                    });
                    fixture.detectChanges();
                    expect(componentInstance.displaySearchResults).toHaveBeenCalledWith(searchTerm);

                });
        }));

    it('should display the returned search results',
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(AlfrescoSearchAutocompleteComponent)
                .then((fixture) => {
                    let componentInstance = fixture.componentInstance;
                    componentInstance.results = [{
                        entry: {
                            id: '123',
                            name: 'MyDoc',
                            content: {
                                mimetype: 'text/plain'
                            },
                            createdByUser: {
                                displayName: 'John Doe'
                            }
                        }
                    }];
                    componentInstance.searchTerm = '<term>';
                    fixture.detectChanges();

                    let element = fixture.nativeElement;
                    expect(element.querySelectorAll('table tr').length).toBe(1);

                });
        }));

    it('should emit preview when file item clicked',
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(AlfrescoSearchAutocompleteComponent)
                .then((fixture) => {
                    let componentInstance = fixture.componentInstance;
                    componentInstance.results = [{
                        entry: {
                            id: '123',
                            name: 'MyDoc',
                            content: {
                                mimetype: 'text/plain'
                            },
                            isFile: true
                        }
                    }];
                    fixture.detectChanges(componentInstance.results[0]);
                    componentInstance.preview.subscribe(e => {
                        expect(e.value).toBe(componentInstance.results[0]);
                    });
                    componentInstance.onItemClick();

                });
        }));

    it('should not emit preview when non-file item clicked',
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(AlfrescoSearchAutocompleteComponent)
                .then((fixture) => {
                    let componentInstance = fixture.componentInstance;
                    componentInstance.results = [{
                        entry: {
                            id: '123',
                            name: 'MyDoc',
                            content: {
                                mimetype: 'text/plain'
                            },
                            isFile: true
                        }
                    }];
                    fixture.detectChanges(componentInstance.results[0]);
                    componentInstance.preview.subscribe(e => {
                        expect(e.value).toBe(componentInstance.results[0]);
                    });
                    componentInstance.onItemClick();

                });
        }));

});
