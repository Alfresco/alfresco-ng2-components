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
    Component, ContentChild, EventEmitter, HostListener, ElementRef,
    Input, OnChanges, Output, TemplateRef,
    ViewEncapsulation, OnInit, OnDestroy
} from '@angular/core';
import { RenditionPaging, SharedLinkEntry, Node, RenditionEntry, NodeEntry } from '@alfresco/js-api';
import { BaseEvent } from '../../events';
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { LogService } from '../../services/log.service';
import { ViewerMoreActionsComponent } from './viewer-more-actions.component';
import { ViewerOpenWithComponent } from './viewer-open-with.component';
import { ViewerSidebarComponent } from './viewer-sidebar.component';
import { ViewerToolbarComponent } from './viewer-toolbar.component';
import { Subscription } from 'rxjs';
import { ViewUtilService } from '../services/view-util.service';
import { AppExtensionService, ViewerExtensionRef } from '@alfresco/adf-extensions';

@Component({
    selector: 'adf-viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.scss'],
    host: { 'class': 'adf-viewer' },
    encapsulation: ViewEncapsulation.None
})
export class ViewerComponent implements OnChanges, OnInit, OnDestroy {

    @ContentChild(ViewerToolbarComponent)
    toolbar: ViewerToolbarComponent;

    @ContentChild(ViewerSidebarComponent)
    sidebar: ViewerSidebarComponent;

    @ContentChild(ViewerOpenWithComponent)
    mnuOpenWith: ViewerOpenWithComponent;

    @ContentChild(ViewerMoreActionsComponent)
    mnuMoreActions: ViewerMoreActionsComponent;

    /** If you want to load an external file that does not come from ACS you
     * can use this URL to specify where to load the file from.
     */
    @Input()
    urlFile = '';

    /** Viewer to use with the `urlFile` address (`pdf`, `image`, `media`, `text`).
     * Used when `urlFile` has no filename and extension.
     */
    @Input()
    urlFileViewer: string = null;

    /** Loads a Blob File */
    @Input()
    blobFile: Blob;

    /** Node Id of the file to load. */
    @Input()
    nodeId: string = null;

    /** Shared link id (to display shared file). */
    @Input()
    sharedLinkId: string = null;

    /** If `true` then show the Viewer as a full page over the current content.
     * Otherwise fit inside the parent div.
     */
    @Input()
    overlayMode = false;

    /** Hide or show the viewer */
    @Input()
    showViewer = true;

    /** Hide or show the toolbar */
    @Input()
    showToolbar = true;

    /** Specifies the name of the file when it is not available from the URL. */
    @Input()
    displayName: string;

    /** @deprecated 3.2.0 */
    /** Allows `back` navigation */
    @Input()
    allowGoBack = true;

    /** Toggles downloading. */
    @Input()
    allowDownload = true;

    /** Toggles printing. */
    @Input()
    allowPrint = false;

    /** Toggles the 'Full Screen' feature. */
    @Input()
    allowFullScreen = true;

    /** Toggles before/next navigation. You can use the arrow buttons to navigate
     * between documents in the collection.
     */
    @Input()
    allowNavigate = false;

    /** Toggles the "before" ("<") button. Requires `allowNavigate` to be enabled. */
    @Input()
    canNavigateBefore = true;

    /** Toggles the next (">") button. Requires `allowNavigate` to be enabled. */
    @Input()
    canNavigateNext = true;

    /** Allow the left the sidebar. */
    @Input()
    allowLeftSidebar = false;

    /** Allow the right sidebar. */
    @Input()
    allowRightSidebar = false;

    /** Toggles PDF thumbnails. */
    @Input()
    allowThumbnails = true;

    /** Toggles right sidebar visibility. Requires `allowRightSidebar` to be set to `true`. */
    @Input()
    showRightSidebar = false;

    /** Toggles left sidebar visibility. Requires `allowLeftSidebar` to be set to `true`. */
    @Input()
    showLeftSidebar = false;

    /** The template for the right sidebar. The template context contains the loaded node data. */
    @Input()
    sidebarRightTemplate: TemplateRef<any> = null;

    /** The template for the left sidebar. The template context contains the loaded node data. */
    @Input()
    sidebarLeftTemplate: TemplateRef<any> = null;

    /** The template for the pdf thumbnails. */
    @Input()
    thumbnailsTemplate: TemplateRef<any> = null;

    /** MIME type of the file content (when not determined by the filename extension). */
    @Input()
    mimeType: string;

    /** Content filename. */
    @Input()
    fileName: string;

    /** Number of times the Viewer will retry fetching content Rendition.
     * There is a delay of at least one second between attempts.
     */
    @Input()
    maxRetries = 30;

    /** Emitted when user clicks the 'Back' button. */
    @Output()
    goBack = new EventEmitter<BaseEvent<any>>();

