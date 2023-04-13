/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
    /**
     * Add a version comment which will appear in version history.
     * Setting this parameter also enables versioning of this node, if it is not already versioned.
     */
    comment?: string;
    /**
     * Overwrite the content of the node with a new version.
     */
    newVersion?: boolean;
    /**
     * If true, then created node will be version 1.0 MAJOR. If false, then created node will be version 0.1 MINOR.
     */
    majorVersion?: boolean;
    /**
     * Root folder id.
     */
    parentId?: string;
    /**
     * Defines the **relativePath** value.
     * The relativePath specifies the folder structure to create relative to the node nodeId.
     * Folders in the relativePath that do not exist are created before the node is created.
     */
    path?: string;
    /**
     * You can use the nodeType field to create a specific type. The default is **cm:content**.
     */
    nodeType?: string;
    /**
     * You can set multi-value properties when you create a new node which supports properties of type multiple.
     */
    properties?: any;
    /**
     * If the content model allows then it is also possible to create primary children with a different assoc type.
     */
    association?: any;
    /**
     * You can optionally specify an array of **secondaryChildren** to create one or more secondary child associations,
     * such that the newly created node acts as a parent node.
     */
    secondaryChildren?: AssocChildBody[];
    /**
     * You can optionally specify an array of **targets** to create one or more peer associations such that the newly created node acts as a source node.
     */
    targets?: AssociationBody[];
    /**
     * If true, then created node will be versioned. If false, then created node will be unversioned and auto-versioning disabled.
     */
    versioningEnabled?: boolean;
}

// eslint-disable-next-line no-shadow
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
