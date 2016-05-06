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
 * <alfresco-upload-button [showDialogUpload]="boolean"
 *                         [showUdoNotificationBar]="boolean"
 *                         [uploadFolders]="boolean"
 *                         [multipleFiles]="boolean"
 *                         [acceptedFilesType]="string">
 * </alfresco-upload-button>
 *
 * This component, provide a set of buttons to upload files to alfresco.
 *
 * @InputParam {boolean} [true] showDialogUpload - hide/show upload dialog.
 * @InputParam {boolean} [true] showUdoNotificationBar - hide/show notification bar.
 * @InputParam {boolean} [false] uploadFolders - allow/disallow upload folders (only for chrome).
 * @InputParam {boolean} [false] multipleFiles - allow/disallow multiple files.
 * @InputParam {string} [*] acceptedFilesType - array of allowed file extensions.
 *
 *
 * @returns {UploadDragAreaComponent} .
 */
export declare class UploadButtonComponent {
    el: ElementRef;
    private _uploaderService;
    undoNotificationBar: any;
    fileUploadingDialogComponent: FileUploadingDialogComponent;
    showUploadDialog: boolean;
    showUdoNotificationBar: boolean;
    uploadFolders: boolean;
    multipleFiles: boolean;
    acceptedFilesType: string;
    filesUploadingList: FileModel[];
    constructor(el: ElementRef);
    /**
     * Method called when files are dropped in the drag area.
     *
     * @param {File[]} files - files dropped in the drag area.
     */
    onFilesAdded($event: any): void;
    /**
     * Show undo notification bar.
     *
     * @param {FileModel[]} latestFilesAdded - files in the upload queue enriched with status flag and xhr object.
     */
    private _showUndoNotificationBar(latestFilesAdded);
    /**
     * Show the upload dialog.
     */
    private _showDialog();
}
