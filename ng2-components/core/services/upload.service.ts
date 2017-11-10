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

import { EventEmitter, Injectable } from '@angular/core';
import * as minimatch from 'minimatch';
import { Subject } from 'rxjs/Rx';
import { FileUploadCompleteEvent, FileUploadDeleteEvent, FileUploadErrorEvent, FileUploadEvent } from '../events/file.event';
import { FileModel, FileUploadProgress, FileUploadStatus } from '../models/file.model';
import { AlfrescoApiService } from './alfresco-api.service';
import { AppConfigService } from './app-config.service';

@Injectable()
export class UploadService {

    private queue: FileModel[] = [];
    private cache: { [key: string]: any } = {};
    private totalComplete: number = 0;
    private totalAborted: number = 0;
    private totalError: number = 0;
    private activeTask: Promise<any> = null;
    private excludedFileList: String[] = [];

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

    constructor(private apiService: AlfrescoApiService, private appConfigService: AppConfigService) {
        this.excludedFileList = <String[]> this.appConfigService.get('files.excluded');
    }

    /**
     * Checks whether the service is uploading a file.
     *
     * @returns {boolean}
     *
     * @memberof UploadService
     */
    isUploading(): boolean {
        return this.activeTask ? true : false;
    }

    /**
     * Returns the file Queue
     *
     * @return {FileModel[]} - files in the upload queue.
     */
    getQueue(): FileModel[] {
        return this.queue;
    }

    /**
     * Add files to the uploading queue to be uploaded.
     *
     * Examples:
     *  addToQueue(file); // pass one file
     *  addToQueue(file1, file2, file3); // pass multiple files
     *  addToQueue(...[file1, file2, file3]); // pass an array of files
     */
    addToQueue(...files: FileModel[]): FileModel[] {
        const allowedFiles = files.filter(f => this.filterElement(f));
        this.queue = this.queue.concat(allowedFiles);
        this.queueChanged.next(this.queue);
        return allowedFiles;
    }

    private filterElement(file: FileModel) {
        let isAllowed = true;
        if (this.excludedFileList) {
            isAllowed = this.excludedFileList.filter(expr => minimatch(file.name, expr)).length === 0;
        }
        return isAllowed;
    }

    /**
     * Pick all the files in the queue that are not been uploaded yet and upload it into the directory folder.
     *
     * @param {EventEmitter<any>} emitter @deprecated emitter to invoke on file status change
     *
     * @memberof UploadService
     */
    uploadFilesInTheQueue(emitter: EventEmitter<any>): void {
        if (!this.activeTask) {
            let file = this.queue.find(f => f.status === FileUploadStatus.Pending);
            if (file) {
                this.onUploadStarting(file);

                const promise = this.beginUpload(file, emitter);
                this.activeTask = promise;
                this.cache[file.id] = promise;

                let next = () => {
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

    cancelUpload(...files: FileModel[]) {
        files.forEach(file => {
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

    clearQueue() {
        this.queue = [];
        this.totalComplete = 0;
        this.totalAborted = 0;
        this.totalError = 0;
    }

    getUploadPromise(file: FileModel) {
        let opts: any = {
                renditions: 'doclib'
            };

        if (file.options.newVersion === true) {
            opts.overwrite = true;
            opts.majorVersion = true;
        } else {
            opts.autoRename = true;
        }
        return this.apiService.getInstance().upload.uploadFile(
            file.file,
            file.options.path,
            file.options.parentId,
            null,
            opts
        );
    }

    private beginUpload(file: FileModel, /* @deprecated */emitter: EventEmitter<any>): any {

        let promise = this.getUploadPromise(file);

        promise.on('progress', (progress: FileUploadProgress) => {
            this.onUploadProgress(file, progress);
        })
        .on('abort', () => {
            this.onUploadAborted(file);
            emitter.emit({ value: 'File aborted' });
        })
        .on('error', err => {
            this.onUploadError(file, err);
            emitter.emit({ value: 'Error file uploaded' });
        })
        .on('success', data => {
            this.onUploadComplete(file, data);
            emitter.emit({ value: data });
        })
        .catch(err => {
            throw err;
        });

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
