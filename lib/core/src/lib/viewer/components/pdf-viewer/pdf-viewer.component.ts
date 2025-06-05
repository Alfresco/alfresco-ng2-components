/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @angular-eslint/no-output-native */

import { NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
    Component,
    EventEmitter,
    HostListener,
    inject,
    InjectionToken,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges,
    TemplateRef,
    ViewEncapsulation
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslateModule } from '@ngx-translate/core';
import { from, Subject, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppConfigService } from '../../../app-config';
import { ToolbarComponent, ToolbarDividerComponent } from '../../../toolbar';
import { RenderingQueueServices } from '../../services/rendering-queue.services';
import { PdfPasswordDialogComponent } from '../pdf-viewer-password-dialog/pdf-viewer-password-dialog';
import { PdfThumbListComponent } from '../pdf-viewer-thumbnails/pdf-viewer-thumbnails.component';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.min.mjs';
import { EventBus, PDFViewer } from 'pdfjs-dist/web/pdf_viewer.mjs';
import { OnProgressParameters, PDFDocumentLoadingTask, PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';

export type PdfScaleMode = 'init' | 'page-actual' | 'page-width' | 'page-height' | 'page-fit' | 'auto';

export const PDFJS_MODULE = new InjectionToken('PDFJS_MODULE', { factory: () => pdfjsLib });
export const PDFJS_VIEWER_MODULE = new InjectionToken('PDFJS_VIEWER_MODULE', { factory: () => PDFViewer });

@Component({
    selector: 'adf-pdf-viewer',
    standalone: true,
    templateUrl: './pdf-viewer.component.html',
    styleUrls: ['./pdf-viewer-host.component.scss', './pdf-viewer.component.scss'],
    providers: [RenderingQueueServices],
    host: { class: 'adf-pdf-viewer' },
    imports: [
        MatButtonModule,
        MatIconModule,
        TranslateModule,
        PdfThumbListComponent,
        NgIf,
        NgTemplateOutlet,
        MatProgressBarModule,
        NgStyle,
        ToolbarComponent,
        ToolbarDividerComponent
    ],
    encapsulation: ViewEncapsulation.None
})
export class PdfViewerComponent implements OnChanges, OnDestroy {
    @Input()
    urlFile: string;

    @Input()
    blobFile: Blob;

    @Input()
    fileName: string;

    @Input()
    showToolbar: boolean = true;

    @Input()
    allowThumbnails = false;

    @Input()
    thumbnailsTemplate: TemplateRef<any> = null;

    @Input()
    cacheType: string = '';

    @Output()
    rendered = new EventEmitter<any>();

    @Output()
    error = new EventEmitter<any>();

    @Output()
    close = new EventEmitter<any>();

    @Output()
    pagesLoaded = new EventEmitter<void>();

    page: number;
    displayPage: number;
    totalPages: number;
    loadingPercent: number;
    pdfViewer: PDFViewer;
    pdfJsWorkerUrl: string;
    pdfJsWorkerInstance: Worker;
    currentScaleMode: PdfScaleMode = 'init';

    MAX_AUTO_SCALE: number = 1.25;
    DEFAULT_SCALE_DELTA: number = 1.1;
    MIN_SCALE: number = 0.25;
    MAX_SCALE: number = 10.0;

    loadingTask: PDFDocumentLoadingTask;
    isPanelDisabled = true;
    showThumbnails: boolean = false;
    pdfThumbnailsContext: { viewer: any } = { viewer: null };
    randomPdfId: string;
    documentOverflow = false;

    get currentScaleText(): string {
        const currentScaleValueStr = this.pdfViewer?.currentScaleValue;
        const scaleNumber = Number(currentScaleValueStr);

        const currentScaleText = scaleNumber ? `${Math.round(scaleNumber * 100)}%` : '';

        return currentScaleText;
    }

    private pdfjsLib = inject(PDFJS_MODULE);
    private pdfjsViewer = inject(PDFJS_VIEWER_MODULE);

    private eventBus = new EventBus();
    private pdfjsDefaultOptions = {
        disableAutoFetch: true,
        disableStream: true,
        cMapUrl: './cmaps/',
        cMapPacked: true
    };
    private pdfjsWorkerDestroy$ = new Subject<boolean>();

    private dialog = inject(MatDialog);
    private renderingQueueServices = inject(RenderingQueueServices);
    private appConfigService = inject(AppConfigService);

    constructor() {
        // needed to preserve "this" context
        this.onPageChange = this.onPageChange.bind(this);
        this.onPagesLoaded = this.onPagesLoaded.bind(this);
        this.onPageRendered = this.onPageRendered.bind(this);

        this.randomPdfId = Date.now().toString();
        this.pdfjsWorkerDestroy$
            .pipe(
                catchError(() => null),
                switchMap(() => from(this.destroyPfdJsWorker()))
            )
            .subscribe(() => {});
    }

    getUserScaling(): number {
        let scaleConfig = this.appConfigService.get<number>('adf-viewer.pdf-viewer-scaling', undefined);

        if (scaleConfig) {
            scaleConfig = scaleConfig / 100;
            scaleConfig = this.checkLimits(scaleConfig);
        }

        return scaleConfig;
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

        if (blobFile?.currentValue) {
            const reader = new FileReader();
            reader.onload = async () => {
                const pdfOptions = {
                    ...this.pdfjsDefaultOptions,
                    data: reader.result,
                    withCredentials: this.appConfigService.get<boolean>('auth.withCredentials', undefined),
                    isEvalSupported: false
                };
                this.executePdf(pdfOptions);
            };
            reader.readAsArrayBuffer(blobFile.currentValue);
        }

        const urlFile = changes['urlFile'];
        if (urlFile?.currentValue) {
            const pdfOptions: any = {
                ...this.pdfjsDefaultOptions,
                url: urlFile.currentValue,
                withCredentials: this.appConfigService.get<boolean>('auth.withCredentials', undefined),
                isEvalSupported: false
            };
            if (this.cacheType) {
                pdfOptions.httpHeaders = {
                    'Cache-Control': this.cacheType
                };
            }
            this.executePdf(pdfOptions);
        }

        if (!this.urlFile && !this.blobFile) {
            throw new Error('Attribute urlFile or blobFile is required');
        }
    }

    executePdf(pdfOptions: any) {
        this.setupPdfJsWorker().then(() => {
            this.loadingTask = this.pdfjsLib.getDocument(pdfOptions);

            this.loadingTask.onPassword = (callback, reason) => {
                this.onPdfPassword(callback, reason);
            };

            this.loadingTask.onProgress = (progressData: OnProgressParameters) => {
                const level = progressData.loaded / progressData.total;
                this.loadingPercent = Math.round(level * 100);
            };

            this.isPanelDisabled = true;

            this.loadingTask.promise
                .then((pdfDocument) => {
                    this.totalPages = pdfDocument.numPages;
                    this.page = 1;
                    this.displayPage = 1;
                    this.initPDFViewer(pdfDocument);

                    return pdfDocument.getPage(1);
                })
                .catch(() => this.error.emit());
        });
    }

    private async setupPdfJsWorker(): Promise<void> {
        if (this.pdfJsWorkerInstance) {
            await this.destroyPfdJsWorker();
        } else if (!this.pdfJsWorkerUrl) {
            this.pdfJsWorkerUrl = await this.getPdfJsWorker();
        }
        this.pdfJsWorkerInstance = new Worker(this.pdfJsWorkerUrl, { type: 'module' });
        this.pdfjsLib.GlobalWorkerOptions.workerPort = this.pdfJsWorkerInstance;
    }

    private async getPdfJsWorker(): Promise<string> {
        const response = await fetch('./pdf.worker.min.mjs');
        const workerScript = await response.text();
        const blob = new Blob([workerScript], { type: 'application/javascript' });
        return URL.createObjectURL(blob);
    }

    initPDFViewer(pdfDocument: PDFDocumentProxy) {
        const viewer: any = this.getViewer();
        const container = this.getDocumentContainer();

        if (viewer && container) {
            this.pdfViewer = new this.pdfjsViewer({
                container,
                viewer,
                renderingQueue: this.renderingQueueServices,
                eventBus: this.eventBus,
                annotationMode: 0
            });

            // cspell: disable-next
            this.eventBus.on('pagechanging', this.onPageChange);
            // cspell: disable-next
            this.eventBus.on('pagesloaded', this.onPagesLoaded);
            // cspell: disable-next
            this.eventBus.on('textlayerrendered', () => {
                this.onPageRendered();
            });
            this.eventBus.on('pagerendered', () => {
                this.onPageRendered();
            });

            this.renderingQueueServices.setViewer(this.pdfViewer);
            this.pdfViewer.setDocument(pdfDocument);
            this.pdfThumbnailsContext.viewer = this.pdfViewer;
        }
    }

    ngOnDestroy() {
        if (this.pdfViewer) {
            // cspell: disable-next
            this.eventBus.off('pagechanging', () => {});
            // cspell: disable-next
            this.eventBus.off('pagesloaded', () => {});
            // cspell: disable-next
            this.eventBus.off('textlayerrendered', () => {});
        }

        if (this.loadingTask) {
            this.pdfjsWorkerDestroy$.next(true);
        }
        this.pdfjsWorkerDestroy$.complete();
        this.revokePdfJsWorkerUrl();
    }

    private async destroyPfdJsWorker() {
        if (this.loadingTask.destroy) {
            await this.loadingTask.destroy();
        }
        if (this.pdfJsWorkerInstance) {
            this.pdfJsWorkerInstance.terminate();
        }
        this.loadingTask = null;
    }

    private revokePdfJsWorkerUrl(): void {
        URL.revokeObjectURL(this.pdfJsWorkerUrl);
    }

    toggleThumbnails() {
        this.showThumbnails = !this.showThumbnails;
    }

    /**
     * Method to scale the page current support implementation
     *
     * @param scaleMode - new scale mode
     */
    scalePage(scaleMode: PdfScaleMode) {
        this.currentScaleMode = scaleMode;

        const viewerContainer = this.getMainContainer();
        const documentContainer = this.getDocumentContainer();

        if (this.pdfViewer && documentContainer) {
            let widthContainer: number;
            let heightContainer: number;

            if (viewerContainer && viewerContainer.clientWidth <= documentContainer.clientWidth) {
                widthContainer = viewerContainer.clientWidth;
                heightContainer = viewerContainer.clientHeight;
            } else {
                widthContainer = documentContainer.clientWidth;
                heightContainer = documentContainer.clientHeight;
            }

            const currentPage = this.pdfViewer._pages[this.pdfViewer._currentPageNumber - 1];

            const padding = 20;
            const pageWidthScale = ((widthContainer - padding) / currentPage.width) * currentPage.scale;
            const pageHeightScale = ((heightContainer - padding) / currentPage.width) * currentPage.scale;

            let scale: number;
            switch (this.currentScaleMode) {
                case 'init':
                case 'page-fit': {
                    scale = this.getUserScaling();
                    if (!scale) {
                        scale = this.autoScaling(pageHeightScale, pageWidthScale);
                    }
                    break;
                }
                case 'page-actual': {
                    scale = 1;
                    break;
                }
                case 'page-width': {
                    scale = pageWidthScale;
                    break;
                }
                case 'page-height': {
                    scale = pageHeightScale;
                    break;
                }
                case 'auto': {
                    scale = this.autoScaling(pageHeightScale, pageWidthScale);
                    break;
                }
                default:
                    return;
            }

            this.setScaleUpdatePages(scale);
        }
    }

    private autoScaling(pageHeightScale: number, pageWidthScale: number) {
        let horizontalScale: number;
        if (this.isLandscape) {
            horizontalScale = Math.min(pageHeightScale, pageWidthScale);
        } else {
            horizontalScale = pageWidthScale;
        }
        horizontalScale = Math.round(horizontalScale);
        const scale = Math.min(this.MAX_AUTO_SCALE, horizontalScale);
        return this.checkPageFitInContainer(scale);
    }

    private getMainContainer(): HTMLElement {
        return document.getElementById(`${this.randomPdfId}-viewer-main-container`);
    }

    private getDocumentContainer(): HTMLDivElement {
        return document.getElementById(`${this.randomPdfId}-viewer-pdf-viewer`) as HTMLDivElement;
    }

    private getViewer(): HTMLElement {
        return document.getElementById(`${this.randomPdfId}-viewer-viewerPdf`);
    }

    checkPageFitInContainer(scale: number): number {
        const documentContainerSize = this.getDocumentContainer();
        const page = this.pdfViewer._pages[this.pdfViewer._currentPageNumber - 1];

        if (page.width > documentContainerSize.clientWidth) {
            scale = Math.fround((documentContainerSize.clientWidth - 20) / page.width);
            if (scale < this.MIN_SCALE) {
                scale = this.MIN_SCALE;
            }
        }

        return scale;
    }

    setDocumentOverflow() {
        const documentContainerSize = this.getDocumentContainer();
        const page = this.pdfViewer._pages[this.pdfViewer._currentPageNumber - 1];

        this.documentOverflow = page.width > documentContainerSize.clientWidth;
    }

    /**
     * Update all the pages with the newScale scale
     *
     * @param newScale - new scale page
     */
    setScaleUpdatePages(newScale: number) {
        if (this.pdfViewer) {
            if (!this.isSameScale(this.pdfViewer.currentScaleValue, newScale.toString())) {
                this.pdfViewer.currentScaleValue = newScale.toString();
            }
            this.pdfViewer.update();
        }
        this.setDocumentOverflow();
    }

    /**
     * Check if the request scale of the page is the same for avoid useless re-rendering
     *
     * @param oldScale - old scale page
     * @param newScale - new scale page
     * @returns `true` if the scale is the same, otherwise `false`
     */
    isSameScale(oldScale: string, newScale: string): boolean {
        return newScale === oldScale;
    }

    /**
     * Check if is a land scape view
     *
     * @param width target width
     * @param height target height
     * @returns `true` if the target is in the landscape mode, otherwise `false`
     */
    isLandscape(width: number, height: number): boolean {
        return width > height;
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
     * @param ticks number of ticks to zoom
     */
    zoomIn(ticks?: number): void {
        let newScale: any = this.pdfViewer.currentScaleValue;
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
     * @param ticks number of ticks to scale
     */
    zoomOut(ticks?: number): void {
        let newScale: any = this.pdfViewer.currentScaleValue;
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
     * @param event event
     */
    onPageChange(event: any) {
        if (event.source && event.source.container.id === `${this.randomPdfId}-viewer-pdf-viewer`) {
            this.page = event.pageNumber;
            this.displayPage = event.pageNumber;
        }
    }

    onPdfPassword(callback, reason) {
        this.dialog
            .open(PdfPasswordDialogComponent, {
                width: '400px',
                data: { reason }
            })
            .afterClosed()
            .subscribe((password) => {
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
     */
    onPagesLoaded() {
        this.isPanelDisabled = false;
        setTimeout(() => this.scalePage('init'));
        this.pagesLoaded.emit();
    }

    /**
     * Keyboard Event Listener
     *
     * @param event KeyboardEvent
     */
    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        const key = event.keyCode;
        if (key === 39) {
            // right arrow
            this.nextPage();
        } else if (key === 37) {
            // left arrow
            this.previousPage();
        }
    }
}
