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


import { FileModel } from '../models/file.model';


/**
 *
 * UploadService keep the queue of the file to upload and uploads them.
 *
 * @returns {UploadService} .
 */
export class UploadService {
    private _url: string;
    private _method: string = 'POST';
    private _authTokenPrefix: string = 'Basic';
    private _authToken: string = undefined;
    private _fieldName: string = 'file';
    private _formFields: Object = {};
    private _withCredentials: boolean;
    private _xmlHttpRequest: XMLHttpRequest;

    private _queue: FileModel[] = [];

    constructor(private options: any) {
        console.log('UploadService constructor');

        this._withCredentials = options.withCredentials != null ? options.withCredentials : this._withCredentials;
        this._url = options.url != null ? options.url : this._url;
        this._authTokenPrefix = options.authTokenPrefix != null ? options.authTokenPrefix : this._authTokenPrefix;
        this._authToken = options.authToken != null ? options.authToken : this._authToken;
        this._fieldName = options.fieldName != null ? options.fieldName : this._fieldName;
        this._formFields = options.formFields != null ? options.formFields : this._formFields;
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
            }
        }
        return latestFilesAdded;
    }

    /**
     * Pick all the files in the queue that are not been uploaded yet and upload it into the directory folder.
     */
    public uploadFilesInTheQueue(directory: string): void {
        let filesToUpload = this._queue.filter((uploadingFileModel) => {
            return !uploadingFileModel.uploading && !uploadingFileModel.done && !uploadingFileModel.abort && !uploadingFileModel.error;
        });
        filesToUpload.forEach((uploadingFileModel) => {
            uploadingFileModel.setUploading();
            this.uploadFile(uploadingFileModel, directory);
        });
    };

    /**
     * The method create a new XMLHttpRequest instance if doesn't exist
     */
    private _configureXMLHttpRequest(uploadingFileModel: any) {
        if (this._xmlHttpRequest === undefined) {
            this._xmlHttpRequest = new XMLHttpRequest();
            this._xmlHttpRequest.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    let percent = Math.round(e.loaded / e.total * 100);
                    uploadingFileModel.setProgres({
                        total: e.total,
                        loaded: e.loaded,
                        percent: percent
                    });
                }
            };

            this._xmlHttpRequest.upload.onabort = (e) => {
                uploadingFileModel.setAbort();
            };

            this._xmlHttpRequest.upload.onerror = (e) => {
                uploadingFileModel.setError();
            };

            this._xmlHttpRequest.onreadystatechange = () => {
                if (this._xmlHttpRequest.readyState === XMLHttpRequest.DONE) {
                    uploadingFileModel.onFinished(
                        this._xmlHttpRequest.status,
                        this._xmlHttpRequest.statusText,
                        this._xmlHttpRequest.response
                    );
                }
            };
        }
    }

    /**
     * Upload a file into the directory folder, and enrich it with the xhr.
     *
     * @param {FileModel} - files to be uploaded.
     *
     */
    uploadFile(uploadingFileModel: any, directory: string): void {
        let form = new FormData();
        form.append(this._fieldName, uploadingFileModel.file, uploadingFileModel.name);
        Object.keys(this._formFields).forEach((key: any) => {
            form.append(key, this._formFields[key]);
        });

        form.append('uploaddirectory', directory);

        this._configureXMLHttpRequest(uploadingFileModel);
        uploadingFileModel.setXMLHttpRequest(this._xmlHttpRequest);

        this._xmlHttpRequest.open(this._method, this._url, true);
        this._xmlHttpRequest.withCredentials = this._withCredentials;

        if (this._authToken) {
            this._xmlHttpRequest.setRequestHeader('Authorization', `${this._authTokenPrefix} ${this._authToken}`);
        }

        this._xmlHttpRequest.send(form);
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
     * Set XMLHttpRequest method
     * @param xhr
     */
    public setXMLHttpRequest(xhr: XMLHttpRequest) {
        this._xmlHttpRequest = xhr;
    }
}
