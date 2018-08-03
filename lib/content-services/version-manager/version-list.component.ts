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

import { AlfrescoApiService, ContentService } from '@alfresco/adf-core';
import { Component, Input, OnChanges, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { VersionsApi, MinimalNodeEntryEntity, VersionEntry } from 'alfresco-js-api';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../dialogs/confirm.dialog';

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
    versions: VersionEntry[] = [];
    isLoading = true;

    /** @deprecated in 2.3.0 */
    @Input()
    id: string;

    /** The target node. */
    @Input()
    node: MinimalNodeEntryEntity;

    /** Toggles showing/hiding of comments */
    @Input()
    showComments = true;

    /** Enable/disable downloading a version of the current node. */
    @Input()
    allowDownload = true;

    /** Toggles showing/hiding of version actions */
    @Input()
    showActions = true;

    /** Emitted when a version is restored */
    @Output()
    restored: EventEmitter<MinimalNodeEntryEntity> = new EventEmitter<MinimalNodeEntryEntity>();

    /** Emitted when a version is deleted */
    @Output()
    deleted: EventEmitter<MinimalNodeEntryEntity> = new EventEmitter<MinimalNodeEntryEntity>();

    constructor(private alfrescoApi: AlfrescoApiService,
                private contentService: ContentService,
                private dialog: MatDialog) {
        this.versionsApi = this.alfrescoApi.versionsApi;
    }

    ngOnChanges() {
        this.loadVersionHistory();
    }

    canUpdate(): boolean {
        return this.contentService.hasPermission(this.node, 'update') && this.versions.length > 1;
    }

    canDelete(): boolean {
        return this.contentService.hasPermission(this.node, 'delete') && this.versions.length > 1;
    }

    restore(versionId) {
        if (this.canUpdate()) {
            this.versionsApi
                .revertVersion(this.node.id, versionId, { majorVersion: true, comment: '' })
                .then(() => this.onVersionRestored(this.node));
        }
    }

    loadVersionHistory() {
        this.isLoading = true;
        this.versionsApi.listVersionHistory(this.node.id).then((data) => {
            this.versions = data.list.entries;
            this.isLoading = false;
        });
    }

    downloadVersion(versionId: string) {
        if (this.allowDownload) {
            const versionDownloadUrl = this.getVersionContentUrl(this.node.id, versionId, true);
            this.downloadContent(versionDownloadUrl);
        }
    }

    deleteVersion(versionId: string) {
        if (this.canUpdate()) {
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    title: 'ADF_VERSION_LIST.CONFIRM_DELETE.TITLE',
                    message: 'ADF_VERSION_LIST.CONFIRM_DELETE.MESSAGE',
                    yesLabel: 'ADF_VERSION_LIST.CONFIRM_DELETE.YES_LABEL',
                    noLabel: 'ADF_VERSION_LIST.CONFIRM_DELETE.NO_LABEL'
                },
                minWidth: '250px'
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result === true) {
                    this.alfrescoApi.versionsApi
                        .deleteVersion(this.node.id, versionId)
                        .then(() => this.onVersionDeleted(this.node));
                }
            });
        }
    }

    onVersionDeleted(node: any) {
        this.loadVersionHistory();
        this.deleted.emit(node);
    }

    onVersionRestored(node: any) {
        this.loadVersionHistory();
        this.restored.emit(node);
    }

    private getVersionContentUrl(nodeId: string, versionId: string, attachment?: boolean) {
        const nodeDownloadUrl = this.alfrescoApi.contentApi.getContentUrl(nodeId, attachment);
        return nodeDownloadUrl.replace('/content', '/versions/' + versionId + '/content');
    }

    downloadContent(url: string) {
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
