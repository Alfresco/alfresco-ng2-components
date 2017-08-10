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

import { Injectable } from '@angular/core';
import { MdDialog } from '@angular/material';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { AlfrescoApiService } from 'ng2-alfresco-core';

import { ViewerDialogComponent } from './../components/viewer-dialog.component';
import { ViewerDialogSettings } from './../components/viewer-dialog.settings';

@Injectable()
export class ViewerService {

    constructor(private dialog: MdDialog,
                private apiService: AlfrescoApiService) {
    }

    private get contentApi() {
        return this.apiService.getInstance().content;
    }

    showViewerForNode(node: MinimalNodeEntryEntity): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const settings: ViewerDialogSettings = {
                fileName: node.name,
                fileMimeType: node.content.mimeType,
                fileUrl: this.contentApi.getContentUrl(node.id, false),
                downloadUrl: this.contentApi.getContentUrl(node.id, true)
            };

            const dialogRef = this.dialog.open(ViewerDialogComponent, {
                panelClass: 'adf-viewer-dialog-panel',
                data: settings
            });

            dialogRef.afterClosed().subscribe(result => {
                resolve(result);
            });
        });
    }
}
