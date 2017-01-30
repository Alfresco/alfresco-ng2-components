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
import { Response } from '@angular/http';
import { Observer, Observable } from 'rxjs/Rx';
import { AlfrescoApiService, LogService } from 'ng2-alfresco-core';
import { FileModel } from '../models/file.model';

/**
 *
 * UploadService keep the queue of the file to upload and uploads them.
 *
 * @returns {UploadService} .
 */
@Injectable()
export class UploadService {

    private formFields: Object = {};
    private queue: FileModel[] = [];
    private versioning: boolean = false;
    private filesUploadObserverProgressBar: Observer<FileModel[]>;
    private totalCompletedObserver: Observer<number>;

    totalCompleted: number = 0;
    filesUpload$: Observable<FileModel[]>;
    totalCompleted$: Observable<any>;

    constructor(private apiService: AlfrescoApiService,
                private logService: LogService) {
        this.filesUpload$ = new Observable<FileModel[]>(observer => this.filesUploadObserverProgressBar = observer).share();
        this.totalCompleted$ = new Observable<number>(observer => this.totalCompletedObserver = observer).share();
    }

    /**
     * Configure the service
     *
     * @param {Object} - options formFields to init the object
     * @param {boolean} - versioning true to indicate that a major version should be created
     *
     */
    setOptions(options: any, versioning: boolean): void {
        this.formFields = options.formFields != null ? options.formFields : this.formFields;
        this.versioning = versioning != null ? versioning : this.versioning;
    }

    /**
     * Add files to the uploading queue to be uploaded.
     *
     * @param {File[]} - files to add to the upload queue.
     *
     * return {FileModel[]} - return the file added to the queue in this call.
     */
    addToQueue(files: any[]): FileModel[] {
        let latestFilesAdded: FileModel[] = [];

        for (let file of files) {
            if (this.isFile(file)) {
                let uploadingFileModel = new FileModel(file);
                latestFilesAdded.push(uploadingFileModel);
                this.queue.push(uploadingFileModel);
                if (this.filesUploadObserverProgressBar) {
                    this.filesUploadObserverProgressBar.next(this.queue);
                }
            }
        }
        return latestFilesAdded;
    }

    /**
     * Pick all the files in the queue that are not been uploaded yet and upload it into the directory folder.
     */
    uploadFilesInTheQueue(rootId: string, directory: string, elementEmit: EventEmitter<any>): void {
        let filesToUpload = this.queue.filter((uploadingFileModel) => {
            return !uploadingFileModel.uploading && !uploadingFileModel.done && !uploadingFileModel.abort && !uploadingFileModel.error;
        });

        let opts: any = {};
        opts.renditions = 'doclib';

        if (this.versioning) {
            opts.overwrite = true;
            opts.majorVersion = true;
        } else {
            opts.autoRename = true;
        }

        filesToUpload.forEach((uploadingFileModel: FileModel) => {
            uploadingFileModel.setUploading();

            let promiseUpload = this.apiService.getInstance().upload.uploadFile(uploadingFileModel.file, directory, rootId, null, opts)
                .on('progress', (progress: any) => {
                    uploadingFileModel.setProgres(progress);
                    this.updateFileListStream(this.queue);
                })
                .on('abort', () => {
                    uploadingFileModel.setAbort();
                    elementEmit.emit({
                        value: 'File aborted'
                    });
                })
                .on('error', () => {
                    uploadingFileModel.setError();
                    elementEmit.emit({
                        value: 'Error file uploaded'
                    });
                })
                .on('success', (data: any) => {
                    elementEmit.emit({
                        value: data
                    });
                    uploadingFileModel.onFinished(
                        data.status,
                        data.statusText,
                        data.response
                    );

                    this.updateFileListStream(this.queue);
                    if (!uploadingFileModel.abort && !uploadingFileModel.error) {
                        this.updateFileCounterStream(++this.totalCompleted);
                    }
                });

            uploadingFileModel.setPromiseUpload(promiseUpload);
        });
    }

    /**
     * Return all the files in the uploading queue.
     *
     * @return {FileModel[]} - files in the upload queue.
     */
    getQueue(): FileModel[] {
        return this.queue;
    }

    /**
     * Check if an item is a file.
     *
     * @return {boolean}
     */
    private isFile(file: any): boolean {
        return file !== null && (file instanceof Blob || (file.name && file.size));
    }

    /**
     * Create a folder
     * @param name - the folder name
     */
    createFolder(relativePath: string, name: string) {
        return Observable.fromPromise(this.callApiCreateFolder(relativePath, name))
            .map(res => {
                return res;
            })
            .do(data => this.logService.info('Node data', data)) // eyeball results in the console
            .catch(err => this.handleError(err));
    }

    private callApiCreateFolder(relativePath: string, name: string) {
        return this.apiService.getInstance().nodes.createFolder(name, relativePath);
    }

    /**
     * Throw the error
     * @param error
     * @returns {ErrorObservable}
     */
    private handleError(error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        this.logService.error(error);
        return Observable.throw(error || 'Server error');
    }

    private updateFileListStream(fileList: FileModel[]) {
        if (this.filesUploadObserverProgressBar) {
            this.filesUploadObserverProgressBar.next(fileList);
        }
    }

    updateFileCounterStream(total: number) {
        if (this.totalCompletedObserver) {
            this.totalCompletedObserver.next(total);
        }
    }
}
