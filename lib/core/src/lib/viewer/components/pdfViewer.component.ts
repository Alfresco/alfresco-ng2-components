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
    TemplateRef,
    HostListener,
    Output,
    Input,
    OnChanges,
    OnDestroy,
    ViewEncapsulation,
    EventEmitter,
    SimpleChanges
} from '@angular/core';
import { MatDialog } from '@angular/material';
import { LogService } from '../../services/log.service';
import { RenderingQueueServices } from '../services/rendering-queue.services';
import { PdfPasswordDialogComponent } from './pdfViewer-password-dialog';
import { AppConfigService } from './../../app-config/app-config.service';

declare const pdfjsLib: any;
declare const pdfjsViewer: any;

export interface PdfDocumentOptions {
    url?: string;
    data?: any;
    withCredentials?: boolean;
}

@Component({
    selector: 'adf-pdf-viewer',
    templateUrl: './pdfViewer.component.html',
    styleUrls: [
        './pdfViewer.component.scss',
        './pdfViewerHost.component.scss'
    ],
    providers: [RenderingQueueServices],
    host: { 'class': 'adf-pdf-viewer' },
    encapsulation: ViewEncapsulation.None
})
export class PdfViewerComponent implements OnChanges, OnDestroy {

    @Input()
    urlFile: string;

    @Input()
    blobFile: Blob;

    @Input()
    nameFile: string;

    @Input()
    showToolbar: boolean = true;

    @Input()
    allowThumbnails = false;

    @Input()
    thumbnailsTemplate: TemplateRef<any> = null;

    @Output()
    rendered = new EventEmitter<any>();

    @Output()
    error = new EventEmitter<any>();

    @Output()
    close = new EventEmitter<any>();

    loadingTask: any;
    currentPdfDocument: any;
    page: number;
    displayPage: number;
    totalPages: number;
    loadingPercent: number;
    pdfViewer: any;
    documentContainer: any;
    currentScaleMode: string = 'auto';
    currentScale: number = 1;

    MAX_AUTO_SCALE: number = 1.25;
    DEFAULT_SCALE_DELTA: number = 1.1;
    MIN_SCALE: number = 0.25;
    MAX_SCALE: number = 10.0;

    isPanelDisabled = true;
    showThumbnails: boolean = false;
    pdfThumbnailsContext: { viewer: any } = { viewer: null };
    randomPdfId: string;

    get currentScaleText(): string {
        return Math.round(this.currentScale * 100) + '%';
    }

    constructor(
        private dialog: MatDialog,
        private renderingQueueServices: RenderingQueueServices,
        private logService: LogService,
        private appConfigService: AppConfigService) {
        // needed to preserve "this" context
        this.onPageChange = this.onPageChange.bind(this);
        this.onPagesLoaded = this.onPagesLoaded.bind(this);
        this.onPageRendered = this.onPageRendered.bind(this);
        this.randomPdfId = this.generateUuid();
        this.currentScale = this.getUserScaling();
    }

    getUserScaling(): number {
        const scaleConfig = this.appConfigService.get<number>('adf-viewer.pdf-viewer-scaling', undefined) / 100;
        if (scaleConfig) {
            return this.checkLimits(scaleConfig);
        } else {
            return 1;
        }
    }

    checkLimits(scaleConfig: number): number {
        if (scaleConfig > this.MAX_SCALE) {
            return this.MAX_SCALE;
        } else if (scaleConfig < this.MIN_SCALE) {
            return this.MIN_SCALE;
        } else {
            return scaleConfig;
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        const blobFile = changes['blobFile'];

        if (blobFile && blobFile.currentValue) {
            const reader = new FileReader();
            reader.onload = () => {
                const options = {
                    data: reader.result,
                    withCredentials: this.appConfigService.get<boolean>('auth.withCredentials', undefined)
                };
                this.executePdf(options);
            };
            reader.readAsArrayBuffer(blobFile.currentValue);
        }

        const urlFile = changes['urlFile'];
        if (urlFile && urlFile.currentValue) {
            const options = {
                url: urlFile.currentValue,
                withCredentials: this.appConfigService.get<boolean>('auth.withCredentials', undefined)
            };
            this.executePdf(options);
        }

        if (!this.urlFile && !this.blobFile) {
            throw new Error('Attribute urlFile or blobFile is required');
        }
    }

    executePdf(pdfOptions: PdfDocumentOptions) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js';

        this.loadingTask = pdfjsLib.getDocument(pdfOptions);

        this.loadingTask.onPassword = (callback, reason) => {
            this.onPdfPassword(callback, reason);
        };

        this.loadingTask.onProgress = (progressData) => {
            const level = progressData.loaded / progressData.total;
            this.loadingPercent = Math.round(level * 100);
        };

        this.loadingTask.then((pdfDocument) => {
            this.currentPdfDocument = pdfDocument;
            this.totalPages = pdfDocument.numPages;
            this.page = 1;
            this.displayPage = 1;
            this.initPDFViewer(this.currentPdfDocument);

            this.currentPdfDocument.getPage(1).then(() => {
                this.scalePage('auto');
            }, () => {
                this.error.emit();
            });

        }, () => {
            this.error.emit();
        });
    }

