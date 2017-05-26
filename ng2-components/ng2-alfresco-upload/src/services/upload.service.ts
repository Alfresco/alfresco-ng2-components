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
import { MinimalNodeEntity, MinimalNodeEntryEntity } from 'alfresco-js-api';

/**
 *
 * UploadService keep the queue of the file to upload and uploads them.
 *
 * @returns {UploadService} .
 */
@Injectable()
export class UploadService {

    private queue: FileModel[] = [];
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
     * Add files to the uploading queue to be uploaded.
     *
     * Examples:
     *  addToQueue(file); // pass one file
     *  addToQueue(file1, file2, file3); // pass multiple files
     *  addToQueue(...[file1, file2, file3]); // pass an array of files
     */
    addToQueue(...files: FileModel[]): void {
        this.queue = this.queue.concat(files);
        if (this.filesUploadObserverProgressBar) {
            this.filesUploadObserverProgressBar.next(this.queue);
        }
    }

    /**
     * Pick all the files in the queue that are not been uploaded yet and upload it into the directory folder.
     */
    uploadFilesInTheQueue(rootId: string, directory: string, elementEmit: EventEmitter<any>): void {
        let filesToUpload = this.queue.filter((file) => {
            return !file.uploading && !file.done && !file.abort && !file.error;
        });

        filesToUpload.forEach((uploadingFileModel: FileModel) => {
            uploadingFileModel.setUploading();

            const opts: any = {
                renditions: 'doclib'
            };

            if (uploadingFileModel.options.newVersion === true) {
                opts.overwrite = true;
                opts.majorVersion = true;
            } else {
                opts.autoRename = true;
            }

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
     * Create a folder
     * @param name - the folder name
     */
    createFolder(relativePath: string, name: string, parentId?: string) {
        return Observable.fromPromise(this.callApiCreateFolder(relativePath, name, parentId))
            .do(data => this.logService.info('Node data', data)) // eyeball results in the console
            .catch(err => this.handleError(err));
    }

    callApiCreateFolder(relativePath: string, name: string, parentId?: string): Promise<MinimalNodeEntity> {
        return this.apiService.getInstance().nodes.createFolder(name, relativePath, parentId);
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

    getFolderNode(nodeId: string): Observable<MinimalNodeEntryEntity> {
        let opts: any = {
            includeSource: true,
            include: ['allowableOperations']
        };

        return Observable.fromPromise(this.apiService.getInstance().nodes.getNodeInfo(nodeId, opts))
            .map((response: any) => {
                return response;
            })
            .catch(err => this.handleError(err));
    }
}
