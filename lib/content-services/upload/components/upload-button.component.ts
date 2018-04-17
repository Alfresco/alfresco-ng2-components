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

import { ContentService, EXTENDIBLE_COMPONENT, FileModel, FileUtils,
    LogService, NodePermissionSubject, TranslationService, UploadService
} from '@alfresco/adf-core';
import { Component, EventEmitter, forwardRef, Input,
    OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { PermissionModel } from '../../document-list/models/permissions.model';
import 'rxjs/add/observable/throw';
import { UploadBase } from './base-upload/upload-base';

@Component({
    selector: 'adf-upload-button',
    templateUrl: './upload-button.component.html',
    styleUrls: ['./upload-button.component.scss'],
    viewProviders: [
        { provide: EXTENDIBLE_COMPONENT, useExisting: forwardRef(() => UploadButtonComponent) }
    ],
    encapsulation: ViewEncapsulation.None
})
export class UploadButtonComponent extends UploadBase implements OnInit, OnChanges, NodePermissionSubject {

    /** Toggles component disabled state (if there is no node permission checking). */
    @Input()
    disabled: boolean = false;

    /** Allows/disallows upload folders (only for Chrome). */
    @Input()
    uploadFolders: boolean = false;

    /** Allows/disallows multiple files */
    @Input()
    multipleFiles: boolean = false;

    /** Toggles versioning. */
    @Input()
    versioning: boolean = false;

    /** Sets a limit on the maximum size (in bytes) of a file to be uploaded.
     * Has no effect if undefined.
     */
    @Input()
    maxFilesSize: number;

    /** Defines the text of the upload button. */
    @Input()
    staticTitle: string;

    /** Custom tooltip text. */
    @Input()
    tooltip: string = null;

    /** The ID of the root. Use the nodeId for
     * Content Services or the taskId/processId for Process Services.
     */
    @Input()
    rootFolderId: string = '-root-';

    /** Emitted when the file is uploaded successfully. */
    @Output()
    success = new EventEmitter();

    /** Emitted when an error occurs. */
    @Output()
    error = new EventEmitter();

    /** Emitted when a folder is created. */
    @Output()
    createFolder = new EventEmitter();

    /** Emitted when delete permission is missing. */
    @Output()
    permissionEvent: EventEmitter<PermissionModel> = new EventEmitter<PermissionModel>();

    private hasPermission: boolean = false;

    private permissionValue: Subject<boolean> = new Subject<boolean>();

    constructor(private uploadService: UploadService,
                private contentService: ContentService,
                protected translateService: TranslationService,
                protected logService: LogService
            ) {
                super();
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
    }

    isButtonDisabled(): boolean {
        return this.disabled ? true : undefined;
    }

    onFilesAdded($event: any): void {
        let files: File[] = FileUtils.toFileArray($event.currentTarget.files);

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
            let files: File[] = FileUtils.toFileArray($event.currentTarget.files);
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
        }
    }

    /**
     * Creates FileModel from File
     *
     * @param file
     */
    protected createFileModel(file: File): FileModel {
        return new FileModel(file, {
            newVersion: this.versioning,
            parentId: this.rootFolderId,
            path: (file.webkitRelativePath || '').replace(/\/[^\/]*$/, '')
        });
    }

    /**
     * Checks if the given file is an acceptable size
     *
     * @param file FileModel
     */
    private isFileSizeAcceptable(file: FileModel): boolean {
        let acceptableSize = true;

        if (this.isFileSizeAllowed(file)) {
            acceptableSize = false;

            this.translateService.get('FILE_UPLOAD.MESSAGES.EXCEED_MAX_FILE_SIZE', {fileName: file.name}).subscribe((message: string) => {
                this.error.emit(message);
            });
        }

        return acceptableSize;
    }

    private isFileSizeAllowed(file: FileModel) {
        return this.isMaxFileSizeDefined() && this.isFileSizeCorrect(file);
    }

    private isMaxFileSizeDefined() {
        return this.maxFilesSize !== undefined && this.maxFilesSize !== null;
    }

    private isFileSizeCorrect(file: FileModel) {
        return this.maxFilesSize < 0 || file.size > this.maxFilesSize;
    }

    checkPermission() {
        if (this.rootFolderId) {
            let opts: any = {
                includeSource: true,
                include: ['allowableOperations']
            };

            this.contentService.getNode(this.rootFolderId, opts).subscribe(
                res => this.permissionValue.next(this.hasCreatePermission(res.entry)),
                error => this.error.emit(error)
            );
        }
    }

    private hasCreatePermission(node: any): boolean {
        if (node && node.allowableOperations) {
            return node.allowableOperations.find(permission => permission === 'create') ? true : false;
        }
        return false;
    }
}
