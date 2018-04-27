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

import { Component, Input, OnInit, ElementRef, ViewEncapsulation } from '@angular/core';
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

    constructor(
        private element: ElementRef, private sanitizer: DomSanitizer) {}

    ngOnInit() {
        this.image$ = this.page.getPage().then((page) => this.getThumb(page));
    }

    private getThumb(page): Promise<string> {
        const canvas = this.getCanvas();
        const viewport = page.getViewport(1);
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
        const elementRect = this.element.nativeElement.getBoundingClientRect();
        const canvas = document.createElement('canvas');

        canvas.width = elementRect.width;
        canvas.height = elementRect.height;

        return canvas;
    }
}
