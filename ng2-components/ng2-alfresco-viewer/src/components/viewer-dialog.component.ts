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

import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { AlfrescoApiService } from 'ng2-alfresco-core';

import { ViewerDialogSettings } from './viewer-dialog.settings';

@Component({
    selector: 'adf-viewer-dialog',
    templateUrl: 'viewer-dialog.component.html',
    styleUrls: ['viewer-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { 'class': 'adf-viewer-dialog' }
})
export class ViewerDialogComponent implements OnInit {

    fileName: string = 'Unknown file';
    fileUrl: string = null;

    unknownFormatIcon = 'wifi_tethering';
    unknownFormatText = 'Document preview could not be loaded.';

    mimeType: string = null;

    constructor(private dialogRef: MdDialogRef<ViewerDialogComponent>,
                @Inject(MD_DIALOG_DATA) private settings: ViewerDialogSettings,
                private apiService: AlfrescoApiService) {
    }

    private get contentApi() {
        return this.apiService.getInstance().content;
    }

    ngOnInit() {
        const node = this.settings.node;
        if (node && node.isFile) {
            this.displayFile(node);
        }
    }

    private displayFile(node: MinimalNodeEntryEntity) {
        if (node) {
            this.fileName = node.name;
            this.mimeType = node.content.mimeType;
            this.fileUrl = this.contentApi.getContentUrl(node.id);
            console.log(node);
        }
    }

    close() {
        this.dialogRef.close(false);
    }

}
