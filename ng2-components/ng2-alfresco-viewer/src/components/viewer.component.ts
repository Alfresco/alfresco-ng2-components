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

import { Location } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { AlfrescoApiService, BaseEvent, LogService, RenditionsService } from 'ng2-alfresco-core';

@Component({
    selector: 'adf-viewer, alfresco-viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.scss'],
    host: { 'class': 'adf-viewer' },
    encapsulation: ViewEncapsulation.None
})
export class ViewerComponent implements OnDestroy, OnChanges {

    @Input()
    urlFile: string = '';

    @Input()
    blobFile: Blob;

    @Input()
    fileNodeId: string = null;

    @Input()
    overlayMode: boolean = false;

    @Input()
    showViewer: boolean = true;

    @Input()
    showToolbar = true;

    @Input()
    displayName: string = 'Unknown';

    @Input()
    allowGoBack = true;

    @Input()
    allowOpenWith = false;

    @Input()
    allowDownload = true;

    @Input()
    allowPrint = false;

    @Input()
    allowShare = false;

    @Input()
    allowInfoDrawer = false;

    @Input()
    showInfoDrawer = false;

    @Input()
    allowMoreActions = false;

    @Output()
    goBack = new EventEmitter<BaseEvent<any>>();

    @Output()
    showViewerChange = new EventEmitter<boolean>();

    @Output()
    extensionChange = new EventEmitter<string>();

    viewerType: string = 'unknown';
    downloadUrl: string = null;
    fileName: string = 'document';
    isLoading: boolean = false;

    extensionTemplates: { template: TemplateRef<any>, isVisible: boolean }[] = [];
    externalExtensions: string[] = [];
    urlFileContent: string;
    otherMenu: any;
    extension: string;
    mimeType: string;

    private extensions = {
        image: ['png', 'jpg', 'jpeg', 'gif', 'bpm'],
        media: ['wav', 'mp4', 'mp3', 'webm', 'ogg'],
        text: ['txt', 'xml', 'js', 'html'],
        pdf: ['pdf']
    };

    private mimeTypes = [
        { mimeType: 'application/x-javascript', type: 'text' },
        { mimeType: 'application/pdf', type: 'pdf' }
    ];

    constructor(
        private apiService: AlfrescoApiService,
        private logService: LogService,
        private location: Location,
        private renditionService: RenditionsService) {}

    ngOnChanges(changes) {
        if (this.showViewer) {
            if (!this.urlFile && !this.blobFile && !this.fileNodeId) {
                throw new Error('Attribute urlFile or fileNodeId or blobFile is required');
            }

            return new Promise((resolve, reject) => {
                if (this.blobFile) {
                    this.isLoading = true;

                    this.mimeType = this.blobFile.type;
                    this.viewerType = this.getViewerTypeByMimeType(this.mimeType);

                    this.allowDownload = false;
                    // TODO: wrap blob into the data url and allow downloading

                    this.extensionChange.emit(this.mimeType);
                    this.isLoading = false;
                    this.scrollTop();
                    resolve();
                } else if (this.urlFile) {
                    this.isLoading = true;
                    let filenameFromUrl = this.getFilenameFromUrl(this.urlFile);
                    this.displayName = filenameFromUrl || 'Unknown';
                    this.extension = this.getFileExtension(filenameFromUrl);
                    this.urlFileContent = this.urlFile;

                    this.downloadUrl = this.urlFile;
                    this.fileName = this.displayName;

                    this.viewerType = this.getViewerTypeByExtension(this.extension);
                    if (this.viewerType === 'unknown') {
                        this.viewerType = this.getViewerTypeByMimeType(this.mimeType);
                    }

                    this.extensionChange.emit(this.extension);
                    this.isLoading = false;
                    this.scrollTop();
                    resolve();
                } else if (this.fileNodeId) {
                    this.isLoading = true;
                    this.apiService.getInstance().nodes.getNodeInfo(this.fileNodeId).then(
                        (data: MinimalNodeEntryEntity) => {
                            this.mimeType = data.content.mimeType;
                            this.displayName = data.name;
                            this.urlFileContent = this.apiService.getInstance().content.getContentUrl(data.id);
                            this.extension = this.getFileExtension(data.name);

                            this.fileName = data.name;
                            this.downloadUrl = this.apiService.getInstance().content.getContentUrl(data.id, true);

                            this.viewerType = this.getViewerTypeByExtension(this.extension);
                            if (this.viewerType === 'unknown') {
                                this.viewerType = this.getViewerTypeByMimeType(this.mimeType);
                            }

                            if (this.viewerType === 'unknown') {
                                this.displayAsPdf(data.id);
                            } else {
                                this.isLoading = false;
                            }

                            this.extensionChange.emit(this.extension);
                            this.scrollTop();
                            resolve();
                        },
                        (error) => {
                            this.isLoading = false;
                            reject(error);
                            this.logService.error('This node does not exist');
                        }
                    );
                }
            });
        }
    }

