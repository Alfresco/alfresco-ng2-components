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

import { Directive, Input, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MinimalNodeEntity } from 'alfresco-js-api';
import { AlfrescoApiService } from '@alfresco/adf-core';

import { DownloadZipDialogComponent } from '../dialogs/download-zip.dialog';

@Directive({
    selector: '[adfNodeDownload]'
})
export class NodeDownloadDirective {

    /** Nodes to download. */
    // tslint:disable-next-line:no-input-rename
    @Input('adfNodeDownload')
    nodes: MinimalNodeEntity[];

    @HostListener('click')
    onClick() {
        this.downloadNodes(this.nodes);
    }

    constructor(
        private apiService: AlfrescoApiService,
        private dialog: MatDialog) {
    }

    /**
     * Downloads multiple selected nodes.
     * Packs result into a .ZIP archive if there is more than one node selected.
     * @param selection Multiple selected nodes to download
     */
    downloadNodes(selection: Array<MinimalNodeEntity>) {
        if (!selection || selection.length === 0) {
            return;
        }

        if (selection.length === 1) {
            this.downloadNode(selection[0]);
        } else {
            this.downloadZip(selection);
        }
    }

    /**
     * Downloads a single node.
     * Packs result into a .ZIP archive is the node is a Folder.
     * @param node Node to download
     */
    downloadNode(node: MinimalNodeEntity) {
        if (node && node.entry) {
            const entry = node.entry;

            if (entry.isFile) {
                this.downloadFile(node);
            }

            if (entry.isFolder) {
                this.downloadZip([node]);
            }

            // Check if there's nodeId for Shared Files
            if (!entry.isFile && !entry.isFolder && (<any> entry).nodeId) {
                this.downloadFile(node);
            }
        }
    }

    private downloadFile(node: MinimalNodeEntity) {
        if (node && node.entry) {
            const contentApi = this.apiService.getInstance().content;
            // nodeId for Shared node
            const id = (<any> node.entry).nodeId || node.entry.id;

            const url = contentApi.getContentUrl(id, true);
            const fileName = node.entry.name;

            this.download(url, fileName);
        }
    }

    private downloadZip(selection: Array<MinimalNodeEntity>) {
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

    private download(url: string, fileName: string) {
        if (url && fileName) {
            const link = document.createElement('a');

            link.style.display = 'none';
            link.download = fileName;
            link.href = url;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
