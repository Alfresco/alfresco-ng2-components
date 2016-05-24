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

import { Component, Input } from 'angular2/core';

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

    nameFile: string;

    currentPdf: any;
    currentPage: number;
    displayPage: number;
    totalPages: number;

    ngOnInit() {
        console.log('urlFile ' + this.urlFile);

        this.nameFile = PDFJS.getFilenameFromUrl(this.urlFile);

        PDFJS.getDocument(this.urlFile).then((pdf) => {
            this.currentPdf = pdf;
            this.totalPages = pdf.numPages;
            this.currentPage = 1;
            this.displayPage = 1;
            this.loadPage(this.currentPdf, this.currentPage);
        });
    }

    loadPage(pdf: any, numberPage: number) {
        pdf.getPage(numberPage).then((page) => {

            console.log(page.numPages);

            let scale = 1.5;
            let viewport = page.getViewport(scale);

            let canvas: any = document.getElementById('the-canvas');

            if (canvas) {
                let context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Render PDF page into canvas context
                let renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };

                page.render(renderContext);
            }
        });
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.displayPage = this.currentPage;
            this.loadPage(this.currentPdf, this.currentPage);
        }
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.displayPage = this.currentPage;
            this.loadPage(this.currentPdf, this.currentPage);
        }
    }

    inputPage(page: any) {
        let pageInput = parseInt(page, 10);

        if (!isNaN(pageInput) && pageInput > 0 && pageInput <= this.totalPages) {
            this.currentPage = pageInput;
            this.loadPage(this.currentPdf, this.currentPage);
        } else {
            this.displayPage = this.currentPage;
        }
    }
}
