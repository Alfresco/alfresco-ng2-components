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

import { it, describe, expect, inject, beforeEachProviders } from '@angular/core/testing';
import { TestComponentBuilder } from '@angular/compiler/testing';
import { RouteParams } from '@angular/router-deprecated';
import { AlfrescoSearchComponent } from './alfresco-search.component';
import { SearchServiceMock } from './../assets/alfresco-search.service.mock';
import { AlfrescoThumbnailService } from './../services/alfresco-thumbnail.service';
import { TranslationMock } from './../assets/translation.service.mock';
import { AlfrescoSearchService } from '../services/alfresco-search.service';
import {
    AlfrescoSettingsService,
    AlfrescoAuthenticationService,
    AlfrescoContentService,
    AlfrescoTranslationService } from 'ng2-alfresco-core';

describe('AlfrescoSearchComponent', () => {

    beforeEachProviders(() => {

        return [
            { provide: AlfrescoSearchService, useClass: SearchServiceMock },
            { provide: AlfrescoThumbnailService },
            { provide: AlfrescoTranslationService, useClass: TranslationMock },
            { provide: AlfrescoSettingsService },
            { provide: AlfrescoAuthenticationService },
            { provide: AlfrescoContentService }
        ];
    });

    it('should not have a search term by default', () => {
        let search = new AlfrescoSearchComponent(null, null, null, null);
        expect(search).toBeDefined();
        expect(search.searchTerm).toBe('');
    });

    it('should take the provided search term from query param provided via RouteParams', () => {
        let search = new AlfrescoSearchComponent(null, null, null, new RouteParams({ q: 'exampleTerm692' }));
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
        expect(translation.addTranslationFolder).toHaveBeenCalledWith('node_modules/ng2-alfresco-search');
    });

    describe('Rendering search results', () => {

        it('should display search results when a search term is provided',
            inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                return tcb
                    .createAsync(AlfrescoSearchComponent)
                    .then((fixture) => {
                        let componentInstance = fixture.componentInstance,
                            searchTerm = 'customSearchTerm';
                        spyOn(componentInstance, 'displaySearchResults').and.stub();
                        componentInstance.searchTerm = searchTerm;
                        componentInstance.ngOnChanges();
                        fixture.detectChanges();
                        expect(componentInstance.displaySearchResults).toHaveBeenCalledWith(searchTerm);

                    });
            }));

        it('should display the returned search results',
            inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                return tcb
                    .overrideProviders(AlfrescoSearchComponent, [
                        { provide: AlfrescoSearchService, useClass: SearchServiceMock }
                    ])
                    .createAsync(AlfrescoSearchComponent)
                    .then((fixture) => {
                        let componentInstance = fixture.componentInstance;
                        componentInstance.searchTerm = '<term>';
                        componentInstance.ngOnChanges();
                        fixture.detectChanges();

                        let element = fixture.nativeElement;
                        expect(element.querySelectorAll('table tbody tr').length).toBe(1);

                    });
            }));

    });

});
