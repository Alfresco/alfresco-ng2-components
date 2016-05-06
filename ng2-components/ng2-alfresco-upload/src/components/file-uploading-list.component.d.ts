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
import { ElementRef } from 'angular2/core';
import { FileModel } from '../models/file.model';
/**
 * <alfresco-file-uploading-list [filesUploadingList]="FileModel[]" ></alfresco-file-uploading-list>
 *
 * This component show a list of the uploading files contained in the filesUploadingList.
 *
 * @InputParam {FileModel[]} filesUploadingList - list of the uploading files .
 *
 *
 * @returns {FileUploadingListComponent} .
 */
export declare class FileUploadingListComponent {
    el: ElementRef;
    filesUploadingList: FileModel[];
    constructor(el: ElementRef);
    /**
     * Abort the in progress uploading of a specific file.
     *
     * @param {string} id - FileModel id of the file to abort.
     */
    abort(id: any): void;
}
