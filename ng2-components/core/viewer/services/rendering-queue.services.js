"use strict";
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
/**
 *
 * RenderingQueueServices rendering of the views for pages and thumbnails.
 *
 * @returns {RenderingQueueServices} .
 */
var RenderingQueueServices = (function () {
    function RenderingQueueServices() {
        this.renderingStates = {
            INITIAL: 0,
            RUNNING: 1,
            PAUSED: 2,
            FINISHED: 3
        };
        this.CLEANUP_TIMEOUT = 30000;
        this.pdfViewer = null;
        this.pdfThumbnailViewer = null;
        this.onIdle = null;
        this.highestPriorityPage = null;
        this.idleTimeout = null;
        this.printing = false;
        this.isThumbnailViewEnabled = false;
    }
    /**
     * @param {PDFViewer} pdfViewer
     */
    RenderingQueueServices.prototype.setViewer = function (pdfViewer) {
        this.pdfViewer = pdfViewer;
    };
    /**
     * @param {PDFThumbnailViewer} pdfThumbnailViewer
     */
    RenderingQueueServices.prototype.setThumbnailViewer = function (pdfThumbnailViewer) {
        this.pdfThumbnailViewer = pdfThumbnailViewer;
    };
    /**
     * @param {IRenderableView} view
     * @returns {boolean}
     */
    RenderingQueueServices.prototype.isHighestPriority = function (view) {
        return this.highestPriorityPage === view.renderingId;
    };
    RenderingQueueServices.prototype.renderHighestPriority = function (currentlyVisiblePages) {
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
    };
    RenderingQueueServices.prototype.getHighestPriority = function (visible, views, scrolledDown) {
        // The state has changed figure out which page has the highest priority to
        // render next (if any).
        // Priority:
        // 1 visible pages
        // 2 if last scrolled down page after the visible pages
        // 2 if last scrolled up page before the visible pages
        var visibleViews = visible.views;
        var numVisible = visibleViews.length;
        if (numVisible === 0) {
            return false;
        }
        for (var i = 0; i < numVisible; ++i) {
            var view = visibleViews[i].view;
            if (!this.isViewFinished(view)) {
                return view;
            }
        }
        // All the visible views have rendered, try to render next/previous pages.
        if (scrolledDown) {
            var nextPageIndex = visible.last.id;
            // ID's start at 1 so no need to add 1.
            if (views[nextPageIndex] && !this.isViewFinished(views[nextPageIndex])) {
                return views[nextPageIndex];
            }
        }
        else {
            var previousPageIndex = visible.first.id - 2;
            if (views[previousPageIndex] && !this.isViewFinished(views[previousPageIndex])) {
                return views[previousPageIndex];
            }
        }
        // Everything that needs to be rendered has been.
        return null;
    };
    /**
     * @param {IRenderableView} view
     * @returns {boolean}
     */
    RenderingQueueServices.prototype.isViewFinished = function (view) {
        return view.renderingState === this.renderingStates.FINISHED;
    };
    /**
     * Render a page or thumbnail view. This calls the appropriate function
     * based on the views state. If the view is already rendered it will return
     * false.
     * @param {IRenderableView} view
     */
    RenderingQueueServices.prototype.renderView = function (view) {
        var state = view.renderingState;
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
                var continueRendering = function () {
                    this.renderHighestPriority();
                }.bind(this);
                view.draw().then(continueRendering, continueRendering);
                break;
            default:
                break;
        }
        return true;
    };
    RenderingQueueServices = __decorate([
        core_1.Injectable()
    ], RenderingQueueServices);
    return RenderingQueueServices;
}());
exports.RenderingQueueServices = RenderingQueueServices;
