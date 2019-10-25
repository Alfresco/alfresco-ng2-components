/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'adf-pdf-thumb',
    templateUrl: './pdfViewer-thumb.component.html',
    encapsulation: ViewEncapsulation.None
})
export class PdfThumbComponent implements OnInit {

    @Input()
    page: any = null;

    image$: Promise<string>;

    constructor(private sanitizer: DomSanitizer) {}

    ngOnInit() {
        this.image$ = this.page.getPage().then((page) => this.getThumb(page));
    }

    private getThumb(page): Promise<string> {
        const viewport = page.getViewport(1);

        const canvas = this.getCanvas();
        const scale = Math.min((canvas.height / viewport.height), (canvas.width / viewport.width));

        return page.render({
            canvasContext: canvas.getContext('2d'),
            viewport: page.getViewport(scale)
        })
        .then(() => {
            const imageSource = canvas.toDataURL();
            return this.sanitizer.bypassSecurityTrustUrl(imageSource);
        });
    }

    private getCanvas(): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        canvas.width = this.page.getWidth();
        canvas.height = this.page.getHeight();
        return canvas;
    }
}
