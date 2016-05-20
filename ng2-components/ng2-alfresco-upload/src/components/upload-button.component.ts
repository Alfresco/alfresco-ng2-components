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
import { AlfrescoTranslationService, AlfrescoPipeTranslate } from 'ng2-alfresco-core/services';
import 'rxjs/Rx';

declare let componentHandler: any;
declare let __moduleName: string;

/**
 * <alfresco-upload-button [showDialogUpload]="boolean"
 *                         [showUdoNotificationBar]="boolean"
 *                         [uploadFolders]="boolean"
 *                         [multipleFiles]="boolean"
 *                         [acceptedFilesType]="string"
 *                         (onSuccess)="customMethod($event)">
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
 * @Output - onSuccess - The event is emitted when the file is uploaded
 *
 * @returns {UploadDragAreaComponent} .
 */
@Component({
    selector: 'alfresco-upload-button',
    moduleId: __moduleName,
    directives: [FileUploadingDialogComponent],
    templateUrl: './upload-button.component.html',
    styleUrls: ['./upload-button.component.css'],
    pipes: [AlfrescoPipeTranslate]
})
export class UploadButtonComponent {

    @ViewChild('undoNotificationBar')
    undoNotificationBar: any;

    @ViewChild('fileUploadingDialog')
    fileUploadingDialogComponent: FileUploadingDialogComponent;

    @Input()
    showUploadDialog: boolean = true;

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

    filesUploadingList: FileModel [] = [];

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

        translate.addComponent('node_modules/ng2-alfresco-upload');
    }

    /**
     * Method called when files are dropped in the drag area.
     *
     * @param {File[]} files - files dropped in the drag area.
     */
    onFilesAdded($event: any): void {
        let files = $event.currentTarget.files;
        if (files.length) {
            let latestFilesAdded = this._uploaderService.addToQueue(files);
            this._uploaderService.uploadFilesInTheQueue(this.uploaddirectory, this.onSuccess);
            this.filesUploadingList = this._uploaderService.getQueue();
            if (this.showUploadDialog) {
                this._showDialog();
            }
            if (this.showUdoNotificationBar) {
                this._showUndoNotificationBar(latestFilesAdded);
            }
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

        this.undoNotificationBar.nativeElement.MaterialSnackbar.showSnackbar({
            message: this.translate.get('FILE_UPLOAD.MESSAGES.PROGRESS'),
            timeout: 5000,
            actionHandler: function () {
                latestFilesAdded.forEach((uploadingFileModel: FileModel) => {
                    uploadingFileModel.setAbort();
                });
            },
            actionText: this.translate.get('FILE_UPLOAD.ACTION.UNDO')
        });
    }

    /**
     * Show the upload dialog.
     */
    private _showDialog(): void {
        this.fileUploadingDialogComponent.showDialog();
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
}
