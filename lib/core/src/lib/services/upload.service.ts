/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { EventEmitter, Injectable } from '@angular/core';
import { Minimatch } from 'minimatch-browser';
import { Subject } from 'rxjs';
import { AppConfigService } from '../app-config/app-config.service';
import {
    FileUploadCompleteEvent,
    FileUploadDeleteEvent,
    FileUploadErrorEvent,
    FileUploadEvent
} from '../events/file.event';
import { FileModel, FileUploadProgress, FileUploadStatus } from '../models/file.model';
import { AlfrescoApiService } from './alfresco-api.service';

@Injectable({
    providedIn: 'root'
})
export class UploadService {

    private cache: { [key: string]: any } = {};
    private totalComplete: number = 0;
    private totalAborted: number = 0;
    private totalError: number = 0;
    private excludedFileList: string[] = [];
    private matchingOptions: any = null;

    activeTask: Promise<any> = null;
    queue: FileModel[] = [];

    queueChanged: Subject<FileModel[]> = new Subject<FileModel[]>();
    fileUpload: Subject<FileUploadEvent> = new Subject<FileUploadEvent>();
    fileUploadStarting: Subject<FileUploadEvent> = new Subject<FileUploadEvent>();
    fileUploadCancelled: Subject<FileUploadEvent> = new Subject<FileUploadEvent>();
    fileUploadProgress: Subject<FileUploadEvent> = new Subject<FileUploadEvent>();
    fileUploadAborted: Subject<FileUploadEvent> = new Subject<FileUploadEvent>();
    fileUploadError: Subject<FileUploadErrorEvent> = new Subject<FileUploadErrorEvent>();
    fileUploadComplete: Subject<FileUploadCompleteEvent> = new Subject<FileUploadCompleteEvent>();
    fileUploadDeleted: Subject<FileUploadDeleteEvent> = new Subject<FileUploadDeleteEvent>();
    fileDeleted: Subject<string> = new Subject<string>();

    constructor(protected apiService: AlfrescoApiService, private appConfigService: AppConfigService) {
    }

    /**
     * Checks whether the service is uploading a file.
     * @returns True if a file is uploading, false otherwise
     */
    isUploading(): boolean {
        return this.activeTask ? true : false;
    }

    /**
     * Gets the file Queue
     * @returns Array of files that form the queue
     */
    getQueue(): FileModel[] {
        return this.queue;
    }

    /**
     * Adds files to the uploading queue to be uploaded
     * @param files One or more separate parameters or an array of files to queue
     * @returns Array of files that were not blocked from upload by the ignore list
     */
    addToQueue(...files: FileModel[]): FileModel[] {
        const allowedFiles = files.filter((currentFile) => this.filterElement(currentFile));
        this.queue = this.queue.concat(allowedFiles);
        this.queueChanged.next(this.queue);
        return allowedFiles;
    }

    private filterElement(file: FileModel) {
        let isAllowed = true;

        this.excludedFileList = <string[]> this.appConfigService.get('files.excluded');
        if (this.excludedFileList) {

            this.matchingOptions = this.appConfigService.get('files.match-options');

            isAllowed = this.excludedFileList.filter((pattern) => {
                const minimatch = new Minimatch(pattern, this.matchingOptions);
                return minimatch.match(file.name);
            }).length === 0;
        }
        return isAllowed;
    }

    /**
     * Finds all the files in the queue that are not yet uploaded and uploads them into the directory folder.
     * @param emitter Emitter to invoke on file status change
     */
    uploadFilesInTheQueue(emitter?: EventEmitter<any>): void {
        if (!this.activeTask) {
            const file = this.queue.find((currentFile) => currentFile.status === FileUploadStatus.Pending);
            if (file) {
                this.onUploadStarting(file);

                const promise = this.beginUpload(file, emitter);
                this.activeTask = promise;
                this.cache[file.id] = promise;

                const next = () => {
                    this.activeTask = null;
                    setTimeout(() => this.uploadFilesInTheQueue(emitter), 100);
                };

                promise.next = next;

                promise.then(
                    () => next(),
                    () => next()
                );
            }
        }
    }

    /**
     * Cancels uploading of files.
     * @param files One or more separate parameters or an array of files specifying uploads to cancel
     */
    cancelUpload(...files: FileModel[]) {
        files.forEach((file) => {
            const promise = this.cache[file.id];

            if (promise) {
                promise.abort();
                delete this.cache[file.id];
            } else {
                const performAction = this.getAction(file);
                performAction();
            }
        });
    }

    /** Clears the upload queue */
    clearQueue() {
        this.queue = [];
        this.totalComplete = 0;
        this.totalAborted = 0;
        this.totalError = 0;
    }

