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
import { Subject } from 'rxjs/Rx';
import { AlfrescoApiService } from 'ng2-alfresco-core';
import { FileUploadEvent, FileUploadCompleteEvent } from '../events/file.event';
import { FileModel, FileUploadProgress, FileUploadStatus } from '../models/file.model';

@Injectable()
export class UploadService {

    private queue: FileModel[] = [];
    private cache: { [key: string]: any } = {};
    private totalComplete: number = 0;
    private activeTask: Promise<any> = null;

    queueChanged: Subject<FileModel[]> = new Subject<FileModel[]>();
    fileUpload: Subject<FileUploadEvent> = new Subject<FileUploadEvent>();
    fileUploadStarting: Subject<FileUploadEvent> = new Subject<FileUploadEvent>();
    fileUploadCancelled: Subject<FileUploadEvent> = new Subject<FileUploadEvent>();
    fileUploadProgress: Subject<FileUploadEvent> = new Subject<FileUploadEvent>();
    fileUploadAborted: Subject<FileUploadEvent> = new Subject<FileUploadEvent>();
    fileUploadError: Subject<FileUploadEvent> = new Subject<FileUploadEvent>();
    fileUploadComplete: Subject<FileUploadCompleteEvent> = new Subject<FileUploadCompleteEvent>();

    constructor(private apiService: AlfrescoApiService) {
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
        const allowedFiles = files.filter(f => !f.name.startsWith('.'));
        this.queue = this.queue.concat(allowedFiles);
        this.queueChanged.next(this.queue);
        return allowedFiles;
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

                promise.then(
                    () => next(),
                    () => next()
                );
            }
        }
    }

    cancelUpload(...files: FileModel[]) {
        files.forEach(file => {
            file.status = FileUploadStatus.Cancelled;

            const promise = this.cache[file.id];
            if (promise) {
                promise.abort();
                delete this.cache[file.id];
            }

            const event = new FileUploadEvent(file, FileUploadStatus.Cancelled);
            this.fileUpload.next(event);
            this.fileUploadCancelled.next(event);
        });
    }

    private beginUpload(file: FileModel, /* @deprecated */emitter: EventEmitter<any>): any {
        let opts: any = {
                renditions: 'doclib'
            };

        if (file.options.newVersion === true) {
            opts.overwrite = true;
            opts.majorVersion = true;
        } else {
            opts.autoRename = true;
        }
        let promise = this.apiService.getInstance().upload.uploadFile(
            file.file,
            file.options.path,
            file.options.parentId,
            null,
            opts
        );
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
            this.onUploadComplete(file);
            emitter.emit({ value: data });
        })
        .catch(err => {
            this.onUploadError(file, err);
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

            this.queueChanged.next(this.queue);
        }
    }

    private onUploadError(file: FileModel, error: any): void {
        if (file) {
            file.status = FileUploadStatus.Error;

            const promise = this.cache[file.id];
            if (promise) {
                delete this.cache[file.id];
            }

            const event = new FileUploadEvent(file, FileUploadStatus.Error, error);
            this.fileUpload.next(event);
            this.fileUploadError.next(event);
        }
    }

    private onUploadComplete(file: FileModel): void {
        if (file) {
            file.status = FileUploadStatus.Complete;
            this.totalComplete++;

            const promise = this.cache[file.id];
            if (promise) {
                delete this.cache[file.id];
            }

            const event = new FileUploadCompleteEvent(file, this.totalComplete);
            this.fileUpload.next(event);
            this.fileUploadComplete.next(event);

            this.queueChanged.next(this.queue);
        }
    }

    private onUploadAborted(file: FileModel): void {
        if (file) {
            file.status = FileUploadStatus.Aborted;

            const promise = this.cache[file.id];
            if (promise) {
                delete this.cache[file.id];
            }

            const event = new FileUploadEvent(file, FileUploadStatus.Aborted);
            this.fileUpload.next(event);
            this.fileUploadAborted.next(event);
        }
    }
}
