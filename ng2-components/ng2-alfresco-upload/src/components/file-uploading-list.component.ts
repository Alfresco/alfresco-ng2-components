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

import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { AlfrescoTranslationService, FileModel, FileUploadStatus, NodesApiService, NotificationService, UploadService } from 'ng2-alfresco-core';
import { FileUploadService } from '../services/file-uploading.service';

@Component({
    selector: 'adf-file-uploading-list, alfresco-file-uploading-list',
    templateUrl: './file-uploading-list.component.html',
    styleUrls: ['./file-uploading-list.component.scss']
})
export class FileUploadingListComponent {

    FileUploadStatus = FileUploadStatus;

    @ContentChild(TemplateRef)
    template: any;

    @Input()
    files: FileModel[] = [];

    constructor(
        private fileUploadService: FileUploadService,
        private uploadService: UploadService,
        private nodesApi: NodesApiService,
        private notificationService: NotificationService,
        private translateService: AlfrescoTranslationService) {
    }

    /**
     * Cancel file upload
     *
     * @param {FileModel} file File model to cancel upload for.
     *
     * @memberOf FileUploadingListComponent
     */
    cancelFileUpload(file: FileModel): void {
        this.uploadService.cancelUpload(file);
    }

    removeFile(file: FileModel): void {
        const { id } = file.data.entry;
        this.nodesApi
            .deleteNode(id, { permanent: true })
            .subscribe(
                () => this.onRemoveSuccess(file),
                () => this.onRemoveFail(file)
            );
    }

    /**
     * Call the abort method for each file
     */
    cancelAllFiles(event: Event): void {
        if (event) {
            event.preventDefault();
        }

        this.files.forEach((file) => {
            const { status } = file;
            const { Complete, Progress, Pending } = FileUploadStatus;

            if (status === Complete) {
                this.removeFile(file);
            }

            if (status === Progress || status === Pending) {
               this.cancelFileUpload(file);
            }

        });
    }

    /**
     * Checks if all the files are uploaded
     * @returns {boolean} - false if there is at least one file in Progress | Starting | Pending
     */
    isUploadCompleted(): boolean {
         return !this.isUploadCancelled() &&
            !!this.files.length &&
            !this.files
                .some(({status}) =>
                    status === FileUploadStatus.Starting ||
                    status === FileUploadStatus.Progress ||
                    status === FileUploadStatus.Pending
                );
    }

    /**
     * Check if all the files are Cancelled | Aborted | Error.
     * @returns {boolean} - false if there is at least one file in uploading states
     */
    isUploadCancelled(): boolean {
        return !!this.files.length &&
            this.files
                .every(({status}) =>
                    status === FileUploadStatus.Aborted ||
                    status === FileUploadStatus.Cancelled ||
                    status === FileUploadStatus.Error
                );
    }

    /**
     * Gets all the files with status Error.
     * @returns {boolean} - false if there is none
     */
    get uploadErrorFiles(): FileModel[] {
        return this.files.filter(({status}) => status === FileUploadStatus.Error);
    }

    /**
     * Gets all the files with status Cancelled.
     * @returns {boolean} - false if there is none
     */
    get uploadCancelledFiles(): FileModel[] {
        return this.files.filter(({status}) => status === FileUploadStatus.Cancelled);
    }

    private onRemoveSuccess(file: FileModel): void {
        const { uploadService, fileUploadService } = this;

        uploadService.cancelUpload(file);
        fileUploadService.emitFileRemoved(file);
    }

    private onRemoveFail(file: FileModel): void {
        this.translateService
            .get('FILE_UPLOAD.MESSAGES.REMOVE_FILE_ERROR', { fileName: file.name})
            .subscribe((message) =>  {
                this.notificationService.openSnackMessage(message, 4000);
            });
    }
}
