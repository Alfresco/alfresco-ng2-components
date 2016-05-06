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
/**
 *
 * This object represent the status of an uploading file.
 *
 *
 * @returns {FileModel} .
 */
export declare class FileModel {
    id: string;
    status: number;
    statusText: string;
    progress: Object;
    name: string;
    size: string;
    response: string;
    done: boolean;
    error: boolean;
    abort: boolean;
    uploading: boolean;
    file: any;
    _xmlHttpRequest: XMLHttpRequest;
    constructor(file: any);
    setProgres(progress: any): void;
    setError(): void;
    setUploading(): void;
    setXMLHttpRequest(xmlHttpRequest: XMLHttpRequest): void;
    /**
     * Stop the uploading of the file.
     */
    setAbort(): void;
    /**
     * Update status of the file when upload finish or is ended.
     */
    onFinished(status: number, statusText: string, response: string): void;
    /**
     * Calculate the size of the file in kb,mb and gb.
     *
     * @param {number} sizeinbytes - size in bytes of the file.
     */
    private _getFileSize(sizeinbytes);
    /**
     * Calculate the size of the file in kb,mb and gb.
     *
     * @return {string} - return a unique file uploading id.
     */
    private _generateId();
}
