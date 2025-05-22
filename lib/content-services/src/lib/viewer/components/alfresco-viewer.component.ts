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

import {
    ChangeDetectorRef,
    Component,
    ContentChild,
    DestroyRef,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {
    CloseButtonPosition,
    Track,
    VIEWER_DIRECTIVES,
    ViewerComponent,
    ViewerMoreActionsComponent,
    ViewerOpenWithComponent,
    ViewerSidebarComponent,
    ViewerToolbarActionsComponent,
    ViewerToolbarComponent,
    ViewUtilService
} from '@alfresco/adf-core';
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { ContentApi, Node, NodeEntry, NodesApi, RenditionEntry, SharedlinksApi, Version, VersionEntry, VersionsApi } from '@alfresco/js-api';
import { RenditionService } from '../../common/services/rendition.service';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { ContentService } from '../../common/services/content.service';
import { NodesApiService } from '../../common/services/nodes-api.service';
import { UploadService } from '../../common/services/upload.service';
import { FileModel } from '../../common/models/file.model';
import { NodeActionsService } from '../../document-list';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NodeDownloadDirective } from '../../directives';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'adf-alfresco-viewer',
    imports: [CommonModule, TranslateModule, MatButtonModule, MatIconModule, ...VIEWER_DIRECTIVES, NodeDownloadDirective],
    templateUrl: './alfresco-viewer.component.html',
    styleUrls: ['./alfresco-viewer.component.scss'],
    host: { class: 'adf-alfresco-viewer' },
    encapsulation: ViewEncapsulation.None,
    providers: [ViewUtilService]
})
export class AlfrescoViewerComponent implements OnChanges, OnInit {
    @ViewChild('adfViewer')
    adfViewer: ViewerComponent<{ node: Node }>;

    @ContentChild(ViewerToolbarComponent)
    toolbar: ViewerToolbarComponent;

    @ContentChild(ViewerSidebarComponent)
    sidebar: ViewerSidebarComponent;

    @ContentChild(ViewerToolbarActionsComponent)
    toolbarActions: ViewerToolbarActionsComponent;

    @ContentChild(ViewerMoreActionsComponent)
    moreActions: ViewerMoreActionsComponent;

    @ContentChild(ViewerOpenWithComponent)
    openWith: ViewerOpenWithComponent;

    @ContentChild('viewerExtensions', { static: false })
    viewerExtensions: TemplateRef<any>;

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

    /**
     * Number of times the Viewer will retry fetching content Rendition.
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

    /**
     * If `true` then show the Viewer as a full page over the current content.
     * Otherwise, fit inside the parent div.
     */
    @Input()
    overlayMode = false;

    /**
     * Toggles before/next navigation. You can use the arrow buttons to navigate
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

    /** Toggles the 'Full Screen' feature. */
    @Input()
    allowFullScreen = true;

    /** Toggles the 'Info Button' */
    @Input()
    hideInfoButton = false;

    /** Change the close button position Right/Left */
    @Input()
    closeButtonPosition = CloseButtonPosition.Left;

    /** The template for the right sidebar. The template context contains the loaded node data. */
    @Input()
    sidebarRightTemplate: TemplateRef<any> = null;

    /** The template for the left sidebar. The template context contains the loaded node data. */
    @Input()
    sidebarLeftTemplate: TemplateRef<any> = null;

    /** Emitted when the shared link used is not valid. */
    @Output()
    invalidSharedLink = new EventEmitter<void>();

    /** Emitted when user clicks 'Navigate Before' ("<") button. */
    @Output()
    navigateBefore = new EventEmitter<MouseEvent | KeyboardEvent>();

    /** Emitted when user clicks 'Navigate Next' (">") button. */
    @Output()
    navigateNext = new EventEmitter<MouseEvent | KeyboardEvent>();

    /** Emitted when the viewer close */
    @Output()
    showViewerChange = new EventEmitter<boolean>();

    private cacheBusterNumber: number;

