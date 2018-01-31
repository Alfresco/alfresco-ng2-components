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

import { Location } from '@angular/common';
import {
    Component, ContentChild, EventEmitter, HostListener, ElementRef,
    Input, OnChanges, Output, SimpleChanges, TemplateRef, ViewEncapsulation
} from '@angular/core';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { BaseEvent } from '../../events';
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { LogService } from '../../services/log.service';
import { RenditionsService } from '../../services/renditions.service';
import { ViewerMoreActionsComponent } from './viewer-more-actions.component';
import { ViewerOpenWithComponent } from './viewer-open-with.component';
import { ViewerSidebarComponent } from './viewer-sidebar.component';
import { ViewerToolbarComponent } from './viewer-toolbar.component';

@Component({
    selector: 'adf-viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.scss'],
    host: { 'class': 'adf-viewer' },
    encapsulation: ViewEncapsulation.None
})
export class ViewerComponent implements OnChanges {

    @ContentChild(ViewerToolbarComponent)
    toolbar: ViewerToolbarComponent;

    @ContentChild(ViewerSidebarComponent)
    sidebar: ViewerSidebarComponent;

    @ContentChild(ViewerOpenWithComponent)
    mnuOpenWith: ViewerOpenWithComponent;

    @ContentChild(ViewerMoreActionsComponent)
    mnuMoreActions: ViewerMoreActionsComponent;

    @Input()
    urlFile = '';

    @Input()
    urlFileViewer: string = null;

    @Input()
    blobFile: Blob;

    @Input()
    fileNodeId: string = null;

    @Input()
    sharedLinkId: string = null;

    @Input()
    overlayMode = false;

    @Input()
    showViewer = true;

    @Input()
    showToolbar = true;

    @Input()
    displayName: string;

    @Input()
    allowGoBack = true;

    @Input()
    allowDownload = true;

    @Input()
    allowPrint = false;

    @Input()
    allowShare = false;

    @Input()
    allowFullScreen = true;

    @Input()
    allowNavigate = false;

    @Input()
    canNavigateBefore = true;

    @Input()
    canNavigateNext = true;

    @Input()
    allowSidebar = false;

    @Input()
    showSidebar = false;

    @Input()
    sidebarPosition = 'right';

    @Input()
    sidebarTemplate: TemplateRef<any> = null;

    @Input()
    mimeType: string;

    @Input()
    fileName: string;

    @Input()
    downloadUrl: string = null;

    @Output()
    goBack = new EventEmitter<BaseEvent<any>>();

    @Output()
    download = new EventEmitter<BaseEvent<any>>();

    @Output()
    print = new EventEmitter<BaseEvent<any>>();

    @Output()
    share = new EventEmitter<BaseEvent<any>>();

    @Output()
    showViewerChange = new EventEmitter<boolean>();

    @Output()
    extensionChange = new EventEmitter<string>();

    @Output()
    navigateBefore = new EventEmitter();

    @Output()
    navigateNext = new EventEmitter();

    viewerType = 'unknown';
    isLoading = false;
    node: MinimalNodeEntryEntity;

    extensionTemplates: { template: TemplateRef<any>, isVisible: boolean }[] = [];
    externalExtensions: string[] = [];
    urlFileContent: string;
    otherMenu: any;
    extension: string;
    sidebarTemplateContext: { node: MinimalNodeEntryEntity } = { node: null };

    private extensions = {
        image: ['png', 'jpg', 'jpeg', 'gif', 'bpm'],
        media: ['wav', 'mp4', 'mp3', 'webm', 'ogg'],
        text: ['txt', 'xml', 'js', 'html', 'json', 'ts'],
        pdf: ['pdf']
    };

    private mimeTypes = [
        { mimeType: 'application/x-javascript', type: 'text' },
        { mimeType: 'application/pdf', type: 'pdf' }
    ];

