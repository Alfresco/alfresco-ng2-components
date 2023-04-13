/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
    Component,
    Input,
    OnInit,
    OnChanges,
    OnDestroy,
    Optional,
    EventEmitter,
    ViewChild,
    SimpleChanges,
    Output,
    ViewEncapsulation
} from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
    MinimalNodeEntity,
    NodePaging,
    Pagination,
    MinimalNodeEntryEntity,
    SiteEntry,
    SearchEntry,
    NodeEntry
} from '@alfresco/js-api';
import {
    AlfrescoApiService,
    AuthenticationService,
    AppConfigService,
    AppConfigValues,
    LogService,
    NotificationService,
    DataRow,
    UserPreferencesService,
    PaginationComponent,
    FormValues,
    DisplayMode,
    ShowHeaderMode,
    InfinitePaginationComponent,
    FormRenderingService
} from '@alfresco/adf-core';

import {
    ContentService,
    FolderCreatedEvent,
    UploadService,
    DocumentListComponent,
    PermissionStyleModel,
    UploadFilesEvent,
    ConfirmDialogComponent,
    LibraryDialogComponent,
    ContentMetadataService,
    FilterSearch,
    DialogAspectListService,
    FileUploadEvent,
    NodesApiService,
    SharedLinksApiService
} from '@alfresco/adf-content-services';

import { SelectAppsDialogComponent, ProcessFormRenderingService } from '@alfresco/adf-process-services';

import { VersionManagerDialogAdapterComponent } from './version-manager-dialog-adapter.component';
import { MetadataDialogAdapterComponent } from './metadata-dialog-adapter.component';
import { Subject } from 'rxjs';
import { PreviewService } from '../../services/preview.service';
import { takeUntil, debounceTime, scan } from 'rxjs/operators';
import { ThemePalette } from '@angular/material/core';

const DEFAULT_FOLDER_TO_SHOW = '-my-';

@Component({
    selector: 'app-files-component',
    templateUrl: './files.component.html',
    styleUrls: ['./files.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {provide: FormRenderingService, useClass: ProcessFormRenderingService}
    ]
})
export class FilesComponent implements OnInit, OnChanges, OnDestroy {

    protected onDestroy$ = new Subject<boolean>();

    errorMessage: string = null;
    nodeId: any;
    showViewer = false;
    showVersions = false;
    allowDropFiles = true;
    displayMode = DisplayMode.List;
    includeFields = ['isFavorite', 'isLocked', 'aspectNames', 'definition'];

    baseShareUrl = (
        this.appConfig.get<string>(AppConfigValues.BASESHAREURL) ||
        this.appConfig.get<string>(AppConfigValues.ECMHOST)) + '/preview/s/';

    toolbarColor: ThemePalette;

    selectionModes = [
        {value: 'none', viewValue: 'None'},
        {value: 'single', viewValue: 'Single'},
        {value: 'multiple', viewValue: 'Multiple'}
    ];

    // The identifier of a node. You can also use one of these well-known aliases: -my- | -shared- | -root-
    @Input()
    currentFolderId: string = DEFAULT_FOLDER_TO_SHOW;

    formValues: FormValues = {};

    processId;

    @Input()
    sorting = ['name', 'ASC'];

    @Input()
    sortingMode: 'server' | 'client' = 'server';

    @Input()
    showRecentFiles = true;

    @Input()
    showSitePicker = true;

    @Input()
    showSettingsPanel = true;

    @Input()
    showHeader = ShowHeaderMode.Always;

    @Input()
    selectionMode = 'multiple';

    @Input()
    multiselect = false;

    @Input()
    multipleFileUpload = false;

    @Input()
    folderUpload = false;

    @Input()
    acceptedFilesTypeShow = false;

    @Input()
    maxSizeShow = false;

    @Input()
    showVersionComments = true;

    @Input()
    versioning = false;

    @Input()
    allowVersionDownload = true;

    @Input()
    acceptedFilesType = '.jpg,.pdf,.js';

    @Input()
    maxFilesSize: number = null;

    @Input()
    enableUpload = true;

    @Input()
    nodeResult: NodePaging;

    @Input()
    pagination: Pagination;

    @Input()
    disableDragArea = false;

    @Input()
    showNameColumn = true;

    @Input()
    searchTerm = '';

    @Input()
    navigationRoute = '/files';

    @Input()
    headerFilters = false;

    @Input()
    paramValues: Map<any, any> = null;

    @Input()
    filterSorting: string = null;

