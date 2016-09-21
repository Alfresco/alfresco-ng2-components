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

/*
import { beforeEachProviders } from '@angular/core/testing';
import { AlfrescoSearchService } from './alfresco-search.service';
import { AlfrescoAuthenticationService, AlfrescoSettingsService, AlfrescoApiService } from 'ng2-alfresco-core';

declare let jasmine: any;

describe('AlfrescoSearchService', () => {

    let service: any;

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

    beforeEachProviders(() => {
        return [
            AlfrescoSearchService,
            AlfrescoSettingsService,
            AlfrescoApiService,
            AlfrescoAuthenticationService
        ];
    });

    beforeEach(inject([AlfrescoSearchService], (alfrescoSearchService: AlfrescoSearchService) => {
        jasmine.Ajax.install();
        service = alfrescoSearchService;
    }));

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('should return search list', (done) => {
        service.getSearchNodesPromise('MyDoc').then(
            (res) => {
                expect(res).toBeDefined();
                expect(res.list.entries[0].entry.name).toEqual('MyDoc');
                done();
            }
        );

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeSearch)
        });
    });

});
*/
