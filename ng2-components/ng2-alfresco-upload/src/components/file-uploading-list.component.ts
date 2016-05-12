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


import { Component, ElementRef, Input } from 'angular2/core';
import { FileModel } from '../models/file.model';
import { TranslatePipe } from 'ng2-translate/ng2-translate';

declare let __moduleName: string;

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
@Component({
    selector: 'alfresco-file-uploading-list',
    moduleId: __moduleName,
    templateUrl: './file-uploading-list.component.html',
    styleUrls: ['./file-uploading-list.component.css'],
    pipes: [TranslatePipe]
})
export class FileUploadingListComponent {

    @Input()
    filesUploadingList: FileModel [];

    constructor(public el: ElementRef) {
        console.log('filesUploadingList constructor', el);

        setInterval(() => {console.log('Check for async update from drag directive'); }, 1000);
    }

    /**
     * Abort the in progress uploading of a specific file.
     *
     * @param {string} id - FileModel id of the file to abort.
     */
    abort(id: string): void {
        let file = this.filesUploadingList.filter((uploadingFileModel) => {
            return uploadingFileModel.id === id;
        });
        file[0].setAbort();
    }
}
