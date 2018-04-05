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

import { AlfrescoApiService } from '@alfresco/adf-core';
import { Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { VersionsApi } from 'alfresco-js-api';

@Component({
    selector: 'adf-version-list',
    templateUrl: './version-list.component.html',
    styleUrls: ['./version-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'adf-version-list'
    }
})
export class VersionListComponent implements OnChanges {

    private versionsApi: VersionsApi;
    versions: any = [];
    isLoading: boolean = true;

    /** ID of the node whose version history you want to display. */
    @Input()
    id: string;

    @Input()
    showComments: boolean = true;

    /** Enable/disable possibility to download a version of the current node. */
    @Input()
    enableDownload: boolean = true;

    constructor(private alfrescoApi: AlfrescoApiService) {
        this.versionsApi = this.alfrescoApi.versionsApi;
    }

    ngOnChanges() {
        this.loadVersionHistory();
    }

    restore(versionId) {
        this.versionsApi
            .revertVersion(this.id, versionId, { majorVersion: true, comment: ''})
            .then(this.loadVersionHistory.bind(this));
    }

    loadVersionHistory() {
        this.isLoading = true;
        this.versionsApi.listVersionHistory(this.id).then((data) => {
            this.versions = data.list.entries;
            this.isLoading = false;
        });
    }

    downloadVersion(versionId) {
        if (this.enableDownload) {
            const versionDownloadUrl = this.getVersionContentUrl(this.id, versionId, true);
            this.downloadContent(versionDownloadUrl);
        }
    }

    private getVersionContentUrl(nodeId: string, versionId: string, attachment?: boolean) {
        const nodeDownloadUrl = this.alfrescoApi.contentApi.getContentUrl(nodeId, attachment);
        return nodeDownloadUrl.replace('/content', '/versions/' + versionId + '/content');
    }

    private downloadContent(url: string) {
        if (url) {
            const link = document.createElement('a');

            link.style.display = 'none';
            link.href = url;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
