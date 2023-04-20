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
    TranslationService
} from '@alfresco/adf-core';
import { UploadService } from '../../common/services/upload.service';
import { FileModel, FileUploadStatus } from '../../common/models/file.model';

import {
    Component,
    ContentChild,
    Input,
    Output,
    TemplateRef,
    EventEmitter
} from '@angular/core';

@Component({
    selector: 'adf-file-uploading-list',
    templateUrl: './file-uploading-list.component.html',
    styleUrls: ['./file-uploading-list.component.scss']
})
export class FileUploadingListComponent {
    @ContentChild(TemplateRef)
    template: any;

    @Input()
    files: FileModel[] = [];

    /** Emitted when a file in the list has an error. */
    @Output()
    error = new EventEmitter<any>();

    constructor(
        private uploadService: UploadService,
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
        if (file.status === FileUploadStatus.Pending) {
            file.status = FileUploadStatus.Cancelled;
        } else {
            this.uploadService.cancelUpload(file);
        }
    }

    /**
     * Remove uploaded file
     *
     * @param file File model to remove upload for.
     *
     * @memberOf FileUploadingListComponent
     */
    removeFile(file: FileModel): void {
        if (file.status === FileUploadStatus.Error) {
            this.notifyError(file);
        }

        if (this.isUploadingFile(file)) {
            this.cancelNodeVersionInstances(file);
            this.uploadService.cancelUpload(file);
        }

        this.files = this.files.filter(entry => entry !== file);
    }

    /**
     * Calls the appropriate methods for each file, depending on state
     */
    cancelAllFiles(): void {
        const filesToCancel = this.files.filter(file => this.isUploadingFile(file));

        if (filesToCancel.length > 0) {
            this.uploadService.cancelUpload(...filesToCancel);
        }
    }

    /**
     * Checks if all the files are uploaded false if there is at least one file in Progress | Starting | Pending
     */
    isUploadCompleted(): boolean {
        return (
            !this.isUploadCancelled() &&
            Boolean(this.files.length) &&
            !this.files.some(
                ({ status }) =>
                    status === FileUploadStatus.Starting ||
                    status === FileUploadStatus.Progress ||
                    status === FileUploadStatus.Pending
            )
        );
    }

    /**
     * Check if all the files are Cancelled | Aborted | Error. false if there is at least one file in uploading states
     */
    isUploadCancelled(): boolean {
        return (
            !!this.files.length &&
            this.files.every(
                ({ status }) =>
                    status === FileUploadStatus.Aborted ||
                    status === FileUploadStatus.Cancelled ||
                    status === FileUploadStatus.Deleted
            )
        );
    }

    private cancelNodeVersionInstances(file: FileModel) {
        this.files
            .filter(
                (item) =>
                    item.options.newVersion &&
                    item.data.entry.id === file.data.entry.id

            )
            .map((item) => {
                item.status = FileUploadStatus.Deleted;
            });
    }

    private notifyError(...files: FileModel[]) {
        let messageError: string = null;

        if (files.length === 1) {
            messageError = this.translateService.instant(
                'FILE_UPLOAD.MESSAGES.REMOVE_FILE_ERROR',
                { fileName: files[0].name }
            );
        } else {
            messageError = this.translateService.instant(
                'FILE_UPLOAD.MESSAGES.REMOVE_FILES_ERROR',
                { total: files.length }
            );
        }

        this.error.emit(messageError);
    }

    private isUploadingFile(file: FileModel): boolean {
        return file.status === FileUploadStatus.Pending ||
            file.status === FileUploadStatus.Starting ||
            file.status === FileUploadStatus.Progress;
    }
}
