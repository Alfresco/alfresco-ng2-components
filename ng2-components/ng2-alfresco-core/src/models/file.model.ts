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

export interface FileUploadProgress {
    loaded: number;
    total: number;
    percent: number;
}

export interface FileUploadOptions {
    newVersion?: boolean;
    parentId?: string;
    path?: string;
}

export enum FileUploadStatus {
    Pending = 0,
    Complete = 1,
    Starting = 2,
    Progress = 3,
    Cancelled = 4,
    Aborted = 5,
    Error = 6
}

export class FileModel {
    readonly id: string;
    readonly name: string;
    readonly size: number;
    readonly file: File;

    status: FileUploadStatus = FileUploadStatus.Pending;
    progress: FileUploadProgress;
    options: FileUploadOptions;
    data: any;

    constructor(file: File, options?: FileUploadOptions) {
        this.file = file;

        this.id = this.generateId();
        this.name = file.name;
        this.size = file.size;
        this.data = null;

        this.progress = {
            loaded: 0,
            total: 0,
            percent: 0
        };

        this.options = Object.assign({}, {
            newVersion: false
        },                           options);
    }

    private generateId(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    get extension(): string {
        return this.name.slice((Math.max(0, this.name.lastIndexOf('.')) || Infinity) + 1);
    }
}
