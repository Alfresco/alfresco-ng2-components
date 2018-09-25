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

import { FileModel, FileInfo } from '@alfresco/adf-core';
import { EventEmitter, Input, Output, OnInit, OnDestroy, NgZone } from '@angular/core';
import { UploadService, TranslationService } from '@alfresco/adf-core';
import { Subscription } from 'rxjs';
import { UploadFilesEvent } from '../upload-files.event';

export abstract class UploadBase implements OnInit, OnDestroy {

    /** Sets a limit on the maximum size (in bytes) of a file to be uploaded.
     * Has no effect if undefined.
     */
    @Input()
    maxFilesSize: number;

    /** The ID of the root. Use the nodeId for
     * Content Services or the taskId/processId for Process Services.
     */
    @Input()
    rootFolderId: string = '-root-';

    /** Toggles component disabled state (if there is no node permission checking). */
    @Input()
    disabled: boolean = false;

    /** Filter for accepted file types. */
    @Input()
    acceptedFilesType: string = '*';

    /** Toggles versioning. */
    @Input()
    versioning: boolean = false;

    /** majorVersion boolean field to true to indicate a major version should be created. */
    @Input()
    majorVersion: boolean = false;

    /** When you overwrite existing content, you can use the comment field to add a version comment that appears in the version history */
    @Input()
    comment: string;

    /** Custom node type for uploaded file */
    @Input()
    nodeType: string = 'cm:content';

    /** Emitted when the file is uploaded successfully. */
    @Output()
    success = new EventEmitter();

    /**
     * Emitted when a folder is created.
     * @deprecated 2.4.0 No longer used by the framework
     */
    @Output()
    createFolder = new EventEmitter();

    /** Emitted when an error occurs. */
    @Output()
    error = new EventEmitter();

    /** Emitted when the upload begins. */
    @Output()
    beginUpload = new EventEmitter<UploadFilesEvent>();

    protected subscriptions: Subscription[] = [];

    constructor(protected uploadService: UploadService,
                protected translationService: TranslationService,
                protected ngZone: NgZone) {
    }

    ngOnInit() {
        this.subscriptions.push(
            this.uploadService.fileUploadError.subscribe((error) => {
                this.error.emit(error);
            })
        );

    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }

    /**
     * Upload a list of file in the specified path
     * @param files
     * @param path
     */
    uploadFiles(files: File[]): void {
        const filteredFiles: FileModel[] = files
            .map<FileModel>((file: File) => {
                return this.createFileModel(file, this.rootFolderId, (file.webkitRelativePath || '').replace(/\/[^\/]*$/, ''));
            });

        this.uploadQueue(filteredFiles);
    }

    uploadFilesInfo(files: FileInfo[]): void {
        const filteredFiles: FileModel[] = files
            .map<FileModel>((fileInfo: FileInfo) => {
                return this.createFileModel(fileInfo.file, this.rootFolderId, fileInfo.relativeFolder);
            });

        this.uploadQueue(filteredFiles);
    }

    private uploadQueue(files: FileModel[]) {
        let filteredFiles = files
            .filter(this.isFileAcceptable.bind(this))
            .filter(this.isFileSizeAcceptable.bind(this));

        this.ngZone.run(() => {
            const event = new UploadFilesEvent(
                [...filteredFiles],
                this.uploadService,
                this.success
            );
            this.beginUpload.emit(event);

            if (!event.defaultPrevented) {
                if (filteredFiles.length > 0) {
                    this.uploadService.addToQueue(...filteredFiles);
                    this.uploadService.uploadFilesInTheQueue(this.success);
                }
            }
        });
    }

    /**
     * Checks if the given file is allowed by the extension filters
     *
     * @param file FileModel
     */
    protected isFileAcceptable(file: FileModel): boolean {
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
     * Creates FileModel from File
     *
     * @param file
     */
    protected createFileModel(file: File, parentId: string, path: string, id?: string): FileModel {
        return new FileModel(file, {
            comment: this.comment,
            majorVersion: this.majorVersion,
            newVersion: this.versioning,
            parentId: parentId,
            path: path,
            nodeType: this.nodeType
        }, id);
    }

    protected isFileSizeAllowed(file: FileModel) {
        let isFileSizeAllowed = true;
        if (this.isMaxFileSizeDefined()) {
            isFileSizeAllowed = this.isFileSizeCorrect(file);
        }

        return isFileSizeAllowed;
    }

    protected isMaxFileSizeDefined() {
        return this.maxFilesSize !== undefined && this.maxFilesSize !== null;
    }

    protected isFileSizeCorrect(file: FileModel) {
        return this.maxFilesSize >= 0 && file.size <= this.maxFilesSize;
    }

    /**
     * Checks if the given file is an acceptable size
     *
     * @param file FileModel
     */
    private isFileSizeAcceptable(file: FileModel): boolean {
        let acceptableSize = true;

        if (!this.isFileSizeAllowed(file)) {
            acceptableSize = false;

            const message = this.translationService.instant(
                'FILE_UPLOAD.MESSAGES.EXCEED_MAX_FILE_SIZE',
                { fileName: file.name }
            );

            this.error.emit(message);
        }

        return acceptableSize;
    }

}
