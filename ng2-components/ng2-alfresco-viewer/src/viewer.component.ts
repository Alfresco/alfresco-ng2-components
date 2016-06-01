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

import { Component, Input, SimpleChange } from 'angular2/core';

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

    nameFile: string;
    currentPdfDocument: any;
    currentPage: number;
    displayPage: number;
    totalPages: number;

    ngOnInit() {
        if (!this.urlFile) {
            throw new Error('Attribute urlFile is required');
        }
    }

    ngOnChanges(changes: {[urlFile: string]: SimpleChange}) {
        if (this.urlFile) {
            this.nameFile = this.getPDFJS().getFilenameFromUrl(this.urlFile);

            this.urlFile = this.addAlfrescoTicket(this.urlFile);

            return this.getPDFJS().getDocument(this.urlFile, null, null).then((pdfDocument) => {
                this.currentPdfDocument = pdfDocument;
                this.totalPages = pdfDocument.numPages;
                this.currentPage = 1;
                this.displayPage = 1;
                this.loadPage(this.currentPdfDocument);
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

    loadPage(pdfDocument: any) {

        PDFJS.verbosity = 5;

        let documentContainer: any = document.getElementById('viewer-canvas-container');

        let pdfViewer = new PDFJS.PDFViewer({
            container: documentContainer
        });

        pdfViewer.setDocument(pdfDocument);
    }

    /**
     * load the previous page
     */
    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.displayPage = this.currentPage;
            this.loadPage(this.currentPdfDocument);
        }
    }

    /**
     * load the next page
     */
    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.displayPage = this.currentPage;
            this.loadPage(this.currentPdfDocument);
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
            this.currentPage = pageInput;
            this.loadPage(this.currentPdfDocument);
        } else {
            this.displayPage = this.currentPage;
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
     * Get the token from the local storage
     * @returns {string}
     */
    private getAlfrescoTicket(): string {
        return localStorage.getItem('token');
    }
}
