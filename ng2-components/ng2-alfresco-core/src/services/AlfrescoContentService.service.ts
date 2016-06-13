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

import { Injectable } from '@angular/core';

import { AlfrescoAuthenticationService } from './AlfrescoAuthenticationService.service';
import { AlfrescoSettingsService } from './AlfrescoSettingsService.service';

@Injectable()
export class AlfrescoContentService {

    constructor(
        private settings: AlfrescoSettingsService,
        private authService: AlfrescoAuthenticationService
    ) {
    }

    /**
     * Get thumbnail URL for the given document node.
     * @param document Node to get URL for.
     * @returns {string} URL address.
     */
    getDocumentThumbnailUrl(document: any) {
        return this.settings.getApiBaseUrl() + '/nodes/' + document.entry.id +
            '/renditions/doclib/content' + '?attachment=false&alf_ticket=' + this.authService.getToken();
    }

    /**
     * Get content URL for the given node.
     * @param document Node to get URL for.
     * @returns {string} URL address.
     */
    getContentUrl(document: any) {
        return this.settings.getApiBaseUrl() + '/nodes/' + document.entry.id +
            '/content' + '?attachment=false&alf_ticket=' + this.authService.getToken();
    }
}