    /** Emitted when user clicks the 'Print' button. */
    @Output()
    print = new EventEmitter<BaseEvent<any>>();

    /** Emitted when the viewer is shown or hidden. */
    @Output()
    showViewerChange = new EventEmitter<boolean>();

    /** Emitted when the filename extension changes. */
    @Output()
    extensionChange = new EventEmitter<string>();

    /** Emitted when user clicks 'Navigate Before' ("<") button. */
    @Output()
    navigateBefore = new EventEmitter<MouseEvent|KeyboardEvent>();

    /** Emitted when user clicks 'Navigate Next' (">") button. */
    @Output()
    navigateNext = new EventEmitter<MouseEvent|KeyboardEvent>();

    /** Emitted when the shared link used is not valid. */
    @Output()
    invalidSharedLink = new EventEmitter();

    TRY_TIMEOUT: number = 10000;

    viewerType = 'unknown';
    isLoading = false;
    nodeEntry: NodeEntry;

    extensionTemplates: { template: TemplateRef<any>, isVisible: boolean }[] = [];
    externalExtensions: string[] = [];
    urlFileContent: string;
    otherMenu: any;
    extension: string;
    sidebarRightTemplateContext: { node: Node } = { node: null };
    sidebarLeftTemplateContext: { node: Node } = { node: null };
    fileTitle: string;
    viewerExtensions: Array<ViewerExtensionRef> = [];

    private cacheBusterNumber;

    private subscriptions: Subscription[] = [];

    // Extensions that are supported by the Viewer without conversion
    private extensions = {
        image: ['png', 'jpg', 'jpeg', 'gif', 'bpm', 'svg'],
        media: ['wav', 'mp4', 'mp3', 'webm', 'ogg'],
        text: ['txt', 'xml', 'html', 'json', 'ts', 'css', 'md'],
        pdf: ['pdf']
    };

    // Mime types that are supported by the Viewer without conversion
    private mimeTypes = {
        text: ['text/plain', 'text/csv', 'text/xml', 'text/html', 'application/x-javascript'],
        pdf: ['application/pdf'],
        image: ['image/png', 'image/jpeg', 'image/gif', 'image/bmp', 'image/svg+xml'],
        media: ['video/mp4', 'video/webm', 'video/ogg', 'audio/mpeg', 'audio/ogg', 'audio/wav']
    };

    constructor(private apiService: AlfrescoApiService,
                private viewUtils: ViewUtilService,
                private logService: LogService,
                private extensionService: AppExtensionService,
                private el: ElementRef) {
    }

    isSourceDefined(): boolean {
        return (this.urlFile || this.blobFile || this.nodeId || this.sharedLinkId) ? true : false;
    }

    ngOnInit() {
        this.subscriptions.push(
            this.apiService.nodeUpdated.subscribe((node) => this.onNodeUpdated(node))
        );

        this.loadExtensions();
    }

    private loadExtensions() {
        this.viewerExtensions = this.extensionService.getViewerExtensions();
        this.viewerExtensions
            .forEach((extension: ViewerExtensionRef) => {
                this.externalExtensions.push(extension.fileExtension);
            });
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.subscriptions = [];
    }

    private onNodeUpdated(node: Node) {
        if (node && node.id === this.nodeId) {
            this.generateCacheBusterNumber();
            this.isLoading = true;
            this.setUpNodeFile(node).then(() => {
                this.isLoading = false;
            });
        }
    }

    ngOnChanges() {
        if (this.showViewer) {
            if (!this.isSourceDefined()) {
                throw new Error('A content source attribute value is missing.');
            }
            this.isLoading = true;

            if (this.blobFile) {
                this.setUpBlobData();
                this.isLoading = false;
            } else if (this.urlFile) {
                this.setUpUrlFile();
                this.isLoading = false;
            } else if (this.nodeId) {
                this.apiService.nodesApi.getNode(this.nodeId, { include: ['allowableOperations'] }).then(
                    (node: NodeEntry) => {
                        this.nodeEntry = node;
                        this.setUpNodeFile(node.entry).then(() => {
                            this.isLoading = false;
                        });
                    },
                    () => {
                        this.isLoading = false;
                        this.logService.error('This node does not exist');
                    }
                );
            } else if (this.sharedLinkId) {
                this.allowGoBack = false;

                this.apiService.sharedLinksApi.getSharedLink(this.sharedLinkId).then(
                    (sharedLinkEntry: SharedLinkEntry) => {
                        this.setUpSharedLinkFile(sharedLinkEntry);
                        this.isLoading = false;
                    },
                    () => {
                        this.isLoading = false;
                        this.logService.error('This sharedLink does not exist');
                        this.invalidSharedLink.next();
                    });
            }
        }
    }

