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

import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DownloadZipDialogComponent } from './download-zip.dialog';
import { zipNode, downloadEntry } from './mock/download-zip-data.mock';

@Component({
    selector: 'adf-download-zip-dialog-storybook',
    template: `<button mat-raised-button (click)="openDialog()">Open dialog</button>`
})
export class DownloadZipDialogStorybookComponent implements OnInit, OnChanges {
    @Input()
    showLoading: boolean;

    constructor(private dialog: MatDialog) {}

    ngOnInit(): void {
        this.setEntryStatus(this.showLoading);
    }

    ngOnChanges(): void {
        this.setEntryStatus(this.showLoading);
    }

    setEntryStatus(isLoading: boolean){
        if (!isLoading) {
            downloadEntry.entry.status = 'DONE';
        } else {
            downloadEntry.entry.status = 'PACKING';
        }
    }

    openDialog() {
        this.dialog.open(DownloadZipDialogComponent, {
            minWidth: '50%',
            data: {
                nodeIds: [zipNode.entry.id]
            }
        });
    }
}
