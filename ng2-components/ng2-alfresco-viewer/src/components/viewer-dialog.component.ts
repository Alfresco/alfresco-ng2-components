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
    fileMimeType: string = null;
    downloadUrl: string = null;

    unknownFormatIcon = 'wifi_tethering';
    unknownFormatText = 'Document preview could not be loaded.';

    viewerType: string = null;

    constructor(private dialogRef: MdDialogRef<ViewerDialogComponent>,
                @Inject(MD_DIALOG_DATA) settings: ViewerDialogSettings) {
        this.fileUrl = settings.fileUrl;
        this.fileName = settings.fileName;
        this.fileMimeType = settings.fileMimeType;
        this.downloadUrl = settings.downloadUrl;
    }

    ngOnInit() {
        this.viewerType = this.detectViewerType(this.fileMimeType);
    }

    private detectViewerType(mimeType: string) {
        if (mimeType) {
            mimeType = mimeType.toLowerCase();
            if (mimeType.startsWith('image/')) {
                return 'image';
            }
        }
        return 'unknown';
    }

    download() {
        if (this.downloadUrl && this.fileName) {
            const link = document.createElement('a');

            link.style.display = 'none';
            link.download = this.fileName;
            link.href = this.downloadUrl;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    close() {
        this.dialogRef.close(true);
    }
}
