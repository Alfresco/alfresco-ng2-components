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
    ChangeDetectorRef,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    Output,
    TemplateRef,
    ViewEncapsulation
} from '@angular/core';
import {
    AlfrescoApiService, ContentService,
    FileModel,
    LogService, Track,
    UploadService,
    ViewerMoreActionsComponent,
    ViewerOpenWithComponent,
    ViewerSidebarComponent,
    ViewerToolbarComponent,
    ViewUtilService
} from "@alfresco/adf-core";
import { fromEvent, Subject } from "rxjs";
import {
    ContentApi,
    Node,
    NodeEntry,
    NodesApi,
    RenditionEntry,
    SharedlinksApi,
    Version,
    VersionEntry,
    VersionsApi
} from "@alfresco/js-api";
import { RenditionViewerService } from "../services/rendition-viewer.service";
import { MatDialog } from "@angular/material/dialog";
import { filter, skipWhile, takeUntil } from "rxjs/operators";

@Component({
    selector: 'adf-alfresco-viewer',
    templateUrl: './alfresco-viewer.component.html',
    styleUrls: ['./alfresco-viewer.component.scss'],
    host: {class: 'adf-alfresco-viewer'},
    encapsulation: ViewEncapsulation.None,
    providers: [ViewUtilService]
})
export class AlfrescoViewerComponent {

    @ContentChild(ViewerToolbarComponent)
    toolbar: ViewerToolbarComponent;

    @ContentChild(ViewerSidebarComponent)
    sidebar: ViewerSidebarComponent;

    @ContentChild(ViewerOpenWithComponent)
    mnuOpenWith: ViewerOpenWithComponent;

    @ContentChild(ViewerMoreActionsComponent)
    mnuMoreActions: ViewerMoreActionsComponent;

    /** Node Id of the file to load. */
    @Input()
    nodeId: string = null;

    /** Version Id of the file to load. */
    @Input()
    versionId: string = null;

    /** Shared link id (to display shared file). */
    @Input()
    sharedLinkId: string = null;

    /** Hide or show the viewer */
    @Input()
    showViewer = true;

    /** Number of times the Viewer will retry fetching content Rendition.
     * There is a delay of at least one second between attempts.
     */
    @Input()
    maxRetries = 30;

    /** Allows `back` navigation */
    @Input()
    allowGoBack = true;

    /** Hide or show the toolbar */
    @Input()
    showToolbar = true;

    /** If `true` then show the Viewer as a full page over the current content.
     * Otherwise fit inside the parent div.
     */
    @Input()
    overlayMode = false;

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

    /** Toggles right sidebar visibility. Requires `allowRightSidebar` to be set to `true`. */
    @Input()
    showRightSidebar = false;

    /** Toggles left sidebar visibility. Requires `allowLeftSidebar` to be set to `true`. */
    @Input()
    showLeftSidebar = false;

    /** Toggles downloading. */
    @Input()
    allowDownload = true;

    /** Toggles printing. */
    @Input()
    allowPrint = false;

    /** The template for the right sidebar. The template context contains the loaded node data. */
    @Input()
    sidebarRightTemplate: TemplateRef<any> = null;

    /** The template for the left sidebar. The template context contains the loaded node data. */
    @Input()
    sidebarLeftTemplate: TemplateRef<any> = null;

    /** Emitted when the shared link used is not valid. */
    @Output()
    invalidSharedLink = new EventEmitter();

    /** Emitted when user clicks 'Navigate Before' ("<") button. */
    @Output()
    navigateBefore = new EventEmitter<MouseEvent | KeyboardEvent>();

    /** Emitted when user clicks 'Navigate Next' (">") button. */
    @Output()
    navigateNext = new EventEmitter<MouseEvent | KeyboardEvent>();

    /** Emitted when the viewer close */
    @Output()
    close = new EventEmitter<boolean>();

    private onDestroy$ = new Subject<boolean>();
    private keyDown$ = fromEvent<KeyboardEvent>(document, 'keydown');

    private cacheBusterNumber: number;
    private closeViewer = true;

    versionEntry: VersionEntry;
    isLoading: boolean;
    urlFileContent: string;
    viewerType: any;
    fileName: string;
    mimeType: string;
    nodeEntry: NodeEntry;
    tracks: Track[] = [];
    readOnly: boolean = true;

