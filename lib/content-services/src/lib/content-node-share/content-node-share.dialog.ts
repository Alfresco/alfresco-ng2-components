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

import {
    Component,
    Inject,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    OnDestroy
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatSlideToggleChange } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, throwError, Subject } from 'rxjs';
import {
    skip,
    distinctUntilChanged,
    mergeMap,
    catchError,
    takeUntil
} from 'rxjs/operators';
import {
    SharedLinksApiService,
    NodesApiService,
    ContentService,
    RenditionsService,
    AppConfigService
} from '@alfresco/adf-core';
import { SharedLinkEntry, Node } from '@alfresco/js-api';
import { ConfirmDialogComponent } from '../dialogs/confirm.dialog';
import moment from 'moment-es6';
import { ContentNodeShareSettings } from './content-node-share.settings';

@Component({
    selector: 'adf-share-dialog',
    templateUrl: './content-node-share.dialog.html',
    styleUrls: ['./content-node-share.dialog.scss'],
    host: { class: 'adf-share-dialog' },
    encapsulation: ViewEncapsulation.None
})
export class ShareDialogComponent implements OnInit, OnDestroy {

    minDate = moment().add(1, 'd');
    sharedId: string;
    fileName: string;
    baseShareUrl: string;
    isFileShared: boolean = false;
    isDisabled: boolean = false;
    form: FormGroup = new FormGroup({
        sharedUrl: new FormControl(''),
        time: new FormControl({ value: '', disabled: true })
    });
    type = 'datetime';

    @ViewChild('matDatetimepickerToggle')
    matDatetimepickerToggle;

    @ViewChild('slideToggleExpirationDate')
    slideToggleExpirationDate;

    @ViewChild('dateTimePickerInput')
    dateTimePickerInput;

    private onDestroy$ = new Subject<boolean>();

    constructor(
        private appConfigService: AppConfigService,
        private sharedLinksApiService: SharedLinksApiService,
        private dialogRef: MatDialogRef<ShareDialogComponent>,
        private dialog: MatDialog,
        private nodesApiService: NodesApiService,
        private contentService: ContentService,
        private renditionService: RenditionsService,
        @Inject(MAT_DIALOG_DATA) public data: ContentNodeShareSettings
    ) {}

    ngOnInit() {
        this.type = this.appConfigService.get<string>('sharedLinkDateTimePickerType', 'datetime');

        if (!this.canUpdate) {
           this.form.controls['time'].disable();
        }

        this.form.controls.time.valueChanges
            .pipe(
                skip(1),
                distinctUntilChanged(),
                mergeMap(
                    (updates) => this.updateNode(updates),
                    (formUpdates) => formUpdates
                ),
                catchError((error) => {
                    return throwError(error);
                }),
                takeUntil(this.onDestroy$)
            )
            .subscribe(updates => this.updateEntryExpiryDate(updates));

        if (this.data.node && this.data.node.entry) {
            this.fileName = this.data.node.entry.name;
            this.baseShareUrl = this.data.baseShareUrl;
            const properties = this.data.node.entry.properties;

            if (!properties || !properties['qshare:sharedId']) {
                this.createSharedLinks(this.data.node.entry.id);
            } else {
                this.sharedId = properties['qshare:sharedId'];
                this.isFileShared = true;

                this.updateForm();
            }
        }
    }

    ngAfterViewInit() {
        if (this.slideToggleExpirationDate.checked === true) {
            this.form.controls['time'].enable();
        }
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
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
        const { entry } = this.data.node;

        if (entry && entry.allowableOperations) {
            return this.contentService.hasAllowableOperations(entry, 'update');
        }

        return true;
    }

    onToggleExpirationDate(slideToggle: MatSlideToggleChange) {
        if (slideToggle.checked) {
            this.form.controls['time'].enable();
        } else {
            this.form.controls['time'].disable();
        }
    }

    onDatetimepickerClosed() {
        this.dateTimePickerInput.nativeElement.blur();

        if (!this.form.controls.time.value) {
            this.slideToggleExpirationDate.checked = false;
        }
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
            .beforeClose()
            .subscribe((deleteSharedLink) => {
                if (deleteSharedLink) {
                    this.deleteSharedLink(this.sharedId);
                } else {
                    this.isFileShared = true;
                }
            });
    }

    private createSharedLinks(nodeId: string) {
        this.isDisabled = true;

        this.sharedLinksApiService.createSharedLinks(nodeId).subscribe(
            (sharedLink: SharedLinkEntry) => {
                if (sharedLink.entry) {
                    this.sharedId = sharedLink.entry.id;
                    if (this.data.node.entry.properties) {
                        this.data.node.entry.properties['qshare:sharedId'] = this.sharedId;
                    } else {
                        this.data.node.entry.properties = {
                            'qshare:sharedId': this.sharedId
                        };
                    }
                    this.isDisabled = false;
                    this.isFileShared = true;
                    this.renditionService
                        .generateRenditionForNode(this.data.node.entry.id)
                        .subscribe(() => {});

                    this.updateForm();
                }
            },
            () => {
                this.isDisabled = false;
                this.isFileShared = false;
            }
        );
    }

    deleteSharedLink(sharedId: string) {
        this.isDisabled = true;

        this.sharedLinksApiService
            .deleteSharedLink(sharedId)
            .subscribe((response: any) => {
                if (response instanceof Error) {
                    this.isDisabled = false;
                    this.isFileShared = true;
                    this.handleError(response);
                } else {
                    if (this.data.node.entry.properties) {
                        this.data.node.entry.properties['qshare:sharedId'] = null;
                        this.data.node.entry.properties['qshare:expiryDate'] = null;
                    }
                    this.dialogRef.close(false);
                }
            }
        );
    }

    private handleError(error: Error) {
        let message = 'SHARE.UNSHARE_ERROR';
        let statusCode = 0;

        try {
            statusCode = JSON.parse(error.message).error.statusCode;
        } catch {}

        if (statusCode === 403) {
            message = 'SHARE.UNSHARE_PERMISSION_ERROR';
        }

        this.sharedLinksApiService.error.next({
            statusCode,
            message
        });
    }

    private updateForm() {
        const { entry } = this.data.node;
        let expiryDate = null;

        if (entry && entry.properties) {
            expiryDate = entry.properties['qshare:expiryDate'];
        }

        this.form.setValue({
            sharedUrl: `${this.baseShareUrl}${this.sharedId}`,
            time: expiryDate ? moment(expiryDate).local() : null
        });
    }

    private updateNode(date: moment.Moment): Observable<Node> {
        return this.nodesApiService.updateNode(this.data.node.entry.id, {
            properties: {
                'qshare:expiryDate': date ?
                    (this.type === 'date' ? date.endOf('day').utc().format() : date.utc().format()) :
                    null
            }
        });
    }

    private updateEntryExpiryDate(date: moment.Moment) {
        const { properties } = this.data.node.entry;

        if (properties) {
            properties['qshare:expiryDate'] = date
                ? date.local()
                : null;
        }
    }
}
