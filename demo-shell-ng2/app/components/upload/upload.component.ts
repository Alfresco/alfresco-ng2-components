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

import { Component, Input, ViewChild } from '@angular/core';
import { FileUploadCompleteEvent, UploadService } from 'ng2-alfresco-core';
import { DocumentListComponent } from 'ng2-alfresco-documentlist';

@Component({
    selector: 'adf-upload-component-demo',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.css']
})
export class UploadComponent {

    @ViewChild(DocumentListComponent)
    documentList: DocumentListComponent;

    @Input()
    acceptedFilesTypeShow: boolean = false;

    @Input()
    acceptedFilesType: string = '.jpg,.pdf,.js';

    @Input()
    enableUpload: boolean = true;

    @Input()
    multipleFileUpload: boolean = false;

    @Input()
    folderUpload: boolean = false;

    @Input()
    versioning: boolean = false;

    @Input()
    disableWithNoPermission: boolean = false;

    constructor(uploadService: UploadService) {
        uploadService.fileUploadComplete.subscribe(value => this.onFileUploadComplete(value));
    }

    onFileUploadComplete(event: FileUploadCompleteEvent) {
        if (event && event.file.options.parentId === this.documentList.currentFolderId) {
            this.documentList.reload();
        }
    }
}
