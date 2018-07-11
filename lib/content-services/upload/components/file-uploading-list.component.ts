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

import { FileModel, FileUploadStatus, NodesApiService, TranslationService, UploadService } from '@alfresco/adf-core';
import { Component, ContentChild, Input, Output, TemplateRef, EventEmitter } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Component({
    selector: 'adf-file-uploading-list',
    templateUrl: './file-uploading-list.component.html',
    styleUrls: ['./file-uploading-list.component.scss']
})
export class FileUploadingListComponent {

    FileUploadStatus = FileUploadStatus;

    @ContentChild(TemplateRef)
    template: any;

    @Input()
    files: FileModel[] = [];

    /** Emitted when a file in the list has an error. */
    @Output()
    error: EventEmitter<any> = new EventEmitter();

    constructor(
        private uploadService: UploadService,
        private nodesApi: NodesApiService,
        private translateService: TranslationService) {
    }

    /**
     * Cancel file upload
     *
     * @param file File model to cancel upload for.
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

        forkJoin(...deletedFiles)
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
     * Checks if all the files are uploaded false if there is at least one file in Progress | Starting | Pending
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
     * Check if all the files are Cancelled | Aborted | Error. false if there is at least one file in uploading states
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
            .pipe(
                map(() => {
                    file.status = FileUploadStatus.Deleted;
                    return file;
                }),
                catchError(() => {
                    file.status = FileUploadStatus.Error;
                    return of(file);
                })
            );
    }

    private notifyError(...files: FileModel[]) {
        let messageError: string = null;

        if (files.length === 1) {
            messageError = this.translateService
                .instant(
                    'FILE_UPLOAD.MESSAGES.REMOVE_FILE_ERROR',
                    { fileName: files[0].name}
                );
        } else {
            messageError = this.translateService
                .instant(
                    'FILE_UPLOAD.MESSAGES.REMOVE_FILES_ERROR',
                    { total: files.length }
                );
        }

        this.error.emit(messageError);
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