    @Output()
    documentListReady: EventEmitter<any> = new EventEmitter();

    @Output()
    changedPageSize: EventEmitter<Pagination> = new EventEmitter();

    @Output()
    changedPageNumber: EventEmitter<Pagination> = new EventEmitter();

    @Output()
    turnedNextPage: EventEmitter<Pagination> = new EventEmitter();

    @Output()
    turnedPreviousPage: EventEmitter<Pagination> = new EventEmitter();

    @Output()
    loadNext: EventEmitter<Pagination> = new EventEmitter();

    @Output()
    deleteElementSuccess: EventEmitter<any> = new EventEmitter();

    @ViewChild('documentList', {static: true})
    documentList: DocumentListComponent;

    @ViewChild('standardPagination')
    standardPagination: PaginationComponent;

    @ViewChild(InfinitePaginationComponent, {static: true})
    infinitePaginationComponent: InfinitePaginationComponent;

    permissionsStyle: PermissionStyleModel[] = [];
    infiniteScrolling: boolean;
    stickyHeader: boolean;
    preselectNodes: boolean;
    warnOnMultipleUploads = false;
    thumbnails = false;
    noHeaderMode = ShowHeaderMode.Never;
    enableCustomPermissionMessage = false;
    enableMediumTimeFormat = false;
    displayEmptyMetadata = false;
    hyperlinkNavigation = false;

    selectedNodes = [];

    enableDownloadPrompt: boolean = this.appConfig.get('viewer.enableDownloadPrompt', false);
    enableDownloadPromptReminder: boolean = this.appConfig.get('viewer.enableDownloadPromptReminders', false);
    downloadPromptDelay = this.appConfig.get('viewer.downloadPromptDelay', 50);
    downloadPromptReminderDelay = this.appConfig.get('viewer.downloadPromptReminderDelay', 30);
    enableFileAutoDownload: boolean = this.appConfig.get('viewer.enableFileAutoDownload', true);
    fileAutoDownloadSizeThresholdInMB: number = this.appConfig.get('viewer.fileAutoDownloadSizeThresholdInMB', 15);

    constructor(private notificationService: NotificationService,
                private uploadService: UploadService,
                private contentService: ContentService,
                private dialog: MatDialog,
                private location: Location,
                private router: Router,
                private logService: LogService,
                private appConfig: AppConfigService,
                private preference: UserPreferencesService,
                private preview: PreviewService,
                @Optional() private route: ActivatedRoute,
                public authenticationService: AuthenticationService,
                public alfrescoApiService: AlfrescoApiService,
                private contentMetadataService: ContentMetadataService,
                private sharedLinksApiService: SharedLinksApiService,
                private dialogAspectListService: DialogAspectListService,
                private nodeService: NodesApiService) {
    }

    showFile(event) {
        const entry = event.value.entry;
        if (entry && entry.isFile) {
            this.preview.showResource(entry.id);
        }
    }

    toggleFolder() {
        this.multipleFileUpload = false;
        this.folderUpload = !this.folderUpload;
        return this.folderUpload;
    }

    toggleThumbnails() {
        this.thumbnails = !this.thumbnails;
        this.documentList.reload();
    }

    toggleAllowDropFiles() {
        this.allowDropFiles = !this.allowDropFiles;
        this.documentList.reload();
    }

    ngOnInit() {
        if (!this.pagination) {
            this.pagination = {
                maxItems: this.preference.paginationSize,
                skipCount: 0
            } as Pagination;
        }

        if (this.route) {
            this.route.params.forEach((params: Params) => {
                if (params['id'] && this.currentFolderId !== params['id']) {
                    this.currentFolderId = params['id'];
                }

                if (params['mode'] && params['mode'] === DisplayMode.Gallery) {
                    this.displayMode = DisplayMode.Gallery;
                }
            });
        }

        this.uploadService.fileUploadComplete
            .pipe(
                debounceTime(300),
                scan((files, currentFile) => [...files, currentFile], []),
                takeUntil(this.onDestroy$)
            )
            .subscribe((value: any[]) => {
                let selectedNodes: NodeEntry[] = [];

                if (this.preselectNodes) {
                    if (value && value.length > 0) {
                        if (this.selectionMode === 'single') {
                            selectedNodes = [...[value[value.length - 1]].map((uploadedFile) => uploadedFile.data)];
                        } else {
                            selectedNodes = [...value.map((uploadedFile) => uploadedFile.data)];
                        }
                        this.selectedNodes = [...selectedNodes];
                    }
                }

                this.onFileUploadEvent(value[0]);
            });

        this.uploadService.fileUploadDeleted
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(value => this.onFileUploadEvent(value));

        this.contentService.folderCreated
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(value => this.onFolderCreated(value));

        this.contentService.folderCreate
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(value => this.onFolderAction(value));

        this.contentService.folderEdit
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(value => this.onFolderAction(value));

        this.contentMetadataService.error
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((err: { message: string }) => {
                this.notificationService.showError(err.message);
            });

        this.sharedLinksApiService.error
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((err: { message: string }) => {
                this.notificationService.showError(err.message);
            });
    }

