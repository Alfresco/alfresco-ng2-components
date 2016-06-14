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

import { Component, Input, HostListener } from '@angular/core';

declare let PDFJS: any;
declare let __moduleName: string;

@Component({
    moduleId: __moduleName,
    selector: 'pdf-viewer',
    templateUrl: './pdfViewer.component.html',
    styleUrls: ['./pdfViewer.component.css']
})
export class PdfViewerComponent {

    @Input()
    urlFile: string;

    currentPdfDocument: any;
    page: number;
    displayPage: number;
    totalPages: number;

    pdfViewer: any;

    renderingStates = {
        FINISHED: 3 as number
    };

    ngOnChanges(changes) {
        if (!this.urlFile) {
            throw new Error('Attribute urlFile is required');
        }

        if (this.urlFile) {
            return new Promise((resolve, reject) => {
                this.getPDFJS().getDocument(this.urlFile, null, null).then((pdfDocument) => {
                    this.currentPdfDocument = pdfDocument;
                    this.totalPages = pdfDocument.numPages;
                    this.page = 1;
                    this.displayPage = 1;
                    this.initPDFViewer(this.currentPdfDocument);
                }, (error) => {
                    reject(error);
                });
                resolve();
            });
        }
    }

    /**
     * return the PDFJS global object (exist to facilitate the mock of PDFJS in the test)
     * @returns {PDFJS}
     */
    getPDFJS() {
        return PDFJS;
    }

    initPDFViewer(pdfDocument: any) {
        PDFJS.verbosity = 5;

        let documentContainer: any = document.getElementById('viewer-pdf-container');
        let viewer: any = document.getElementById('viewer-viewerPdf');

        this.pdfViewer = new PDFJS.PDFViewer({
            container: documentContainer,
            viewer: viewer
        });

        this.pdfViewer.setDocument(pdfDocument);
    }

    /**
     * load the previous page
     */
    previousPage() {
        if (this.pdfViewer && this.page > 1) {
            this.page--;
            this.displayPage = this.page;

            this.pdfViewer.currentPageNumber = this.page;

            if (this.pdfViewer.currentPage.renderingState === this.renderingStates.FINISHED) {
                // remove loader
            } else {
                // add loader
            }
        }
    }

    /**
     * load the next page
     */
    nextPage() {
        if (this.pdfViewer && this.page < this.totalPages) {
            this.page++;
            this.displayPage = this.page;

            this.pdfViewer.currentPageNumber = this.page;
        }
    }

    /**
     * load the page in input
     *
     * @param {string} page - page to load
     */
    inputPage(page: string) {
        let pageInput = parseInt(page, 10);

        if (!isNaN(pageInput) && pageInput > 0 && pageInput <= this.totalPages) {
            this.page = pageInput;

            this.pdfViewer.currentPageNumber = this.page;
        } else {
            this.displayPage = this.page;
        }
    }

    /**
     * Litener Keyboard Event
     * @param {KeyboardEvent} event
     */
    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        let key = event.keyCode;
        if (key === 39) { //right arrow
            this.nextPage();
        } else if (key === 37) {//left arrow
            this.previousPage();
        }
    }

}
