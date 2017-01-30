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
export declare class RenderingQueueServices {
    renderingStates: {
        INITIAL: number;
        RUNNING: number;
        PAUSED: number;
        FINISHED: number;
    };
    CLEANUP_TIMEOUT: number;
    pdfViewer: any;
    pdfThumbnailViewer: any;
    onIdle: any;
    highestPriorityPage: any;
    idleTimeout: any;
    printing: any;
    isThumbnailViewEnabled: any;
    setViewer(pdfViewer: any): void;
    setThumbnailViewer(pdfThumbnailViewer: any): void;
    isHighestPriority(view: any): boolean;
    renderHighestPriority(currentlyVisiblePages: any): void;
    getHighestPriority(visible: any, views: any, scrolledDown: any): any;
    isViewFinished(view: any): boolean;
    renderView(view: any): boolean;
}
