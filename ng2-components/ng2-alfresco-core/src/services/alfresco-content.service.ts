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

import { AlfrescoAuthenticationService } from './alfresco-authentication.service';
import { AlfrescoApiService } from './alfresco-api.service';

@Injectable()
export class AlfrescoContentService {

    constructor(public authService: AlfrescoAuthenticationService,
                public apiService: AlfrescoApiService) {
    }

    /**
     * Get thumbnail URL for the given document node.
     * @param document Node to get URL for.
     * @returns {string} URL address.
     */
    getDocumentThumbnailUrl(document: any): string {
        return this.apiService.getInstance().content.getDocumentThumbnailUrl(document.entry.id);
    }

    /**
     * Get content URL for the given node.
     * @param document Node to get URL for.
     * @returns {string} URL address.
     */
    getContentUrl(document: any): string {
        return this.apiService.getInstance().content.getContentUrl(document.entry.id);
    }
}
