/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ConfirmDialogComponent } from '@alfresco/adf-core';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { Component, DestroyRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ContentApi, ContentPagingQuery, Node, NodeEntry, NodesApi, VersionEntry, VersionsApi } from '@alfresco/js-api';
import { MatDialog } from '@angular/material/dialog';
import { ContentVersionService } from './content-version.service';
import { ContentService } from '../common';
import { InfiniteScrollDatasource } from '../infinite-scroll-datasource';
import { from, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { VersionCompatibilityDirective } from '../version-compatibility';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export class VersionListDataSource extends InfiniteScrollDatasource<VersionEntry> {
    constructor(private versionsApi: VersionsApi, private node: Node) {
        super();
    }

    getNextBatch(pagingOptions: ContentPagingQuery): Observable<VersionEntry[]> {
        return from(this.versionsApi.listVersionHistory(this.node.id, pagingOptions)).pipe(
            take(1),
            map((versionPaging) => versionPaging.list.entries)
        );
    }
}

@Component({
    selector: 'adf-version-list',
    standalone: true,
    imports: [
        CommonModule,
        MatProgressBarModule,
        MatListModule,
        CdkVirtualScrollViewport,
        CdkFixedSizeVirtualScroll,
        CdkVirtualForOf,
        MatIconModule,
        MatMenuModule,
        TranslatePipe,
        MatButtonModule,
        VersionCompatibilityDirective
    ],
    templateUrl: './version-list.component.html',
    styleUrls: ['./version-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-version-list' }
})
export class VersionListComponent implements OnChanges, OnInit {
    private _contentApi: ContentApi;
    get contentApi(): ContentApi {
        this._contentApi = this._contentApi ?? new ContentApi(this.alfrescoApi.getInstance());
        return this._contentApi;
    }

    private _versionsApi: VersionsApi;
    get versionsApi(): VersionsApi {
        this._versionsApi = this._versionsApi ?? new VersionsApi(this.alfrescoApi.getInstance());
        return this._versionsApi;
    }

    private _nodesApi: NodesApi;
    get nodesApi(): NodesApi {
        this._nodesApi = this._nodesApi ?? new NodesApi(this.alfrescoApi.getInstance());
        return this._nodesApi;
    }

    versionsDataSource: VersionListDataSource;
    latestVersion: VersionEntry;
    isLoading = true;

    /** The target node. */
    @Input()
    node: Node;

    /** Toggles showing/hiding of comments */
    @Input()
    showComments = true;

    /** Enable/disable downloading a version of the current node. */
    @Input()
    allowDownload = true;

    /** Enable/disable viewing a version of the current node. */
    @Input()
    allowViewVersions = true;

    /** Toggles showing/hiding of version actions */
    @Input()
    showActions = true;

    /** Enable/disable deletion of version */
    @Input()
    allowVersionDelete = true;

    /** Emitted when a version is restored */
    @Output()
    restored = new EventEmitter<Node>();

    /** Emitted when a version is deleted */
    @Output()
    deleted = new EventEmitter<Node>();

    /** Emitted when viewing a version */
    @Output()
    viewVersion = new EventEmitter<string>();

    @ViewChild('viewport')
    viewport: CdkVirtualScrollViewport;

    private readonly destroyRef = inject(DestroyRef);

    constructor(
        private alfrescoApi: AlfrescoApiService,
        private contentService: ContentService,
        private contentVersionService: ContentVersionService,
        private dialog: MatDialog
    ) {}

    ngOnInit() {
        this.versionsDataSource = new VersionListDataSource(this.versionsApi, this.node);
        this.versionsDataSource.isLoading.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((isLoading) => {
            this.isLoading = isLoading;
            this.latestVersion = this.versionsDataSource.firstItem;
        });
    }

    ngOnChanges() {
        if (this.versionsDataSource) {
            this.loadVersionHistory();
        }
    }

    canUpdate(): boolean {
        return this.contentService.hasAllowableOperations(this.node, 'update') && this.versionsDataSource.itemsCount > 1;
    }

    canDelete(): boolean {
        return this.contentService.hasAllowableOperations(this.node, 'delete') && this.versionsDataSource.itemsCount > 1;
    }

    restore(versionId: string) {
        if (this.canUpdate()) {
            this.versionsApi
                .revertVersion(this.node.id, versionId, { majorVersion: true, comment: '' })
                .then(() => this.nodesApi.getNode(this.node.id, { include: ['permissions', 'path', 'isFavorite', 'allowableOperations'] }))
                .then((node) => this.onVersionRestored(node));
        }
    }

    onViewVersion(versionId: string) {
        this.viewVersion.emit(versionId);
    }

    loadVersionHistory() {
        this.viewport.scrollToIndex(0);
        this.versionsDataSource.reset();
    }

    downloadVersion(versionId: string) {
        if (this.allowDownload) {
            this.contentVersionService
                .getVersionContentUrl(this.node.id, versionId, true)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((versionDownloadUrl) => this.downloadContent(versionDownloadUrl));
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

            dialogRef
                .afterClosed()
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((result) => {
                    if (result) {
                        this.versionsApi.deleteVersion(this.node.id, versionId).then(() => this.onVersionDeleted(this.node));
                    }
                });
        }
    }

    onVersionDeleted(node: any) {
        this.loadVersionHistory();
        this.deleted.emit(node);
    }

    onVersionRestored(node: NodeEntry) {
        this.loadVersionHistory();
        this.restored.emit(node?.entry);
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
