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
import { FileModel } from '../models/file.model';

/**
 * <alfresco-file-uploading-list [files]="files"></alfresco-file-uploading-list>
 *
 * This component show a list of the uploading files contained in the filesUploadingList.
 *
 * @InputParam {FileModel[]} filesUploadingList - list of the uploading files .
 *
 *
 * @returns {FileUploadingListComponent} .
 */
@Component({
    selector: 'alfresco-file-uploading-list',
    moduleId: module.id,
    templateUrl: './file-uploading-list.component.html',
    styleUrls: ['./file-uploading-list.component.css']
})
export class FileUploadingListComponent {

    @Input()
    files: FileModel[];

    /**
     * Cancel file upload
     *
     * @param {FileModel} file File model to cancel upload for.
     *
     * @memberOf FileUploadingListComponent
     */
    cancelFileUpload(file: FileModel): void {
        if (file) {
            file.emitAbort();
        }
    }

    /**
     * Call the abort method for each file
     */
    cancelAllFiles(event: Event): void {
        if (event) {
            event.preventDefault();
        }
        this.files.forEach((uploadingFileModel: FileModel) => {
            uploadingFileModel.emitAbort();
        });
    }

    /**
     * Verify if all the files are in state done or abort
     * @returns {boolean} - false if there is a file in progress
     */
    isUploadCompleted(): boolean {
        let isPending = false;
        let isAllCompleted = true;
        for (let i = 0; i < this.files.length && !isPending; i++) {
            let file = this.files[i];
            if (!file.done && !file.abort) {
                isPending = true;
                isAllCompleted = false;
            }
        }
        return isAllCompleted;
    }
}