    sidebarRightTemplateContext: { node: Node } = {node: null};
    sidebarLeftTemplateContext: { node: Node } = {node: null};

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
                private renditionViewerService: RenditionViewerService,
                private viewUtilService: ViewUtilService,
                private logService: LogService,
                private contentService: ContentService,
                private el: ElementRef,
                private uploadService: UploadService,
                public dialog: MatDialog,
                private cdr: ChangeDetectorRef) {
        renditionViewerService.maxRetries = this.maxRetries;

    }

    ngOnInit() {
        this.apiService.nodeUpdated.pipe(
            filter((node) => node && node.id === this.nodeId &&
                (node.name !== this.fileName ||
                    this.getNodeVersionProperty(this.nodeEntry.entry) !== this.getNodeVersionProperty(node))),
            takeUntil(this.onDestroy$)
        ).subscribe((node) => this.onNodeUpdated(node));
        this.closeOverlayManager();
    }

    private closeOverlayManager() {
        this.dialog.afterOpened.pipe(
            skipWhile(() => !this.overlayMode),
            takeUntil(this.onDestroy$)
        ).subscribe(() => this.closeViewer = false);

        this.dialog.afterAllClosed.pipe(
            skipWhile(() => !this.overlayMode),
            takeUntil(this.onDestroy$)
        ).subscribe(() => this.closeViewer = true);

        this.keyDown$.pipe(
            skipWhile(() => !this.overlayMode),
            filter((e: KeyboardEvent) => e.keyCode === 27),
            takeUntil(this.onDestroy$)
        ).subscribe((event: KeyboardEvent) => {
            event.preventDefault();

            if (this.closeViewer) {
                this.onClose();
            }
        });
    }

    private async onNodeUpdated(node: Node) {
        if (node && node.id === this.nodeId) {
            this.generateCacheBusterNumber();
            this.isLoading = true;

            await this.setUpNodeFile(node)
            this.isLoading = false;
        }
    }

    private getNodeVersionProperty(node: Node): string {
        return node?.properties['cm:versionLabel'] ?? '';
    }

    private async setupSharedLink() {
        this.allowGoBack = false;

        try {
            const sharedLinkEntry = await this.sharedLinksApi.getSharedLink(this.sharedLinkId);
            await this.setUpSharedLinkFile(sharedLinkEntry);
            this.isLoading = false;
        } catch (error) {
            this.isLoading = false;
            this.logService.error('This sharedLink does not exist');
            this.invalidSharedLink.next();
            this.viewerType = 'invalid-link';
        }
    }

    private async setupNode() {
        try {
            this.nodeEntry = await this.nodesApi.getNode(this.nodeId, {include: ['allowableOperations']});
            if (this.versionId) {
                this.versionEntry = await this.versionsApi.getVersion(this.nodeId, this.versionId);
                await this.setUpNodeFile(this.nodeEntry.entry, this.versionEntry.entry);
                this.isLoading = false;
            } else {
                await this.setUpNodeFile(this.nodeEntry.entry);
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        } catch (error) {
            this.isLoading = false;
            this.logService.error('This node does not exist');
        }
    }

    private async setUpNodeFile(nodeData: Node, versionData?: Version): Promise<void> {
        this.isLoading = true;

        this.readOnly = !this.contentService.hasAllowableOperations(nodeData, 'update');

        if (versionData && versionData.content) {
            this.mimeType = versionData.content.mimeType;
        } else if (nodeData.content) {
            this.mimeType = nodeData.content.mimeType;
        }

        const currentFileVersion = this.nodeEntry?.entry?.properties && this.nodeEntry.entry.properties['cm:versionLabel'] ?
            encodeURI(this.nodeEntry?.entry?.properties['cm:versionLabel']) : encodeURI('1.0');

        this.urlFileContent = versionData ? this.contentApi.getVersionContentUrl(this.nodeId, versionData.id) :
            this.contentApi.getContentUrl(this.nodeId);
        this.urlFileContent = this.cacheBusterNumber ? this.urlFileContent + '&' + currentFileVersion + '&' + this.cacheBusterNumber :
            this.urlFileContent + '&' + currentFileVersion;

        const fileExtension = this.viewUtilService.getFileExtension(versionData ? versionData.name : nodeData.name);
        this.fileName = versionData ? versionData.name : nodeData.name;
        this.viewerType = this.viewUtilService.getViewerType(fileExtension, this.mimeType);

        if (this.viewerType === 'unknown') {
            if (versionData) {
                ({
                    url: this.urlFileContent,
                    viewerType: this.viewerType
                } = await this.renditionViewerService.getNodeRendition(nodeData.id, versionData.id));
            } else {
                ({
                    url: this.urlFileContent,
                    viewerType: this.viewerType
                } = await this.renditionViewerService.getNodeRendition(nodeData.id));
            }
        } else if (this.viewerType === 'media') {
            this.tracks = await this.renditionViewerService.generateMediaTracksRendition(this.nodeId);
        }

        this.isLoading = false;

        this.sidebarRightTemplateContext.node = nodeData;
        this.sidebarLeftTemplateContext.node = nodeData;
    }

    private async setUpSharedLinkFile(details: any) {
        this.mimeType = details.entry.content.mimeType;
        const fileExtension = this.viewUtilService.getFileExtension(details.entry.name);
        this.fileName = details.entry.name;
        this.urlFileContent = this.contentApi.getSharedLinkContentUrl(this.sharedLinkId, false);
        this.viewerType = this.viewUtilService.getViewerType(fileExtension, this.mimeType);

        if (this.viewerType === 'unknown') {
            ({
                url: this.urlFileContent,
                viewerType: this.viewerType
            } = await this.getSharedLinkRendition(this.sharedLinkId));
        }
    }

    private async getSharedLinkRendition(sharedId: string): Promise<{ url: string, viewerType: string }> {
        try {
            const rendition: RenditionEntry = await this.sharedLinksApi.getSharedLinkRendition(sharedId, 'pdf');
            if (rendition.entry.status.toString() === 'CREATED') {
                const urlFileContent = this.contentApi.getSharedLinkRenditionUrl(sharedId, 'pdf');
                return {url: urlFileContent, viewerType: 'pdf'}
            }
        } catch (error) {
            this.logService.error(error);
            try {
                const rendition: RenditionEntry = await this.sharedLinksApi.getSharedLinkRendition(sharedId, 'imgpreview');
                if (rendition.entry.status.toString() === 'CREATED') {
                    const urlFileContent = this.contentApi.getSharedLinkRenditionUrl(sharedId, 'imgpreview');
                    return {url: urlFileContent, viewerType: 'image'}

                }
            } catch (renditionError) {
                this.logService.error(renditionError);
                return null;
            }
        }

        return null;
    }

    private generateCacheBusterNumber() {
        this.cacheBusterNumber = Date.now();
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
    onClose() {
        this.showViewer = false;
        this.close.emit(this.showViewer);
    }

    onPrintContent(event: MouseEvent) {
        if (this.allowPrint) {
            if (!event.defaultPrevented) {
                this.renditionViewerService.printFileGeneric(this.nodeId, this.mimeType);
            }
        }
    }

    onSubmitFile(newImageBlob: Blob) {
        if (this?.nodeEntry?.entry?.id && !this.readOnly) {
            const newImageFile: File = new File([newImageBlob], this?.nodeEntry?.entry?.name, {type: this?.nodeEntry?.entry?.content?.mimeType});
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

    isSourceDefined(): boolean {
        return !!(this.nodeId || this.sharedLinkId);
    }

    ngOnChanges() {
        if (this.showViewer) {
            if (!this.isSourceDefined()) {
                throw new Error('A content source attribute value is missing.');
            }

            if (this.nodeId) {
                this.setupNode();
            } else if (this.sharedLinkId) {
                this.setupSharedLink();
            }
        }
    }

    toggleRightSidebar() {
        this.showRightSidebar = !this.showRightSidebar;
    }

    toggleLeftSidebar() {
        this.showLeftSidebar = !this.showLeftSidebar;
    }

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

    /**
     * Triggers full screen mode with a main content area displayed.
     */
    enterFullScreen(): void {
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
