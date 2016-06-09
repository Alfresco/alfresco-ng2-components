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


import { Component, ViewChild, ElementRef, Input, Output, EventEmitter } from 'angular2/core';
import { UploadService } from '../services/upload.service';
import { FileModel } from '../models/file.model';
import { AlfrescoTranslationService, AlfrescoPipeTranslate } from 'ng2-alfresco-core/dist/ng2-alfresco-core';
import 'rxjs/Rx';

declare let componentHandler: any;
declare let __moduleName: string;

/**
 * <alfresco-upload-button [showUdoNotificationBar]="boolean"
 *                         [uploadFolders]="boolean"
 *                         [multipleFiles]="boolean"
 *                         [acceptedFilesType]="string"
 *                         (onSuccess)="customMethod($event)">
 * </alfresco-upload-button>
 *
 * This component, provide a set of buttons to upload files to alfresco.
 *
 * @InputParam {boolean} [true] showUdoNotificationBar - hide/show notification bar.
 * @InputParam {boolean} [false] uploadFolders - allow/disallow upload folders (only for chrome).
 * @InputParam {boolean} [false] multipleFiles - allow/disallow multiple files.
 * @InputParam {string} [*] acceptedFilesType - array of allowed file extensions.
 *
 * @Output - onSuccess - The event is emitted when the file is uploaded
 *
 * @returns {UploadDragAreaComponent} .
 */
@Component({
    selector: 'alfresco-upload-button',
    moduleId: __moduleName,
    templateUrl: './upload-button.component.html',
    styleUrls: ['./upload-button.component.css'],
    pipes: [AlfrescoPipeTranslate]
})
export class UploadButtonComponent {

    @ViewChild('undoNotificationBar')
    undoNotificationBar: any;

    @Input()
    showUdoNotificationBar: boolean = true;

    @Input()
    uploadFolders: boolean = false;

    @Input()
    multipleFiles: boolean = false;

    @Input()
    acceptedFilesType: string = '*';

    @Input()
    currentFolderPath: string = '/Sites/swsdp/documentLibrary';

    @Input()
    uploaddirectory: string = '';

    @Output()
    onSuccess = new EventEmitter();

    translate: AlfrescoTranslationService;


    constructor(public el: ElementRef,
                private _uploaderService: UploadService,
                translate: AlfrescoTranslationService) {
        console.log('UploadComponent constructor', el);

        let site = this.getSiteId();
        let container = this.getContainerId();

        this._uploaderService.setOptions({
            formFields: {
                siteid: site,
                containerid: container
            }
        });
        this.translate = translate;
        this.translate.addTranslationFolder('node_modules/ng2-alfresco-upload');
    }

    /**
     * Method called when files are dropped in the drag area.
     *
     * @param {File[]} files - files dropped in the drag area.
     */
    onFilesAdded($event: any): void {
        let files = $event.currentTarget.files;
        this.printFileInfo(files);
        this.uploadFiles(this.uploaddirectory, files);
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
        this.printFileInfo(files);
        let hashMapDir = this.convertIntoHashMap(files);

        hashMapDir.forEach((filesDir, directoryPath) => {
            let directoryName = this.getDirectoryName(directoryPath);
            let absolutePath = this.currentFolderPath + this.getDirectoryPath(directoryPath);

            this._uploaderService.createFolder(absolutePath, directoryName)
                .subscribe(
                    res => {
                        let relativeDir = this.uploaddirectory + '/' + directoryPath;
                        this.uploadFiles(relativeDir, filesDir);
                    },
                    error => {
                    console.log(error);
                }
            );
        });
        // reset the value of the input file
        $event.target.value = '';
    }

    /**
     * Upload a list of file in the specified path
     * @param path
     * @param files
     */
    private uploadFiles(path: string, files: any[]) {
        if (files.length) {
            let latestFilesAdded = this._uploaderService.addToQueue(files);
            this._uploaderService.uploadFilesInTheQueue(path, this.onSuccess);
            if (this.showUdoNotificationBar) {
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
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }

        let messageTranslate, actionTranslate: any;
        messageTranslate = this.translate.get('FILE_UPLOAD.MESSAGES.PROGRESS');
        actionTranslate = this.translate.get('FILE_UPLOAD.ACTION.UNDO');

        this.undoNotificationBar.nativeElement.MaterialSnackbar.showSnackbar({
            message: messageTranslate.value,
            timeout: 5000,
            actionHandler: function () {
                latestFilesAdded.forEach((uploadingFileModel: FileModel) => {
                    uploadingFileModel.setAbort();
                });
            },
            actionText: actionTranslate.value
        });
    }

    /**
     * Return the site from the path
     * @returns {any}
     */
    private getSiteId(): string {
        return this.currentFolderPath.replace('/Sites/', '').split('/')[0];
    }

    /**
     * Return the container from the path
     * @returns {any}
     */
    private getContainerId(): string {
        return this.currentFolderPath.replace('/Sites/', '').split('/')[1];
    }

    /**
     * Prints the basic information of a file
     * @param files
     */
    printFileInfo(files: any) {
        for (let file of files) {
            console.log('Name: ' + file.name);
            console.log('Size: ' + file.size);
            console.log('Path: ' + file.webkitRelativePath);
        }
    }
}
