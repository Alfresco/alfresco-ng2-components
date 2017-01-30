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
import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AlfrescoApiService } from 'ng2-alfresco-core';
import { FileModel } from '../models/file.model';
export declare class UploadService {
    private apiService;
    private formFields;
    private queue;
    private versioning;
    private filesUploadObserverProgressBar;
    private totalCompletedObserver;
    totalCompleted: number;
    filesUpload$: Observable<FileModel[]>;
    totalCompleted$: Observable<any>;
    constructor(apiService: AlfrescoApiService);
    setOptions(options: any, versioning: boolean): void;
    addToQueue(files: any[]): FileModel[];
    uploadFilesInTheQueue(rootId: string, directory: string, elementEmit: EventEmitter<any>): void;
    getQueue(): FileModel[];
    private isFile(file);
    createFolder(relativePath: string, name: string): Observable<any>;
    private callApiCreateFolder(relativePath, name);
    private handleError(error);
    private updateFileListStream(fileList);
    private updateFileCounterStream(total);
}
