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

import { Component, ElementRef, EventEmitter, HostListener, Inject, Input, OnChanges, OnDestroy, Output, TemplateRef } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { AlfrescoApiService, LogService } from 'ng2-alfresco-core';

@Component({
    selector: 'adf-viewer, alfresco-viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.css']
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
    showToolbar: boolean = true;

    @Input()
    displayName: string;

    @Output()
    showViewerChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Output()
    extensionChange: EventEmitter<String> = new EventEmitter<String>();

    extensionTemplates: { template: TemplateRef<any>, isVisible: boolean }[] = [];

    externalExtensions: string[] = [];

    urlFileContent: string;
    otherMenu: any;
    extension: string;
    mimeType: string;
    loaded: boolean = false;

    constructor(private apiService: AlfrescoApiService,
                private element: ElementRef,
                @Inject(DOCUMENT) private document,
                private logService: LogService) {
    }

    ngOnChanges(changes) {
        if (this.showViewer) {
            if (this.overlayMode) {
                this.hideOtherHeaderBar();
                this.blockOtherScrollBar();
            }
            if (!this.urlFile && !this.blobFile && !this.fileNodeId) {
                throw new Error('Attribute urlFile or fileNodeId or blobFile is required');
            }

            return new Promise((resolve, reject) => {
                if (this.blobFile) {
                    this.mimeType = this.blobFile.type;
                    this.extensionChange.emit(this.mimeType);
                    resolve();
                } else if (this.urlFile) {
                    let filenameFromUrl = this.getFilenameFromUrl(this.urlFile);
                    this.displayName = filenameFromUrl ? filenameFromUrl : '';
                    this.extension = this.getFileExtension(filenameFromUrl);
                    this.extensionChange.emit(this.extension);
                    this.urlFileContent = this.urlFile;
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

    /**
     * close the viewer
     */
    close() {
        this.unblockOtherScrollBar();
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
    private getFileExtension(fileName: string): string {
        return fileName.split('.').pop().toLowerCase();
    }

    /**
     * Check if the content is an image through the extension or mime type
     *
     * @returns {boolean}
     */
    public isImage(): boolean {
        return this.isImageExtension() || this.isImageMimeType();
    }

    /**
     * Check if the content is a media through the extension or mime type
     *
     * @returns {boolean}
     */
    public isMedia(): boolean {
        return this.isMediaExtension(this.extension) || this.isMediaMimeType();
    }

    /**
     * check if the current file is a supported image extension
     *
     * @returns {boolean}
     */
    private isImageExtension(): boolean {
        return this.extension === 'png' || this.extension === 'jpg' ||
            this.extension === 'jpeg' || this.extension === 'gif' || this.extension === 'bmp';
    }

    /**
     * check if the current file has an image-based mimetype
     *
     * @returns {boolean}
     */
    private isMediaMimeType(): boolean {
        let mimeExtension;
        if (this.mimeType && this.mimeType.indexOf('/')) {
            mimeExtension = this.mimeType.substr(this.mimeType.indexOf('/') + 1, this.mimeType.length);
        }
        return (this.mimeType && (this.mimeType.indexOf('video/') === 0 || this.mimeType.indexOf('audio/') === 0)) && this.isMediaExtension(mimeExtension);
    }

    /**
     * check if the current file is a supported media extension
     * @param {string} extension
     *
     * @returns {boolean}
     */
    private isMediaExtension(extension: string): boolean {
        return extension === 'wav' || extension === 'mp4' || extension === 'mp3' || extension === 'WebM' || extension === 'Ogg';
    }

    /**
     * check if the current file has an image-based mimetype
     *
     * @returns {boolean}
     */
    private isImageMimeType(): boolean {
        return this.mimeType && this.mimeType.indexOf('image/') === 0;
    }

    /**
     * check if the current file is a supported pdf extension
     *
     * @returns {boolean}
     */
    public isPdf(): boolean {
        return this.extension === 'pdf' || this.mimeType === 'application/pdf';
    }

    /**
     * check if the current file is a supported txt extension
     *
     * @returns {boolean}
     */
    public isText(): boolean {
        return this.extension === 'txt' || this.mimeType === 'text/txt' || this.mimeType === 'text/plain';
    }

    /**
     * check if the current file is  a supported extension
     *
     * @returns {boolean}
     */
    supportedExtension(): boolean {
        return this.isImage() || this.isPdf() || this.isMedia() || this.isText() || this.isExternalSupportedExtension();
    }

    /**
     * Check if the file is compatible with one of the extension
     *
     * @returns {boolean}
     */
    isExternalSupportedExtension(): boolean {
        let externalType: string;

        if (this.externalExtensions && (this.externalExtensions instanceof Array)) {
            externalType = this.externalExtensions.find((externalExtension) => {
                return externalExtension.toLowerCase() === this.extension;

            });
        }

        return !!externalType;
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
     * Check if in the document there are scrollable main area and disable it
     */
    private blockOtherScrollBar() {
        let mainElements: any = this.document.getElementsByTagName('main');

        for (let i = 0; i < mainElements.length; i++) {
            mainElements[i].style.overflow = 'hidden';
        }
    }

    /**
     * Check if in the document there are scrollable main area and re-enable it
     */
    private unblockOtherScrollBar() {
        let mainElements: any = this.document.getElementsByTagName('main');

        for (let i = 0; i < mainElements.length; i++) {
            mainElements[i].style.overflow = '';
        }
    }

    /**
     * Check if the viewer is used inside and header element
     *
     * @returns {boolean}
     */
    private isParentElementHeaderBar(): boolean {
        return !!this.closestElement(this.element.nativeElement, 'header');
    }

    /**
     * Check if the viewer is used inside and header element
     * @param {HTMLElement} elelemnt
     * @param {string} nodeName
     * @returns {HTMLElement}
     */
    private closestElement(element: HTMLElement, nodeName: string): HTMLElement {
        let parent = element.parentElement;
        if (parent) {
            if (parent.nodeName.toLowerCase() === nodeName) {
                return parent;
            } else {
                return this.closestElement(parent, nodeName);
            }
        } else {
            return null;
        }
    }

    /**
     * Hide the other possible menu in the application
     */
    private hideOtherHeaderBar() {
        if (this.overlayMode && !this.isParentElementHeaderBar()) {
            this.otherMenu = this.document.querySelector('header');
            if (this.otherMenu) {
                this.otherMenu.hidden = true;
            }
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
