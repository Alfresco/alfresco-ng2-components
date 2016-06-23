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
import { PdfViewerComponent } from './pdfViewer.component';
import { ImgViewerComponent } from './imgViewer.component';
import { NotSupportedFormat } from './notSupportedFormat.component';
import { DOCUMENT } from '@angular/platform-browser';

declare let __moduleName: string;

@Component({
    moduleId: __moduleName,
    selector: 'alfresco-viewer',
    directives: [PdfViewerComponent, ImgViewerComponent, NotSupportedFormat],
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.css']
})
export class ViewerComponent {

    @Input()
    urlFile: string;

    @Input()
    fileName: string = null;

    @Input()
    mimeType: string = null;

    @Input()
    overlayMode: boolean = false;

    @Input()
    showViewer: boolean = true;

    @Output()
    showViewerChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    otherMenu: any;

    displayName: string;

    extension: string;

    constructor(private element: ElementRef, @Inject(DOCUMENT) private document) {
    }

    ngOnChanges(changes) {
        if (this.showViewer) {
            this.hideOtherHeaderBar();
            this.blockOtherScrollBar();
            if (!this.urlFile) {
                throw new Error('Attribute urlFile is required');
            }
            return new Promise((resolve) => {
                if (this.urlFile) {
                    let filenameFromUrl = this.getFilenameFromUrl(this.urlFile);
                    this.displayName = this.fileName !== null ? this.fileName : filenameFromUrl;
                    this.extension = this.getFileExtension(filenameFromUrl);
                }
                resolve();
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
        this.showViewer = false;
        this.showViewerChange.emit(this.showViewer);
    }

    /**
     * get File name from url
     *
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
     * Check if the content is an image thorugh the extension or mime type
     *
     * @returns {boolean}
     */
    private isImage() {
        return this.isImageExtension() || this.isImageMimeType();
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
    private isImageMimeType() {
        return this.mimeType !== null && this.mimeType.indexOf('image/') === 0;
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
        return this.isImage() || this.isPdf();
    }

    /**
     * Litener Keyboard Event
     * @param {KeyboardEvent} event
     */
    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        let key = event.keyCode;
        if (key === 27) { // esc
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
}
