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

import {
    AlfrescoApiService,
    EXTENDIBLE_COMPONENT,
    FileModel,
    FileUtils,
    LogService,
    NodePermissionSubject,
    NotificationService,
    TranslationService,
    UploadService
} from '@alfresco/core';
import {
    Component,
    EventEmitter,
    forwardRef,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewEncapsulation
} from '@angular/core';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { Observable, Subject } from 'rxjs/Rx';
import { PermissionModel } from '../../document-list/models/permissions.model';

@Component({
    selector: 'adf-upload-button',
    templateUrl: './upload-button.component.html',
    styleUrls: ['./upload-button.component.scss'],
    providers: [
        {provide: EXTENDIBLE_COMPONENT, useExisting: forwardRef(() => UploadButtonComponent)}
    ],
    encapsulation: ViewEncapsulation.None
})
export class UploadButtonComponent implements OnInit, OnChanges, NodePermissionSubject {

    /** @deprecated Deprecated in 1.6.0, you can use UploadService events and NotificationService api instead. */
    @Input()
    showNotificationBar = true;

    /** @deprecated Deprecated in 1.6.0, this property is not used for couple of releases already. */
    @Input()
    currentFolderPath = '/';

    /** @deprecated Deprecated in 1.8.0, use the button with combination of adf-node-permission directive */
    @Input()
    disableWithNoPermission = false;

    @Input()
    disabled = false;

    @Input()
    uploadFolders = false;

    @Input()
    multipleFiles = false;

    @Input()
    versioning = false;

    @Input()
    acceptedFilesType = '*';

    @Input()
    maxFilesSize: number;

    @Input()
    staticTitle: string;

    @Input()
    tooltip: string = null;

    @Input()
    rootFolderId = '-root-';

    @Output()
    success = new EventEmitter();

    @Output()
    error = new EventEmitter();

    @Output()
    createFolder = new EventEmitter();

    @Output()
    permissionEvent: EventEmitter<PermissionModel> = new EventEmitter<PermissionModel>();

    private hasPermission = false;

    private permissionValue: Subject<boolean> = new Subject<boolean>();

    constructor(private uploadService: UploadService,
                private translateService: TranslationService,
                private logService: LogService,
                private notificationService: NotificationService,
                private apiService: AlfrescoApiService) {
    }

    ngOnInit() {
        this.permissionValue.subscribe((permission: boolean) => {
            this.hasPermission = permission;
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        const rootFolderId = changes['rootFolderId'];
        if (rootFolderId && rootFolderId.currentValue) {
            this.checkPermission();
        }
    }

    isButtonDisabled(): boolean {
        return this.isForceDisable() || this.isDisableWithNoPermission();
    }

    isForceDisable(): boolean {
        return this.disabled ? true : undefined;
    }

    /** @deprecated Deprecated in 1.8.0, use the button with combination of adf-node-permission directive */
    isDisableWithNoPermission(): boolean {
        return !this.hasPermission && this.disableWithNoPermission ? true : undefined;
    }

    onFilesAdded($event: any): void {
        const files: File[] = FileUtils.toFileArray($event.currentTarget.files);

        if (this.hasPermission) {
            this.uploadFiles(files);
        } else {
            this.permissionEvent.emit(new PermissionModel({type: 'content', action: 'upload', permission: 'create'}));
        }
        // reset the value of the input file
        $event.target.value = '';
    }

    onDirectoryAdded($event: any): void {
        if (this.hasPermission) {
            const files: File[] = FileUtils.toFileArray($event.currentTarget.files);
            this.uploadFiles(files);
        } else {
            this.permissionEvent.emit(new PermissionModel({type: 'content', action: 'upload', permission: 'create'}));
        }
        // reset the value of the input file
        $event.target.value = '';
    }

    /**
     * Upload a list of file in the specified path
     * @param files
     * @param path
     */
    uploadFiles(files: File[]): void {
        const latestFilesAdded: FileModel[] = files
            .map<FileModel>(this.createFileModel.bind(this))
            .filter(this.isFileAcceptable.bind(this))
            .filter(this.isFileSizeAcceptable.bind(this));

        if (latestFilesAdded.length > 0) {
            this.uploadService.addToQueue(...latestFilesAdded);
            this.uploadService.uploadFilesInTheQueue(this.success);
            if (this.showNotificationBar) {
                this.showUndoNotificationBar(latestFilesAdded);
            }
        }
    }

    /**
     * Creates FileModel from File
     *
     * @param file
     */
    private createFileModel(file: File): FileModel {
        return new FileModel(file, {
            newVersion: this.versioning,
            parentId: this.rootFolderId,
            path: (file.webkitRelativePath || '').replace(/\/[^\/]*$/, '')
        });
    }

    /**
     * Checks if the given file is allowed by the extension filters
     *
     * @param file FileModel
     */
    private isFileAcceptable(file: FileModel): boolean {
        if (this.acceptedFilesType === '*') {
            return true;
        }

        const allowedExtensions = this.acceptedFilesType
            .split(',')
            .map(ext => ext.replace(/^\./, ''));

        if (allowedExtensions.indexOf(file.extension) !== -1) {
            return true;
        }

        return false;
    }

    /**
     * Checks if the given file is an acceptable size
     *
     * @param file FileModel
     */
    private isFileSizeAcceptable(file: FileModel): boolean {
        let acceptableSize = true;

        if ((this.maxFilesSize !== undefined && this.maxFilesSize !== null ) && (this.maxFilesSize <= 0 || file.size > this.maxFilesSize)) {
            acceptableSize = false;

            this.translateService.get('FILE_UPLOAD.MESSAGES.EXCEED_MAX_FILE_SIZE', {fileName: file.name}).subscribe((message: string) => {
                this.error.emit(message);
            });
        }

        return acceptableSize;
    }

    /**
     * Show undo notification bar.
     *
     * @param {FileModel[]} latestFilesAdded - files in the upload queue enriched with status flag and xhr object.
     */
    private showUndoNotificationBar(latestFilesAdded: FileModel[]): void {
        let messageTranslate: any, actionTranslate: any;
        messageTranslate = this.translateService.get('FILE_UPLOAD.MESSAGES.PROGRESS');
        actionTranslate = this.translateService.get('FILE_UPLOAD.ACTION.UNDO');

        this.notificationService.openSnackMessageAction(messageTranslate.value, actionTranslate.value, 3000).onAction().subscribe(() => {
            this.uploadService.cancelUpload(...latestFilesAdded);
        });
    }

    checkPermission() {
        if (this.rootFolderId) {
            this.getFolderNode(this.rootFolderId).subscribe(
                res => this.permissionValue.next(this.hasCreatePermission(res)),
                error => this.error.emit(error)
            );
        }
    }

    // TODO: move to ContentService
    getFolderNode(nodeId: string): Observable<MinimalNodeEntryEntity> {
        const opts: any = {
            includeSource: true,
            include: ['allowableOperations']
        };

        return Observable.fromPromise(this.apiService.getInstance().nodes.getNodeInfo(nodeId, opts))
            .catch(err => this.handleError(err));
    }

    private handleError(error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        this.logService.error(error);
        return Observable.throw(error || 'Server error');
    }

    private hasCreatePermission(node: any): boolean {
        if (node && node.allowableOperations) {
            return node.allowableOperations.find(permission => permission === 'create') ? true : false;
        }
        return false;
    }
}