    initPDFViewer(pdfDocument: any) {
        const viewer: any = document.getElementById(`${this.randomPdfId}-viewer-viewerPdf`);
        const container = document.getElementById(`${this.randomPdfId}-viewer-pdf-viewer`);

        if (viewer && container) {
            this.documentContainer = container;

            // cspell: disable-next
            this.documentContainer.addEventListener('pagechange', this.onPageChange, true);
            // cspell: disable-next
            this.documentContainer.addEventListener('pagesloaded', this.onPagesLoaded, true);
            // cspell: disable-next
            this.documentContainer.addEventListener('textlayerrendered', this.onPageRendered, true);

            this.pdfViewer = new pdfjsViewer.PDFViewer({
                container: this.documentContainer,
                viewer: viewer,
                renderingQueue: this.renderingQueueServices
            });

            this.renderingQueueServices.setViewer(this.pdfViewer);
            this.pdfViewer.setDocument(pdfDocument);
            this.pdfThumbnailsContext.viewer = this.pdfViewer;
        }
    }

    ngOnDestroy() {
        if (this.documentContainer) {
            // cspell: disable-next
            this.documentContainer.removeEventListener('pagechange', this.onPageChange, true);
            // cspell: disable-next
            this.documentContainer.removeEventListener('pagesloaded', this.onPagesLoaded, true);
            // cspell: disable-next
            this.documentContainer.removeEventListener('textlayerrendered', this.onPageRendered, true);
        }

        if (this.loadingTask) {
            try {
                this.loadingTask.destroy();
            } catch {
            }

            this.loadingTask = null;
        }
    }

    toggleThumbnails() {
        this.showThumbnails = !this.showThumbnails;
    }

    /**
     * Method to scale the page current support implementation
     *
     * @param scaleMode - new scale mode
     */
    scalePage(scaleMode) {
        this.currentScaleMode = scaleMode;

        const viewerContainer = document.getElementById(`${this.randomPdfId}-viewer-main-container`);
        const documentContainer = document.getElementById(`${this.randomPdfId}-viewer-pdf-viewer`);

        if (this.pdfViewer && documentContainer) {

            let widthContainer;
            let heightContainer;

            if (viewerContainer && viewerContainer.clientWidth <= documentContainer.clientWidth) {
                widthContainer = viewerContainer.clientWidth;
                heightContainer = viewerContainer.clientHeight;
            } else {
                widthContainer = documentContainer.clientWidth;
                heightContainer = documentContainer.clientHeight;
            }

            const currentPage = this.pdfViewer._pages[this.pdfViewer._currentPageNumber - 1];

            const padding = 20;
            const pageWidthScale = (widthContainer - padding) / currentPage.width * currentPage.scale;
            const pageHeightScale = (heightContainer - padding) / currentPage.width * currentPage.scale;

            let scale = this.getUserScaling();
            if (!scale) {
                switch (this.currentScaleMode) {
                    case 'page-actual':
                        scale = 1;
                        break;
                    case 'page-width':
                        scale = pageWidthScale;
                        break;
                    case 'page-height':
                        scale = pageHeightScale;
                        break;
                    case 'page-fit':
                        scale = Math.min(pageWidthScale, pageHeightScale);
                        break;
                    case 'auto':
                        let horizontalScale;
                        if (this.isLandscape) {
                            horizontalScale = Math.min(pageHeightScale, pageWidthScale);
                        } else {
                            horizontalScale = pageWidthScale;
                        }
                        horizontalScale = Math.round(horizontalScale);
                        scale = Math.min(this.MAX_AUTO_SCALE, horizontalScale);

                        break;
                    default:
                        this.logService.error('pdfViewSetScale: \'' + scaleMode + '\' is an unknown zoom value.');
                        return;
                }

                this.setScaleUpdatePages(scale);
            } else {
                this.currentScale = 0;
                this.setScaleUpdatePages(scale);
            }
        }
    }

