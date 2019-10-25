/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { AssocChildBody, AssociationBody } from '@alfresco/js-api';

export interface FileUploadProgress {
    loaded: number;
    total: number;
    percent: number;
}

export class FileUploadOptions {
    comment?: string;
    newVersion?: boolean;
    majorVersion?: boolean;
    parentId?: string;
    path?: string;
    nodeType?: string;
    properties?: any;
    association?: any;
    secondaryChildren?: AssocChildBody[];
    targets?: AssociationBody[];
}

export enum FileUploadStatus {
    Pending = 0,
    Complete = 1,
    Starting = 2,
    Progress = 3,
    Cancelled = 4,
    Aborted = 5,
    Error = 6,
    Deleted = 7
}

export class FileModel {
    readonly name: string;
    readonly size: number;
    readonly file: File;

    id: string;
    status: FileUploadStatus = FileUploadStatus.Pending;
    errorCode: number;
    progress: FileUploadProgress;
    options: FileUploadOptions;
    data: any;

    constructor(file: File, options?: FileUploadOptions, id?: string) {
        this.file = file;
        this.id = id;
        this.name = file.name;
        this.size = file.size;
        this.data = null;
        this.errorCode = null;

        this.progress = {
            loaded: 0,
            total: 0,
            percent: 0
        };

        this.options = Object.assign({}, {
            newVersion: false
        }, options);
    }

    get extension(): string {
        return this.name.slice((Math.max(0, this.name.lastIndexOf('.')) || Infinity) + 1);
    }
}
