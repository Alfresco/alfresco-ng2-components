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

import { Component, ElementRef, Input, Output, HostListener } from 'angular2/core';
import { EventEmitter } from 'angular2/src/facade/async';
import { PdfViewerComponent } from './pdfViewer.component';
import { NotSupportedFormat } from './notSupportedFormat.component';

declare let __moduleName: string;

@Component({
    moduleId: __moduleName,
    selector: 'alfresco-viewer',
    directives: [PdfViewerComponent, NotSupportedFormat],
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
    currentPdfDocument: any;
    page: number;
    displayPage: number;
    totalPages: number;

    extension: string;

    constructor(private element: ElementRef) {
    }

    ngOnChanges(changes) {
        if (this.showViewer) {
            this.hideOtherMenu();
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
        if (this.otherMenu) {
            this.otherMenu.hidden = false;
        }
        this.showViewer = false;
        this.showViewerChange.emit(this.showViewer);
    }

    /**
     * get File name from url
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

    private isImage() {
        return this.isImageExtension() || this.isImageMimeType();
    }

    /**
     * check if the current file is a supported image extension
     */
    private isImageExtension() {
        return this.extension === 'png' || this.extension === 'jpg' ||
            this.extension === 'jpeg' || this.extension === 'gif' || this.extension === 'bmp';
    }

    /**
     * check if the current file has an image-based mimetype
     */
    private isImageMimeType() {
        return this.mimeType !== null && this.mimeType.indexOf('image/') === 0;
    }

    /**
     * check if the current file is a suppoerted pdf extension
     */
    private isPdf() {
        return this.extension === 'pdf' || this.mimeType === 'application/pdf';
    }

    /**
     * check if the current file is not a supported extension
     */
    private notSupportedExtension() {
        return !this.isImage() && !this.isPdf();
    }

    /**
     * Litener Keyboard Event
     * @param {KeyboardEvent} event
     */
    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        let key = event.keyCode;
        if (key === 27) { //esc
            this.close();
        } else if (key === 39) { //right arrow
            //this.nextPage();
        } else if (key === 37) {//left arrow
            //this.previousPage();
        }
    }

    private closestElement(el: HTMLElement, nodeName: string) {
        let parent = el.parentElement;
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
    private hideOtherMenu() {
        if (this.overlayMode && !this.closestElement(this.element.nativeElement, 'header')) {
            this.otherMenu = document.querySelector('header');
            if (this.otherMenu) {
                this.otherMenu.hidden = true;
            }
        }
    }
}
