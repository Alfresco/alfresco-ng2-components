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
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { AlfrescoAuthenticationService} from 'ng2-alfresco-core';
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

    private filesUploadObserverProgressBar: Observer<FileModel[]>;
    private totalCompletedObserver: Observer<number>;

    public totalCompleted: number = 0;

    filesUpload$: Observable<FileModel[]>;
    totalCompleted$: Observable<any>;

    constructor(private authService: AlfrescoAuthenticationService) {
        this.filesUpload$ = new Observable<FileModel[]>(observer =>  this.filesUploadObserverProgressBar = observer).share();
        this.totalCompleted$ = new Observable<number>(observer =>  this.totalCompletedObserver = observer).share();
    }

    /**
     * Configure the service
     *
     * @param {Object} - options to init the object
     *
     */
    public setOptions(options: any): void {
        this.formFields = options.formFields != null ? options.formFields : this.formFields;
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
    public uploadFilesInTheQueue(directory: string, elementEmit: EventEmitter<any>): void {
        let filesToUpload = this.queue.filter((uploadingFileModel) => {
            return !uploadingFileModel.uploading && !uploadingFileModel.done && !uploadingFileModel.abort && !uploadingFileModel.error;
        });

        filesToUpload.forEach((uploadingFileModel: FileModel) => {
            uploadingFileModel.setUploading();

            let _filesUploadObserverProgressBar = this.filesUploadObserverProgressBar;
            let _queue = this.queue;

            let promiseUpload = this.authService.getAlfrescoApi().
                upload.uploadFile(uploadingFileModel.file, directory)
                .on('progress', (progress: any) => {
                    uploadingFileModel.setProgres(progress);
                    if (_filesUploadObserverProgressBar) {
                        _filesUploadObserverProgressBar.next(_queue);
                    }
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
                        value: 'File uploaded'
                    });
                    uploadingFileModel.onFinished(
                        data.status,
                        data.statusText,
                        data.response
                    );

                    _filesUploadObserverProgressBar.next(_queue);
                    if (!uploadingFileModel.abort && !uploadingFileModel.error) {
                        if (this.totalCompletedObserver) {
                            this.totalCompletedObserver.next(++this.totalCompleted);
                        }
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
            .do(data => console.log('Node data', data)) // eyeball results in the console
            .catch(this.handleError);
    }

    private callApiCreateFolder(relativePath: string, name: string) {
        return this.authService.getAlfrescoApi().node.createFolder(name, relativePath);
    }

    /**
     * Throw the error
     * @param error
     * @returns {ErrorObservable}
     */
    private handleError(error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error || 'Server error');
    }
}
