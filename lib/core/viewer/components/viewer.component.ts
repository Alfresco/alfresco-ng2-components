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
    ViewEncapsulation, OnInit, OnDestroy, ChangeDetectorRef
} from '@angular/core';
import {
    SharedLinkEntry,
    Node,
    Version,
    RenditionEntry,
    NodeEntry,
    VersionEntry,
    SharedlinksApi, VersionsApi, NodesApi, ContentApi
} from '@alfresco/js-api';
import { BaseEvent } from '../../events';
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { LogService } from '../../services/log.service';
import { ViewerMoreActionsComponent } from './viewer-more-actions.component';
import { ViewerOpenWithComponent } from './viewer-open-with.component';
import { ViewerSidebarComponent } from './viewer-sidebar.component';
import { ViewerToolbarComponent } from './viewer-toolbar.component';
import { fromEvent, Subject } from 'rxjs';
import { ViewUtilService } from '../services/view-util.service';
import { AppExtensionService, ViewerExtensionRef } from '@alfresco/adf-extensions';
import { filter, skipWhile, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ContentService } from '../../services/content.service';
import { UploadService } from '../../services/upload.service';
import { FileModel } from '../../models';

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

    /** Version Id of the file to load. */
    @Input()
    versionId: string = null;

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
    navigateBefore = new EventEmitter<MouseEvent | KeyboardEvent>();

    /** Emitted when user clicks 'Navigate Next' (">") button. */
    @Output()
    navigateNext = new EventEmitter<MouseEvent | KeyboardEvent>();

    /** Emitted when the shared link used is not valid. */
    @Output()
    invalidSharedLink = new EventEmitter();

    viewerType = 'unknown';
    isLoading = false;
    nodeEntry: NodeEntry;
    versionEntry: VersionEntry;

    extensionTemplates: { template: TemplateRef<any>; isVisible: boolean }[] = [];
    urlFileContent: string;
    otherMenu: any;
    extension: string;
    sidebarRightTemplateContext: { node: Node } = { node: null };
    sidebarLeftTemplateContext: { node: Node } = { node: null };
    fileTitle: string;

    /**
     * Returns a list of the active Viewer content extensions.
     */
    get viewerExtensions(): ViewerExtensionRef[] {
        return this.extensionService.getViewerExtensions();
    }

    /**
     * Provides a list of file extensions supported by external plugins.
     */
    get externalExtensions(): string[] {
        return this.viewerExtensions.map(ext => ext.fileExtension);
    }

    private _externalViewer: ViewerExtensionRef;
    get externalViewer(): ViewerExtensionRef {
        if (!this._externalViewer) {
            this._externalViewer = this.viewerExtensions.find(ext => ext.fileExtension === '*');
        }

        return this._externalViewer;
    }

    readOnly = true;

    private cacheBusterNumber: number;
    cacheTypeForContent = '';

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
        media: ['video/mp4', 'video/webm', 'video/ogg', 'audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/wav']
    };

    private onDestroy$ = new Subject<boolean>();
    private shouldCloseViewer = true;
    private keyDown$ = fromEvent<KeyboardEvent>(document, 'keydown');

    _sharedLinksApi: SharedlinksApi;
    get sharedLinksApi(): SharedlinksApi {
        this._sharedLinksApi = this._sharedLinksApi ?? new SharedlinksApi(this.apiService.getInstance());
        return this._sharedLinksApi;
    }

    _versionsApi: VersionsApi;
    get versionsApi(): VersionsApi {
        this._versionsApi = this._versionsApi ?? new VersionsApi(this.apiService.getInstance());
        return this._versionsApi;
    }

    _nodesApi: NodesApi;
    get nodesApi(): NodesApi {
        this._nodesApi = this._nodesApi ?? new NodesApi(this.apiService.getInstance());
        return this._nodesApi;
    }

    _contentApi: ContentApi;
    get contentApi(): ContentApi {
        this._contentApi = this._contentApi ?? new ContentApi(this.apiService.getInstance());
        return this._contentApi;
    }

    constructor(private apiService: AlfrescoApiService,
                private viewUtilService: ViewUtilService,
                private logService: LogService,
                private extensionService: AppExtensionService,
                private contentService: ContentService,
                private uploadService: UploadService,
                private el: ElementRef,
                public dialog: MatDialog,
                private cdr: ChangeDetectorRef) {
        viewUtilService.maxRetries = this.maxRetries;
    }

    isSourceDefined(): boolean {
        return !!(this.urlFile || this.blobFile || this.nodeId || this.sharedLinkId);
    }

    ngOnInit() {
        this.apiService.nodeUpdated.pipe(
            filter((node) => {
                return node && node.id === this.nodeId &&
                    (node.name !== this.fileName ||
                        this.getNodeVersionProperty(this.nodeEntry.entry) !== this.getNodeVersionProperty(node));
            }),
            takeUntil(this.onDestroy$)
        ).subscribe((node) => this.onNodeUpdated(node));

        this.viewUtilService.viewerTypeChange.pipe(takeUntil(this.onDestroy$)).subscribe((type: string) => {
            this.viewerType = type;
        });

        this.viewUtilService.urlFileContentChange.pipe(takeUntil(this.onDestroy$)).subscribe((content: string) => {
            this.urlFileContent = content;
        });

        this.closeOverlayManager();
        this.cacheTypeForContent = '';
    }

    private getNodeVersionProperty(node: Node): string {
        return node?.properties['cm:versionLabel'] ?? '';
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    private onNodeUpdated(node: Node) {
        if (node && node.id === this.nodeId) {
            this.cacheTypeForContent = 'no-cache';
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
                this.setupNode();
            } else if (this.sharedLinkId) {
                this.setupSharedLink();
            }
        }
    }

    private setupSharedLink() {
        this.allowGoBack = false;

        this.sharedLinksApi.getSharedLink(this.sharedLinkId).then(
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

    private setupNode() {
        this.nodesApi.getNode(this.nodeId, { include: ['allowableOperations'] }).then(
            (node: NodeEntry) => {
                this.nodeEntry = node;
                if (this.versionId) {
                    this.versionsApi.getVersion(this.nodeId, this.versionId).then(
                        (version: VersionEntry) => {
                            this.versionEntry = version;
                            this.setUpNodeFile(node.entry, version.entry).then(() => {
                                this.isLoading = false;
                            });
                        }
                    );
                } else {
                    this.setUpNodeFile(node.entry).then(() => {
                        this.isLoading = false;
                        this.cdr.detectChanges();
                    });
                }
            },
            () => {
                this.isLoading = false;
                this.logService.error('This node does not exist');
            }
        );
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
        this.viewerType = this.urlFileViewer || this.getViewerType(this.extension, this.mimeType);

        this.extensionChange.emit(this.extension);
        this.scrollTop();
    }

    private async setUpNodeFile(nodeData: Node, versionData?: Version): Promise<void> {
        this.readOnly = !this.contentService.hasAllowableOperations(nodeData, 'update');

        if (versionData && versionData.content) {
            this.mimeType = versionData.content.mimeType;
        } else if (nodeData.content) {
            this.mimeType = nodeData.content.mimeType;
        }

        this.fileTitle = this.getDisplayName(versionData ? versionData.name : nodeData.name);

        const currentFileVersion = this.nodeEntry?.entry?.properties && this.nodeEntry.entry.properties['cm:versionLabel'] ?
            encodeURI(this.nodeEntry?.entry?.properties['cm:versionLabel']) : encodeURI('1.0');

        this.urlFileContent = versionData ? this.contentApi.getVersionContentUrl(this.nodeId, versionData.id) :
            this.contentApi.getContentUrl(this.nodeId);
        this.urlFileContent = this.cacheBusterNumber ? this.urlFileContent + '&' + currentFileVersion + '&' + this.cacheBusterNumber :
            this.urlFileContent + '&' + currentFileVersion;

        this.extension = this.getFileExtension(versionData ? versionData.name : nodeData.name);
        this.fileName = versionData ? versionData.name : nodeData.name;
        this.viewerType = this.getViewerType(this.extension, this.mimeType);

        if (this.viewerType === 'unknown') {
            if (versionData) {
                await this.viewUtilService.displayNodeRendition(nodeData.id, versionData.id);
            } else {
                await this.viewUtilService.displayNodeRendition(nodeData.id);
            }
        }

        this.extensionChange.emit(this.extension);
        this.sidebarRightTemplateContext.node = nodeData;
        this.sidebarLeftTemplateContext.node = nodeData;
        this.scrollTop();
    }

    private getViewerType(extension: string, mimeType: string): string {
        let viewerType = this.getViewerTypeByExtension(extension);

        if (viewerType === 'unknown') {
            viewerType = this.getViewerTypeByMimeType(mimeType);
        }

        return viewerType;
    }

    private setUpSharedLinkFile(details: any) {
        this.mimeType = details.entry.content.mimeType;
        this.fileTitle = this.getDisplayName(details.entry.name);
        this.extension = this.getFileExtension(details.entry.name);
        this.fileName = details.entry.name;
        this.urlFileContent = this.contentApi.getSharedLinkContentUrl(this.sharedLinkId, false);
        this.viewerType = this.getViewerType(this.extension, this.mimeType);

        if (this.viewerType === 'unknown') {
            this.displaySharedLinkRendition(this.sharedLinkId);
        }

        this.extensionChange.emit(this.extension);
    }

    toggleSidebar() {
        this.showRightSidebar = !this.showRightSidebar;
        if (this.showRightSidebar && this.nodeId) {
            this.nodesApi.getNode(this.nodeId, { include: ['allowableOperations'] })
                .then((nodeEntry: NodeEntry) => {
                    this.sidebarRightTemplateContext.node = nodeEntry.entry;
                });
        }
    }

    toggleLeftSidebar() {
        this.showLeftSidebar = !this.showLeftSidebar;
        if (this.showRightSidebar && this.nodeId) {
            this.nodesApi.getNode(this.nodeId, { include: ['allowableOperations'] })
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

        if (this.isExternalViewer()) {
            return 'external';
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

    onNavigateBeforeClick(event: MouseEvent | KeyboardEvent) {
        this.navigateBefore.next(event);
    }

    onNavigateNextClick(event: MouseEvent | KeyboardEvent) {
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

    private isExternalViewer(): boolean {
        return !!this.viewerExtensions.find(ext => ext.fileExtension === '*');
    }

    isCustomViewerExtension(extension: string): boolean {
        const extensions = this.externalExtensions || [];

        if (extension && extensions.length > 0) {
            extension = extension.toLowerCase();
            return extensions.flat().indexOf(extension) >= 0;
        }

        return false;
    }

    /**
     * Keyboard event listener
     *
     * @param  event
     */
    @HostListener('document:keyup', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event && event.defaultPrevented) {
            return;
        }

        const key = event.keyCode;

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
                this.viewUtilService.printFileGeneric(this.nodeId, this.mimeType);
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

    private async displaySharedLinkRendition(sharedId: string) {
        try {
            const rendition: RenditionEntry = await this.sharedLinksApi.getSharedLinkRendition(sharedId, 'pdf');
            if (rendition.entry.status.toString() === 'CREATED') {
                this.viewerType = 'pdf';
                this.urlFileContent = this.contentApi.getSharedLinkRenditionUrl(sharedId, 'pdf');
            }
        } catch (error) {
            this.logService.error(error);
            try {
                const rendition: RenditionEntry = await this.sharedLinksApi.getSharedLinkRendition(sharedId, 'imgpreview');
                if (rendition.entry.status.toString() === 'CREATED') {
                    this.viewerType = 'image';
                    this.urlFileContent = this.contentApi.getSharedLinkRenditionUrl(sharedId, 'imgpreview');
                }
            } catch (renditionError) {
                this.logService.error(renditionError);
            }
        }
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

    onSubmitFile(newImageBlob: Blob) {
        if (this?.nodeEntry?.entry?.id && !this.readOnly) {
            const newImageFile: File = new File([newImageBlob], this?.nodeEntry?.entry?.name, { type: this?.nodeEntry?.entry?.content?.mimeType });
            const newFile = new FileModel(
                newImageFile,
                {
                    majorVersion: false,
                    newVersion: true,
                    parentId: this?.nodeEntry?.entry?.parentId,
                    nodeType: this?.nodeEntry?.entry?.content?.mimeType
                },
                this?.nodeEntry?.entry?.id
            );
            this.uploadService.addToQueue(...[newFile]);
            this.uploadService.uploadFilesInTheQueue();
        }
    }

    onUnsupportedFile() {
        this.viewerType = 'unknown';
    }

    private closeOverlayManager() {
        this.dialog.afterOpened.pipe(
            skipWhile(() => !this.overlayMode),
            takeUntil(this.onDestroy$)
        ).subscribe(() => this.shouldCloseViewer = false);

        this.dialog.afterAllClosed.pipe(
            skipWhile(() => !this.overlayMode),
            takeUntil(this.onDestroy$)
        ).subscribe(() => this.shouldCloseViewer = true);

        this.keyDown$.pipe(
            skipWhile(() => !this.overlayMode),
            filter((e: KeyboardEvent) => e.keyCode === 27),
            takeUntil(this.onDestroy$)
        ).subscribe((event: KeyboardEvent) => {
            event.preventDefault();

            if (this.shouldCloseViewer) {
                this.close();
            }
        });
    }

    private generateCacheBusterNumber() {
        this.cacheBusterNumber = Date.now();
    }
}
