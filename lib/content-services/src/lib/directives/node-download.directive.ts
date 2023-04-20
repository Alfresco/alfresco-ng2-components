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

import { Directive, Input, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlfrescoApiService, DownloadService } from '@alfresco/adf-core';
import { DownloadZipDialogComponent } from '../dialogs/download-zip/download-zip.dialog';
import { ContentApi, NodeEntry, VersionEntry } from '@alfresco/js-api';

/**
 * Directive selectors without adf- prefix will be deprecated on 3.0.0
 */
@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[adfNodeDownload]'
})
export class NodeDownloadDirective {

    _contentApi: ContentApi;
    get contentApi(): ContentApi {
        this._contentApi = this._contentApi ?? new ContentApi(this.apiService.getInstance());
        return this._contentApi;
    }

    /** Nodes to download. */
    @Input('adfNodeDownload')
    nodes: NodeEntry | NodeEntry[];

    /** Node's version to download. */
    @Input()
    version: VersionEntry;

    @HostListener('click')
    onClick() {
        this.downloadNodes(this.nodes);
    }

    constructor(
        private apiService: AlfrescoApiService,
        private downloadService: DownloadService,
        private dialog: MatDialog) {
    }

    /**
     * Downloads multiple selected nodes.
     * Packs result into a .ZIP archive if there is more than one node selected.
     *
     * @param selection Multiple selected nodes to download
     */
    downloadNodes(selection: NodeEntry | Array<NodeEntry>) {

        if (!this.isSelectionValid(selection)) {
            return;
        }
        if (selection instanceof Array) {
            if (selection.length === 1) {
                this.downloadNode(selection[0]);
            } else {
                this.downloadZip(selection);
            }
        } else {
            this.downloadNode(selection);
        }
    }

    /**
     * Downloads a single node.
     * Packs result into a .ZIP archive is the node is a Folder.
     *
     * @param node Node to download
     */
    downloadNode(node: NodeEntry) {
        if (node && node.entry) {
            const entry = node.entry;

            if (entry.isFile) {
                this.downloadFile(node);
            }

            if (entry.isFolder) {
                this.downloadZip([node]);
            }

            // Check if there's nodeId for Shared Files
            if (!entry.isFile && !entry.isFolder && (entry as any).nodeId) {
                this.downloadFile(node);
            }
        }
    }

    private isSelectionValid(selection: NodeEntry | Array<NodeEntry>) {
        return selection || (selection instanceof Array && selection.length > 0);
    }

    private downloadFile(node: NodeEntry) {
        if (node && node.entry) {
            // nodeId for Shared node
            const id = (node.entry as any).nodeId || node.entry.id;

            let url;
            let fileName;
            if (this.version) {
                url = this.contentApi.getVersionContentUrl(id, this.version.entry.id, true);
                fileName = this.version.entry.name;
            } else {
                url = this.contentApi.getContentUrl(id, true);
                fileName = node.entry.name;
            }

            this.downloadService.downloadUrl(url, fileName);
        }
    }

    private downloadZip(selection: Array<NodeEntry>) {
        if (selection && selection.length > 0) {
            // nodeId for Shared node
            const nodeIds = selection.map((node: any) => (node.entry.nodeId || node.entry.id));

            this.dialog.open(DownloadZipDialogComponent, {
                width: '600px',
                disableClose: true,
                data: {
                    nodeIds
                }
            });
        }
    }
}
