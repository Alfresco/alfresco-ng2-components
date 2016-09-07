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

import { it, describe, inject, beforeEach, beforeEachProviders } from '@angular/core/testing';
import { RenditionsService } from './renditions.service';
import { AlfrescoApiService } from './AlfrescoApi.service';
import { AlfrescoSettingsService } from './AlfrescoSettings.service';
import { AlfrescoAuthenticationService } from './AlfrescoAuthentication.service';

declare let AlfrescoApi: any;
declare let jasmine: any;

describe('RenditionsService', () => {
    let service: any;

    let fakeRedition = {
        'list': {
            'pagination': {
                'count': 6,
                'hasMoreItems': false,
                'totalItems': 6,
                'skipCount': 0,
                'maxItems': 100
            },
            'entries': [{
                'entry': {
                    'id': 'avatar',
                    'content': {'mimeType': 'image/png', 'mimeTypeName': 'PNG Image'},
                    'status': 'NOT_CREATED'
                }
            }, {
                'entry': {
                    'id': 'avatar32',
                    'content': {'mimeType': 'image/png', 'mimeTypeName': 'PNG Image'},
                    'status': 'NOT_CREATED'
                }
            }, {
                'entry': {
                    'id': 'doclib',
                    'content': {'mimeType': 'image/png', 'mimeTypeName': 'PNG Image'},
                    'status': 'NOT_CREATED'
                }
            }, {
                'entry': {
                    'id': 'imgpreview',
                    'content': {'mimeType': 'image/jpeg', 'mimeTypeName': 'JPEG Image'},
                    'status': 'NOT_CREATED'
                }
            }, {
                'entry': {
                    'id': 'medium',
                    'content': {'mimeType': 'image/jpeg', 'mimeTypeName': 'JPEG Image'},
                    'status': 'NOT_CREATED'
                }
            }, {
                'entry': {
                    'id': 'pdf',
                    'content': {'mimeType': 'application/pdf', 'mimeTypeName': 'Adobe PDF Document'},
                    'status': 'NOT_CREATED'
                }
            }]
        }
    };

    beforeEachProviders(() => {
        return [
            AlfrescoSettingsService,
            AlfrescoApiService,
            AlfrescoAuthenticationService,
            RenditionsService
        ];
    });

    beforeEach(inject([RenditionsService, AlfrescoApiService], (renditionsService: RenditionsService, apiService: AlfrescoApiService) => {
        jasmine.Ajax.install();
        service = renditionsService;
        apiService.setInstance(new AlfrescoApi({}));
    }));

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('Get redition list service should call the server with the ID passed', (done) => {
        service.getRenditionsListByNodeId('fake-node-id').subscribe((res) => {
            expect(jasmine.Ajax.requests.mostRecent().url).toBe('http://127.0.0.1:8080/alfresco/api/-default-/public/alfresco/versions/1/nodes/fake-node-id/renditions');
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeRedition)
        });
    });

    it('Create redition service should call the server with the ID passed and the asked encoding', (done) => {
        service.createRendition('fake-node-id', 'pdf').subscribe((res) => {
            expect(jasmine.Ajax.requests.mostRecent().url).toBe('http://127.0.0.1:8080/alfresco/api/-default-/public/alfresco/versions/1/nodes/fake-node-id/renditions');
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: ''
        });
    });

    it('Get redition service should catch the error', (done) => {
        service.getRenditionsListByNodeId('fake-node-id').subscribe((res) => {
            }, (res) => {
                done();
            }
        );

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 403,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeRedition)
        });
    });
});
