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

import { FileModel } from '@alfresco/adf-core';
import { Input } from '@angular/core';

import {
    Component, EventEmitter, forwardRef, Input,
    OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation
} from '@angular/core';

export abstract class UploadBase {

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

    /** Emitted when the file is uploaded successfully. */
    @Output()
    success = new EventEmitter();

    /** Emitted when an error occurs. */
    @Output()
    error = new EventEmitter();

    constructor() {
    }

    /**
     * Upload a list of file in the specified path
     * @param files
     * @param path
     */
    uploadFiles(files: File[]): void {
        const latestFilesAdded: FileModel[] = files
            .map<FileModel>((file: File) => {
                return this.createFileModel(file, this.rootFolderId, (file.webkitRelativePath || '').replace(/\/[^\/]*$/, ''));
            })
            .filter(this.isFileAcceptable.bind(this))
            .filter(this.isFileSizeAcceptable.bind(this));

        if (latestFilesAdded.length > 0) {
            this.uploadService.addToQueue(...latestFilesAdded);
            this.uploadService.uploadFilesInTheQueue(this.success);
        }
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
    protected createFileModel(file: File, parentId: string, path: string): FileModel {
        return new FileModel(file, {
            majorVersion: this.majorVersion,
            newVersion: this.versioning,
            parentId: parentId,
            path: path
        });
    }

    protected isFileSizeAllowed(file: FileModel) {
        return this.isMaxFileSizeDefined() && this.isFileSizeCorrect(file);
    }

    protected isMaxFileSizeDefined() {
        return this.maxFilesSize !== undefined && this.maxFilesSize !== null;
    }

    protected isFileSizeCorrect(file: FileModel) {
        return this.maxFilesSize < 0 || file.size > this.maxFilesSize;
    }

}
