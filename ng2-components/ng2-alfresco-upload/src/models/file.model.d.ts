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
    promiseUpload: any;
    constructor(file: any);
    setProgres(progress: any): void;
    emitProgres(progress: any): void;
    setError(): void;
    emitError(): void;
    setUploading(): void;
    setPromiseUpload(promiseUpload: any): void;
    setAbort(): void;
    emitAbort(): void;
    onFinished(status: number, statusText: string, response: string): void;
    private _getFileSize(sizeinbytes);
    private _generateId();
}
