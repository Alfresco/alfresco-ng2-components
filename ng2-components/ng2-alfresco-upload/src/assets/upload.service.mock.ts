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

import { UploadService } from '../services/upload.service';
import { AlfrescoSettingsService } from 'ng2-alfresco-core/dist/ng2-alfresco-core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { FileModel } from '../models/file.model';

export class UploadServiceMock {

    private _baseUrlPath: string = 'fakebaseurlpath';
    private _url: string = 'fakeurl';
    private _formFields: Object = {};

    filesUpload$: Observable<any>;
    totalCompleted$: Observable<number>;

    public setOptions(options: any): void {
        this._url = options._url || this._url;
        this._baseUrlPath = options.baseUrlPath || this._baseUrlPath;
        this._formFields = options.formFields != null ? options.formFields : this._formFields;
    }

    addToQueue(files: any[]): FileModel[] {
        this.filesUpload$ = new Observable(observer => {
            observer.next(files);
        });
        return files;
    }

    createFolder(relativePath: string, name: string) {
        let promise: Promise<any>;
        if (name !== 'folder-duplicate-fake') {
            promise = new Promise(function (resolve, reject) {
                resolve({
                    entry: {
                        userId: 'fake-username',
                        id: 'fake-post-token'
                    }
                })
            });
        } else {
            promise = new Promise(function (resolve, reject) {
                reject({
                    response: {
                        body: {
                            error: {
                                statusCode: 409
                            }
                        }
                    }
                });
            });
        }
        return Observable.fromPromise(promise)
            .map(res => {
                return res;
            })
            .do(data => console.log('Node data', data))
            .catch((error => {
                return Observable.throw(error);
            }));
    }

    public uploadFilesInTheQueue(directory: string, elementEmit: any): void {
    };



}
