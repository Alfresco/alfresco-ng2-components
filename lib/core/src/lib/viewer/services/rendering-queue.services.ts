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

import { Injectable } from '@angular/core';
import type { PDFViewer } from 'pdfjs-dist/types/web/pdf_viewer';
import type { PDFThumbnailViewer } from 'pdfjs-dist/types/web/pdf_thumbnail_viewer';
import type { PDFPageView } from 'pdfjs-dist/types/web/pdf_page_view';

interface VisiblePage {
    id: number;
}

interface VisiblePages {
    first?: VisiblePage;
    last?: VisiblePage;
    views?: Array<{ view: PDFPageView }>;
}

/**
 * Type helper for accessing the resume method on PDFPageView.
 * PDFPageView implements IRenderableView which includes a resume method,
 * but the TypeScript definitions don't properly expose it.
 */
// cspell:ignore Renderable
interface ResumableView {
    resume?: () => void;
}

/**
 *
 * RenderingQueueServices rendering of the views for pages and thumbnails.
 *
 */
@Injectable()
export class RenderingQueueServices {
    renderingStates = {
        INITIAL: 0,
        RUNNING: 1,
        PAUSED: 2,
        FINISHED: 3
    };

    CLEANUP_TIMEOUT: number = 30_000;

    pdfViewer: PDFViewer | null = null;
    pdfThumbnailViewer: PDFThumbnailViewer | null = null;
    onIdle: (() => void) | null = null;

    highestPriorityPage: string | null = null;
    idleTimeout: ReturnType<typeof setTimeout> | null = null;
    printing = false;
    isThumbnailViewEnabled = false;

    /**
     * Set the instance of the PDF Viewer
     *
     * @param pdfViewer viewer instance
     */
    setViewer(pdfViewer: PDFViewer): void {
        this.pdfViewer = pdfViewer;
    }

    /**
     * Sets the instance of the PDF Thumbnail Viewer
     *
     * @param pdfThumbnailViewer viewer instance
     */
    setThumbnailViewer(pdfThumbnailViewer: PDFThumbnailViewer): void {
        this.pdfThumbnailViewer = pdfThumbnailViewer;
    }

    /**
     * Check if the view has highest rendering priority
     *
     * @param view view to render
     * @returns `true` if the view has higher priority, otherwise `false`
     */
    isHighestPriority(view: PDFPageView): boolean {
        return this.highestPriorityPage === view.renderingId;
    }

    renderHighestPriority(currentlyVisiblePages?: unknown): void {
        if (this.idleTimeout) {
            clearTimeout(this.idleTimeout);
            this.idleTimeout = null;
        }

        // Pages have a higher priority than thumbnails, so check them first.
        if (this.pdfViewer?.forceRendering(currentlyVisiblePages)) {
            return;
        }
        // No pages needed rendering so check thumbnails.
        if (this.pdfThumbnailViewer && this.isThumbnailViewEnabled && this.pdfThumbnailViewer.forceRendering()) {
            return;
        }

        if (this.printing) {
            // If printing is currently ongoing do not reschedule cleanup.
            return;
        }

        if (this.onIdle) {
            this.idleTimeout = setTimeout(this.onIdle.bind(this), this.CLEANUP_TIMEOUT);
        }
    }

    /**
     * Gets the highest priority page to render from the visible pages
     * This method is part of the PDFRenderingQueue interface compatibility
     *
     * @param visible visible pages information
     * @param views array of page views
     * @param scrolledDown whether the user scrolled down
     * @returns the highest priority page view to render, null if all done, or false if no visible pages
     */
    getHighestPriority(visible: VisiblePages, views: PDFPageView[], scrolledDown: boolean): PDFPageView | null | false {
        // The state has changed figure out which page has the highest priority to
        // render next (if any).
        // Priority:
        // 1 visible pages
        // 2 if last scrolled down page after the visible pages
        // 2 if last scrolled up page before the visible pages
        const visibleViews = visible.views;

        if (!visibleViews) {
            return false;
        }

        const numberVisible = visibleViews.length;
        if (numberVisible === 0) {
            return false;
        }
        for (let i = 0; i < numberVisible; ++i) {
            const view = visibleViews[i].view;
            if (!this.isViewFinished(view)) {
                return view;
            }
        }

        // All the visible views have rendered, try to render next/previous pages.
        if (scrolledDown && visible.last) {
            const nextPageIndex = visible.last.id;
            // ID's start at 1 so no need to add 1.
            if (views[nextPageIndex] && !this.isViewFinished(views[nextPageIndex])) {
                return views[nextPageIndex];
            }
        } else if (visible.first) {
            const previousPageIndex = visible.first.id - 2;
            if (views[previousPageIndex] && !this.isViewFinished(views[previousPageIndex])) {
                return views[previousPageIndex];
            }
        }
        // Everything that needs to be rendered has been.
        return null;
    }

    hasViewer(): boolean {
        return !!this.pdfViewer;
    }

    /**
     * Checks if the view rendering is finished
     *
     * @param view the View instance to check
     * @returns `true` if rendering is finished, otherwise `false`
     */
    isViewFinished(view: PDFPageView): boolean {
        return view.renderingState === this.renderingStates.FINISHED;
    }

    /**
     * Render a page or thumbnail view. This calls the appropriate function
     * based on the views state. If the view is already rendered it will return
     * false.
     *
     * @param view View instance to render
     * @returns the rendered state of the view
     */
    renderView(view: PDFPageView): boolean {
        const state = view.renderingState;
        switch (state) {
            case this.renderingStates.FINISHED: {
                return false;
            }
            case this.renderingStates.PAUSED: {
                this.highestPriorityPage = view.renderingId;
                const resumableView = view as unknown as ResumableView;
                if (resumableView.resume) {
                    resumableView.resume();
                }
                break;
            }
            case this.renderingStates.RUNNING: {
                this.highestPriorityPage = view.renderingId;
                break;
            }
            case this.renderingStates.INITIAL: {
                this.highestPriorityPage = view.renderingId;
                const continueRendering = () => {
                    this.renderHighestPriority();
                };
                view.draw().then(continueRendering, continueRendering);
                break;
            }
            default: {
                break;
            }
        }
        return true;
    }
}
