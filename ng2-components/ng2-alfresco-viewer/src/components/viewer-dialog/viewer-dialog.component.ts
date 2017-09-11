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
import { Http, Response } from '@angular/http';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { RenditionsService } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Rx';

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

    allowInfoDrawer = false;
    showInfoDrawer = false;

    unknownFormatIcon = 'wifi_tethering';
    unknownFormatText = 'Document preview could not be loaded.';

    isLoading: boolean = false;

    viewerType: string = null;
    asText: Observable<string>;

    private nodeId: string;

    private types = [
        { mimeType: 'application/x-javascript', type: 'text' },
        { mimeType: 'application/pdf', type: 'pdf' }
    ];

    constructor(private dialogRef: MdDialogRef<ViewerDialogComponent>,
                @Inject(MD_DIALOG_DATA) settings: ViewerDialogSettings,
                private http: Http,
                private renditionService: RenditionsService) {
        this.fileUrl = settings.fileUrl;
        this.fileName = settings.fileName;
        this.fileMimeType = settings.fileMimeType;
        this.downloadUrl = settings.downloadUrl;
        this.nodeId = settings.nodeId;
    }

    ngOnInit() {
        this.viewerType = this.detectViewerType(this.fileMimeType);
        this.asText = this.getAsText();

        if (this.viewerType !== 'unknown') {
            this.allowInfoDrawer = true;
        } else {
            if (this.nodeId) {
                this.displayAsPdf(this.nodeId);
            }
        }
    }

    private detectViewerType(mimeType: string) {
        if (mimeType) {
            mimeType = mimeType.toLowerCase();

            if (mimeType.startsWith('image/')) {
                return 'image';
            }

            if (mimeType.startsWith('text/')) {
                return 'text';
            }

            if (mimeType.startsWith('video/')) {
                return 'video';
            }

            if (mimeType.startsWith('audio/')) {
                return 'audio';
            }

            const registered = this.types.find(t => t.mimeType === mimeType);
            if (registered) {
                return registered.type;
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

    private getAsText(): Observable<string> {
        return this.http.get(this.fileUrl).map((res: Response) => res.text());
    }

    close() {
        this.dialogRef.close(true);
    }

    private displayAsPdf(nodeId: string) {
        this.isLoading = true;

        this.renditionService.getRendition(nodeId, 'pdf').subscribe(
            (response) => {
                const status = response.entry.status.toString();

                if (status === 'CREATED') {
                    this.isLoading = false;
                    this.showRenditionPdf(nodeId);
                } else if (status === 'NOT_CREATED') {
                    this.renditionService.convert(nodeId, 'pdf').subscribe({
                        complete: () => {
                            this.isLoading = false;
                            this.showRenditionPdf(nodeId);
                        },
                        error: (error) => {
                            this.isLoading = false;
                            console.log(error);
                        }
                    });
                } else {
                    this.isLoading = false;
                }
            },
            (err) => {
                this.isLoading = false;
                console.log(err);
            }
        );
    }

    private showRenditionPdf(nodeId: string) {
        if (nodeId) {
            this.viewerType = 'pdf';
            this.fileUrl = this.renditionService.getRenditionUrl(nodeId, 'pdf');
        }
    }
}
