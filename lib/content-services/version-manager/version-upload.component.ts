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

import { Component, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { ContentService } from '@alfresco/adf-core';

@Component({
    selector: 'adf-version-upload',
    templateUrl: './version-upload.component.html',
    styleUrls: ['./version-upload.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { 'class': 'adf-version-upload' }
})
export class VersionUploadComponent {

    semanticVersion: string = 'minor';
    comment: string;
    uploadVersion: boolean = false;

    @Input()
    node: MinimalNodeEntryEntity;

    @Output()
    success = new EventEmitter();

    @Output()
    error = new EventEmitter();

    @Output()
    cancel = new EventEmitter();

    constructor(private contentService: ContentService) {
    }

    canUpload(): boolean {
        return this.contentService.hasPermission(this.node, 'update');
    }

    isMajorVersion(): boolean {
        return this.semanticVersion === 'minor' ? false : true;
    }

    cancelUpload() {
        this.cancel.emit();
    }

}
