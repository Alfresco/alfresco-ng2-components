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
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { UntypedFormGroup, UntypedFormControl, AbstractControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import {
    AppConfigService
} from '@alfresco/adf-core';
import { NodesApiService } from '../common/services/nodes-api.service';
import { ContentService } from '../common/services/content.service';

import { SharedLinksApiService } from './services/shared-links-api.service';
import { SharedLinkEntry, Node } from '@alfresco/js-api';
import { ConfirmDialogComponent } from '../dialogs/confirm.dialog';
import moment from 'moment';
import { ContentNodeShareSettings } from './content-node-share.settings';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { RenditionService } from '../common/services/rendition.service';

type DatePickerType = 'date' | 'time' | 'month' | 'datetime';

@Component({
    selector: 'adf-share-dialog',
    templateUrl: './content-node-share.dialog.html',
    styleUrls: ['./content-node-share.dialog.scss'],
    host: {class: 'adf-share-dialog'},
    encapsulation: ViewEncapsulation.None
})
export class ShareDialogComponent implements OnInit, OnDestroy {

    minDate = moment().add(1, 'd');
    sharedId: string;
    fileName: string;
    baseShareUrl: string;
    isFileShared: boolean = false;
    isDisabled: boolean = false;
    form: UntypedFormGroup = new UntypedFormGroup({
        sharedUrl: new UntypedFormControl(''),
        time: new UntypedFormControl({value: '', disabled: true})
    });
    type: DatePickerType = 'datetime';
    maxDebounceTime = 500;

    @ViewChild('slideToggleExpirationDate', {static: true})
    slideToggleExpirationDate;

    @ViewChild('dateTimePickerInput', {static: true})
    dateTimePickerInput;

    private onDestroy$ = new Subject<boolean>();

    constructor(
        private appConfigService: AppConfigService,
        private sharedLinksApiService: SharedLinksApiService,
        private dialogRef: MatDialogRef<ShareDialogComponent>,
        private dialog: MatDialog,
        private nodesApiService: NodesApiService,
        private contentService: ContentService,
        private renditionService: RenditionService,
        @Inject(MAT_DIALOG_DATA) public data: ContentNodeShareSettings
    ) {
    }

    ngOnInit() {
        this.type = this.appConfigService.get<DatePickerType>('sharedLinkDateTimePickerType', 'datetime');

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

        this.time.valueChanges
            .pipe(
                debounceTime(this.maxDebounceTime),
                takeUntil(this.onDestroy$)
            )
            .subscribe(value => this.onTimeChanged(value));
    }

    onTimeChanged(date: moment.Moment) {
        this.updateNode(date).subscribe(
            () => this.updateEntryExpiryDate(date)
        );
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
        } else {
            this.time.disable();
            this.time.setValue(null);
        }
    }

    onDatetimepickerClosed() {
        this.dateTimePickerInput.nativeElement.blur();

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

    private updateForm() {
        const {entry} = this.data.node;
        let expiryDate = null;

        if (entry && entry.properties) {
            expiryDate = entry.properties['qshare:expiryDate'];
        }

        this.form.setValue({
            sharedUrl: `${this.baseShareUrl}${this.sharedId}`,
            time: expiryDate ? moment(expiryDate).local() : null
        });

        if (expiryDate) {
            this.time.enable();
        } else {
            this.time.disable();
        }
    }

    private updateNode(date: moment.Moment): Observable<Node> {
        const expiryDate = date
            ? (this.type === 'date' ? date.endOf('day').utc().format() : date.utc().format())
            : null;

        return this.nodesApiService.updateNode(this.data.node.entry.id, {
            properties: {
                'qshare:expiryDate': expiryDate
            }
        });
    }

    private updateEntryExpiryDate(date: moment.Moment) {
        const {properties} = this.data.node.entry;

        if (properties) {
            properties['qshare:expiryDate'] = date
                ? date.local()
                : null;
        }
    }
}