    versionEntry: VersionEntry;
    urlFileContent: string;
    fileName: string;
    mimeType: string;
    nodeMimeType: string;
    nodeEntry: NodeEntry;
    tracks: Track[] = [];
    readOnly: boolean = true;
    allowedEditActions: { [key: string]: boolean } = {
        rotate: true,
        crop: true
    };

    sidebarRightTemplateContext: { node: Node } = { node: null };
    sidebarLeftTemplateContext: { node: Node } = { node: null };

    private _sharedLinksApi: SharedlinksApi;
    get sharedLinksApi(): SharedlinksApi {
        this._sharedLinksApi = this._sharedLinksApi ?? new SharedlinksApi(this.apiService.getInstance());
        return this._sharedLinksApi;
    }

    private _versionsApi: VersionsApi;
    get versionsApi(): VersionsApi {
        this._versionsApi = this._versionsApi ?? new VersionsApi(this.apiService.getInstance());
        return this._versionsApi;
    }

    private _nodesApi: NodesApi;
    get nodesApi(): NodesApi {
        this._nodesApi = this._nodesApi ?? new NodesApi(this.apiService.getInstance());
        return this._nodesApi;
    }

    private _contentApi: ContentApi;
    get contentApi(): ContentApi {
        this._contentApi = this._contentApi ?? new ContentApi(this.apiService.getInstance());
        return this._contentApi;
    }

    private readonly destroyRef = inject(DestroyRef);

    constructor(
        private apiService: AlfrescoApiService,
        private nodesApiService: NodesApiService,
        private renditionService: RenditionService,
        private viewUtilService: ViewUtilService,
        private contentService: ContentService,
        private uploadService: UploadService,
        public dialog: MatDialog,
        private cdr: ChangeDetectorRef,
        private nodeActionsService: NodeActionsService
    ) {
        renditionService.maxRetries = this.maxRetries;
    }

