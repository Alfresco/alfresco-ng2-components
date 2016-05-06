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
/**
 *
 * UploadService keep the queue of the file to upload and uploads them.
 *
 * @returns {UploadService} .
 */
export declare class UploadService {
    private options;
    private _url;
    private _method;
    private _authTokenPrefix;
    private _authToken;
    private _fieldName;
    private _formFields;
    private _withCredentials;
    private _queue;
    constructor(options: any);
    /**
     * Add files to the uploading queue to be uploaded.
     *
     * @param {File[]} - files to add to the upload queue.
     *
     * return {FileModel[]} - return the file added to the queue in this call.
     */
    addToQueue(files: any[]): FileModel[];
    /**
     * Pick all the files in the queue that are not been uploaded yet and upload it.
     */
    private _uploadFilesInTheQueue();
    /**
     * Upload a file, and enrich it with the xhr.
     *
     * @param {FileModel} - files to be uploaded.
     *
     */
    uploadFile(uploadingFileModel: any): void;
    /**
     * Return all the files in the uploading queue.
     *
     * @return {FileModel[]} - files in the upload queue.
     */
    getQueue(): FileModel[];
    /**
     * Check if an item is a file.
     *
     * @return {boolean}
     */
    private _isFile(file);
}
