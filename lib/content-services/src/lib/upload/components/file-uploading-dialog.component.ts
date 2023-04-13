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

import { UserPreferencesService } from '@alfresco/adf-core';
import { ChangeDetectorRef, Component, Input, Output, EventEmitter, OnDestroy, OnInit, ViewChild, HostBinding, ElementRef, ViewEncapsulation } from '@angular/core';
import { Subscription, merge, Subject } from 'rxjs';
import { FileUploadingListComponent } from './file-uploading-list.component';
import { Direction } from '@angular/cdk/bidi';
import { takeUntil, delay } from 'rxjs/operators';
import { UploadService } from '../../common/services/upload.service';
import { FileModel, FileUploadStatus } from '../../common/models/file.model';
import { FileUploadDeleteEvent, FileUploadCompleteEvent } from '../../common/events/file.event';

@Component({
    selector: 'adf-file-uploading-dialog',
    templateUrl: './file-uploading-dialog.component.html',
    styleUrls: ['./file-uploading-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FileUploadingDialogComponent implements OnInit, OnDestroy {
    /** Dialog direction. Can be 'ltr' or 'rtl. */
    private direction: Direction = 'ltr';
    private onDestroy$ = new Subject<boolean>();

    @ViewChild('uploadList')
    uploadList: FileUploadingListComponent;

    /** Dialog position. Can be 'left' or 'right'. */
    @Input()
    position: string = 'right';

    /** Makes the dialog always visible even when there are no uploads. */
    @Input()
    alwaysVisible: boolean = false;

    /** Emitted when a file in the list has an error. */
    @Output()
    error: EventEmitter<any> = new EventEmitter();

    @HostBinding('attr.adfUploadDialogRight')
    public get isPositionRight(): boolean {
        return (this.direction === 'ltr' && this.position === 'right')
            || (this.direction === 'rtl' && this.position === 'left')
            || null;
    }
    @HostBinding('attr.adfUploadDialogLeft')
    public get isPositionLeft(): boolean {
        return (this.direction === 'ltr' && this.position === 'left')
            || (this.direction === 'rtl' && this.position === 'right')
            || null;
    }

    filesUploadingList: FileModel[] = [];
    isDialogActive: boolean = false;
    totalCompleted: number = 0;
    totalErrors: number = 0;
    isDialogMinimized: boolean = false;
    isConfirmation: boolean = false;

    private listSubscription: Subscription;
    private counterSubscription: Subscription;
    private fileUploadSubscription: Subscription;
    private errorSubscription: Subscription;
    private dialogActive = new Subject<boolean>();

    constructor(
        private uploadService: UploadService,
        private changeDetector: ChangeDetectorRef,
        private userPreferencesService: UserPreferencesService,
        private elementRef: ElementRef) {
    }

    ngOnInit() {
        this.dialogActive
            .pipe(
                delay(100),
                takeUntil(this.onDestroy$)
            )
            .subscribe(() => {
                const element: any = this.elementRef.nativeElement.querySelector('#upload-dialog');
                if (element) {
                    element.focus();
                }
            });

        this.listSubscription = this.uploadService.queueChanged
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(fileList => {
                this.filesUploadingList = fileList;

                if (this.filesUploadingList.length && !this.isDialogActive) {
                    this.isDialogActive = true;
                    this.dialogActive.next();
                } else {
                    this.dialogActive.next();
                }
            });

        this.counterSubscription = merge(
            this.uploadService.fileUploadComplete,
            this.uploadService.fileUploadDeleted
        )
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((event: FileUploadCompleteEvent | FileUploadDeleteEvent) => {
                this.totalCompleted = event.totalComplete;
                this.changeDetector.detectChanges();
            });

        this.errorSubscription = this.uploadService.fileUploadError
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(event => {
                this.totalErrors = event.totalError;
                this.changeDetector.detectChanges();
            });

        this.fileUploadSubscription = this.uploadService.fileUpload
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(() => {
                this.changeDetector.detectChanges();
            });

        this.uploadService.fileDeleted
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(objId => {
                if (this.filesUploadingList) {
                    const uploadedFile = this.filesUploadingList.find((file) => file.data ? file.data.entry.id === objId : false);
                    if (uploadedFile) {
                        uploadedFile.status = FileUploadStatus.Cancelled;
                        this.changeDetector.detectChanges();
                    }
                }
            });

        this.userPreferencesService.select('textOrientation')
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((textOrientation: Direction) => {
                this.direction = textOrientation;
            });
    }

    /**
     * Toggle confirmation message.
     */
    toggleConfirmation() {
        this.isConfirmation = !this.isConfirmation;

        if (!this.isConfirmation) {
            this.dialogActive.next();
        }

        if (this.isDialogMinimized) {
            this.isDialogMinimized = false;
        }
    }

    /**
     * Cancel uploads and hide confirmation
     */
    cancelAllUploads() {
        this.toggleConfirmation();
        this.dialogActive.next();
        this.uploadList.cancelAllFiles();
    }

    /**
     * Toggle dialog minimized state.
     */
    toggleMinimized(): void {
        this.isDialogMinimized = !this.isDialogMinimized;
        this.changeDetector.detectChanges();
    }

    /**
     * Dismiss dialog
     */
    close(): void {
        this.isConfirmation = false;
        this.totalCompleted = 0;
        this.totalErrors = 0;
        this.filesUploadingList = [];
        this.isDialogActive = false;
        this.isDialogMinimized = false;
        this.uploadService.clearQueue();
        this.changeDetector.detectChanges();
    }

    ngOnDestroy() {
        this.uploadService.clearQueue();
        this.listSubscription.unsubscribe();
        this.counterSubscription.unsubscribe();
        this.fileUploadSubscription.unsubscribe();
        this.errorSubscription.unsubscribe();
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    canShowDialog(): boolean {
        return this.isDialogActive || this.alwaysVisible;
    }

    canShowCancelAll(): boolean {
        return this.filesUploadingList?.length && this.hasUploadInProgress();
    }

    canCloseDialog(): boolean {
        return !this.hasUploadInProgress() && !this.alwaysVisible;
    }

    hasUploadInProgress(): boolean {
        return (!this.uploadList?.isUploadCompleted() && !this.uploadList?.isUploadCancelled());
    }
}
