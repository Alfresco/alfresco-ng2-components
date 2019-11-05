/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DownloadEntry, NodeEntry } from '@alfresco/js-api';
import { LogService } from '../../services/log.service';
import { DownloadZipService } from '../../services/download-zip.service';

@Component({
    selector: 'adf-download-zip-dialog',
    templateUrl: './download-zip.dialog.html',
    styleUrls: ['./download-zip.dialog.scss'],
    host: { 'class': 'adf-download-zip-dialog' },
    encapsulation: ViewEncapsulation.None
})
export class DownloadZipDialogComponent implements OnInit {

    // flag for async threads
    cancelled = false;
    downloadId: string;

    constructor(private dialogRef: MatDialogRef<DownloadZipDialogComponent>,
                @Inject(MAT_DIALOG_DATA)
                public data: any,
                private logService: LogService,
                private downloadZipService: DownloadZipService) {
    }

    ngOnInit() {
        if (this.data && this.data.nodeIds && this.data.nodeIds.length > 0) {
            if (!this.cancelled) {
                this.downloadZip(this.data.nodeIds);
            } else {
                this.logService.log('Cancelled');
            }
        }
    }

    cancelDownload() {
        this.cancelled = true;
        this.downloadZipService.cancelDownload(this.downloadId);
        this.dialogRef.close(false);
    }

    downloadZip(nodeIds: string[]) {
        if (nodeIds && nodeIds.length > 0) {

            this.downloadZipService.createDownload({ nodeIds }).subscribe((data: DownloadEntry) => {
                if (data && data.entry && data.entry.id) {
                    const url = this.downloadZipService.getContentUrl(data.entry.id, true);

                    this.downloadZipService.getNode(data.entry.id).subscribe((downloadNode: NodeEntry) => {
                        this.logService.log(downloadNode);
                        const fileName = downloadNode.entry.name;
                        this.downloadId = data.entry.id;
                        this.waitAndDownload(data.entry.id, url, fileName);
                    });
                }
            });
        }
    }

    waitAndDownload(downloadId: string, url: string, fileName: string) {
        if (this.cancelled) {
            return;
        }

        this.downloadZipService.getDownload(downloadId).subscribe((downloadEntry: DownloadEntry) => {
            if (downloadEntry.entry) {
                if (downloadEntry.entry.status === 'DONE') {
                    this.download(url, fileName);
                } else {
                    setTimeout(() => {
                        this.waitAndDownload(downloadId, url, fileName);
                    }, 1000);
                }
            }
        });
    }

    download(url: string, fileName: string) {
        if (url && fileName) {
            const link = document.createElement('a');

            link.style.display = 'none';
            link.download = fileName;
            link.href = url;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        this.dialogRef.close(true);
    }
}