    constructor(private apiService: AlfrescoApiService,
                private logService: LogService,
                private location: Location,
                private renditionService: RenditionsService,
                private el: ElementRef) {
    }

    isSourceDefined(): boolean {
        return (this.urlFile || this.blobFile || this.fileNodeId || this.sharedLinkId) ? true : false;
    }

    private setUpBlobData() {
        this.displayName = this.getDisplayName('Unknown');
        this.isLoading = true;
        this.mimeType = this.blobFile.type;
        this.viewerType = this.getViewerTypeByMimeType(this.mimeType);

        this.allowDownload = false;
        // TODO: wrap blob into the data url and allow downloading

        this.extensionChange.emit(this.mimeType);
        this.isLoading = false;
        this.scrollTop();
    }

    private setUpUrlFile() {
        this.isLoading = true;
        let filenameFromUrl = this.getFilenameFromUrl(this.urlFile);
        this.displayName = this.getDisplayName(filenameFromUrl);
        this.extension = this.getFileExtension(filenameFromUrl);
        this.urlFileContent = this.urlFile;

        this.downloadUrl = this.urlFile;
        this.fileName = this.displayName;

        this.viewerType = this.urlFileViewer || this.getViewerTypeByExtension(this.extension);
        if (this.viewerType === 'unknown') {
            this.viewerType = this.getViewerTypeByMimeType(this.mimeType);
        }

        this.extensionChange.emit(this.extension);
        this.isLoading = false;
        this.scrollTop();
    }

    private setUpNodeFile(data: MinimalNodeEntryEntity) {
        this.mimeType = data.content.mimeType;
        this.displayName = this.getDisplayName(data.name);
        this.urlFileContent = this.apiService.getInstance().content.getContentUrl(data.id);
        this.extension = this.getFileExtension(data.name);

        this.fileName = data.name;
        this.downloadUrl = this.apiService.getInstance().content.getContentUrl(data.id, true);

        this.viewerType = this.getViewerTypeByExtension(this.extension);
        if (this.viewerType === 'unknown') {
            this.viewerType = this.getViewerTypeByMimeType(this.mimeType);
        }

        if (this.viewerType === 'unknown') {
            this.displayNodeRendition(data.id);
        } else {
            this.isLoading = false;
        }

        this.extensionChange.emit(this.extension);
        this.sidebarTemplateContext.node = data;
        this.scrollTop();
    }

