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

import { Component, ElementRef, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs/Rx';
import { AlfrescoTranslationService, LogService, NotificationService } from 'ng2-alfresco-core';
import { UploadService } from '../services/upload.service';
import { FileModel } from '../models/file.model';
import { PermissionModel } from '../models/permissions.model';

declare let componentHandler: any;

const ERROR_FOLDER_ALREADY_EXIST = 409;

/**
 * <alfresco-upload-button [showNotificationBar]="boolean"
 *                         [uploadFolders]="boolean"
 *                         [multipleFiles]="boolean"
 *                         [acceptedFilesType]="string"
 *                         (onSuccess)="customMethod($event)">
 * </alfresco-upload-button>
 *
 * This component, provide a set of buttons to upload files to alfresco.
 *
 * @InputParam {boolean} [true] showNotificationBar - hide/show notification bar.
 * @InputParam {boolean} [false] versioning - true to indicate that a major version should be created
 * @InputParam {boolean} [false] uploadFolders - allow/disallow upload folders (only for chrome).
 * @InputParam {boolean} [false] multipleFiles - allow/disallow multiple files.
 * @InputParam {string} [*] acceptedFilesType - array of allowed file extensions.
 * @InputParam {boolean} [false] versioning - true to indicate that a major version should be created
 * @Output - onSuccess - The event is emitted when the file is uploaded
 *
 * @returns {UploadButtonComponent} .
 */
@Component({
    selector: 'alfresco-upload-button',
    templateUrl: './upload-button.component.html',
    styleUrls: ['./upload-button.component.css']
})
export class UploadButtonComponent implements OnInit, OnChanges {

    private static DEFAULT_ROOT_ID: string = '-root-';

    @Input()
    disabled: boolean = false;

    @Input()
    showNotificationBar: boolean = true;

    @Input()
    uploadFolders: boolean = false;

    @Input()
    multipleFiles: boolean = false;

    @Input()
    versioning: boolean = false;

    @Input()
    acceptedFilesType: string = '*';

    @Input()
    staticTitle: string;

    @Input()
    currentFolderPath: string = '/';

    @Input()
    rootFolderId: string = UploadButtonComponent.DEFAULT_ROOT_ID;

    @Input()
    disableWithNoPermission: boolean = false;

    @Output()
    onSuccess = new EventEmitter();

    @Output()
    onError = new EventEmitter();

    @Output()
    createFolder = new EventEmitter();

    @Output()
    permissionEvent: EventEmitter<PermissionModel> = new EventEmitter<PermissionModel>();

    private hasPermission: boolean = false;

    private permissionValue: Subject<boolean> = new Subject<boolean>();

    constructor(private el: ElementRef,
                private uploadService: UploadService,
                private translateService: AlfrescoTranslationService,
                private logService: LogService,
                private notificationService: NotificationService) {
        if (translateService) {
            translateService.addTranslationFolder('ng2-alfresco-upload', 'node_modules/ng2-alfresco-upload/src');
        }
    }

    ngOnInit() {
        this.permissionValue.subscribe((permission: boolean) => {
            this.hasPermission = permission;
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        let rootFolderId = changes['rootFolderId'];
        if (rootFolderId && rootFolderId.currentValue) {
            this.checkPermission();
        }
        let formFields = this.createFormFields();
        this.uploadService.setOptions(formFields, this.versioning);
    }

    isButtonDisabled(): boolean {
        return this.isForceDisable() || this.isDisableWithNoPermission();
    }

    isForceDisable(): boolean {
        return this.disabled ? true : undefined;
    }

    isDisableWithNoPermission(): boolean {
        return !this.hasPermission && this.disableWithNoPermission ? true : undefined;
    }

    /**
     * Method called when files are dropped in the drag area.
     *
     * @param {File[]} files - files dropped in the drag area.
     */
    onFilesAdded($event: any): void {
        let files = $event.currentTarget.files;

        if (this.hasPermission) {
            this.uploadFiles(this.currentFolderPath, files);
        } else {
            this.permissionEvent.emit(new PermissionModel({type: 'content', action: 'upload', permission: 'create'}));
        }
        // reset the value of the input file
        $event.target.value = '';
    }

    /**
     * Method called when a folder is dropped in the drag area.
     *
     * @param {File[]} files - files of a folder dropped in the drag area.
     */
    onDirectoryAdded($event: any): void {
        let files = $event.currentTarget.files;
        if (this.hasPermission) {
            let hashMapDir = this.convertIntoHashMap(files);

            hashMapDir.forEach((filesDir, directoryPath) => {
                let directoryName = this.getDirectoryName(directoryPath);
                let absolutePath = this.currentFolderPath + this.getDirectoryPath(directoryPath);

                this.uploadService.createFolder(absolutePath, directoryName, this.rootFolderId)
                    .subscribe(
                        res => {
                            let relativeDir = this.currentFolderPath + '/' + directoryPath;
                            this.uploadFiles(relativeDir, filesDir);
                        },
                        error => {
                            let errorMessagePlaceholder = this.getErrorMessage(error.response);
                            if (errorMessagePlaceholder) {
                                this.onError.emit({value: errorMessagePlaceholder});
                                let errorMessage = this.formatString(errorMessagePlaceholder, [directoryName]);
                                if (errorMessage) {
                                    this._showErrorNotificationBar(errorMessage);
                                }
                            }
                        }
                    );
            });
        } else {
            this.permissionEvent.emit(new PermissionModel({type: 'content', action: 'upload', permission: 'create'}));
        }
        // reset the value of the input file
        $event.target.value = '';
    }

    /**
     * Upload a list of file in the specified path
     * @param path
     * @param files
     */
    uploadFiles(path: string, files: any[]) {
        if (files.length) {
            let latestFilesAdded = this.uploadService.addToQueue(files);
            this.uploadService.uploadFilesInTheQueue(this.rootFolderId, path, this.onSuccess);
            if (this.showNotificationBar) {
                this._showUndoNotificationBar(latestFilesAdded);
            }
        }
    }

    /**
     * It converts the array given as input into a map. The map is a key values pairs, where the key is the directory name and the value are
     * all the files that the directory contains.
     * @param files - array of files
     * @returns {Map}
     */
    private convertIntoHashMap(files: any[]) {
        let directoryMap = new Map<string, Object[]>();
        for (let file of files) {
            let directory = this.getDirectoryPath(file.webkitRelativePath);
            let filesSomeDir = directoryMap.get(directory) || [];
            filesSomeDir.push(file);
            directoryMap.set(directory, filesSomeDir);
        }
        return directoryMap;
    }

    /**
     * Split the directory path given as input and cut the last directory name
     * @param directory
     * @returns {string}
     */
    private getDirectoryPath(directory: string) {
        let relativeDirPath = '';
        let dirPath = directory.split('/');
        if (dirPath.length > 1) {
            dirPath.pop();
            relativeDirPath = '/' + dirPath.join('/');
        }
        return relativeDirPath;
    }

    /**
     * Split a directory path passed in input and return the first directory name
     * @param directory
     * @returns {string}
     */
    private getDirectoryName(directory: string) {
        let dirPath = directory.split('/');
        if (dirPath.length > 1) {
            return dirPath.pop();
        } else {
            return dirPath[0];
        }
    }

    /**
     * Show undo notification bar.
     *
     * @param {FileModel[]} latestFilesAdded - files in the upload queue enriched with status flag and xhr object.
     */
    private _showUndoNotificationBar(latestFilesAdded: FileModel[]) {
        let messageTranslate: any, actionTranslate: any;
        messageTranslate = this.translateService.get('FILE_UPLOAD.MESSAGES.PROGRESS');
        actionTranslate = this.translateService.get('FILE_UPLOAD.ACTION.UNDO');

        this.notificationService.openSnackMessageAction(messageTranslate.value, actionTranslate.value, 3000).afterDismissed().subscribe(() => {
            latestFilesAdded.forEach((uploadingFileModel: FileModel) => {
                uploadingFileModel.emitAbort();
            });
        });
    }

    /**
     * Retrive the error message using the error status code
     * @param response - object that contain the HTTP response
     * @returns {string}
     */
    private getErrorMessage(response: any): string {
        if (response.body && response.body.error.statusCode === ERROR_FOLDER_ALREADY_EXIST) {
            let errorMessage: any;
            errorMessage = this.translateService.get('FILE_UPLOAD.MESSAGES.FOLDER_ALREADY_EXIST');
            return errorMessage.value;
        }
    }

    /**
     * Show the error inside Notification bar
     * @param Error message
     * @private
     */
    private _showErrorNotificationBar(errorMessage: string) {
        this.notificationService.openSnackMessage(errorMessage, 3000);
    }

    /**
     * Replace a placeholder {0} in a message with the input keys
     * @param message - the message that conains the placeholder
     * @param keys - array of value
     * @returns {string} - The message without placeholder
     */
    private formatString(message: string, keys: any []) {
        let i = keys.length;
        while (i--) {
            message = message.replace(new RegExp('\\{' + i + '\\}', 'gm'), keys[i]);
        }
        return message;
    }

    private createFormFields(): any {
        return {
            formFields: {
                overwrite: true
            }
        };
    }

    checkPermission() {
        if (this.rootFolderId) {
            this.uploadService.getFolderNode(this.rootFolderId).subscribe(
                (res) => {
                    this.permissionValue.next(this.hasCreatePermission(res));
                },
                (error) => {
                    this.onError.emit(error);
                }
            );
        }
    }

    private hasCreatePermission(node: any): boolean {
        if (this.hasPermissions(node)) {
            return node.allowableOperations.find(permision => permision === 'create') ? true : false;
        }
        return false;
    }

    private hasPermissions(node: any): boolean {
        return node && node.allowableOperations ? true : false;
    }
}
