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

import { PermissionsEnum  } from '@alfresco/adf-core';
import { Component, forwardRef, Input, OnChanges, ViewEncapsulation, OnInit } from '@angular/core';
import { MinimalNodeEntryEntity } from '@alfresco/js-api';
import { UploadButtonComponent } from './upload-button.component';
import { FileModel, EXTENDIBLE_COMPONENT } from '@alfresco/adf-core';

@Component({
    selector: 'adf-upload-version-button',
    templateUrl: './upload-button.component.html',
    styleUrls: ['./upload-button.component.scss'],
    viewProviders: [
        { provide: EXTENDIBLE_COMPONENT, useExisting: forwardRef(() => UploadVersionButtonComponent) }
    ],
    encapsulation: ViewEncapsulation.None
})
export class UploadVersionButtonComponent extends UploadButtonComponent implements OnChanges, OnInit {

    /** (**Required**) The node to be versioned. */
    @Input()
    node: MinimalNodeEntryEntity;

    protected createFileModel(file: File): FileModel {
        const fileModel = super.createFileModel(file, this.rootFolderId, ((<any> file).webkitRelativePath || '').replace(/\/[^\/]*$/, ''), this.node.id);

        if (!this.isFileAcceptable(fileModel)) {
            const message = this.translationService.instant('FILE_UPLOAD.VERSION.MESSAGES.INCOMPATIBLE_VERSION');
            this.error.emit(message);
        }

        return fileModel;
    }

    ngOnInit() {
        super.ngOnInit();
        this.checkPermission();
    }

    checkPermission() {
        this.permissionValue.next(this.nodeHasPermission(this.node, PermissionsEnum.UPDATE));
    }
}
