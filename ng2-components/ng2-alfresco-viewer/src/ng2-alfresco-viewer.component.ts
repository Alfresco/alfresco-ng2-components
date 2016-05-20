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
declare let __moduleName:string;

@Component({
    moduleId: __moduleName,
    selector: 'ng2-alfresco-viewer',
    templateUrl: './ng2-alfresco-viewer.component.html',
    styleUrls: ['./ng2-alfresco-viewer.component.css']
})
export class Ng2AlfrescoViewerComponent {

    nameFile:String;

    constructor() {
        this.nameFile = 'localTestFile.pdf';

        PDFJS.getDocument('../localTestFile.pdf').then(function getPdfHelloWorld(pdf) {
            //
            // Fetch the first page
            //
            pdf.getPage(1).then(function (page) {
                let scale = 1.5;
                let viewport = page.getViewport(scale);

                //
                // Prepare canvas using PDF page dimensions
                //
                let canvas:any = document.getElementById('the-canvas');
                if (canvas) {
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
                }
            });
        });
        console.log('../contructor');
    }

}
