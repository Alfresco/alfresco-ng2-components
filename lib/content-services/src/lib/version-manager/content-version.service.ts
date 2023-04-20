/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { AlfrescoApiService } from '@alfresco/adf-core';
import { ContentApi } from '@alfresco/js-api';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ContentVersionService {
    private _contentApi: ContentApi;

    get contentApi(): ContentApi {
        if (!this._contentApi) {
            this._contentApi = new ContentApi(this.alfrescoApi.getInstance());
        }
        return this._contentApi;
    }

    constructor(private alfrescoApi: AlfrescoApiService) {}

    /**
     * Get content URL for the given nodeId and specific version.
     *
     * @param nodeId The ID of the node
     * @param versionId The ID of the version
     * @param attachment Retrieve content as an attachment for download
     * @returns The URL address pointing to the content.
     */
    getVersionContentUrl(nodeId: string, versionId: string, attachment?: boolean): Observable<string> {
        let nodeDownloadUrl = this.contentApi.getContentUrl(nodeId, attachment);
        nodeDownloadUrl = nodeDownloadUrl.replace('/content', '/versions/' + versionId + '/content');

        return of(nodeDownloadUrl);
    }
}
