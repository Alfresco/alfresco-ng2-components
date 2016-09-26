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

import {ReflectiveInjector} from '@angular/core';
import {AlfrescoSettingsService} from './AlfrescoSettings.service';
import {AlfrescoAuthenticationService} from './AlfrescoAuthentication.service';
import {AlfrescoContentService} from './AlfrescoContent.service';
import { AlfrescoApiService } from './AlfrescoApi.service';

describe('AlfrescoContentService', () => {

    let injector, contentService: AlfrescoContentService, authService: AlfrescoAuthenticationService, node;

    const nodeId = 'fake-node-id';

    beforeEach(() => {
        injector = ReflectiveInjector.resolveAndCreate([
            AlfrescoApiService,
            AlfrescoContentService,
            AlfrescoAuthenticationService,
            AlfrescoSettingsService
        ]);
        spyOn(localStorage, 'getItem').and.callFake(function (key) {
            return 'myTicket';
        });

        contentService = injector.get(AlfrescoContentService);
        authService = injector.get(AlfrescoAuthenticationService);
        authService.login('fake-username', 'fake-password');

        node = {
            entry: {
                id: nodeId
            }
        };
    });

    it('should return a valid content URL', () => {
        expect(contentService.getContentUrl(node)).toBe('http://localhost:8080/alfresco/api/' +
            '-default-/public/alfresco/versions/1/nodes/fake-node-id/content?attachment=false&alf_ticket=myTicket');
    });

    it('should return a valid thumbnail URL', () => {
        expect(contentService.getDocumentThumbnailUrl(node))
            .toBe('http://localhost:8080/alfresco/api/-default-/public/alfresco' +
                '/versions/1/nodes/fake-node-id/renditions/doclib/content?attachment=false&alf_ticket=myTicket');
    });
});
