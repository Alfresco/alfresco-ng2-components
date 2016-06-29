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

import { Observable } from 'rxjs/Observable';
import { FileModel } from '../models/file.model';
import { UploadService } from '../services/upload.service';
import { AlfrescoSettingsService } from 'ng2-alfresco-core';

export class UploadServiceMock extends UploadService {

    filesUpload$: Observable<any>;
    totalCompleted$: Observable<number>;

    constructor(settings: AlfrescoSettingsService) {
        super(settings);
    }

    public setOptions(options: any): void {
        super.setOptions(options);
    }

    addToQueue(files: any[]): FileModel[] {
        let result = super.addToQueue(files);
        this.filesUpload$ = new Observable(observer => {
            observer.next(files);
        });
        return result;
    }

    createFolder(relativePath: string, name: string) {
        let promise: Promise<any>;
        if (name !== 'folder-duplicate-fake') {
            promise = new Promise(function (resolve, reject) {
                resolve({
                    entry: {
                        isFile: false,
                        isFolder: true,
                        name: name,
                        nodeType: 'cm:folder'
                    }
                });
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