    private setUpBlobData() {
        this.fileTitle = this.getDisplayName('Unknown');
        this.mimeType = this.blobFile.type;
        this.viewerType = this.getViewerTypeByMimeType(this.mimeType);

        this.allowDownload = false;
        // TODO: wrap blob into the data url and allow downloading

        this.extensionChange.emit(this.mimeType);
        this.scrollTop();
    }

    private setUpUrlFile() {
        const filenameFromUrl = this.getFilenameFromUrl(this.urlFile);
        this.fileTitle = this.getDisplayName(filenameFromUrl);
        this.extension = this.getFileExtension(filenameFromUrl);
        this.urlFileContent = this.urlFile;

        this.fileName = this.displayName;

        this.viewerType = this.urlFileViewer || this.getViewerTypeByExtension(this.extension);
        if (this.viewerType === 'unknown') {
            this.viewerType = this.getViewerTypeByMimeType(this.mimeType);
        }

        this.extensionChange.emit(this.extension);
        this.scrollTop();
    }

    private async setUpNodeFile(data: Node) {
        let setupNode;

        if (data.content) {
            this.mimeType = data.content.mimeType;
        }

        this.fileTitle = this.getDisplayName(data.name);

        this.urlFileContent = this.apiService.contentApi.getContentUrl(data.id);
        this.urlFileContent = this.cacheBusterNumber ? this.urlFileContent + '&' + this.cacheBusterNumber : this.urlFileContent;

        this.extension = this.getFileExtension(data.name);

        this.fileName = data.name;

        this.viewerType = this.getViewerTypeByExtension(this.extension);
        if (this.viewerType === 'unknown') {
            this.viewerType = this.getViewerTypeByMimeType(this.mimeType);
        }

        if (this.viewerType === 'unknown') {
            setupNode = this.displayNodeRendition(data.id);
        }

        this.extensionChange.emit(this.extension);
        this.sidebarRightTemplateContext.node = data;
        this.sidebarLeftTemplateContext.node = data;
        this.scrollTop();

        return setupNode;
    }

    private setUpSharedLinkFile(details: any) {
        this.mimeType = details.entry.content.mimeType;
        this.fileTitle = this.getDisplayName(details.entry.name);
        this.extension = this.getFileExtension(details.entry.name);
        this.fileName = details.entry.name;

        this.urlFileContent = this.apiService.contentApi.getSharedLinkContentUrl(this.sharedLinkId, false);

        this.viewerType = this.getViewerTypeByMimeType(this.mimeType);
        if (this.viewerType === 'unknown') {
            this.viewerType = this.getViewerTypeByExtension(this.extension);
        }

        if (this.viewerType === 'unknown') {
            this.displaySharedLinkRendition(this.sharedLinkId);
        }

        this.extensionChange.emit(this.extension);
    }

    toggleSidebar() {
        this.showRightSidebar = !this.showRightSidebar;
        if (this.showRightSidebar && this.nodeId) {
            this.apiService.getInstance().nodes.getNode(this.nodeId, { include: ['allowableOperations'] })
                .then((nodeEntry: NodeEntry) => {
                    this.sidebarRightTemplateContext.node = nodeEntry.entry;
                });
        }
    }

