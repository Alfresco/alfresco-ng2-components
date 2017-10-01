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
import { AlfrescoApiService, BaseEvent, LogService } from 'ng2-alfresco-core';

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
    displayName: string;

    @Input()
    allowGoBack = true;

    @Input()
    allowOpenWith = true;

    @Input()
    allowDownload = true;

    @Input()
    allowPrint = true;

    @Input()
    allowShare = true;

    @Input()
    allowInfoDrawer = true;

    @Input()
    showInfoDrawer = false;

    @Output()
    goBack = new EventEmitter<BaseEvent<any>>();

    @Output()
    showViewerChange = new EventEmitter<boolean>();

    @Output()
    extensionChange = new EventEmitter<string>();

    viewerType: string = 'unknown';
    extensionTemplates: { template: TemplateRef<any>, isVisible: boolean }[] = [];
    externalExtensions: string[] = [];
    urlFileContent: string;
    otherMenu: any;
    extension: string;
    mimeType: string;
    loaded: boolean = false;

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

    constructor(private apiService: AlfrescoApiService,
                private logService: LogService,
                private location: Location) {}

    ngOnChanges(changes) {
        if (this.showViewer) {
            if (!this.urlFile && !this.blobFile && !this.fileNodeId) {
                throw new Error('Attribute urlFile or fileNodeId or blobFile is required');
            }

            return new Promise((resolve, reject) => {
                if (this.blobFile) {
                    this.mimeType = this.blobFile.type;
                    this.extensionChange.emit(this.mimeType);

                    this.viewerType = this.getViewerTypeByMimeType(this.mimeType);
                    resolve();
                } else if (this.urlFile) {
                    let filenameFromUrl = this.getFilenameFromUrl(this.urlFile);
                    this.displayName = filenameFromUrl ? filenameFromUrl : '';
                    this.extension = this.getFileExtension(filenameFromUrl);
                    this.extensionChange.emit(this.extension);
                    this.urlFileContent = this.urlFile;

                    this.viewerType = this.getViewerTypeByExtension(this.extension);
                    if (this.viewerType === 'unknown') {
                        this.viewerType = this.getViewerTypeByMimeType(this.mimeType);
                    }
                    resolve();
                } else if (this.fileNodeId) {
                    this.apiService.getInstance().nodes.getNodeInfo(this.fileNodeId).then(
                        (data: MinimalNodeEntryEntity) => {
                            this.mimeType = data.content.mimeType;
                            this.displayName = data.name;
                            this.urlFileContent = this.apiService.getInstance().content.getContentUrl(data.id);
                            this.extension = this.getFileExtension(data.name);
                            this.extensionChange.emit(this.extension);
                            this.loaded = true;

                            this.viewerType = this.getViewerTypeByExtension(this.extension);
                            if (this.viewerType === 'unknown') {
                                this.viewerType = this.getViewerTypeByMimeType(this.mimeType);
                            }
                            resolve();
                        },
                        (error) => {
                            reject(error);
                            this.logService.error('This node does not exist');
                        }
                    );
                }
            });
        }
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
        this.loaded = false;
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

    /**
     * return true if the data about the node in the ecm are loaded
     *
     * @returns {boolean}
     */
    isLoaded(): boolean {
        return this.fileNodeId ? this.loaded : true;
    }
}
