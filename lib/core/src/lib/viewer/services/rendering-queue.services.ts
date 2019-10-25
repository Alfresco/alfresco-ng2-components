/* tslint:disable:adf-license-banner  */

/* Copyright 2012 Mozilla Foundation
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

    CLEANUP_TIMEOUT: number = 30000;

    pdfViewer: any = null;
    pdfThumbnailViewer: any = null;
    onIdle: any = null;

    highestPriorityPage: any = null;
    idleTimeout: any = null;
    printing: any = false;
    isThumbnailViewEnabled: any = false;

    /**
     * @param pdfViewer
     */
    setViewer(pdfViewer) {
        this.pdfViewer = pdfViewer;
    }

    /**
     * @param pdfThumbnailViewer
     */
    setThumbnailViewer(pdfThumbnailViewer) {
        this.pdfThumbnailViewer = pdfThumbnailViewer;
    }

    /**
     * @param  view
     */
    isHighestPriority(view: any): boolean {
        return this.highestPriorityPage === view.renderingId;
    }

    renderHighestPriority(currentlyVisiblePages) {
        if (this.idleTimeout) {
            clearTimeout(this.idleTimeout);
            this.idleTimeout = null;
        }

        // Pages have a higher priority than thumbnails, so check them first.
        if (this.pdfViewer.forceRendering(currentlyVisiblePages)) {
            return;
        }
        // No pages needed rendering so check thumbnails.
        if (this.pdfThumbnailViewer && this.isThumbnailViewEnabled) {
            if (this.pdfThumbnailViewer.forceRendering()) {
                return;
            }
        }

        if (this.printing) {
            // If printing is currently ongoing do not reschedule cleanup.
            return;
        }

        if (this.onIdle) {
            this.idleTimeout = setTimeout(this.onIdle.bind(this), this.CLEANUP_TIMEOUT);
        }
    }

    getHighestPriority(visible, views, scrolledDown) {
        // The state has changed figure out which page has the highest priority to
        // render next (if any).
        // Priority:
        // 1 visible pages
        // 2 if last scrolled down page after the visible pages
        // 2 if last scrolled up page before the visible pages
        const visibleViews = visible.views;

        const numVisible = visibleViews.length;
        if (numVisible === 0) {
            return false;
        }
        for (let i = 0; i < numVisible; ++i) {
            const view = visibleViews[i].view;
            if (!this.isViewFinished(view)) {
                return view;
            }
        }

        // All the visible views have rendered, try to render next/previous pages.
        if (scrolledDown) {
            const nextPageIndex = visible.last.id;
            // ID's start at 1 so no need to add 1.
            if (views[nextPageIndex] && !this.isViewFinished(views[nextPageIndex])) {
                return views[nextPageIndex];
            }
        } else {
            const previousPageIndex = visible.first.id - 2;
            if (views[previousPageIndex] && !this.isViewFinished(views[previousPageIndex])) {
                return views[previousPageIndex];
            }
        }
        // Everything that needs to be rendered has been.
        return null;
    }

    /**
     * @param view
     */
    isViewFinished(view): boolean {
        return view.renderingState === this.renderingStates.FINISHED;
    }

    /**
     * Render a page or thumbnail view. This calls the appropriate function
     * based on the views state. If the view is already rendered it will return
     * false.
     * @param view
     */
    renderView(view: any) {
        const state = view.renderingState;
        switch (state) {
            case this.renderingStates.FINISHED:
                return false;
            case this.renderingStates.PAUSED:
                this.highestPriorityPage = view.renderingId;
                view.resume();
                break;
            case this.renderingStates.RUNNING:
                this.highestPriorityPage = view.renderingId;
                break;
            case this.renderingStates.INITIAL:
                this.highestPriorityPage = view.renderingId;
                const continueRendering = function () {
                    this.renderHighestPriority();
                }.bind(this);
                view.draw().then(continueRendering, continueRendering);
                break;
            default:
                break;
        }
        return true;
    }
}
