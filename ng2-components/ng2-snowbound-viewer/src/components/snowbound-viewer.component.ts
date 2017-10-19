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

import { Component, Input, EventEmitter, Output, ElementRef } from '@angular/core';
import { AlfrescoSettingsService, AlfrescoAuthenticationService } from 'ng2-alfresco-core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

declare let __moduleName: string;

@Component({
    selector: 'snowbound-viewer',
    templateUrl: './snowbound-viewer.component.html',
    styleUrls: ['./snowbound-viewer.component.css']
})
export class SnowboundViewerComponent {

    @Input()
    fileNodeId: string = null;

    @Input()
    showViewer: boolean = true;

    @Input()
    overlayMode: boolean = false;

    @Output()
    showViewerChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    // The root URL constructed through the ECM host url and snowbound specific arguments
    rootURL: string;

    // url provided to the snowbound viewer
    url: string;

    // reference element to existing header element - ADF only
    otherMenu: any;

    /**
     * Initialize the alfrescoSettingsService, build the root URL
     */
    constructor(public alfrescoSettingsService: AlfrescoSettingsService,
                public authenticationService: AlfrescoAuthenticationService,
                public sanitizer: DomSanitizer,
                private element: ElementRef) {
        this.rootURL = this.getECMHost() + '/VirtualViewerJavaHTML5/index.html';
    }

    /**
     * ECM host serves as the base of the snowbound viewer url
     * @returns {string}
     */
    private getECMHost() {
        return this.alfrescoSettingsService.ecmHost;
    }

    /**
     * Builds url that is required by Snowbound Viewer, including documentId and authentication token
     * @returns {SafeResourceUrl} Full url that can be passed to snowbound
     */
    viewerURL(): SafeResourceUrl {
        let args = '{"ticket" : "' + this.authenticationService.getTicketEcm() + '"}';
        this.url = this.rootURL + '?documentId=' + this.fileNodeId + '&clientInstanceId=' + args;
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    }

    /**
     * Detect if the viewer is going from not shown->shown and trigger some DOM helper methods
     */
    ngOnChanges() {
        if (this.showViewer) {
            this.hideOtherHeaderBar();
            this.blockOtherScrollBar();
            if (!this.fileNodeId) {
                throw new Error('File Node Id required for snowbound viewer to display.');
            }
        }
    }

    /**
     * Check if in the document there are scrollable main area and disable it
     */
    private blockOtherScrollBar() {
        let mainElements: any = document.getElementsByTagName('main');

        for (let i = 0; i < mainElements.length; i++) {
            mainElements[i].style.overflow = 'hidden';
        }
    }

    /**
     * Check if in the document there are scrollable main area and renable it
     */
    private unblockOtherScrollBar() {
        let mainElements: any = document.getElementsByTagName('main');

        for (let i = 0; i < mainElements.length; i++) {
            mainElements[i].style.overflow = '';
        }
    }

    /**
     * Check if the viewer is used inside and header element
     */
    isParentElementHeaderBar() {
        return !!this.closestElement(this.element.nativeElement, 'header');
    }

    /**
     * Check if the viewer is used inside and header element
     * @param {HTMLElement} element
     * @param {string} nodeName
     * @returns {HTMLElement}
     */
    private closestElement(element: HTMLElement, nodeName: string) {
        let parent = element.parentElement;
        if (parent) {
            if (parent.nodeName.toLowerCase() === nodeName) {
                return parent;
            } else {
                return this.closestElement(parent, nodeName);
            }
        } else {
            return null;
        }
    }

    /**
     * Hide the other possible menu in the application
     */
    private hideOtherHeaderBar() {
        if (this.overlayMode && !this.isParentElementHeaderBar()) {
            this.otherMenu = document.querySelector('header');
            if (this.otherMenu) {
                this.otherMenu.hidden = true;
            }
        }
    }

    /**
     * Mostly stub.  If there is no fileNodeId we can assume the viewer is not loaded.
     */
    isLoaded() {
        return !!this.fileNodeId;
    }

    /**
     * close the viewer
     */
    close() {
        this.unblockOtherScrollBar();
        if (this.otherMenu) {
            this.otherMenu.hidden = false;
        }
        this.cleanup();
        this.showViewer = false;
        this.showViewerChange.emit(this.showViewer);
    }

    /**
     * Perform cleanup that will facilitate smooth future viewer setups
     */
    cleanup() {
        this.fileNodeId = null;
    }

    /**
     * Perform cleanup operation if this componenet gets destroyed for any reason
     */
    ngOnDestroy() {
        this.cleanup();
    }
}