    private setUpSharedLinkFile(details: any) {
        this.mimeType = details.entry.content.mimeType;
        this.displayName = this.getDisplayName(details.entry.name);
        this.extension = this.getFileExtension(details.entry.name);
        this.fileName = details.entry.name;

        this.urlFileContent = this.apiService.contentApi.getSharedLinkContentUrl(this.sharedLinkId, false);
        this.downloadUrl = this.apiService.contentApi.getSharedLinkContentUrl(this.sharedLinkId, true);

        this.viewerType = this.getViewerTypeByMimeType(this.mimeType);
        if (this.viewerType === 'unknown') {
            this.viewerType = this.getViewerTypeByExtension(this.extension);
        }

        if (this.viewerType === 'unknown') {
            this.displaySharedLinkRendition(this.sharedLinkId);
        } else {
            this.isLoading = false;
        }
        this.extensionChange.emit(this.extension);
        this.isLoading = false;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.showViewer) {
            if (!this.isSourceDefined()) {
                throw new Error('A content source attribute value is missing.');
            }

            if (this.blobFile) {
                this.setUpBlobData();
            } else if (this.urlFile) {
                this.setUpUrlFile();
            } else if (this.fileNodeId) {
                this.isLoading = true;
                this.apiService.getInstance().nodes.getNodeInfo(this.fileNodeId).then(
                    (data: MinimalNodeEntryEntity) => {
                        this.setUpNodeFile(data);
                    },
                    (error) => {
                        this.isLoading = false;
                        this.logService.error('This node does not exist');
                    }
                );
            } else if (this.sharedLinkId) {
                this.isLoading = true;

                this.apiService.sharedLinksApi.getSharedLink(this.sharedLinkId).then(details => {
                    this.setUpSharedLinkFile(details);
                });
            }
        }
    }

    toggleSidebar() {
        this.showSidebar = !this.showSidebar;
        if (this.showSidebar && this.fileNodeId) {
            this.apiService.getInstance().nodes.getNodeInfo(this.fileNodeId)
                .then((data: MinimalNodeEntryEntity) => {
                    this.sidebarTemplateContext.node = data;
                });
        }
    }

    private getDisplayName(name) {
        return this.displayName || name;
    }

    scrollTop() {
        window.scrollTo(0, 1);
    }

    getViewerTypeByMimeType(mimeType: string) {
        if (mimeType) {
            mimeType = mimeType.toLowerCase();

            if (mimeType.startsWith('image/')) {
                return 'image';
            }

            if (mimeType.startsWith('text/')) {
                return 'text';
            }

            if (mimeType.startsWith('video/')) {
                return 'media';
            }

            if (mimeType.startsWith('audio/')) {
                return 'media';
            }

            const registered = this.mimeTypes.find(t => t.mimeType === mimeType);
            if (registered) {
                return registered.type;
            }
        }
        return 'unknown';
    }

    getViewerTypeByExtension(extension: string) {
        if (extension) {
            extension = extension.toLowerCase();
        }

        if (this.isCustomViewerExtension(extension)) {
            return 'custom';
        }

        if (this.extensions.image.indexOf(extension) >= 0) {
            return 'image';
        }

        if (this.extensions.media.indexOf(extension) >= 0) {
            return 'media';
        }

        if (this.extensions.text.indexOf(extension) >= 0) {
            return 'text';
        }

        if (this.extensions.pdf.indexOf(extension) >= 0) {
            return 'pdf';
        }

        return 'unknown';
    }

    onBackButtonClick() {
        if (this.overlayMode) {
            this.close();
        } else {
            const event = new BaseEvent<any>();
            this.goBack.next(event);

            if (!event.defaultPrevented) {
                this.location.back();
            }
        }
    }

    onNavigateBeforeClick() {
        this.navigateBefore.next();
    }

    onNavigateNextClick() {
        this.navigateNext.next();
    }

    /**
     * close the viewer
     */
    close() {
        if (this.otherMenu) {
            this.otherMenu.hidden = false;
        }
        this.showViewer = false;
        this.showViewerChange.emit(this.showViewer);
    }

    /**
     * get File name from url
     *
     * @param {string} url - url file
     * @returns {string} name file
     */
    getFilenameFromUrl(url: string): string {
        let anchor = url.indexOf('#');
        let query = url.indexOf('?');
        let end = Math.min(
            anchor > 0 ? anchor : url.length,
            query > 0 ? query : url.length);
        return url.substring(url.lastIndexOf('/', end) + 1, end);
    }

    /**
     * Get file extension from the string.
     * Supports the URL formats like:
     * http://localhost/test.jpg?cache=1000
     * http://localhost/test.jpg#cache=1000
     *
     * @param {string} fileName - file name
     * @returns {string} file name extension
     */
    getFileExtension(fileName: string): string {
        if (fileName) {
            const match = fileName.match(/\.([^\./\?\#]+)($|\?|\#)/);
            return match ? match[1] : null;
        }
        return null;
    }

    isCustomViewerExtension(extension: string): boolean {
        const extensions = this.externalExtensions || [];

        if (extension && extensions.length > 0) {
            extension = extension.toLowerCase();
            return extensions.indexOf(extension) >= 0;
        }

        return false;
    }

    /**
     * Keyboard event listener
     * @param {KeyboardEvent} event
     */
    @HostListener('document:keyup', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        const key = event.keyCode;

        // Esc
        if (key === 27 && this.overlayMode) { // esc
            this.close();
        }

        // Left arrow
        if (key === 37 && this.canNavigateBefore) {
            event.preventDefault();
            this.onNavigateBeforeClick();
        }

        // Right arrow
        if (key === 39 && this.canNavigateNext) {
            event.preventDefault();
            this.onNavigateNextClick();
        }

        // Ctrl+F
        if (key === 70 && event.ctrlKey) {
            event.preventDefault();
            this.enterFullScreen();
        }
    }

    downloadContent() {
        if (this.allowDownload && this.downloadUrl && this.fileName) {
            const args = new BaseEvent();
            this.download.next(args);

            if (!args.defaultPrevented) {
                const link = document.createElement('a');

                link.style.display = 'none';
                link.download = this.fileName;
                link.href = this.downloadUrl;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }

    printContent() {
        if (this.allowPrint) {
            const args = new BaseEvent();
            this.print.next(args);
        }
    }

    shareContent() {
        if (this.allowShare) {
            const args = new BaseEvent();
            this.share.next(args);
        }
    }

    /**
     * Triggers full screen mode with a main content area displayed.
     */
    enterFullScreen(): void {
        if (this.allowFullScreen) {
            const container = this.el.nativeElement.querySelector('.adf-viewer__fullscreen-container');
            if (container) {
                if (container.requestFullscreen) {
                    container.requestFullscreen();
                } else if (container.webkitRequestFullscreen) {
                    container.webkitRequestFullscreen();
                } else if (container.mozRequestFullScreen) {
                    container.mozRequestFullScreen();
                } else if (container.msRequestFullscreen) {
                    container.msRequestFullscreen();
                }
            }
        }
    }

    private async displayNodeRendition(nodeId: string) {
        this.isLoading = true;

        try {
            const rendition = await this.apiService.renditionsApi.getRendition(nodeId, 'pdf');
            const status = rendition.entry.status.toString();

            if (status === 'CREATED') {
                this.viewerType = 'pdf';
                this.urlFileContent = this.apiService.contentApi.getRenditionUrl(nodeId, 'pdf');
            } else if (status === 'NOT_CREATED') {
                try {
                    await this.renditionService.convert(nodeId, 'pdf').toPromise();
                    this.viewerType = 'pdf';
                    this.urlFileContent = this.apiService.contentApi.getRenditionUrl(nodeId, 'pdf');
                } catch (error) {
                    this.logService.error(error);
                }
            }
        } catch (error) {
            this.logService.error(error);

            try {
                const imagePreview = await this.apiService.renditionsApi.getRendition(nodeId, 'imgpreview');
                if (imagePreview.entry.status.toString() === 'CREATED') {
                    this.viewerType = 'image';
                    this.urlFileContent = this.apiService.contentApi.getRenditionUrl(nodeId, 'imgpreview');
                }
            } catch (error) {
                this.logService.error(error);
            }
        }

        this.isLoading = false;
    }

    private async displaySharedLinkRendition(sharedId: string) {
        this.isLoading = true;

        try {
            const rendition = await this.apiService.renditionsApi.getSharedLinkRendition(sharedId, 'pdf');
            if (rendition.entry.status.toString() === 'CREATED') {
                this.viewerType = 'pdf';
                this.urlFileContent = this.apiService.contentApi.getSharedLinkRenditionUrl(sharedId, 'pdf');
            }
        } catch (error) {
            this.logService.error(error);
            try {
                const rendition = await this.apiService.renditionsApi.getSharedLinkRendition(sharedId, 'imgpreview');
                if (rendition.entry.status.toString() === 'CREATED') {
                    this.viewerType = 'image';
                    this.urlFileContent = this.apiService.contentApi.getSharedLinkRenditionUrl(sharedId, 'imgpreview');
                }
            } catch (error) {
                this.logService.error(error);
            }
        }

        this.isLoading = false;
    }
}
