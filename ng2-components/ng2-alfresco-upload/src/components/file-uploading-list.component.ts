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

import { Component, Input } from '@angular/core';
import { FileModel, FileUploadStatus } from '../models/file.model';
import { UploadService } from '../services/upload.service';

@Component({
    selector: 'alfresco-file-uploading-list',
    templateUrl: './file-uploading-list.component.html',
    styleUrls: ['./file-uploading-list.component.css']
})
export class FileUploadingListComponent {

    FileUploadStatus = FileUploadStatus;

    @Input()
    files: FileModel[];

    constructor(private uploadService: UploadService) {
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

    /**
     * Call the abort method for each file
     */
    cancelAllFiles(event: Event): void {
        if (event) {
            event.preventDefault();
        }
        this.uploadService.cancelUpload(...this.files);
    }

    /**
     * Check if all the files are not in the Progress state.
     * @returns {boolean} - false if there is at least one file in Progress
     */
    isUploadCompleted(): boolean {
        let isPending = false;
        let isAllCompleted = true;

        for (let i = 0; i < this.files.length && !isPending; i++) {
            let file = this.files[i];
            if (file.status === FileUploadStatus.Progress) {
                isPending = true;
                isAllCompleted = false;
            }
        }
        return isAllCompleted;
    }
}