    /**
     * Gets an upload promise for a file.
     * @param file The target file
     * @returns Promise that is resolved if the upload is successful or error otherwise
     */
    getUploadPromise(file: FileModel): any {
        const opts: any = {
            renditions: 'doclib',
            include: ['allowableOperations']
        };

        if (file.options.newVersion === true) {
            opts.overwrite = true;
            opts.majorVersion = file.options.majorVersion;
            opts.comment = file.options.comment;
            opts.name = file.name;
        } else {
            opts.autoRename = true;
        }

        if (file.options.nodeType) {
            opts.nodeType = file.options.nodeType;
        }

        if (file.id) {
            return this.apiService.getInstance().node.updateNodeContent(
                file.id,
                file.file,
                opts
            );
        } else {
            return this.apiService.getInstance().upload.uploadFile(
                file.file,
                file.options.path,
                file.options.parentId,
                file.options,
                opts
            );
        }
    }

    private beginUpload(file: FileModel, emitter: EventEmitter<any>): any {

        const promise = this.getUploadPromise(file);

        promise.on('progress', (progress: FileUploadProgress) => {
            this.onUploadProgress(file, progress);
        })
            .on('abort', () => {
                this.onUploadAborted(file);
                if (emitter) {
                    emitter.emit({ value: 'File aborted' });
                }
            })
            .on('error', (err) => {
                this.onUploadError(file, err);
                if (emitter) {
                    emitter.emit({ value: 'Error file uploaded' });
                }
            })
            .on('success', (data) => {
                this.onUploadComplete(file, data);
                if (emitter) {
                    emitter.emit({ value: data });
                }
            })
            .catch(() => {});

        return promise;
    }

    private onUploadStarting(file: FileModel): void {
        if (file) {
            file.status = FileUploadStatus.Starting;
            const event = new FileUploadEvent(file, FileUploadStatus.Starting);
            this.fileUpload.next(event);
            this.fileUploadStarting.next(event);
        }
    }

    private onUploadProgress(file: FileModel, progress: FileUploadProgress): void {
        if (file) {
            file.progress = progress;
            file.status = FileUploadStatus.Progress;

            const event = new FileUploadEvent(file, FileUploadStatus.Progress);
            this.fileUpload.next(event);
            this.fileUploadProgress.next(event);
        }
    }

    private onUploadError(file: FileModel, error: any): void {
        if (file) {
            file.errorCode = ( error || {} ).status;
            file.status = FileUploadStatus.Error;
            this.totalError++;

            const promise = this.cache[file.id];
            if (promise) {
                delete this.cache[file.id];
            }

            const event = new FileUploadErrorEvent(file, error, this.totalError);
            this.fileUpload.next(event);
            this.fileUploadError.next(event);
        }
    }

    private onUploadComplete(file: FileModel, data: any): void {
        if (file) {
            file.status = FileUploadStatus.Complete;
            file.data = data;
            this.totalComplete++;

            const promise = this.cache[file.id];
            if (promise) {
                delete this.cache[file.id];
            }

            const event = new FileUploadCompleteEvent(file, this.totalComplete, data, this.totalAborted);
            this.fileUpload.next(event);
            this.fileUploadComplete.next(event);
        }
    }

    private onUploadAborted(file: FileModel): void {
        if (file) {
            file.status = FileUploadStatus.Aborted;
            this.totalAborted++;

            const promise = this.cache[file.id];
            if (promise) {
                delete this.cache[file.id];
            }

            const event = new FileUploadEvent(file, FileUploadStatus.Aborted);
            this.fileUpload.next(event);
            this.fileUploadAborted.next(event);
            promise.next();
        }
    }

    private onUploadCancelled(file: FileModel): void {
        if (file) {
            file.status = FileUploadStatus.Cancelled;

            const event = new FileUploadEvent(file, FileUploadStatus.Cancelled);
            this.fileUpload.next(event);
            this.fileUploadCancelled.next(event);
        }
    }

    private onUploadDeleted(file: FileModel): void {
        if (file) {
            file.status = FileUploadStatus.Deleted;
            this.totalComplete--;

            const event = new FileUploadDeleteEvent(file, this.totalComplete);
            this.fileUpload.next(event);
            this.fileUploadDeleted.next(event);
        }
    }

    private getAction(file) {
        const actions = {
            [FileUploadStatus.Pending]: () => this.onUploadCancelled(file),
            [FileUploadStatus.Deleted]: () => this.onUploadDeleted(file),
            [FileUploadStatus.Error]: () => this.onUploadError(file, null)
        };

        return actions[file.status];
    }
}
