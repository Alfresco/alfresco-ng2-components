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

import { DownloadEntry } from '@alfresco/js-api';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DownloadZipDialogComponent } from './download-zip.dialog';

@Component({
    template: `<button (click)="openDialog()">Open dialog</button>`
})
export class DownloadZipDialogStorybookComponent implements OnInit {
    @Input()
    showLoading: boolean;

    constructor(private dialog: MatDialog) {}

    zipNode = {
        entry: {
            name: 'files.zip',
            contentUrl: './../assets/files.zip',
            id: 'files_in_zip'
        }
    };

    downloadEntry: DownloadEntry = {
        entry: {
            id: 'entryId',
            status: 'DONE'
        }
    };

    ngOnInit(): void {
        if (!this.showLoading) {
            this.downloadEntry.entry.status = 'DONE';
        } else {
            this.downloadEntry.entry.status = 'PACKING';
        }
    }

    openDialog() {
        this.dialog.open(DownloadZipDialogComponent, {
            minWidth: '50%',
            data: {
                nodeIds: [this.zipNode.entry.id]
            }
        });
    }
}
