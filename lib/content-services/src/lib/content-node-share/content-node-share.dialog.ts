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

import {
    Component,
    Inject,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    OnDestroy
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { UntypedFormGroup, UntypedFormControl, AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { ContentService } from '../common/services/content.service';

import { SharedLinksApiService } from './services/shared-links-api.service';
import { SharedLinkBodyCreate, SharedLinkEntry } from '@alfresco/js-api';
import { ConfirmDialogComponent } from '../dialogs/confirm.dialog';
import { ContentNodeShareSettings } from './content-node-share.settings';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { RenditionService } from '../common/services/rendition.service';
import { format, add, endOfDay } from 'date-fns';

type DatePickerType = 'date' | 'time' | 'month' | 'datetime';

@Component({
    selector: 'adf-share-dialog',
    templateUrl: './content-node-share.dialog.html',
    styleUrls: ['./content-node-share.dialog.scss'],
    host: {class: 'adf-share-dialog'},
    encapsulation: ViewEncapsulation.None
})
export class ShareDialogComponent implements OnInit, OnDestroy {

    minDate = add(new Date(), { days: 1 });
    sharedId: string;
    fileName: string;
    baseShareUrl: string;
    isFileShared = false;
    isDisabled = false;
    isLinkWithExpiryDate = false;
    form: UntypedFormGroup = new UntypedFormGroup({
        sharedUrl: new UntypedFormControl(''),
        time: new UntypedFormControl({value: '', disabled: true})
    });
    type: DatePickerType = 'date';
    maxDebounceTime = 500;
    isExpiryDateToggleChecked: boolean;

    @ViewChild('slideToggleExpirationDate', {static: true})
    slideToggleExpirationDate;

    @ViewChild('datePickerInput', {static: true})
    datePickerInput;

    private onDestroy$ = new Subject<boolean>();

    constructor(
        private sharedLinksApiService: SharedLinksApiService,
        private dialogRef: MatDialogRef<ShareDialogComponent>,
        private dialog: MatDialog,
        private contentService: ContentService,
        private renditionService: RenditionService,
        @Inject(MAT_DIALOG_DATA) public data: ContentNodeShareSettings
    ) {
    }

    ngOnInit() {
        if (this.data.node && this.data.node.entry) {
            this.fileName = this.data.node.entry.name;
            this.baseShareUrl = this.data.baseShareUrl;

            const properties = this.data.node.entry.properties;

            if (!properties || !properties['qshare:sharedId']) {
                this.createSharedLinks(this.data.node.entry.id);
            } else {
                this.sharedId = properties['qshare:sharedId'];
                this.isFileShared = true;

                const expiryDate = this.updateForm();
                this.isExpiryDateToggleChecked = this.isLinkWithExpiryDate = !!expiryDate;
                this.isLinkWithExpiryDate ? this.time.enable() : this.time.disable();
            }
        }

        this.time.valueChanges
            .pipe(
                debounceTime(this.maxDebounceTime),
                takeUntil(this.onDestroy$)
            )
            .subscribe(value => this.onTimeChanged(value));
    }

    onTimeChanged(date: Date) {
        this.updateNode(date);
    }

    get time(): AbstractControl {
        return this.form.controls['time'];
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    onSlideShareChange(event: MatSlideToggleChange) {
        if (event.checked) {
            this.createSharedLinks(this.data.node.entry.id);
        } else {
            this.openConfirmationDialog();
        }
    }

    get canUpdate() {
        const {entry} = this.data.node;

        if (entry && entry.allowableOperations) {
            return this.contentService.hasAllowableOperations(entry, 'update');
        }

        return true;
    }

    onToggleExpirationDate(slideToggle: MatSlideToggleChange) {
        if (slideToggle.checked) {
            this.time.enable();
            this.isExpiryDateToggleChecked = true;
        } else {
            this.time.disable();
            this.time.setValue(null);
            this.deleteSharedLink(this.sharedId, true);
        }
    }

    onDatePickerClosed() {
        this.datePickerInput.nativeElement.blur();
        if (!this.time.value) {
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
            .beforeClosed()
            .subscribe((deleteSharedLink) => {
                if (deleteSharedLink) {
                    this.deleteSharedLink(this.sharedId);
                } else {
                    this.isFileShared = true;
                }
            });
    }

    private createSharedLinks(nodeId: string, sharedLinkWithExpirySettings?: SharedLinkBodyCreate) {
        this.isDisabled = true;

        this.sharedLinksApiService.createSharedLinks(nodeId, sharedLinkWithExpirySettings).subscribe(
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

                    // eslint-disable-next-line
                    this.renditionService.getNodeRendition(this.data.node.entry.id);

                    this.updateForm();
                }
            },
            () => {
                this.isDisabled = false;
                this.isFileShared = false;
            }
        );
    }

    deleteSharedLink(sharedId: string, dialogOpenFlag?: boolean) {
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
                        if (dialogOpenFlag) {
                            this.createSharedLinks(this.data.node.entry.id);
                            this.isExpiryDateToggleChecked = false;
                            this.isLinkWithExpiryDate = false;
                        } else {
                            this.dialogRef.close(false);
                        }
                    }
                }
            );
    }

    private handleError(error: Error) {
        let message = 'SHARE.UNSHARE_ERROR';
        let statusCode = 0;

        try {
            statusCode = JSON.parse(error.message).error.statusCode;
        } catch {
        }

        if (statusCode === 403) {
            message = 'SHARE.UNSHARE_PERMISSION_ERROR';
        }

        this.sharedLinksApiService.error.next({
            statusCode,
            message
        });
    }

    private updateForm(): Date {
        const {entry} = this.data.node;
        let expiryDate = null;

        if (entry && entry.properties) {
            expiryDate = entry.properties['qshare:expiryDate'];
        }

        this.form.setValue({
            sharedUrl: `${this.baseShareUrl}${this.sharedId}`,
            time: expiryDate ? new Date(expiryDate) : null
        }, { emitEvent: false });

        return expiryDate;
    }

    private updateNode(date: Date) {
        let expiryDate: Date | string;
        if (date) {
            if (this.type === 'date') {
                expiryDate = format(endOfDay(new Date(date)), `yyyy-MM-dd'T'HH:mm:ss.SSSxx`);
            } else {
                expiryDate = format((new Date(date)), `yyyy-MM-dd'T'HH:mm:ss.SSSxx`);
            }
        } else {
            expiryDate = null;
        }

        if (this.sharedId && expiryDate) {
                this.isDisabled = true;

                this.sharedLinksApiService.deleteSharedLink(this.sharedId).subscribe((response: any) => {
                    if (response instanceof Error) {
                        this.isDisabled = false;
                        this.isFileShared = true;
                        this.handleError(response);
                    } else {
                        this.sharedLinkWithExpirySettings(expiryDate as Date);
                        this.isLinkWithExpiryDate = true;
                        this.updateEntryExpiryDate(date);
                    }
            });
        }
    }

    private sharedLinkWithExpirySettings(expiryDate: Date) {
        const nodeObject: SharedLinkBodyCreate = {
            nodeId: this.data.node.entry.id,
            expiresAt: expiryDate as Date
        };
        this.createSharedLinks(this.data.node.entry.id, nodeObject);
    }

    private updateEntryExpiryDate(date: Date) {
        const {properties} = this.data.node.entry;

        if (properties) {
            properties['qshare:expiryDate'] = date
                ? new Date(date)
                : null;
        }
    }
}
