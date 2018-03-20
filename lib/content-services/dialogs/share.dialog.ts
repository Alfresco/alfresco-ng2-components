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

import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SharedLinksApiService } from '@alfresco/adf-core';
import { SharedLinkEntry } from 'alfresco-js-api';

@Component({
    selector: 'adf-share-dialog',
    templateUrl: './share.dialog.html',
    styleUrls: ['./share.dialog.scss'],
    host: { 'class': 'adf-share-dialog' },
    encapsulation: ViewEncapsulation.None
})
export class ShareDialogComponent implements OnInit {

    sharedId: string;

    fileName: string;
    baseShareUrl: string;

    isFileShared: boolean = false;
    isDisabled: boolean = false;

    constructor(private sharedLinksApiService: SharedLinksApiService,
                private dialogRef: MatDialogRef<ShareDialogComponent>,
                @Inject(MAT_DIALOG_DATA)
                public data: any) {
    }

    ngOnInit() {
        if (this.data.node && this.data.node.entry) {
            this.fileName = this.data.node.entry.name;
            this.baseShareUrl = this.data.baseShareUrl;

            if (this.data.node.entry.properties && this.data.node.entry.properties['qshare:sharedId']) {
                this.sharedId = this.data.node.entry.properties['qshare:sharedId'];
                this.isFileShared = true;
            } else {
                this.createSharedLinks(this.data.node.entry.id);
            }
        }
    }

    cancelShare() {
        this.dialogRef.close(false);
    }

    onSlideShareChange(event: any) {
        this.isDisabled = true;
        if (event.checked) {
            this.createSharedLinks(this.data.node.entry.id);
        } else {
            this.deleteSharedLink(this.sharedId);
        }
    }

    createSharedLinks(nodeId: string) {
        this.sharedLinksApiService.createSharedLinks(nodeId).subscribe((sharedLink: SharedLinkEntry) => {
                if (sharedLink.entry) {
                    this.sharedId = sharedLink.entry.id;
                    this.isFileShared = true;
                    this.isDisabled = false;
                }
            },
            () => {
                this.isFileShared = false;
                this.isDisabled = false;
            });
    }

    deleteSharedLink(sharedId: string) {
        this.sharedLinksApiService.deleteSharedLink(sharedId).subscribe(() => {
                this.isFileShared = false;
                this.isDisabled = false;
            },
            () => {
                this.isFileShared = true;
                this.isDisabled = false;
            });
    }
}