    scrollTop() {
        window.scrollTo(0, 1);
    }

    getViewerTypeByMimeType(mimeType: string) {
        if (mimeType) {
            mimeType = mimeType.toLowerCase();

            if (mimeType.startsWith('image/')) {
                return 'image';
            }

            if (mimeType.startsWith('text/')) {
                return 'text';
            }

            if (mimeType.startsWith('video/')) {
                return 'media';
            }

            if (mimeType.startsWith('audio/')) {
                return 'media';
            }

            const registered = this.mimeTypes.find(t => t.mimeType === mimeType);
            if (registered) {
                return registered.type;
            }
        }
        return 'unknown';
    }

    getViewerTypeByExtension(extension: string) {
        if (extension) {
            extension = extension.toLowerCase();
        }

        if (this.isCustomViewerExtension(extension)) {
            return 'custom';
        }

        if (this.extensions.image.indexOf(extension) >= 0) {
            return 'image';
        }

        if (this.extensions.media.indexOf(extension) >= 0) {
            return 'media';
        }

        if (this.extensions.text.indexOf(extension) >= 0) {
            return 'text';
        }

        if (this.extensions.pdf.indexOf(extension) >= 0) {
            return 'pdf';
        }

        return 'unknown';
    }

    onBackButtonClick() {
        if (this.overlayMode) {
            this.close();
        } else {
            const event = new BaseEvent<any>();
            this.goBack.next(event);

            if (!event.defaultPrevented) {
                this.location.back();
            }
        }
    }

    /**
     * close the viewer
     */
    close() {
        if (this.otherMenu) {
            this.otherMenu.hidden = false;
        }
        this.cleanup();
        this.showViewer = false;
        this.showViewerChange.emit(this.showViewer);
    }

    /**
     * cleanup before the close
     */
    cleanup() {
        this.urlFileContent = '';
        this.displayName = '';
        this.fileNodeId = null;
        this.extension = null;
        this.mimeType = null;
    }

    ngOnDestroy() {
        this.cleanup();
    }

    /**
     * get File name from url
     *
     * @param {string} url - url file
     * @returns {string} name file
     */
    getFilenameFromUrl(url: string): string {
        let anchor = url.indexOf('#');
        let query = url.indexOf('?');
        let end = Math.min(
            anchor > 0 ? anchor : url.length,
            query > 0 ? query : url.length);
        return url.substring(url.lastIndexOf('/', end) + 1, end);
    }

    /**
     * Get the token from the local storage
     *
     * @param {string} fileName - file name
     * @returns {string} file name extension
     */
    getFileExtension(fileName: string): string {
        return fileName.split('.').pop().toLowerCase();
    }

    isCustomViewerExtension(extension: string): boolean {
        const extensions = this.externalExtensions || [];

        if (extension && extensions.length > 0) {
            extension = extension.toLowerCase();
            return extensions.indexOf(extension) >= 0;
        }

        return false;
    }

    /**
     * Litener Keyboard Event
     * @param {KeyboardEvent} event
     */
    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        let key = event.keyCode;
        if (key === 27 && this.overlayMode) { // esc
            this.close();
        }
    }

    download() {
        if (this.allowDownload && this.downloadUrl && this.fileName) {
            const link = document.createElement('a');

            link.style.display = 'none';
            link.download = this.fileName;
            link.href = this.downloadUrl;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    private displayAsPdf(nodeId: string) {
        this.isLoading = true;

        this.renditionService.getRendition(nodeId, 'pdf').subscribe(
            (response) => {
                const status = response.entry.status.toString();

                if (status === 'CREATED') {
                    this.isLoading = false;
                    this.showPdfRendition(nodeId);
                } else if (status === 'NOT_CREATED') {
                    this.renditionService.convert(nodeId, 'pdf').subscribe({
                        complete: () => {
                            this.isLoading = false;
                            this.showPdfRendition(nodeId);
                        },
                        error: (error) => {
                            this.isLoading = false;
                        }
                    });
                } else {
                    this.isLoading = false;
                }
            },
            (err) => {
                this.isLoading = false;
            }
        );
    }

    private showPdfRendition(nodeId: string) {
        if (nodeId) {
            this.viewerType = 'pdf';
            this.urlFileContent = this.renditionService.getRenditionUrl(nodeId, 'pdf');
        }
    }
}
