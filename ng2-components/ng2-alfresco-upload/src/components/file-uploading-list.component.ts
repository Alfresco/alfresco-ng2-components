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
import { Observable } from 'rxjs/Rx';

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
    cancelFile(file: FileModel): void {
        this.uploadService.cancelUpload(file);
    }

    removeFile(file: FileModel): void {
        this.deleteNode(file)
            .subscribe(() => {
                if ( file.status === FileUploadStatus.Error) {
                    this.notifyError(file);
                }

                this.uploadService.cancelUpload(file);
            });
    }

    /**
     * Call the appropriate method for each file, depending on state
     */
    cancelAllFiles(): void {
        this.getUploadingFiles()
            .forEach((file) => this.uploadService.cancelUpload(file));

        const deletedFiles = this.files
            .filter((file) => file.status === FileUploadStatus.Complete)
            .map((file) => this.deleteNode(file));

        Observable.forkJoin(...deletedFiles)
            .subscribe((files: FileModel[]) => {
                const errors = files
                    .filter((file) => file.status === FileUploadStatus.Error);

                if (errors.length) {
                    this.notifyError(...errors);
                }

                this.uploadService.cancelUpload(...files);
            });
    }

    /**
     * Checks if all the files are uploaded
     * @returns {boolean} - false if there is at least one file in Progress | Starting | Pending
     */
    isUploadCompleted(): boolean {
         return !this.isUploadCancelled() &&
            Boolean(this.files.length) &&
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
                    status === FileUploadStatus.Deleted
                );
    }

    private deleteNode(file: FileModel): Observable<FileModel> {
        const { id } = file.data.entry;

        return this.nodesApi
            .deleteNode(id, { permanent: true })
            .map(() => {
                file.status = FileUploadStatus.Deleted;
                return file;
            })
            .catch((error) => {
                file.status = FileUploadStatus.Error;
                return Observable.of(file);
            });
    }

    private notifyError(...files: FileModel[]) {
        let translateSubscription = null;

        if (files.length === 1) {
            translateSubscription = this.translateService
                .get(
                    'FILE_UPLOAD.MESSAGES.REMOVE_FILE_ERROR',
                    { fileName: files[0].name}
                );
        } else {
            translateSubscription = this.translateService
                .get(
                    'FILE_UPLOAD.MESSAGES.REMOVE_FILES_ERROR',
                    { total: files.length }
                );
        }

        translateSubscription
            .subscribe(message => this.notificationService.openSnackMessage(message, 4000));
    }

    private getUploadingFiles() {
        return this.files.filter((item) => {
            if (
                item.status === FileUploadStatus.Pending ||
                item.status === FileUploadStatus.Progress ||
                item.status === FileUploadStatus.Starting
            ) {
                return item;
            }
        });
    }
}
