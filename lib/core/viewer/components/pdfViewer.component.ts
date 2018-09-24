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

import {
    Component,
    TemplateRef,
    HostListener,
    Output,
    Input,
    OnChanges,
    OnDestroy,
    ViewEncapsulation,
    EventEmitter
} from '@angular/core';
import { LogService } from '../../services/log.service';
import { RenderingQueueServices } from '../services/rendering-queue.services';
import { PdfPasswordDialogComponent } from './pdfViewer-password-dialog';
import { MatDialog } from '@angular/material';

declare const pdfjsLib: any;
declare const pdfjsViewer: any;

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

    get currentScaleText(): string {
        return Math.round(this.currentScale * 100) + '%';
    }

    constructor(
        private dialog: MatDialog,
        private renderingQueueServices: RenderingQueueServices,
        private logService: LogService) {
        // needed to preserve "this" context
        this.onPageChange = this.onPageChange.bind(this);
        this.onPagesLoaded = this.onPagesLoaded.bind(this);
        this.onPageRendered = this.onPageRendered.bind(this);
    }

    ngOnChanges(changes) {
        let blobFile = changes['blobFile'];

        if (blobFile && blobFile.currentValue) {
            let reader = new FileReader();
            reader.onload = () => {
                this.executePdf(reader.result);
            };
            reader.readAsArrayBuffer(blobFile.currentValue);
        }

        let urlFile = changes['urlFile'];
        if (urlFile && urlFile.currentValue) {
            this.executePdf(urlFile.currentValue);
        }

        if (!this.urlFile && !this.blobFile) {
            throw new Error('Attribute urlFile or blobFile is required');
        }
    }

    executePdf(src) {

        pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js';
        this.loadingTask = pdfjsLib.getDocument(src);

        this.loadingTask.onPassword = (callback, reason) => {
            this.onPdfPassword(callback, reason);
        };

        this.loadingTask.onProgress = (progressData) => {
            let level = progressData.loaded / progressData.total;
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
            }, (error) => {
                this.error.emit();
            });

        }, (error) => {
            this.error.emit();
        });
    }

    initPDFViewer(pdfDocument: any) {
        const viewer: any = document.getElementById('viewer-viewerPdf');
        const container = document.getElementById('viewer-pdf-viewer');

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
            } catch {}

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

        if (this.pdfViewer) {

            let viewerContainer = document.getElementById('viewer-main-container');
            let documentContainer = document.getElementById('viewer-pdf-viewer');

            let widthContainer;
            let heightContainer;

            if (viewerContainer && viewerContainer.clientWidth <= documentContainer.clientWidth) {
                widthContainer = viewerContainer.clientWidth;
                heightContainer = viewerContainer.clientHeight;
            } else {
                widthContainer = documentContainer.clientWidth;
                heightContainer = documentContainer.clientHeight;
            }

            let currentPage = this.pdfViewer._pages[this.pdfViewer._currentPageNumber - 1];

            let padding = 20;
            let pageWidthScale = (widthContainer - padding) / currentPage.width * currentPage.scale;
            let pageHeightScale = (heightContainer - padding) / currentPage.width * currentPage.scale;

            let scale;

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
                    scale = Math.min(this.MAX_AUTO_SCALE, horizontalScale);

                    break;
                default:
                    this.logService.error('pdfViewSetScale: \'' + scaleMode + '\' is an unknown zoom value.');
                    return;
            }

            this.setScaleUpdatePages(scale);
        }
    }

    /**
     * Update all the pages with the newScale scale
     *
     * @param newScale - new scale page
     */
    setScaleUpdatePages(newScale: number) {
        if (!this.isSameScale(this.currentScale, newScale)) {
            this.currentScale = newScale;

            this.pdfViewer._pages.forEach(function (currentPage) {
                currentPage.update(newScale);
            });
        }

        this.pdfViewer.update();
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
        let pageInput = parseInt(page, 10);

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
                disableClose: true,
                data: { reason }
            })
            .afterClosed().subscribe(password => {
            if (password) {
                callback(password);
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
    onPagesLoaded(event) {
        this.isPanelDisabled = false;
    }

    /**
     * Keyboard Event Listener
     * @param KeyboardEvent event
     */
    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        let key = event.keyCode;
        if (key === 39) { // right arrow
            this.nextPage();
        } else if (key === 37) {// left arrow
            this.previousPage();
        }
    }
}
