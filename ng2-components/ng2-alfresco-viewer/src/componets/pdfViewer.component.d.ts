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
import { RenderingQueueServices } from '../services/rendering-queue.services';
export declare class PdfViewerComponent {
    private renderingQueueServices;
    urlFile: string;
    nameFile: string;
    showToolbar: boolean;
    currentPdfDocument: any;
    page: number;
    displayPage: number;
    totalPages: number;
    laodingPercent: number;
    pdfViewer: any;
    currentScaleMode: string;
    currentScale: number;
    MAX_AUTO_SCALE: number;
    DEFAULT_SCALE_DELTA: number;
    MIN_SCALE: number;
    MAX_SCALE: number;
    constructor(renderingQueueServices: RenderingQueueServices);
    ngOnChanges(changes: any): Promise<{}>;
    getPDFJS(): any;
    initPDFViewer(pdfDocument: any): void;
    scalePage(scaleMode: any): void;
    setScaleUpdatePages(newScale: number): void;
    isSameScale(oldScale: number, newScale: number): boolean;
    isLandscape(width: number, height: number): boolean;
    onResize(): void;
    pageFit(): void;
    zoomIn(ticks: number): void;
    zoomOut(ticks: number): void;
    previousPage(): void;
    nextPage(): void;
    inputPage(page: string): void;
    watchScroll(target: any): void;
    getVisibleElement(target: any): any;
    isOnScreen(page: any, target: any): boolean;
    handleKeyboardEvent(event: KeyboardEvent): void;
}