    ngOnInit() {
        this.nodesApiService.nodeUpdated
            .pipe(
                filter(
                    (node) =>
                        node && node.id === this.nodeId && this.getNodeVersionProperty(this.nodeEntry.entry) !== this.getNodeVersionProperty(node)
                ),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((node) => this.onNodeUpdated(node));
    }

    private async onNodeUpdated(node: Node) {
        if (node && node.id === this.nodeId) {
            this.generateCacheBusterNumber();

            await this.setUpNodeFile(node);
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
        } catch (error) {
            this.invalidSharedLink.next(undefined);
            this.mimeType = 'invalid-link';
            this.urlFileContent = 'invalid-file';
        }
    }

    private async setupNode() {
        try {
            this.nodeEntry = await this.nodesApi.getNode(this.nodeId, { include: ['allowableOperations'] });
            if (this.versionId) {
                this.versionEntry = await this.versionsApi.getVersion(this.nodeId, this.versionId);
                await this.setUpNodeFile(this.nodeEntry.entry, this.versionEntry.entry);
            } else {
                await this.setUpNodeFile(this.nodeEntry.entry);
                this.cdr.detectChanges();
            }
        } catch (error) {
            this.urlFileContent = 'invalid-node';
        }
    }

    private async setUpNodeFile(nodeData: Node, versionData?: Version): Promise<void> {
        this.readOnly = !this.contentService.hasAllowableOperations(nodeData, 'update');
        let mimeType: string;
        let nodeMimeType: string;
        let urlFileContent: string;

        if (versionData?.content) {
            mimeType = versionData.content.mimeType;
        } else if (nodeData.content) {
            mimeType = nodeData.content.mimeType;
        }
        nodeMimeType = mimeType;

        const currentFileVersion = this.nodeEntry?.entry?.properties?.['cm:versionLabel']
            ? encodeURI(this.nodeEntry?.entry?.properties['cm:versionLabel'])
            : encodeURI('1.0');

        urlFileContent = versionData ? this.contentApi.getVersionContentUrl(this.nodeId, versionData.id) : this.contentApi.getContentUrl(this.nodeId);
        urlFileContent = urlFileContent + '&' + currentFileVersion;

        const fileExtension = this.viewUtilService.getFileExtension(versionData ? versionData.name : nodeData.name);
        const viewerType = this.viewUtilService.getViewerType(fileExtension, mimeType);

        if (viewerType === 'unknown') {
            let nodeRendition;
            if (versionData) {
                nodeRendition = await this.renditionService.getNodeRendition(nodeData.id, versionData.id);
            } else {
                nodeRendition = await this.renditionService.getNodeRendition(nodeData.id);
            }
            if (nodeRendition) {
                urlFileContent = nodeRendition.url;

                nodeMimeType = nodeData?.content?.mimeType;
                const renditionMimeType = nodeRendition.mimeType;
                mimeType = renditionMimeType || nodeMimeType;
            }
        } else if (viewerType === 'media') {
            this.tracks = await this.renditionService.generateMediaTracksRendition(this.nodeId);
        }

        this.mimeType = mimeType;
        this.nodeMimeType = nodeMimeType;
        this.fileName = versionData ? versionData.name : nodeData.name;
        this.urlFileContent = urlFileContent + (this.cacheBusterNumber ? '&' + this.cacheBusterNumber : '');
        this.sidebarRightTemplateContext.node = nodeData;
        this.sidebarLeftTemplateContext.node = nodeData;
    }

    private async setUpSharedLinkFile(details: any) {
        let mimeType = details.entry.content.mimeType;
        const fileExtension = this.viewUtilService.getFileExtension(details.entry.name);
        this.fileName = details.entry.name;
        let urlFileContent = this.contentApi.getSharedLinkContentUrl(this.sharedLinkId, false);
        const viewerType = this.viewUtilService.getViewerType(fileExtension, mimeType);

        if (viewerType === 'unknown') {
            ({ url: urlFileContent, mimeType } = await this.getSharedLinkRendition(this.sharedLinkId));
        }
        this.mimeType = mimeType;
        this.urlFileContent = urlFileContent;
    }

    private async getSharedLinkRendition(sharedId: string): Promise<{ url: string; mimeType: string }> {
        try {
            const rendition: RenditionEntry = await this.sharedLinksApi.getSharedLinkRendition(sharedId, 'pdf');
            if (rendition.entry.status.toString() === 'CREATED') {
                const urlFileContent = this.contentApi.getSharedLinkRenditionUrl(sharedId, 'pdf');
                return { url: urlFileContent, mimeType: 'application/pdf' };
            }
        } catch (error) {
            try {
                const rendition: RenditionEntry = await this.sharedLinksApi.getSharedLinkRendition(sharedId, 'imgpreview');
                if (rendition.entry.status.toString() === 'CREATED') {
                    const urlFileContent = this.contentApi.getSharedLinkRenditionUrl(sharedId, 'imgpreview');
                    return { url: urlFileContent, mimeType: 'image/png' };
                }
            } catch (renditionError) {
                return null;
            }
        }

        return null;
    }

    private generateCacheBusterNumber() {
        this.cacheBusterNumber = Date.now();
    }

    /**
     * close the viewer
     */
    onClose() {
        this.showViewerChange.emit(this.showViewer);
    }

    onPrintContent(event: MouseEvent) {
        if (this.allowPrint) {
            if (!event.defaultPrevented) {
                this.renditionService.printFileGeneric(this.nodeId, this.mimeType);
            }
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

    onNavigateBeforeClick(event: MouseEvent | KeyboardEvent) {
        this.navigateBefore.next(event);
    }

    onNavigateNextClick(event: MouseEvent | KeyboardEvent) {
        this.navigateNext.next(event);
    }

    isSourceDefined(): boolean {
        return !!(this.nodeId || this.sharedLinkId);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.showViewer) {
            if (!this.isSourceDefined()) {
                throw new Error('A content source attribute value is missing.');
            }

            if (changes.nodeId?.currentValue !== changes.nodeId?.previousValue) {
                this.setupNode();
            } else if (this.sharedLinkId) {
                this.setupSharedLink();
            }
        }
    }

    onDownloadFile() {
        this.nodeActionsService.downloadNode(this.nodeEntry);
    }
}