    /**
     * Update all the pages with the newScale scale
     *
     * @param newScale - new scale page
     */
    setScaleUpdatePages(newScale: number) {
        if (this.pdfViewer) {
            if (!this.isSameScale(this.currentScale, newScale)) {
                this.currentScale = newScale;

                this.pdfViewer._pages.forEach(function (currentPage) {
                    currentPage.update(newScale);
                });
            }

            this.pdfViewer.update();
        }
    }

    /**
     * Check if the request scale of the page is the same for avoid useless re-rendering
     *
     * @param oldScale - old scale page
     * @param newScale - new scale page
     *
     */
    isSameScale(oldScale: number, newScale: number): boolean {
        return (newScale === oldScale);
    }

    /**
     * Check if is a land scape view
     *
     * @param width
     * @param height
     */
    isLandscape(width: number, height: number): boolean {
        return (width > height);
    }

    /**
     * Method triggered when the page is resized
     */
    onResize() {
        this.scalePage(this.currentScaleMode);
    }

    /**
     * toggle the fit page pdf
     */
    pageFit() {
        if (this.currentScaleMode !== 'page-fit') {
            this.scalePage('page-fit');
        } else {
            this.scalePage('auto');
        }
    }

    /**
     * zoom in page pdf
     *
     * @param ticks
     */
    zoomIn(ticks?: number) {
        let newScale: any = this.currentScale;
        do {
            newScale = (newScale * this.DEFAULT_SCALE_DELTA).toFixed(2);
            newScale = Math.ceil(newScale * 10) / 10;
            newScale = Math.min(this.MAX_SCALE, newScale);
        } while (--ticks > 0 && newScale < this.MAX_SCALE);
        this.currentScaleMode = 'auto';
        this.setScaleUpdatePages(newScale);
    }

    /**
     * zoom out page pdf
     *
     * @param ticks
     */
    zoomOut(ticks?: number) {
        let newScale: any = this.currentScale;
        do {
            newScale = (newScale / this.DEFAULT_SCALE_DELTA).toFixed(2);
            newScale = Math.floor(newScale * 10) / 10;
            newScale = Math.max(this.MIN_SCALE, newScale);
        } while (--ticks > 0 && newScale > this.MIN_SCALE);
        this.currentScaleMode = 'auto';
        this.setScaleUpdatePages(newScale);
    }

    /**
     * load the previous page
     */
    previousPage() {
        if (this.pdfViewer && this.page > 1) {
            this.page--;
            this.displayPage = this.page;

            this.pdfViewer.currentPageNumber = this.page;
        }
    }

    /**
     * load the next page
     */
    nextPage() {
        if (this.pdfViewer && this.page < this.totalPages) {
            this.page++;
            this.displayPage = this.page;

            this.pdfViewer.currentPageNumber = this.page;
        }
    }

    /**
     * load the page in input
     *
     * @param page to load
     */
    inputPage(page: string) {
        const pageInput = parseInt(page, 10);

        if (!isNaN(pageInput) && pageInput > 0 && pageInput <= this.totalPages) {
            this.page = pageInput;
            this.displayPage = this.page;
            this.pdfViewer.currentPageNumber = this.page;
        } else {
            this.displayPage = this.page;
        }
    }

    /**
     * Page Change Event
     *
     * @param event
     */
    onPageChange(event) {
        this.page = event.pageNumber;
        this.displayPage = event.pageNumber;
    }

    onPdfPassword(callback, reason) {
        this.dialog
            .open(PdfPasswordDialogComponent, {
                width: '400px',
                data: { reason }
            })
            .afterClosed().subscribe((password) => {
                if (password) {
                    callback(password);
                } else {
                    this.close.emit();
                }
        });
    }

    /**
     * Page Rendered Event
     */
    onPageRendered() {
        this.rendered.emit();
    }

    /**
     * Pages Loaded Event
     *
     * @param event
     */
    onPagesLoaded() {
        this.isPanelDisabled = false;
    }

    /**
     * Keyboard Event Listener
     * @param KeyboardEvent event
     */
    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        const key = event.keyCode;
        if (key === 39) { // right arrow
            this.nextPage();
        } else if (key === 37) {// left arrow
            this.previousPage();
        }
    }

    private generateUuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
