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
import { Observable, Subject } from 'rxjs/Rx';
import { AlfrescoApiService, AlfrescoContentService, AlfrescoTranslationService, LogService, NotificationService, AlfrescoSettingsService } from 'ng2-alfresco-core';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { UploadService } from '../services/upload.service';
import { FileModel } from '../models/file.model';
import { PermissionModel } from '../models/permissions.model';

@Component({
    selector: 'alfresco-upload-button',
    templateUrl: './upload-button.component.html',
    styleUrls: ['./upload-button.component.css']
})
export class UploadButtonComponent implements OnInit, OnChanges {

    @Input()
    disabled: boolean = false;

    /**
     * @deprecated Deprecated in 1.6.0, you can use UploadService events and NotificationService api instead.
     *
     * @type {boolean}
     * @memberof UploadButtonComponent
     */
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

    /**
     * @deprecated Deprecated in 1.6.0, this property is not used for couple of releases already.
     *
     * @type {string}
     * @memberof UploadDragAreaComponent
     */
    @Input()
    currentFolderPath: string = '/';

    @Input()
    rootFolderId: string = '-root-';

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
                private notificationService: NotificationService,
                private settingsService: AlfrescoSettingsService,
                private apiService: AlfrescoApiService,
                private contentService: AlfrescoContentService) {
        if (translateService) {
            translateService.addTranslationFolder('ng2-alfresco-upload', 'assets/ng2-alfresco-upload');
        }
    }

    ngOnInit() {
        this.settingsService.ecmHostSubject.subscribe((hostEcm: string) => {
            this.checkPermission();
        });

        this.permissionValue.subscribe((permission: boolean) => {
            this.hasPermission = permission;
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        let rootFolderId = changes['rootFolderId'];
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

    isDisableWithNoPermission(): boolean {
        return !this.hasPermission && this.disableWithNoPermission ? true : undefined;
    }

    onFilesAdded($event: any): void {
        let files: File[] = this.getFiles($event.currentTarget.files);

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
            let files: File[] = this.getFiles($event.currentTarget.files);
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
        if (files.length > 0) {
            const latestFilesAdded = files.map(f => new FileModel(f, {
                newVersion: this.versioning,
                parentId: this.rootFolderId,
                path: f.webkitRelativePath.replace(/\/[^\/]*$/, '')
            }));
            this.uploadService.addToQueue(...latestFilesAdded);
            this.uploadService.uploadFilesInTheQueue(this.onSuccess);
            if (this.showNotificationBar) {
                this.showUndoNotificationBar(latestFilesAdded);
            }
        }
    }

    private getFiles(fileList: FileList): File[] {
        const result: File[] = [];

        if (fileList && fileList.length > 0) {
            for (let i = 0; i < fileList.length; i++) {
                result.push(fileList[i]);
            }
        }

        return result;
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
                error => this.onError.emit(error)
            );
        }
    }

    // TODO: move to AlfrescoContentService
    getFolderNode(nodeId: string): Observable<MinimalNodeEntryEntity> {
        let opts: any = {
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
        if (this.hasPermissions(node)) {
            return node.allowableOperations.find(permision => permision === 'create') ? true : false;
        }
        return false;
    }

    private hasPermissions(node: any): boolean {
        return node && node.allowableOperations ? true : false;
    }
}
