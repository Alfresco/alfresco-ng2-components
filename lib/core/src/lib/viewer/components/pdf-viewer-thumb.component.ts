/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, ElementRef, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FocusableOption } from '@angular/cdk/a11y';

@Component({
    selector: 'adf-pdf-thumb',
    templateUrl: './pdf-viewer-thumb.component.html',
    encapsulation: ViewEncapsulation.None,
    host: { tabindex: '0'}
})
export class PdfThumbComponent implements OnInit, FocusableOption {

    @Input()
    page: any = null;

    image$: Promise<string>;

    constructor(private sanitizer: DomSanitizer, private element: ElementRef) {
    }

    ngOnInit() {
        this.image$ = this.page.getPage().then((page) => this.getThumb(page));
    }

    focus() {
        this.element.nativeElement.focus();
    }

    private getThumb(page): Promise<string> {
        const viewport = page.getViewport({ scale: 1 });

        const canvas = this.getCanvas();
        const scale = Math.min((canvas.height / viewport.height), (canvas.width / viewport.width));

        return page.render({
            canvasContext: canvas.getContext('2d'),
            viewport: page.getViewport({ scale })
        }).promise.then(() => {
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
