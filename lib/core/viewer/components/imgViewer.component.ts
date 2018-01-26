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

import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ContentService } from '../../services/content.service';

@Component({
    selector: 'adf-img-viewer',
    templateUrl: './imgViewer.component.html',
    styleUrls: ['./imgViewer.component.scss'],
    host: { 'class': 'adf-image-viewer' },
    encapsulation: ViewEncapsulation.None
})
export class ImgViewerComponent implements OnChanges {

    @Input()
    showToolbar = true;

    @Input()
    urlFile: string;

    @Input()
    blobFile: Blob;

    @Input()
    nameFile: string;

    rotate: number = 0;
    scaleX: number = 1.0;
    scaleY: number = 1.0;

    get transform(): string {
        return `scale(${this.scaleX}, ${this.scaleY}) rotate(${this.rotate}deg)`
    }

    constructor(private contentService: ContentService) {}

    ngOnChanges(changes: SimpleChanges) {
        let blobFile = changes['blobFile'];
        if (blobFile && blobFile.currentValue) {
            this.urlFile = this.contentService.createTrustedUrl(this.blobFile);
            return;
        }
        if (!this.urlFile && !this.blobFile) {
            throw new Error('Attribute urlFile or blobFile is required');
        }
    }

    zoomIn() {
        const ratio = +((this.scaleX + 0.2).toFixed(1));
        this.scaleX = this.scaleY = ratio;
    }

    zoomOut() {
        let ratio = +((this.scaleX - 0.2).toFixed(1));
        if (ratio < 0.2) {
            ratio = 0.2;
        }
        this.scaleX = this.scaleY = ratio;
    }

    rotateLeft() {
        const angle = this.rotate - 90;
        this.rotate = Math.abs(angle) < 360 ? angle : 0;
    }

    rotateRight() {
        const angle = this.rotate + 90;
        this.rotate = Math.abs(angle) < 360 ? angle : 0;
    }

    flip() {
        this.scaleX *= -1;
    }
}
