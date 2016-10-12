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

import { ReflectiveInjector } from '@angular/core';
import { AlfrescoSearchService } from './alfresco-search.service';
import { AlfrescoAuthenticationService, AlfrescoSettingsService, AlfrescoApiService } from 'ng2-alfresco-core';

declare let jasmine: any;

describe('AlfrescoSearchService', () => {

    let service: AlfrescoSearchService;
    let authenticationService: AlfrescoAuthenticationService;
    let injector: ReflectiveInjector;

    let fakeSearch = {
        list: {
            pagination: {
                count: 1,
                hasMoreItems: false,
                totalItems: 1,
                skipCount: 0,
                maxItems: 100
            },
            entries: [
                {
                    entry: {
                        id: '123',
                        name: 'MyDoc',
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

    let fakeError = {
        error: {
            errorKey: 'Search failed',
            statusCode: 400,
            briefSummary: '08220082 search failed',
            stackTrace: 'For security reasons the stack trace is no longer displayed, but the property is kept for previous versions.',
            descriptionURL: 'https://api-explorer.alfresco.com'
        }
    };

    let fakeApi = {
        core: {
            searchApi: {
                liveSearchNodes: (term, opts) => Promise.resolve(fakeSearch)
            }
        }
    };

    beforeEach(() => {
        injector = ReflectiveInjector.resolveAndCreate([
            AlfrescoSearchService,
            AlfrescoSettingsService,
            AlfrescoApiService,
            AlfrescoAuthenticationService
        ]);
        service = injector.get(AlfrescoSearchService);
        authenticationService = injector.get(AlfrescoAuthenticationService);
        spyOn(authenticationService, 'getAlfrescoApi').and.returnValue(fakeApi);
    });

    it('should call search API with the correct parameters', (done) => {
        let searchTerm = 'searchTerm63688', options = {
            include: [ 'path' ],
            rootNodeId: '-root-',
            nodeType: 'cm:content'
        };
        spyOn(fakeApi.core.searchApi, 'liveSearchNodes').and.returnValue(Promise.resolve(fakeSearch));
        service.getLiveSearchResults(searchTerm).subscribe(
            () => {
                expect(fakeApi.core.searchApi.liveSearchNodes).toHaveBeenCalledWith(searchTerm, options);
                done();
            }
        );
    });

    it('should return search results returned from the API', (done) => {
        service.getLiveSearchResults('').subscribe(
            (res: any) => {
                expect(res).toBeDefined();
                expect(res).toEqual(fakeSearch);
                done();
            }
        );
    });

    it('should notify errors returned from the API', (done) => {
        spyOn(fakeApi.core.searchApi, 'liveSearchNodes').and.returnValue(Promise.reject(fakeError));
        service.getLiveSearchResults('').subscribe(
            () => {},
            (res: any) => {
                expect(res).toBeDefined();
                expect(res).toEqual(fakeError);
                done();
            }
        );
    });

});
