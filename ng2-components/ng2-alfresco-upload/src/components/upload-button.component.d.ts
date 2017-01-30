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
import { ElementRef, EventEmitter } from '@angular/core';
import { UploadService } from '../services/upload.service';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import 'rxjs/Rx';
export declare class UploadButtonComponent {
    el: ElementRef;
    private _uploaderService;
    private static DEFAULT_ROOT_ID;
    undoNotificationBar: any;
    showUdoNotificationBar: boolean;
    uploadFolders: boolean;
    multipleFiles: boolean;
    versioning: boolean;
    acceptedFilesType: string;
    currentFolderPath: string;
    rootFolderId: string;
    onSuccess: EventEmitter<{}>;
    onError: EventEmitter<{}>;
    createFolder: EventEmitter<{}>;
    translate: AlfrescoTranslationService;
    constructor(el: ElementRef, _uploaderService: UploadService, translate: AlfrescoTranslationService);
    ngOnChanges(changes: any): void;
    onFilesAdded($event: any): void;
    onDirectoryAdded($event: any): void;
    private uploadFiles(path, files);
    private convertIntoHashMap(files);
    private getDirectoryPath(directory);
    private getDirectoryName(directory);
    private _showUndoNotificationBar(latestFilesAdded);
    private getErrorMessage(response);
    private _showErrorNotificationBar(errorMessage);
    private formatString(message, keys);
    private createFormFields();
}