    onFileUploadEvent(event: FileUploadEvent) {
        if (event && event.file.options.parentId === this.documentList.currentFolderId) {
            this.documentList.reload();
        }
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.nodeResult && changes.nodeResult.currentValue) {
            this.nodeResult = changes.nodeResult.currentValue;
            this.pagination = this.nodeResult.list.pagination;
        }
        if (!this.pagination) {
            this.giveDefaultPaginationWhenNotDefined();
        }
    }

    giveDefaultPaginationWhenNotDefined() {
        this.pagination = {
            maxItems: this.preference.paginationSize,
            skipCount: 0,
            totalItems: 0,
            hasMoreItems: false
        } as Pagination;
    }

    getCurrentDocumentListNode(): MinimalNodeEntity[] {
        if (this.documentList.folderNode) {
            return [{entry: this.documentList.folderNode}];
        } else {
            return [];
        }
    }

    onNavigationError(error: any) {
        if (error) {
            this.router.navigate(['/error', error.status]);
        }
    }

    resetError() {
        this.errorMessage = null;
    }

    onFolderCreated(event: FolderCreatedEvent) {
        this.logService.log('FOLDER CREATED');
        this.logService.log(event);
        if (event && event.parentId === this.documentList.currentFolderId) {
            this.documentList.reload();
        }
    }

    onFolderAction(node) {
        this.logService.log(node);
        if (node && node.parentId === this.documentList.currentFolderId) {
            this.documentList.reload();
        }
    }

    onFolderChange($event) {
        this.router.navigate([this.navigationRoute, $event.value.id, 'display', this.displayMode]);
    }

    handlePermissionError(event: any) {
        this.notificationService.showError('PERMISSION.LACKOF', null, {
            permission: event.permission,
            action: event.action,
            type: event.type
        });
    }

    openSnackMessageError(error: any) {
        this.notificationService.showError(error.value || error);
    }

    openSnackMessageInfo(message: string) {
        this.notificationService.showInfo(message);
    }

    emitReadyEvent(event: NodePaging) {
        this.documentListReady.emit(event);
    }

    pageIsEmpty(node: NodePaging) {
        return node && node.list && node.list.entries.length === 0;
    }

    onContentActionError(errors: any) {
        const errorStatusCode = JSON.parse(errors.message).error.statusCode;
        let message: string;

        switch (errorStatusCode) {
            case 403:
                message = 'OPERATION.ERROR.PERMISSION';
                break;
            case 409:
                message = 'OPERATION.ERROR.CONFLICT';
                break;
            default:
                message = 'OPERATION.ERROR.UNKNOWN';
        }

        this.openSnackMessageError(message);
    }

    onContentActionSuccess(message: string) {
        this.openSnackMessageInfo(message);
        this.documentList.reload();
    }

    onDeleteActionSuccess(message: string) {
        this.uploadService.fileDeleted.next(message);
        this.deleteElementSuccess.emit();
        this.documentList.reload();
        this.openSnackMessageInfo(message);
    }

    onPermissionRequested(node: any) {
        this.router.navigate(['/permissions', node.value.entry.id]);
    }

    onManageVersions(event: any) {
        const contentEntry = event.value.entry;
        const showComments = this.showVersionComments;
        const allowDownload = this.allowVersionDownload;

        if (this.contentService.hasAllowableOperations(contentEntry, 'update')) {
            this.dialog.open(VersionManagerDialogAdapterComponent, {
                data: {contentEntry, showComments, allowDownload},
                panelClass: 'adf-version-manager-dialog',
                width: '630px'
            });
        } else {
            this.openSnackMessageError('OPERATION.ERROR.PERMISSION');
        }
    }

    onAspectUpdate(event: any) {
        this.dialogAspectListService.openAspectListDialog(event.value.entry.id).subscribe((aspectList) => {
            this.nodeService.updateNode(event.value.entry.id, {aspectNames: [...aspectList]}).subscribe(() => {
                this.openSnackMessageInfo('Node Aspects Updated');
            });
        });
    }

    onManageMetadata(event: any) {
        const contentEntry = event.value.entry;
        const displayEmptyMetadata = this.displayEmptyMetadata;

        if (this.contentService.hasAllowableOperations(contentEntry, 'update')) {
            this.dialog.open(MetadataDialogAdapterComponent, {
                data: {
                    contentEntry,
                    displayEmptyMetadata
                },
                panelClass: 'adf-metadata-manager-dialog',
                width: '630px'
            });
        } else {
            this.openSnackMessageError('OPERATION.ERROR.PERMISSION');
        }
    }

    onSiteChange(site: SiteEntry) {
        this.currentFolderId = site.entry.guid;
    }

    hasSelection(selection: Array<any>): boolean {
        return selection && selection.length > 0;
    }

    hasOneFileSelected(): boolean {
        const selection = this.documentList.selection;
        return selection && selection.length === 1 && selection[0].entry.isFile;
    }

    userHasPermissionToManageVersions(): boolean {
        const selection = this.documentList.selection;
        return this.contentService.hasAllowableOperations(selection[0].entry, 'update');
    }

    getNodeNameTooltip(row: DataRow): string {
        if (row) {
            return row.getValue('name');
        }
        return null;
    }

    canEditFolder(selection: Array<MinimalNodeEntity>): boolean {
        if (selection && selection.length === 1) {
            const entry = selection[0].entry;

            if (entry && entry.isFolder) {
                return this.contentService.hasAllowableOperations(entry, 'update');
            }
        }
        return false;
    }

    canCreateContent(parentNode: MinimalNodeEntryEntity): boolean {
        if (parentNode) {
            return this.contentService.hasAllowableOperations(parentNode, 'create');
        }
        return false;
    }

    startProcessAction($event: any) {
        this.formValues['file'] = $event.value.entry;

        const dialogRef = this.dialog.open(SelectAppsDialogComponent, {
            width: '630px',
            panelClass: 'adf-version-manager-dialog'
        });

        dialogRef.afterClosed().subscribe((selectedProcess) => {
            this.processId = selectedProcess.id;
        });

    }

    closeStartProcess() {
        this.processId = null;
    }

    onChangePageSize(event: Pagination): void {
        this.preference.paginationSize = event.maxItems;
        this.pagination.maxItems = event.maxItems;
        this.pagination.skipCount = event.skipCount;
        this.changedPageSize.emit(event);
    }

    onChangePageNumber(event: Pagination): void {
        this.pagination.maxItems = event.maxItems;
        this.pagination.skipCount = event.skipCount;
        this.changedPageNumber.emit(event);
    }

    onNextPage(event: Pagination): void {
        this.pagination.maxItems = event.maxItems;
        this.pagination.skipCount = event.skipCount;
        this.turnedNextPage.emit(event);
    }

    loadNextBatch(event: Pagination): void {
        this.pagination.maxItems = event.maxItems;
        this.pagination.skipCount = event.skipCount;
        this.loadNext.emit(event);
    }

    onPrevPage(event: Pagination): void {
        this.pagination.maxItems = event.maxItems;
        this.pagination.skipCount = event.skipCount;
        this.turnedPreviousPage.emit(event);
    }

    toggleGalleryView(): void {
        this.displayMode = this.displayMode === DisplayMode.List ? DisplayMode.Gallery : DisplayMode.List;
        const url = this
            .router
            .createUrlTree(['/files', this.currentFolderId, 'display', this.displayMode])
            .toString();

        this.location.go(url);
    }

    onInfiniteScrolling(): void {
        this.infiniteScrolling = !this.infiniteScrolling;
        this.infinitePaginationComponent.reset();
    }

    canDownloadNode(node: MinimalNodeEntity): boolean {
        return node && node.entry && node.entry.name === 'custom';
    }

    onBeginUpload(event: UploadFilesEvent) {
        if (this.warnOnMultipleUploads && event) {
            const files = event.files || [];
            if (files.length > 1) {
                event.pauseUpload();

                const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                    data: {
                        title: 'Upload',
                        message: `Are you sure you want to upload ${files.length} file(s)?`
                    },
                    minWidth: '250px'
                });

                dialogRef.afterClosed().subscribe((result) => {
                    if (result === true) {
                        event.resumeUpload();
                    }
                });
            }
        }
    }

    isCustomActionDisabled(node: MinimalNodeEntity): boolean {
        return !(node && node.entry && node.entry.name === 'custom');
    }

    runCustomAction(event: any) {
        this.logService.log(event);
    }

    onUploadNewVersion(ev) {
        const contentEntry = ev.detail.data.node.entry;
        const showComments = this.showVersionComments;
        const allowDownload = this.allowVersionDownload;
        const newFileVersion = ev.detail.files[0].file;

        if (this.contentService.hasAllowableOperations(contentEntry, 'update')) {
            this.dialog.open(VersionManagerDialogAdapterComponent, {
                data: {
                    contentEntry,
                    showComments,
                    allowDownload,
                    newFileVersion,
                    showComparison: true
                },
                panelClass: 'adf-version-manager-dialog',
                width: '630px'
            });
        } else {
            this.openSnackMessageError('OPERATION.ERROR.PERMISSION');
        }
    }

    getFileFiltering(): string {
        return this.acceptedFilesTypeShow ? this.acceptedFilesType : '*';
    }

    createLibrary(): void {
        const dialogInstance: any = this.dialog.open(LibraryDialogComponent, {
            width: '400px'
        });

        dialogInstance.componentInstance.error.subscribe((message: string) => {
            this.notificationService.openSnackMessage(message);
        });
    }

    searchResultsHighlight(search: SearchEntry): string {
        if (search && search.highlight) {
            return search.highlight.map((currentHighlight) => currentHighlight.snippets).join(', ');
        }
        return '';
    }

    onFilterSelected(activeFilters: FilterSearch[]) {
        if (activeFilters.length) {
            this.navigateToFilter(activeFilters);
        } else {
            this.clearFilterNavigation();
        }
    }

    navigateToFilter(activeFilters: FilterSearch[]) {
        const objectFromMap = {};
        activeFilters.forEach((filter: FilterSearch) => {
            let paramValue = null;
            if (filter.value && filter.value.from && filter.value.to) {
                paramValue = `${filter.value.from}||${filter.value.to}`;
            } else {
                paramValue = filter.value;
            }
            objectFromMap[filter.key] = paramValue;
        });

        this.router.navigate([], {relativeTo: this.route, queryParams: objectFromMap});
    }

    clearFilterNavigation() {
        this.documentList.node = null;
        if (this.currentFolderId === '-my-') {
            this.router.navigate([this.navigationRoute, '']);
        } else {
            this.router.navigate([this.navigationRoute, this.currentFolderId, 'display', this.displayMode]);
        }
        this.documentList.reload();
    }

    setPreselectNodes(nodes: string) {
        this.selectedNodes = this.getArrayFromString(nodes);
        this.documentList.reload();
    }

    isStringArray(str: string): boolean {
        try {
            const result = JSON.parse(str);
            return Array.isArray(result);
        } catch (e) {
            return false;
        }
    }

    private getArrayFromString<T = any>(value: string): T[] {
        if (this.isStringArray(value)) {
            return JSON.parse(value);
        } else {
            return [];
        }
    }

    onMultipleFilesUpload() {
        this.selectedNodes = [];
    }

    onEnableDownloadPrompt() {
        const previewConfig = this.appConfig?.config['viewer'];
        previewConfig['enableDownloadPrompt'] = this.enableDownloadPrompt;
    }

    onDownloadPromptDelayChange() {
        const previewConfig = this.appConfig?.config['viewer'];
        previewConfig['downloadPromptDelay'] = this.downloadPromptDelay;
    }

    onEnableDownloadPromptReminderChange() {
        const previewConfig = this.appConfig?.config['viewer'];
        previewConfig['enableDownloadPromptReminder'] = this.enableDownloadPromptReminder;
    }

    onDownloadPromptReminderChange() {
        const previewConfig = this.appConfig?.config['viewer'];
        previewConfig['downloadPromptReminderDelay'] = this.downloadPromptReminderDelay;
    }

    onEnableFileAutoDownloadChange() {
        const previewConfig = this.appConfig?.config['viewer'];
        previewConfig['enableFileAutoDownload'] = this.enableFileAutoDownload;
    }

    onFileAutoDownloadSizeThresholdChange() {
        const previewConfig = this.appConfig?.config['viewer'];
        previewConfig['fileAutoDownloadSizeThresholdInMB'] = this.fileAutoDownloadSizeThresholdInMB;
    }

}
