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
import { AlfrescoSettingsService, AlfrescoAuthenticationService } from 'ng2-alfresco-core';
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
    private _url: string = '/alfresco/api/-default-/public/alfresco/versions/1/nodes/-root-/children';

    private _method: string = 'POST';
    private _fieldName: string = 'filedata';
    private _formFields: Object = {};

    private _queue: FileModel[] = [];

    filesUpload$: Observable<FileModel[]>;
    totalCompleted$: Observable<any>;
    private _filesUploadObserver: Observer<FileModel[]>;
    private _totalCompletedObserver: Observer<number>;

    private _alfrescoClient: any;

    public totalCompleted: number = 0;

    constructor(private settings: AlfrescoSettingsService,
                private authService: AlfrescoAuthenticationService) {
        console.log('UploadService constructor');
        this.filesUpload$ = new Observable<FileModel[]>(observer =>  this._filesUploadObserver = observer).share();
        this.totalCompleted$ = new Observable<number>(observer =>  this._totalCompletedObserver = observer).share();
        this._alfrescoClient = this.getAlfrescoClient();
    }

    /**
     * Configure the service
     *
     * @param {Object} - options to init the object
     *
     */
    public setOptions(options: any): void {
        this._url = options.url || this._url;
        this._formFields = options.formFields != null ? options.formFields : this._formFields;
    }

    /**
     * Get the host
     * @returns {string}
     */
    public getHost(): string {
        return this.settings.host;
    }

    /**
     * Get the url
     * @returns {string}
     */
    public getUrl(): string {
        return this._url;
    }

    /**
     * Get the form fields
     * @returns {Object}
     */
    public getFormFileds(): Object {
        return this._formFields;
    }

    /**
     * Get the alfresco client
     * @returns {AlfrescoApi.ApiClient}
     */
    private getAlfrescoClient() {
        return AlfrescoApi.getClientWithTicket(this.settings.getApiBaseUrl(), this.authService.getToken());
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
            this.uploadFile(uploadingFileModel, directory, elementEmit);
        });
    }

    /**
     * Create an XMLHttpRequest and return it
     * @returns {XMLHttpRequest}
     */
    createXMLHttpRequestInstance(uploadingFileModel: any, elementEmit: EventEmitter<any>) {
        let xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                let percent = Math.round(e.loaded / e.total * 100);
                uploadingFileModel.setProgres({
                    total: e.total,
                    loaded: e.loaded,
                    percent: percent
                });
                if (this._filesUploadObserver) {
                    this._filesUploadObserver.next(this._queue);
                }
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
                elementEmit.emit({
                    value: 'File uploaded'
                });
                uploadingFileModel.onFinished(
                    xmlHttpRequest.status,
                    xmlHttpRequest.statusText,
                    xmlHttpRequest.response
                );
                this._filesUploadObserver.next(this._queue);
                if (!uploadingFileModel.abort && !uploadingFileModel.error) {
                    if (this._totalCompletedObserver) {
                        this._totalCompletedObserver.next(++this.totalCompleted);
                    }
                }
            }
        };
        return xmlHttpRequest;
    }

    /**
     * Upload a file into the directory folder, and enrich it with the xhr.
     *
     * @param {FileModel} - files to be uploaded.
     *
     */
    uploadFile(uploadingFileModel: FileModel, directory: string, elementEmit: EventEmitter<any>): void {
        // Configure HTTP basic authorization: basicAuth
        let basicAuth = this._alfrescoClient.authentications['basicAuth'];

        let form = new FormData();
        form.append(this._fieldName, uploadingFileModel.file, uploadingFileModel.name);
        Object.keys(this._formFields).forEach((key: any) => {
           form.append(key, this._formFields[key]);
        });

        form.append('relativePath', directory);

        let xmlHttpRequest = this.createXMLHttpRequestInstance(uploadingFileModel, elementEmit);
        uploadingFileModel._xmlHttpRequest = xmlHttpRequest;

        xmlHttpRequest.open(this._method, this.getHost() + this.getUrl(), true);
        let authToken = btoa(basicAuth.username + ':' + basicAuth.password);
        if (authToken) {
            xmlHttpRequest.setRequestHeader('Authorization', `${basicAuth.type} ${authToken}`);
        }

        xmlHttpRequest.send(form);
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
        console.log('Directory created' + name);
        let apiInstance = new AlfrescoApi.NodesApi(this._alfrescoClient);
        let nodeId = '-root-';
        let nodeBody = {
            'name': name,
            'nodeType': 'cm:folder',
            'relativePath': relativePath
        };
        return Observable.fromPromise(apiInstance.addNode(nodeId, nodeBody))
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