    toggleLeftSidebar() {
        this.showLeftSidebar = !this.showLeftSidebar;
        if (this.showRightSidebar && this.nodeId) {
            this.apiService.getInstance().nodes.getNode(this.nodeId, { include: ['allowableOperations'] })
                .then((nodeEntry: NodeEntry) => {
                    this.sidebarLeftTemplateContext.node = nodeEntry.entry;
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

            const editorTypes = Object.keys(this.mimeTypes);
            for (const type of editorTypes) {
                if (this.mimeTypes[type].indexOf(mimeType) >= 0) {
                    return type;
                }
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
        this.close();
    }

    onNavigateBeforeClick(event: MouseEvent|KeyboardEvent) {
        this.navigateBefore.next(event);
    }

    onNavigateNextClick(event: MouseEvent|KeyboardEvent) {
        this.navigateNext.next(event);
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
     * @param  url - url file
     */
    getFilenameFromUrl(url: string): string {
        const anchor = url.indexOf('#');
        const query = url.indexOf('?');
        const end = Math.min(
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
     * @param fileName - file name
     */
    getFileExtension(fileName: string): string {
        if (fileName) {
            const match = fileName.match(/\.([^\./\?\#]+)($|\?|\#)/);
            return match ? match[1] : null;
        }
        return null;
    }

    isCustomViewerExtension(extension: string): boolean {
        const extensions: any = this.externalExtensions || [];

        if (extension && extensions.length > 0) {
            extension = extension.toLowerCase();
            return extensions.flat().indexOf(extension) >= 0;
        }

        return false;
    }

    /**
     * Keyboard event listener
     * @param  event
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
            this.onNavigateBeforeClick(event);
        }

        // Right arrow
        if (key === 39 && this.canNavigateNext) {
            event.preventDefault();
            this.onNavigateNextClick(event);
        }

        // Ctrl+F
        if (key === 70 && event.ctrlKey) {
            event.preventDefault();
            this.enterFullScreen();
        }
    }

    printContent() {
        if (this.allowPrint) {
            const args = new BaseEvent();
            this.print.next(args);

            if (!args.defaultPrevented) {
                this.viewUtils.printFileGeneric(this.nodeId, this.mimeType);
            }
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
        try {
            const rendition = await this.resolveRendition(nodeId, 'pdf');
            if (rendition) {
                const renditionId = rendition.entry.id;

                if (renditionId === 'pdf') {
                    this.viewerType = 'pdf';
                } else if (renditionId === 'imgpreview') {
                    this.viewerType = 'image';
                }

                this.urlFileContent = this.apiService.contentApi.getRenditionUrl(nodeId, renditionId);
            }
        } catch (err) {
            this.logService.error(err);
        }
    }

    private async displaySharedLinkRendition(sharedId: string) {
        try {
            const rendition: RenditionEntry = await this.apiService.renditionsApi.getSharedLinkRendition(sharedId, 'pdf');
            if (rendition.entry.status.toString() === 'CREATED') {
                this.viewerType = 'pdf';
                this.urlFileContent = this.apiService.contentApi.getSharedLinkRenditionUrl(sharedId, 'pdf');
            }
        } catch (error) {
            this.logService.error(error);
            try {
                const rendition: RenditionEntry = await this.apiService.renditionsApi.getSharedLinkRendition(sharedId, 'imgpreview');
                if (rendition.entry.status.toString() === 'CREATED') {
                    this.viewerType = 'image';
                    this.urlFileContent = this.apiService.contentApi.getSharedLinkRenditionUrl(sharedId, 'imgpreview');
                }
            } catch (error) {
                this.logService.error(error);
            }
        }
    }

    private async resolveRendition(nodeId: string, renditionId: string): Promise<RenditionEntry> {
        renditionId = renditionId.toLowerCase();

        const supportedRendition: RenditionPaging = await this.apiService.renditionsApi.getRenditions(nodeId);

        let rendition: RenditionEntry = supportedRendition.list.entries.find((renditionEntry: RenditionEntry) => renditionEntry.entry.id.toLowerCase() === renditionId);
        if (!rendition) {
            renditionId = 'imgpreview';
            rendition = supportedRendition.list.entries.find((renditionEntry: RenditionEntry) => renditionEntry.entry.id.toLowerCase() === renditionId);
        }

        if (rendition) {
            const status: string = rendition.entry.status.toString();

            if (status === 'NOT_CREATED') {
                try {
                    await this.apiService.renditionsApi.createRendition(nodeId, { id: renditionId }).then(() => {
                        this.viewerType = 'in_creation';
                    });
                    rendition = await this.waitRendition(nodeId, renditionId);
                } catch (err) {
                    this.logService.error(err);
                }
            }
        }

        return rendition;
    }

    private async waitRendition(nodeId: string, renditionId: string): Promise<RenditionEntry> {
        let currentRetry: number = 0;
        return new Promise<RenditionEntry>((resolve, reject) => {
            const intervalId = setInterval(() => {
                currentRetry++;
                if (this.maxRetries >= currentRetry) {
                    this.apiService.renditionsApi.getRendition(nodeId, renditionId).then((rendition: RenditionEntry) => {
                        const status: string = rendition.entry.status.toString();
                        if (status === 'CREATED') {

                            if (renditionId === 'pdf') {
                                this.viewerType = 'pdf';
                            } else if (renditionId === 'imgpreview') {
                                this.viewerType = 'image';
                            }

                            this.urlFileContent = this.apiService.contentApi.getRenditionUrl(nodeId, renditionId);

                            clearInterval(intervalId);
                            return resolve(rendition);
                        }
                    }, () => {
                        this.viewerType = 'error_in_creation';
                        return reject();
                    });
                } else {
                    this.isLoading = false;
                    this.viewerType = 'error_in_creation';
                    clearInterval(intervalId);
                }
            }, this.TRY_TIMEOUT);
        });
    }

    checkExtensions(extensionAllowed) {
        if (typeof extensionAllowed === 'string') {
            return this.extension.toLowerCase() === extensionAllowed.toLowerCase();
        } else if (extensionAllowed.length > 0) {
            return extensionAllowed.find((currentExtension) => {
                return this.extension.toLowerCase() === currentExtension.toLowerCase();
            });
        }

    }

    private generateCacheBusterNumber() {
        this.cacheBusterNumber = Date.now();
    }
}
