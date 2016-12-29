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
import { AlfrescoSettingsService } from './AlfrescoSettings.service';
import { AlfrescoAuthenticationService } from './AlfrescoAuthentication.service';
import { AlfrescoContentService } from './AlfrescoContent.service';
import { AlfrescoApiService } from './alfresco-api.service';
import { StorageService } from './storage.service';

declare let jasmine: any;

describe('AlfrescoContentService', () => {

    let injector, contentService: AlfrescoContentService;
    let authService: AlfrescoAuthenticationService;
    let settingsService: AlfrescoSettingsService;
    let storage: StorageService;
    let node: any;

    const nodeId = 'fake-node-id';

    beforeEach(() => {
        injector = ReflectiveInjector.resolveAndCreate([
            AlfrescoApiService,
            AlfrescoContentService,
            AlfrescoAuthenticationService,
            AlfrescoSettingsService,
            StorageService
        ]);

        authService = injector.get(AlfrescoAuthenticationService);
        settingsService = injector.get(AlfrescoSettingsService);
        contentService = injector.get(AlfrescoContentService);
        storage = injector.get(StorageService);
        storage.clear();

        node = {
            entry: {
                id: nodeId
            }
        };

        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    beforeEach(() => {
        settingsService.setProviders('ECM');
    });

    it('should return a valid content URL', (done) => {
        authService.login('fake-username', 'fake-password').subscribe(() => {
            expect(contentService.getContentUrl(node)).toBe('http://localhost:8080/alfresco/api/' +
                '-default-/public/alfresco/versions/1/nodes/fake-node-id/content?attachment=false&alf_ticket=fake-post-ticket');
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 201,
            contentType: 'application/json',
            responseText: JSON.stringify({'entry': {'id': 'fake-post-ticket', 'userId': 'admin'}})
        });
    });

    it('should return a valid thumbnail URL', (done) => {
        authService.login('fake-username', 'fake-password').subscribe(() => {
            expect(contentService.getDocumentThumbnailUrl(node))
                .toBe('http://localhost:8080/alfresco/api/-default-/public/alfresco' +
                    '/versions/1/nodes/fake-node-id/renditions/doclib/content?attachment=false&alf_ticket=fake-post-ticket');
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 201,
            contentType: 'application/json',
            responseText: JSON.stringify({'entry': {'id': 'fake-post-ticket', 'userId': 'admin'}})
        });
    });
});
