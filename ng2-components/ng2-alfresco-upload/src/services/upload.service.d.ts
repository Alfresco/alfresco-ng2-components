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
import { FileModel } from '../models/file.model';
export declare class UploadService {
    private _url;
    private _method;
    private _authTokenPrefix;
    private _authToken;
    private _fieldName;
    private _formFields;
    private _withCredentials;
    _queue: FileModel[];
    constructor(options: any);
    addToQueue(files: any[]): FileModel[];
    private _uploadFilesInTheQueue();
    uploadFile(uploadingFileModel: any): void;
    getQueue(): FileModel[];
    private _isFile(file);
}
