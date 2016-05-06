/**
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
import { ElementRef } from 'angular2/core';
import { FileModel } from '../models/file.model';
import { FileUploadingDialogComponent } from './file-uploading-dialog.component';
/**
 * <alfresco-upload-drag-area [showDialogUpload]="boolean" ></alfresco-upload-drag-area>
 *
 * This component, provide a drag and drop are to upload files to alfresco.
 *
 * @InputParam {boolean} [true] showDialogUpload - hide/show upload dialog .
 *
 *
 * @returns {UploadDragAreaComponent} .
 */
export declare class UploadDragAreaComponent {
    el: ElementRef;
    private _uploaderService;
    fileUploadingDialogComponent: FileUploadingDialogComponent;
    showUploadDialog: boolean;
    filesUploadingList: FileModel[];
    constructor(el: ElementRef);
    /**
     * Method called when files are dropped in the drag area.
     *
     * @param {File[]} files - files dropped in the drag area.
     */
    onFilesDropped(files: any): void;
    /**
     * Show the upload dialog.
     */
    private _showDialog();
}
