import {
    ChangeDetectorRef,
    Component,
    EventEmitter, HostListener,
    Input,
    Output,
    ViewEncapsulation
} from "@angular/core";
import { ViewUtilService } from "../services/view-util.service";
import {
    ContentApi, Node,
    NodeEntry,
    NodesApi, RenditionEntry,
    SharedLinkEntry,
    SharedlinksApi, Version,
    VersionEntry,
    VersionsApi
} from "@alfresco/js-api";
import { AlfrescoApiService, LogService, UploadService } from "../../services";
import { MatDialog } from "@angular/material/dialog";
import { filter, takeUntil } from "rxjs/operators";
import { FileModel } from "../../models";
import { Subject } from "rxjs";
import { RenditionViewerService } from "../services/rendition-viewer.service";
import { BaseEvent } from '../../events';

@Component({
    selector: 'adf-alfresco-viewer',
    templateUrl: './alfresco-viewer.component.html',
    styleUrls: ['./alfresco-viewer.component.scss'],
    host: {class: 'adf-viewer'},
    encapsulation: ViewEncapsulation.None,
    providers: [ViewUtilService]
})
export class AlfrescoViewerComponent {

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

    /** Emitted when the shared link used is not valid. */
    @Output()
    invalidSharedLink = new EventEmitter();

    /** Emitted when user clicks 'Navigate Before' ("<") button. */
    @Output()
    navigateBefore = new EventEmitter<MouseEvent | KeyboardEvent>();

    /** Emitted when user clicks 'Navigate Next' (">") button. */
    @Output()
    navigateNext = new EventEmitter<MouseEvent | KeyboardEvent>();

    /** Toggles right sidebar visibility. Requires `allowRightSidebar` to be set to `true`. */
    @Input()
    showRightSidebar = false;

    /** Toggles left sidebar visibility. Requires `allowLeftSidebar` to be set to `true`. */
    @Input()
    showLeftSidebar = false;

    private onDestroy$ = new Subject<boolean>();

    private cacheBusterNumber: number;
    private nodeEntry: NodeEntry;
     versionEntry: VersionEntry;
     isLoading: boolean;

    urlFileContent: string;

    _sharedLinksApi: SharedlinksApi;

     viewerType: any;
     fileName: string;
     fileExtension: any;
     mimeType: string;

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
                // private contentService: ContentService,
                private uploadService: UploadService,
                public dialog: MatDialog,
                private cdr: ChangeDetectorRef) {
        renditionViewerService.maxRetries = this.maxRetries;

    }

    onNavigateBeforeClick(event: MouseEvent | KeyboardEvent) {
        this.navigateBefore.next(event);
    }

    onNavigateNextClick(event: MouseEvent | KeyboardEvent) {
        this.navigateNext.next(event);
    }

    ngOnInit() {
        this.apiService.nodeUpdated.pipe(
            filter((node) => node && node.id === this.nodeId &&
                (node.name !== this.fileName ||
                    this.getNodeVersionProperty(this.nodeEntry.entry) !== this.getNodeVersionProperty(node))),
            takeUntil(this.onDestroy$)
        ).subscribe((node) => this.onNodeUpdated(node));
    }

    private onNodeUpdated(node: Node) {
        if (node && node.id === this.nodeId) {
            // this.cacheTypeForContent = 'no-cache';
            this.generateCacheBusterNumber();
            this.isLoading = true;
            this.setUpNodeFile(node).then(() => {
                this.isLoading = false;
            });
        }
    }

    private getNodeVersionProperty(node: Node): string {
        return node?.properties['cm:versionLabel'] ?? '';
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
        this.nodesApi.getNode(this.nodeId, {include: ['allowableOperations']}).then(
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

    private async setUpNodeFile(nodeData: Node, versionData?: Version): Promise<void> {
        this.isLoading = true;

        // this.readOnly = !this.contentService.hasAllowableOperations(nodeData, 'update');

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
        }
        this.isLoading = false;

        // this.sidebarRightTemplateContext.node = nodeData;
        // this.sidebarLeftTemplateContext.node = nodeData;
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

    onPrintContent(event: BaseEvent<any>) {
        if (!event.defaultPrevented) {
            this.viewUtilService.printFileGeneric(this.nodeId, this.mimeType);
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

    onSubmitFile(newImageBlob: Blob) {
        if (this?.nodeEntry?.entry?.id) { // && !this.readOnly) {
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

    toggleSidebar() {
        this.showRightSidebar = !this.showRightSidebar;
        if (this.showRightSidebar && this.nodeId) {
            this.nodesApi.getNode(this.nodeId, { include: ['allowableOperations'] });
              //   .then((nodeEntry: NodeEntry) => {
              // //      this.sidebarRightTemplateContext.node = nodeEntry.entry;
              //   });
        }
    }

    toggleLeftSidebar() {
        this.showLeftSidebar = !this.showLeftSidebar;
        if (this.showRightSidebar && this.nodeId) {
            this.nodesApi.getNode(this.nodeId, { include: ['allowableOperations'] });
                // .then((nodeEntry: NodeEntry) => {
                //  //   this.sidebarLeftTemplateContext.node = nodeEntry.entry;
                // });
        }
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
    }

}
