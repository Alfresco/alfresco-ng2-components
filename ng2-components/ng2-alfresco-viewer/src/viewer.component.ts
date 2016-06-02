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

import { Component, Input, Output } from 'angular2/core';
import { EventEmitter } from 'angular2/src/facade/async';

declare let PDFJS: any;
declare let __moduleName: string;

@Component({
    moduleId: __moduleName,
    selector: 'alfresco-viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.css']
})
export class ViewerComponent {

    @Input()
    urlFile: string;

    @Input()
    overlayMode: boolean = false;

    @Input()
    showViewer: boolean = true;
    @Output()
    showViewerChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    nameFile: string;
    currentPdfDocument: any;
    page: number;
    displayPage: number;
    totalPages: number;

    pdfViewer: any;

    renderingStates = {
        FINISHED: 3 as number
    };

    ngOnChanges(changes) {
        console.log(changes);

        if (this.showViewer) {
            if (!this.urlFile) {
                throw new Error('Attribute urlFile is required');
            }

            if (this.urlFile) {
                this.nameFile = this.getPDFJS().getFilenameFromUrl(this.urlFile);

                let urlFileTicket = this.addAlfrescoTicket(this.urlFile);

                return this.getPDFJS().getDocument(urlFileTicket, null, null).then((pdfDocument) => {
                    this.currentPdfDocument = pdfDocument;
                    this.totalPages = pdfDocument.numPages;
                    this.page = 1;
                    this.displayPage = 1;
                    this.loadPage(this.currentPdfDocument);
                });
            }
        }
    }

    /**
     * return the PDFJS global object (exist to facilitate the mock of PDFJS in the test)
     * @returns {PDFJS}
     */
    getPDFJS() {
        return PDFJS;
    }

    loadPage(pdfDocument: any) {

        PDFJS.verbosity = 5;

        let documentContainer: any = document.getElementById('viewer-canvas-container');

        this.pdfViewer = new PDFJS.PDFViewer({
            container: documentContainer
        });

        this.pdfViewer.setDocument(pdfDocument);
    }

    /**
     * load the previous page
     */
    previousPage() {
        if (this.page > 1) {
            this.page--;
            this.displayPage = this.page;

            let currentPage = this.pdfViewer.getPageView(this.page - 1);

            if (currentPage.renderingState === this.renderingStates.FINISHED) {
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
        if (this.page < this.totalPages) {
            this.page++;
            this.displayPage = this.page;
            this.pdfViewer.getPageView(this.page - 1);
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
            this.loadPage(this.currentPdfDocument);
        } else {
            this.displayPage = this.page;
        }
    }

    /**
     * Add Ticket to the file request
     * @returns {string}
     */
    private addAlfrescoTicket(url: string) {
        return url + '?alf_ticket=' + this.getAlfrescoTicket();
    }

    /**
     * close the viewer
     */
    close() {
        this.showViewer = false;
        this.showViewerChange.emit(this.showViewer);
    }

    /**
     * Get the token from the local storage
     * @returns {string}
     */
    private getAlfrescoTicket(): string {
        return localStorage.getItem('token');
    }
}
