/**
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


import {Injectable} from 'angular2/core';
import {FileModel} from '../models/file.model';


@Injectable()
export class UploadService {
    private _url:string;
    private _method:string = 'POST';
    private _authTokenPrefix:string = 'Basic';
    private _authToken:string = undefined;
    private _fieldName:string = 'file';
    private _formFields:Object = {};
    private _withCredentials:boolean;

    _queue:FileModel[] = [];

    constructor(){}

    constructor(private options:any) {
        console.log('UploadService constructor');

        this._withCredentials = options.withCredentials != null ? options.withCredentials : this._withCredentials;
        this._url = options.url != null ? options.url : this._url;
        this._authTokenPrefix = options.authTokenPrefix != null ? options.authTokenPrefix : this._authTokenPrefix;
        this._authToken = options.authToken != null ? options.authToken : this._authToken;
        this._fieldName = options.fieldName != null ? options.fieldName : this._fieldName;
        this._formFields = options.formFields != null ? options.formFields : this._formFields;
    }

    addToQueue(files:any[]):FileModel[] {
        let latestFilesAdded:FileModel[] = [];

        for (let file of files) {
            if (this._isFile(file)) {
                let uploadingFileModel = new FileModel(file)
                latestFilesAdded.push(uploadingFileModel)
                this._queue.push(uploadingFileModel);
            }
        }
        this._uploadFilesInTheQueue();

        return latestFilesAdded;
    }

    private _uploadFilesInTheQueue():void {
        let filesToUpload = this._queue.filter((uploadingFileModel) => {
            return !uploadingFileModel.uploading && !uploadingFileModel.done && !uploadingFileModel.abort && !uploadingFileModel.error;
        });
        filesToUpload.forEach((uploadingFileModel) => {
            uploadingFileModel.setUploading();
            this.uploadFile(uploadingFileModel);
        });
    };

    uploadFile(uploadingFileModel:any):void {
        let form = new FormData();
        form.append(this._fieldName, uploadingFileModel.file, uploadingFileModel.name);
        Object.keys(this._formFields).forEach((key) => {
            form.append(key, this._formFields[key]);
        });

        let xmlHttpRequest = new XMLHttpRequest();
        uploadingFileModel.setXMLHttpRequest(xmlHttpRequest);

        xmlHttpRequest.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                let percent = Math.round(e.loaded / e.total * 100);
                uploadingFileModel.setProgres({
                    total: e.total,
                    loaded: e.loaded,
                    percent: percent
                });
            }
        };

        xmlHttpRequest.upload.onabort = (e) => {
            uploadingFileModel.setAbort();
        };

        xmlHttpRequest.upload.onerror = (e) => {
            uploadingFileModel.setError();
        };

        xmlHttpRequest.onreadystatechange = () => {
            if (xmlHttpRequest.readyState === XMLHttpRequest.DONE) {
                uploadingFileModel.onFinished(
                    xmlHttpRequest.status,
                    xmlHttpRequest.statusText,
                    xmlHttpRequest.response
                );
            }
        };

        xmlHttpRequest.open(this._method, this._url, true);
        xmlHttpRequest.withCredentials = this._withCredentials;

        if (this._authToken) {
            xmlHttpRequest.setRequestHeader('Authorization', `${this._authTokenPrefix} ${this._authToken}`);
        }

        xmlHttpRequest.send(form);
    }

    getQueue():FileModel[] {
        return this._queue;
    }

    private _isFile(file:any):boolean {
        return file !== null && (file instanceof Blob || (file.name && file.size));
    }
}
