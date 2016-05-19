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
import { FileUploadingDialogComponent } from './file-uploading-dialog.component';
import { FileDraggableDirective } from '../directives/file-draggable.directive';

declare let __moduleName: string;

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
@Component({
    selector: 'alfresco-upload-drag-area',
    moduleId: __moduleName,
    directives: [FileDraggableDirective, FileUploadingDialogComponent],
    templateUrl: './upload-drag-area.component.html',
    styleUrls: ['./upload-drag-area.component.css']
})
export class UploadDragAreaComponent {

    private _uploaderService: UploadService;

    @ViewChild('fileUploadingDialog')
    fileUploadingDialogComponent: FileUploadingDialogComponent;

    @Input()
    showUploadDialog: boolean = true;

    filesUploadingList: FileModel [] = [];

    @Input()
    uploaddirectory: string = '';

    @Input()
    currentFolderPath: string = '/Sites/swsdp/documentLibrary';

    @Output()
    onSuccess = new EventEmitter();

    constructor(public el: ElementRef) {
        console.log('UploadComponent constructor', el);

        let site = this.getSiteId();
        let container = this.getContainerId();

        this._uploaderService = new UploadService({
            fieldName: 'filedata',
            formFields: {
                siteid: site,
                containerid: container
            }
        });
    }

    /**
     * Method called when files are dropped in the drag area.
     *
     * @param {File[]} files - files dropped in the drag area.
     */
    onFilesDropped(files: File[]): void {
        if (files.length) {
            this._uploaderService.addToQueue(files);
            this._uploaderService.uploadFilesInTheQueue(this.uploaddirectory, this.onSuccess);
            this.filesUploadingList = this._uploaderService.getQueue();
            if (this.showUploadDialog) {
                this._showDialog();
            }
        }
    }

    /**
     * Called when the file are dropped in the drag area
     * @param item - FileEntity
     */
    onFilesEntityDropped(item: any): void {
        let self = this;
        item.file(function (file: any) {
            self._uploaderService.addToQueue([file]);
            let path = item.fullPath.replace(item.name, '');
            let filePath = self.uploaddirectory + path;
            self._uploaderService.uploadFilesInTheQueue(filePath, self.onSuccess);
            self.filesUploadingList = self._uploaderService.getQueue();
            if (self.showUploadDialog) {
                self._showDialog();
            }
        });
    }

    /**
     * Called when a folder are dropped in the drag area
     * @param folder - name of the dropped folder
     */
    onFolderEntityDropped(folder: any): void {
        if (folder.isDirectory) {
            let relativePath = folder.fullPath.replace(folder.name, '');
            relativePath = this.currentFolderPath + relativePath;

            this._uploaderService.createFolder(relativePath, folder.name)
                .subscribe(
                    message => {
                        let self = this;
                        let dirReader = folder.createReader();
                        dirReader.readEntries(function (entries: any) {
                            for (let i = 0; i < entries.length; i++) {
                                self._traverseFileTree(entries[i]);
                            }
                        });
                    },
                    error => {
                        console.log(error);
                    }
                );
        }
    }

    /**
     * Travers all the files and folders, and create it on the alfresco.
     *
     * @param {Object} item - can contains files or folders.
     */
    private _traverseFileTree(item: any): void {
        if (item.isFile) {
            let self = this;
            self.onFilesEntityDropped(item);
        } else {
            if (item.isDirectory) {
                let self = this;
                self.onFolderEntityDropped(item);
            }
        }
    }

    /**
     * Show the upload dialog.
     */
    private _showDialog(): void {
        this.fileUploadingDialogComponent.showDialog();
    }

    /**
     * Return the site from the path
     * @returns {string}
     */
    private getSiteId(): string {
        return this.currentFolderPath.replace('/Sites/', '').split('/')[0];
    }

    /**
     * Return the container from the path
     * @returns {string}
     */
    private getContainerId(): string {
        return this.currentFolderPath.replace('/Sites/', '').split('/')[1];
    }
}
