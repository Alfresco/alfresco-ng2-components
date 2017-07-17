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

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AlfrescoTranslationService, FileModel, FileUploadCompleteEvent, FileUploadStatus, UploadService } from 'ng2-alfresco-core';

@Component({
    selector: 'adf-file-uploading-dialog, file-uploading-dialog',
    templateUrl: './file-uploading-dialog.component.html',
    styleUrls: ['./file-uploading-dialog.component.css']
})
export class FileUploadingDialogComponent implements OnInit, OnDestroy {

    @Input()
    filesUploadingList: FileModel[];

    isDialogActive: boolean = false;
    totalCompleted: number = 0;
    totalCompletedMsg: string = 'FILE_UPLOAD.MESSAGES.SINGLE_COMPLETED';
    isDialogMinimized: boolean = false;
    showCloseButton: boolean = false;

    private listSubscription: any;
    private counterSubscription: any;

    constructor(translateService: AlfrescoTranslationService, private uploadService: UploadService) {
        if (translateService) {
            translateService.addTranslationFolder('ng2-alfresco-upload', 'assets/ng2-alfresco-upload');
        }
    }

    ngOnInit() {
        this.listSubscription = this.uploadService.queueChanged.subscribe((fileList: FileModel[]) => {
            this.filesUploadingList = fileList;
            if (this.filesUploadingList.length > 0) {
                this.isDialogActive = true;
            }
            this.showCloseButton = false;
        });

        this.counterSubscription = this.uploadService.fileUploadComplete.subscribe((event: FileUploadCompleteEvent) => {
            this.totalCompleted = event.totalComplete;
            if (this.totalCompleted > 1) {
                this.totalCompletedMsg = 'FILE_UPLOAD.MESSAGES.COMPLETED';
            }
        });

        this.uploadService.fileUpload.subscribe((event: FileUploadCompleteEvent) => {
            if (event.status !== FileUploadStatus.Progress) {
                this.isUploadProcessCompleted(event);
            }
        });
    }

    /**
     * Toggle dialog visibility state.
     */
    toggleVisible(): void {
        this.isDialogActive = !this.isDialogActive;
        this.uploadService.clearQueue();
    }

    /**
     * Toggle dialog minimized state.
     */
    toggleMinimized(): void {
        this.isDialogMinimized = !this.isDialogMinimized;
    }

    ngOnDestroy() {
        this.uploadService.clearQueue();
        this.listSubscription.unsubscribe();
        this.counterSubscription.unsubscribe();
    }

    private isUploadProcessCompleted(event: FileUploadCompleteEvent) {
        if (this.isAllFileUploadEnded(event) && this.isUploadStateCompleted(event.status)) {
            this.showCloseDialogButton();
        } else if (event.status === FileUploadStatus.Error || event.status === FileUploadStatus.Cancelled) {
            this.showCloseDialogButton();
        }
    }

    private showCloseDialogButton() {
        this.showCloseButton = true;
    }

    private isAllFileUploadEnded(event: FileUploadCompleteEvent) {
        return event.totalComplete === this.uploadService.getQueue().length - event.totalAborted;
    }

    private isUploadStateCompleted(state): boolean {
        return FileUploadStatus.Complete === state;
    }
}
