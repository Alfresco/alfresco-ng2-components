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

import {
    Component,
    Input,
    OnChanges,
    SimpleChanges,
    ViewEncapsulation,
    ElementRef,
    OnInit,
    OnDestroy
} from '@angular/core';
import { ContentService } from '../../services/content.service';
import { AppConfigService } from './../../app-config/app-config.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
    selector: 'adf-img-viewer',
    templateUrl: './imgViewer.component.html',
    styleUrls: ['./imgViewer.component.scss'],
    host: { 'class': 'adf-image-viewer' },
    encapsulation: ViewEncapsulation.None
})
export class ImgViewerComponent implements OnInit, OnChanges, OnDestroy {

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
    offsetX: number = 0;
    offsetY: number = 0;
    step: number = 4;
    isDragged: boolean = false;

    private drag = { x: 0, y: 0 };
    private delta = { x: 0, y: 0 };

    get transform(): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle(`scale(${this.scaleX}, ${this.scaleY}) rotate(${this.rotate}deg) translate(${this.offsetX}px, ${this.offsetY}px)`);
    }

    get currentScaleText(): string {
        return Math.round(this.scaleX * 100) + '%';
    }

    private element: HTMLElement;

    constructor(
        private sanitizer: DomSanitizer,
        private appConfigService: AppConfigService,
        private contentService: ContentService,
        private el: ElementRef) {
        this.initializeScaling();
    }

    initializeScaling() {
        const scaling = this.appConfigService.get<number>('adf-viewer.image-viewer-scaling', undefined) / 100;
        if (scaling) {
            this.scaleX = scaling;
            this.scaleY = scaling;
        }
    }

    ngOnInit() {
        this.element = <HTMLElement> this.el.nativeElement.querySelector('#viewer-image');

        if (this.element) {
            this.element.addEventListener('mousedown', this.onMouseDown.bind(this));
            this.element.addEventListener('mouseup', this.onMouseUp.bind(this));
            this.element.addEventListener('mouseleave', this.onMouseLeave.bind(this));
            this.element.addEventListener('mouseout', this.onMouseOut.bind(this));
            this.element.addEventListener('mousemove', this.onMouseMove.bind(this));
        }
    }

    ngOnDestroy() {
        if (this.element) {
            this.element.removeEventListener('mousedown', this.onMouseDown);
            this.element.removeEventListener('mouseup', this.onMouseUp);
            this.element.removeEventListener('mouseleave', this.onMouseLeave);
            this.element.removeEventListener('mouseout', this.onMouseOut);
            this.element.removeEventListener('mousemove', this.onMouseMove);
        }
    }

    onKeyDown(event: KeyboardEvent) {
        const scaleX = (this.scaleX !== 0 ? this.scaleX : 1.0);
        const scaleY = (this.scaleY !== 0 ? this.scaleY : 1.0);

        if (event.key === 'ArrowDown') {
            this.offsetY += (this.step / scaleY);
        }

        if (event.key === 'ArrowUp') {
            this.offsetY -= (this.step / scaleY);
        }

        if (event.key === 'ArrowRight') {
            this.offsetX += (this.step / scaleX);
        }

        if (event.key === 'ArrowLeft') {
            this.offsetX -= (this.step / scaleX);
        }
    }

    onMouseDown(event: MouseEvent) {
        event.preventDefault();
        this.isDragged = true;
        this.drag = { x: event.pageX, y: event.pageY };
    }

    onMouseMove(event: MouseEvent) {
        if (this.isDragged) {
            event.preventDefault();

            this.delta.x = event.pageX - this.drag.x;
            this.delta.y = event.pageY - this.drag.y;

            this.drag.x = event.pageX;
            this.drag.y = event.pageY;

            const scaleX = (this.scaleX !== 0 ? this.scaleX : 1.0);
            const scaleY = (this.scaleY !== 0 ? this.scaleY : 1.0);

            this.offsetX += (this.delta.x / scaleX);
            this.offsetY += (this.delta.y / scaleY);
        }
    }

    onMouseUp(event: MouseEvent) {
        if (this.isDragged) {
            event.preventDefault();
            this.isDragged = false;
        }
    }

    onMouseLeave(event: MouseEvent) {
        if (this.isDragged) {
            event.preventDefault();
            this.isDragged = false;
        }
    }

    onMouseOut(event: MouseEvent) {
        if (this.isDragged) {
            event.preventDefault();
            this.isDragged = false;
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        const blobFile = changes['blobFile'];
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

    reset() {
        this.rotate = 0;
        this.scaleX = 1.0;
        this.scaleY = 1.0;
        this.offsetX = 0;
        this.offsetY = 0;
    }
}
