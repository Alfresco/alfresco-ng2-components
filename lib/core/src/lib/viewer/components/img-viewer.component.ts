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

import {
    Component,
    Input,
    OnChanges,
    SimpleChanges,
    ViewEncapsulation,
    ElementRef,
    Output,
    EventEmitter, AfterViewInit, ViewChild, HostListener, OnDestroy
} from '@angular/core';
import { AppConfigService } from '../../app-config/app-config.service';
import { UrlService } from '../../common/services/url.service';
import Cropper from 'cropperjs';

@Component({
    selector: 'adf-img-viewer',
    templateUrl: './img-viewer.component.html',
    styleUrls: ['./img-viewer.component.scss'],
    host: { class: 'adf-image-viewer' },
    encapsulation: ViewEncapsulation.None
})
export class ImgViewerComponent implements AfterViewInit, OnChanges, OnDestroy {

    @Input()
    showToolbar = true;

    @Input()
    readOnly = true;

    @Input()
    urlFile: string;

    @Input()
    blobFile: Blob;

    @Input()
    fileName: string;

    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output()
    error = new EventEmitter<any>();

    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output()
    submit = new EventEmitter<any>();

    @Output()
    isSaving = new EventEmitter<boolean>();

    @ViewChild('image', { static: false})
    public imageElement: ElementRef;

    public scale: number = 1.0;
    public cropper: Cropper;
    public isEditing: boolean = false;

    get currentScaleText(): string {
        return Math.round(this.scale * 100) + '%';
    }

    constructor(
        private appConfigService: AppConfigService,
        private urlService: UrlService
    ) {
        this.initializeScaling();
    }

    initializeScaling() {
        const scaling = this.appConfigService.get<number>('adf-viewer-render.image-viewer-scaling', undefined) / 100;
        if (scaling) {
            this.scale = scaling;
        }
    }

    ngAfterViewInit() {
        this.cropper = new Cropper(this.imageElement.nativeElement, {
            autoCrop: false,
            dragMode: 'move',
            background: false,
            scalable: true,
            zoomOnWheel: false,
            toggleDragModeOnDblclick: false,
            viewMode: 1,
            checkCrossOrigin: false,
            ready: () => {
                this.updateCanvasContainer();
            }
        });
    }

    ngOnDestroy() {
        this.cropper.destroy();
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                this.cropper.move(-3, 0);
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.cropper.move(0, -3);
                break;
            case 'ArrowRight':
                event.preventDefault();
                this.cropper.move(3, 0);
                break;
            case 'ArrowDown':
                event.preventDefault();
                this.cropper.move(0, 3);
                break;
            case 'i':
                this.zoomIn();
                break;
            case 'o':
                this.zoomOut();
                break;
            case 'r':
                this.rotateImage();
                break;
            default:
        }
    }

    @HostListener('document:fullscreenchange')
    fullScreenChangeHandler() {
        if(document.fullscreenElement) {
            this.reset();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        const blobFile = changes['blobFile'];
        if (blobFile && blobFile.currentValue) {
            this.urlFile = this.urlService.createTrustedUrl(this.blobFile);
            return;
        }

        if (!changes['urlFile'].firstChange && changes['fileName']) {
            if (changes['fileName'].previousValue !== changes['fileName'].currentValue) {
                this.cropper.replace(changes['urlFile'].currentValue);
            }
        }

        if (!this.urlFile && !this.blobFile) {
            throw new Error('Attribute urlFile or blobFile is required');
        }
    }

    zoomIn() {
        this.cropper.zoom( 0.2);
        this.scale = +((this.scale + 0.2).toFixed(1));
    }

    zoomOut() {
        if (this.scale > 0.2) {
            this.cropper.zoom( -0.2 );
            this.scale = +((this.scale - 0.2).toFixed(1));
        }
    }

    rotateImage() {
        this.isEditing = true;
        this.cropper.rotate( -90);
    }

    cropImage() {
        this.isEditing = true;
        this.cropper.setDragMode('crop');
        this.cropper.crop();
    }

    save() {
        this.isSaving.emit(true);
        this.isEditing = false;
        this.cropper.setDragMode('move');
        this.cropper.getCroppedCanvas().toBlob((blob) => {
            this.submit.emit(blob);
            this.cropper.replace(this.cropper.getCroppedCanvas().toDataURL());
            this.cropper.clear();
            this.isSaving.emit(false);
        });
    }

    reset() {
        this.isEditing = false;
        this.cropper.clear();
        this.cropper.reset();
        this.cropper.setDragMode('move');
        this.scale = 1.0;
        this.updateCanvasContainer();
    }

    updateCanvasContainer() {
        if (this.imageElement.nativeElement.width < this.cropper.getContainerData().width) {
            const width = this.imageElement.nativeElement.width;
            const height = this.imageElement.nativeElement.height;
            const top = (this.cropper.getContainerData().height - this.imageElement.nativeElement.height) / 2;
            const left = (this.cropper.getContainerData().width - this.imageElement.nativeElement.width) / 2;

            this.cropper.setCanvasData({
                width,
                height,
                top,
                left
            });
        }
    }

    onImageError() {
        this.error.emit();
    }
}
