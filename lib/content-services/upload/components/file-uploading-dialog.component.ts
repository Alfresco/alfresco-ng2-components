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
    FileModel, FileUploadCompleteEvent, FileUploadDeleteEvent,
    FileUploadErrorEvent, FileUploadStatus, UploadService
} from '@alfresco/adf-core';
import { ChangeDetectorRef, Component, Input, Output, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription, merge } from 'rxjs';
import { FileUploadingListComponent } from './file-uploading-list.component';

// @deprecated file-uploading-dialog TODO remove in 3.0.0
@Component({
    selector: 'adf-file-uploading-dialog, file-uploading-dialog',
    templateUrl: './file-uploading-dialog.component.html',
    styleUrls: ['./file-uploading-dialog.component.scss']
})
export class FileUploadingDialogComponent implements OnInit, OnDestroy {
    @ViewChild('uploadList')
    uploadList: FileUploadingListComponent;

    /** Dialog position. Can be 'left' or 'right'. */
    @Input()
    position: string = 'right';

    /** Emitted when a file in the list has an error. */
    @Output()
    error: EventEmitter<any> = new EventEmitter();

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

    constructor(private uploadService: UploadService,
                private changeDetector: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.listSubscription = this.uploadService
            .queueChanged.subscribe((fileList: FileModel[]) => {
                this.filesUploadingList = fileList;

                if (this.filesUploadingList.length) {
                    this.isDialogActive = true;
                }
            });

        this.counterSubscription = merge(
                this.uploadService.fileUploadComplete,
                this.uploadService.fileUploadDeleted
            )
            .subscribe((event: (FileUploadDeleteEvent | FileUploadCompleteEvent)) => {
                this.totalCompleted = event.totalComplete;
                this.changeDetector.detectChanges();
            });

        this.errorSubscription = this.uploadService.fileUploadError
            .subscribe((event: FileUploadErrorEvent) => {
                this.totalErrors = event.totalError;
                this.changeDetector.detectChanges();
            });

        this.fileUploadSubscription = this.uploadService
            .fileUpload.subscribe(() => {
                this.changeDetector.detectChanges();
            });

        this.uploadService.fileDeleted.subscribe((objId) => {
            if (this.filesUploadingList) {
                let file = this.filesUploadingList.find((item) => {
                    return item.data.entry.id === objId;
                });
                if (file) {
                    file.status = FileUploadStatus.Cancelled;
                    this.changeDetector.detectChanges();
                }
            }
        });
    }

    /**
     * Toggle confirmation message.
     */
    toggleConfirmation() {
        this.isConfirmation = !this.isConfirmation;

        if (this.isDialogMinimized) {
            this.isDialogMinimized = false;
        }
    }

    /**
     * Cancel uploads and hide confirmation
     */
    cancelAllUploads() {
        this.toggleConfirmation();

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
    }
}
