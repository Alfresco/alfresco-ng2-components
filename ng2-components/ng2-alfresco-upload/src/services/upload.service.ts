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
import { AlfrescoSettingsService, AlfrescoAuthenticationService} from 'ng2-alfresco-core';
import { FileModel } from '../models/file.model';

declare let AlfrescoApi: any;

/**
 *
 * UploadService keep the queue of the file to upload and uploads them.
 *
 * @returns {UploadService} .
 */
@Injectable()
export class UploadService {
    private _formFields: Object = {};

    private _queue: FileModel[] = [];

    filesUpload$: Observable<FileModel[]>;
    totalCompleted$: Observable<any>;
    private _filesUploadObserver: Observer<FileModel[]>;
    private _totalCompletedObserver: Observer<number>;

    private _alfrescoClient: any;

    public totalCompleted: number = 0;

    constructor(private settings: AlfrescoSettingsService, private authService: AlfrescoAuthenticationService) {
        this.filesUpload$ = new Observable<FileModel[]>(observer =>  this._filesUploadObserver = observer).share();
        this.totalCompleted$ = new Observable<number>(observer =>  this._totalCompletedObserver = observer).share();
        this._alfrescoClient = this.authService.alfrescoApi;
    }

    /**
     * Configure the service
     *
     * @param {Object} - options to init the object
     *
     */
    public setOptions(options: any): void {
        this._formFields = options.formFields != null ? options.formFields : this._formFields;
    }


    /**
     * Get the form fields
     * @returns {Object}
     */
    public getFormFields(): Object {
        return this._formFields;
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
            if (this._isFile(file)) {
                let uploadingFileModel = new FileModel(file);
                latestFilesAdded.push(uploadingFileModel);
                this._queue.push(uploadingFileModel);
                if (this._filesUploadObserver) {
                    this._filesUploadObserver.next(this._queue);
                }
            }
        }
        return latestFilesAdded;
    }

    /**
     * Pick all the files in the queue that are not been uploaded yet and upload it into the directory folder.
     */
    public uploadFilesInTheQueue(directory: string, elementEmit: EventEmitter<any>): void {
        let filesToUpload = this._queue.filter((uploadingFileModel) => {
            return !uploadingFileModel.uploading && !uploadingFileModel.done && !uploadingFileModel.abort && !uploadingFileModel.error;
        });
        filesToUpload.forEach((uploadingFileModel) => {
            uploadingFileModel.setUploading();
            this.authService.getAlfrescoApi().
            upload.uploadFile(uploadingFileModel.file, directory)
                .on('progress', (progress: any) => {
                    uploadingFileModel.setProgres(progress);
                })
                .on('abort', () => {
                    uploadingFileModel.setAbort();
                })
                .on('error', () => {
                    uploadingFileModel.setError();
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

                    this._filesUploadObserver.next(this._queue);
                    if (!uploadingFileModel.abort && !uploadingFileModel.error) {
                        if (this._totalCompletedObserver) {
                            this._totalCompletedObserver.next(++this.totalCompleted);
                        }
                    }
                });
        });
    }

    /**
     * Return all the files in the uploading queue.
     *
     * @return {FileModel[]} - files in the upload queue.
     */
    getQueue(): FileModel[] {
        return this._queue;
    }

    /**
     * Check if an item is a file.
     *
     * @return {boolean}
     */
    private _isFile(file: any): boolean {
        return file !== null && (file instanceof Blob || (file.name && file.size));
    }

    /**
     * Create a folder
     * @param name - the folder name
     */
    createFolder(relativePath: string, name: string) {
        return Observable.fromPromise(this.authService.getAlfrescoApi().node.createFolder(name, relativePath))
            .map(res => {
                return res;
            })
            .do(data => console.log('Node data', data)) // eyeball results in the console
            .catch(this.handleError);
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
