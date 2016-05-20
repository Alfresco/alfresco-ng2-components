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

import { Component } from 'angular2/core';

declare let PDFJS: any;

@Component({
    selector: 'ng2-alfresco-viewer',
    styles: [
        `
              :host h1 {
                  font-size:22px
              }
          `
    ],
    template: `<H1>ng2-alfresco-viewer</H1>`
})
export class Ng2AlfrescoViewerComponent {

    constructor() {
        PDFJS.getDocument('../localTestFile.pdf').then(function getPdfHelloWorld(pdf) {
            //
            // Fetch the first page
            //
            pdf.getPage(1).then(function getPageHelloWorld(page) {
                let scale = 1.5;
                let viewport = page.getViewport(scale);

                //
                // Prepare canvas using PDF page dimensions
                //
                let canvas: any = document.getElementById('the-canvas');
                let context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                //
                // Render PDF page into canvas context
                //
                let renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                page.render(renderContext);
            });
        });
        console.log('../contructor');
    }

}
