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

import { Component, ElementRef, Input, Output, HostListener, EventEmitter, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { AlfrescoApiService, LogService } from 'ng2-alfresco-core';

@Component({
    selector: 'alfresco-viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.css']
})
export class ViewerComponent {

    @Input()
    urlFile: string = '';

    @Input()
    fileNodeId: string = null;

    @Input()
    overlayMode: boolean = false;

    @Input()
    showViewer: boolean = true;

    @Input()
    showToolbar: boolean = true;

    @Output()
    showViewerChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    urlFileContent: string;
    otherMenu: any;
    displayName: string;
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
            this.hideOtherHeaderBar();
            this.blockOtherScrollBar();
            if (!this.urlFile && !this.fileNodeId) {
                throw new Error('Attribute urlFile or fileNodeId is required');
            }
            return new Promise((resolve, reject) => {
                let alfrescoApi = this.apiService.getInstance();
                if (this.urlFile) {
                    let filenameFromUrl = this.getFilenameFromUrl(this.urlFile);
                    this.displayName = filenameFromUrl ? filenameFromUrl : '';
                    this.extension = this.getFileExtension(filenameFromUrl);
                    this.urlFileContent = this.urlFile;
                    resolve();
                } else if (this.fileNodeId) {
                    alfrescoApi.nodes.getNodeInfo(this.fileNodeId).then((data: MinimalNodeEntryEntity) => {
                        this.mimeType = data.content.mimeType;
                        this.displayName = data.name;
                        this.urlFileContent = alfrescoApi.content.getContentUrl(data.id);
                        this.loaded = true;
                        resolve();
                    }, function (error) {
                        reject(error);
                        this.logService.error('This node does not exist');
                    });
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
    getFilenameFromUrl(url: string) {
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
    private getFileExtension(fileName: string) {
        return fileName.split('.').pop().toLowerCase();
    }

    /**
     * Check if the content is an image through the extension or mime type
     *
     * @returns {boolean}
     */
    private isImage() {
        return this.isImageExtension() || this.isImageMimeType();
    }

    /**
     * Check if the content is a media through the extension or mime type
     *
     * @returns {boolean}
     */
    private isMedia() {
        return this.isMediaExtension(this.extension) || this.isMediaMimeType();
    }

    /**
     * check if the current file is a supported image extension
     *
     * @returns {boolean}
     */
    private isImageExtension() {
        return this.extension === 'png' || this.extension === 'jpg' ||
            this.extension === 'jpeg' || this.extension === 'gif' || this.extension === 'bmp';
    }

    /**
     * check if the current file has an image-based mimetype
     *
     * @returns {boolean}
     */
    private isMediaMimeType() {
        let mimeExtension;
        if (this.mimeType && this.mimeType.indexOf('/')) {
            mimeExtension = this.mimeType.substr(this.mimeType.indexOf('/') + 1, this.mimeType.length);
        }
        return this.mimeType && this.mimeType.indexOf('video/') === 0 && this.isMediaExtension(mimeExtension);
    }

    /**
     * check if the current file is a supported media extension
     * @param {string} extension
     *
     * @returns {boolean}
     */
    private isMediaExtension(extension: string) {
        return extension === 'mp4' || extension === 'WebM' || extension === 'Ogg';
    }

    /**
     * check if the current file has an image-based mimetype
     *
     * @returns {boolean}
     */
    private isImageMimeType() {
        return this.mimeType && this.mimeType.indexOf('image/') === 0;
    }

    /**
     * check if the current file is a supported pdf extension
     *
     * @returns {boolean}
     */
    private isPdf() {
        return this.extension === 'pdf' || this.mimeType === 'application/pdf';
    }

    /**
     * check if the current file is  a supported extension
     *
     * @returns {boolean}
     */
    supportedExtension() {
        return this.isImage() || this.isPdf() || this.isMedia();
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
     *
     * @returns {boolean}
     */
    private blockOtherScrollBar() {
        let mainElements: any = document.getElementsByTagName('main');

        for (let i = 0; i < mainElements.length; i++) {
            mainElements[i].style.overflow = 'hidden';
        }
    }

    /**
     * Check if in the document there are scrollable main area and renable it
     *
     * @returns {boolean}
     */
    private unblockOtherScrollBar() {
        let mainElements: any = document.getElementsByTagName('main');

        for (let i = 0; i < mainElements.length; i++) {
            mainElements[i].style.overflow = '';
        }
    }

    /**
     * Check if the viewer is used inside and header element
     *
     * @returns {boolean}
     */
    private isParentElementHeaderBar() {
        return !!this.closestElement(this.element.nativeElement, 'header');
    }

    /**
     * Check if the viewer is used inside and header element
     * @param {HTMLElement} elelemnt
     * @param {string} nodeName
     * @returns {HTMLElement}
     */
    private closestElement(elelemnt: HTMLElement, nodeName: string) {
        let parent = elelemnt.parentElement;
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
            this.otherMenu = document.querySelector('header');
            if (this.otherMenu) {
                this.otherMenu.hidden = true;
            }
        }
    }

    /**
     * return true if the data about the node in the ecm are loaded
     */
    isLoaded() {
        return this.fileNodeId ? this.loaded : true;
    }
}
