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

import {
    NodePaging,
    PersonEntry,
    SitePaging,
    DeletedNodesPaging,
    SearchRequest,
    DownloadEntry,
    MinimalNodeEntity,
    NodeEntry
} from 'alfresco-js-api';
import { Injectable } from '@angular/core';
import { Observable, from, of, throwError } from 'rxjs';
import { LogService } from '../../services/log.service';
import { AlfrescoApiService } from '../../services/alfresco-api.service';

@Injectable({
    providedIn: 'root'
})
export class DownloadZipService {

    constructor(private apiService: AlfrescoApiService,
                private logService: LogService) {
    }

    // createDownload(nodeIds) {
    //     const promise = this.apiService.getInstance().core.downloadsApi.createDownload({ nodeIds });

    //     promise.on('progress', progress => this.logService.log('Progress', progress));
    //     promise.on('error', error => this.logService.error('Error', error));
    //     promise.on('abort', data => this.logService.log('Abort', data));

    //     promise.on('success', (data: DownloadEntry) => {
    //         if (data && data.entry && data.entry.id) {
    //             const url = this.apiService.getInstance().content.getContentUrl(data.entry.id, true);

    //             this.apiService.getInstance().core.nodesApi.getNode(data.entry.id).then((downloadNode: MinimalNodeEntity) => {
    //                 this.logService.log(downloadNode);
    //                 const fileName = downloadNode.entry.name;
    //                 this.downloadId = data.entry.id;
    //                 this.waitAndDownload(data.entry.id, url, fileName);
    //             });
    //         }
    //     });
    // }

    getDownloadUrl(nodeId: string): string {
        return this.apiService.getInstance().content.getContentUrl(nodeId, true);
    }

    getDownloadNode(nodeId: string): Observable<NodeEntry> {
        return from(this.apiService.getInstance().core.nodesApi.getNode(nodeId));
    }
}
