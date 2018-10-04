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

import {
    Component,
    Inject,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    ElementRef,
    OnDestroy
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,  MatDialog } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { tap, skip } from 'rxjs/operators';
import {
    SharedLinksApiService,
    NodesApiService,
    ContentService
} from '@alfresco/adf-core';
import { SharedLinkEntry, MinimalNodeEntryEntity } from 'alfresco-js-api';
import { ConfirmDialogComponent } from '../dialogs/confirm.dialog';
import moment from 'moment-es6';

@Component({
    selector: 'adf-share-dialog',
    templateUrl: './content-node-share.dialog.html',
    styleUrls: ['./content-node-share.dialog.scss'],
    host: { 'class': 'adf-share-dialog' },
    encapsulation: ViewEncapsulation.None
})
export class ShareDialogComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];

    minDate = moment().add(1, 'd');
    sharedId: string;
    fileName: string;
    baseShareUrl: string;
    isFileShared: boolean = false;
    isDisabled: boolean = false;
    form: FormGroup = new FormGroup({
        'sharedUrl': new FormControl(''),
        'time': new FormControl({value: '', disabled: false})
    });

    @ViewChild('sharedLinkInput') sharedLinkInput: ElementRef;

    constructor(
        private sharedLinksApiService: SharedLinksApiService,
        private dialogRef: MatDialogRef<ShareDialogComponent>,
        private dialog: MatDialog,
        private nodesApiService: NodesApiService,
        private contentService: ContentService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit() {

        if (!this.canUpdate) {
            this.form.controls['time'].disable();
        }

        this.subscriptions.push(
            this.form.valueChanges
                .pipe(
                    skip(1),
                    tap((updates) => {
                        this.updateNode(updates);
                    })
                )
                .subscribe((updates) => this.updateEntryExpiryDate(updates))
        );

        if (this.data.node && this.data.node.entry) {
            this.fileName = this.data.node.entry.name;
            this.baseShareUrl = this.data.baseShareUrl;
            const properties = this.data.node.entry.properties;

            if (properties && !properties['qshare:sharedId']) {

                this.createSharedLinks(this.data.node.entry.id);
            } else {
                this.sharedId = properties['qshare:sharedId'];
                this.isFileShared = true;

                this.updateForm();
            }
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe);
    }

    removeShare() {
        this.deleteSharedLink(this.sharedId);
    }

    onSlideShareChange(event: any) {
        if (event.checked) {
            this.createSharedLinks(this.data.node.entry.id);
        } else {
            this.openConfirmationDialog();
        }
    }

    get canUpdate() {
        return this.contentService.hasPermission(this.data.node.entry, 'update');
    }

    private openConfirmationDialog() {
        this.isFileShared = false;

        this.dialog
            .open(ConfirmDialogComponent, {
                data: {
                    title: 'SHARE.CONFIRMATION.DIALOG-TITLE',
                    message: 'SHARE.CONFIRMATION.MESSAGE',
                    yesLabel: 'SHARE.CONFIRMATION.REMOVE',
                    noLabel: 'SHARE.CONFIRMATION.CANCEL'
                },
                minWidth: '250px',
                closeOnNavigation: true
            })
            .beforeClose().subscribe(deleteSharedLink => {
                if (deleteSharedLink) {
                    this.deleteSharedLink(this.sharedId);
                } else {
                    this.isFileShared = true;
                }
            });
    }

    private createSharedLinks(nodeId: string) {
        this.isDisabled = true;

        this.sharedLinksApiService.createSharedLinks(nodeId)
            .subscribe((sharedLink: SharedLinkEntry) => {

                if (sharedLink.entry) {
                    this.sharedId = sharedLink.entry.id;
                    this.data.node.entry.properties['qshare:sharedId'] = this.sharedId;
                    this.isDisabled = false;
                    this.isFileShared = true;

                    this.updateForm();
                }
            },
            () => {
                this.isDisabled = false;
                this.isFileShared = false;
            });
    }

    private deleteSharedLink(sharedId: string) {
        this.isDisabled = true;

        this.sharedLinksApiService.deleteSharedLink(sharedId).subscribe(() => {
                this.data.node.entry.properties['qshare:sharedId'] = null;
                this.data.node.entry.properties['qshare:expiryDate'] = null;
                this.dialogRef.close(false);
            },
            () => {
                this.isDisabled = false;
                this.isFileShared = false;
            });
    }

    private updateForm() {
        const { entry } = this.data.node;
        const expiryDate = entry.properties['qshare:expiryDate'];

        this.form.setValue({
            'sharedUrl': `${this.baseShareUrl}${this.sharedId}`,
            'time': expiryDate ? expiryDate : null
        });
    }

    private updateNode(updates): Observable<MinimalNodeEntryEntity> {
        return this.nodesApiService.updateNode(
            this.data.node.entry.id,
            {
                properties: {
                    'qshare:expiryDate': updates.time ? updates.time.utc().format() : null
                }
            }
        );
    }

    private updateEntryExpiryDate(updates) {
        const { properties } = this.data.node.entry;

        properties['qshare:expiryDate'] = updates.time
            ? updates.time.local()
            : null;
    }
}
