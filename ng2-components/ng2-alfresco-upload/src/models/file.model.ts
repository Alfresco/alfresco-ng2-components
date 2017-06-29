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

/**
 *
 * This object represent the status of an uploading file.
 *
 *
 * @returns {FileModel} .
 */
export class FileModel {
    id: string;
    status: number;
    statusText: string;
    progress: Object;
    name: string;
    size: string;
    response: string;
    done: boolean = false;
    error: boolean = false;
    abort: boolean = false;
    uploading: boolean = false;
    file: File;
    promiseUpload: any;

    options: FileUploadOptions;

    constructor(file: File, options?: FileUploadOptions) {
        this.file = file;
        this.options = Object.assign({}, {
            newVersion: false
        }, options);
        this.id = this.generateId();
        this.name = file.name;
        this.size = this.getFileSize(file.size);
        this.progress = {
            loaded: 0,
            total: 0,
            percent: 0
        };
    }

    setProgres(progress: any): void {
        this.progress = progress;
    }

    /**
     * Emit an event progress on the promise
     */
    emitProgres(progress: any): void {
        this.setProgres(progress);
        this.promiseUpload.emit('progress', progress);
    }

    setError(): void {
        this.error = true;
    }

    /**
     * Emit an event progress on the promise
     */
    emitError(): void {
        this.setError();
        this.promiseUpload.emit('error');
    }

    setUploading() {
        this.uploading = true;
    }

    setPromiseUpload(promiseUpload: any) {
        this.promiseUpload = promiseUpload;
    }

    /**
     * Stop the uploading of the file.
     */
    setAbort(): void {
        if (!this.done && !this.error) {
            this.abort = true;
            this.uploading = false;
        }
    }

    /**
     * Emit an event abort on the promise
     */
    emitAbort(): void {
        this.setAbort();
        this.promiseUpload.abort();
    }

    /**
     * Update status of the file when upload finish or is ended.
     */
    onFinished(status: number, statusText: string, response: string): void {
        this.status = status;
        this.statusText = statusText;
        this.response = response;
        this.done = true;
        this.uploading = false;
    }

    /**
     * Calculate the size of the file in kb,mb and gb.
     *
     * @param {number} sizeinbytes - size in bytes of the file.
     */
    private getFileSize(sizeinbytes: number): string {
        let fSExt = new Array('Bytes', 'KB', 'MB', 'GB');
        let size = sizeinbytes;
        let i = 0;
        while (size > 900) {
            size /= 1000;
            i++;
        }
        return Math.round((Math.round(size * 100) / 100)) + ' ' + fSExt[i];
    }

    private generateId(): string {
        return 'uploading-file-' + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
    }
}

export interface FileUploadOptions {
    newVersion?: boolean;
}
