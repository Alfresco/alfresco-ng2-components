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
import { EventEmitter } from '@angular/core';
import { UploadService } from '../services/upload.service';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
export declare class UploadDragAreaComponent {
    private _uploaderService;
    private static DEFAULT_ROOT_ID;
    undoNotificationBar: any;
    showUdoNotificationBar: boolean;
    versioning: boolean;
    currentFolderPath: string;
    rootFolderId: string;
    onSuccess: EventEmitter<{}>;
    translate: AlfrescoTranslationService;
    constructor(_uploaderService: UploadService, translate: AlfrescoTranslationService);
    ngOnChanges(changes: any): void;
    onFilesDropped(files: File[]): void;
    checkValidity(files: File[]): boolean;
    onFilesEntityDropped(item: any): void;
    onFolderEntityDropped(folder: any): void;
    private _traverseFileTree(item);
    private _showUndoNotificationBar(latestFilesAdded);
    private _showErrorNotificationBar(errorMessage);
    private getErrorMessage(response);
    private formatString(message, keys);
    private createFormFields();
}
