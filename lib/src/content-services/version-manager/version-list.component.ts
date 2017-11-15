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

import { AlfrescoApiService } from '@alfresco/core';
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
    isLoading = true;

    @Input()
    id: string;

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

    private loadVersionHistory() {
        this.isLoading = true;
        this.versionsApi.listVersionHistory(this.id).then((data) => {
            this.versions = data.list.entries;
            this.isLoading = false;
        });
    }
}
