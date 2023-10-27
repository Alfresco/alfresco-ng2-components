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
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NodeEntry, NodePaging, Pagination, Node, SearchEntry } from '@alfresco/js-api';
import {
    NotificationService,
    UserPreferencesService,
    PaginationComponent,
    DisplayMode,
    ShowHeaderMode,
    FormRenderingService
} from '@alfresco/adf-core';
import {
    ContentService,
    FolderCreatedEvent,
    UploadService,
    DocumentListComponent,
    PermissionStyleModel,
    ContentMetadataService,
    FilterSearch,
    DialogAspectListService,
    FileUploadEvent,
    NodesApiService
} from '@alfresco/adf-content-services';
import { ProcessFormRenderingService } from '@alfresco/adf-process-services';
import { VersionManagerDialogAdapterComponent } from './version-manager-dialog-adapter.component';
import { Subject } from 'rxjs';
import { PreviewService } from '../../services/preview.service';
import { takeUntil, debounceTime, scan } from 'rxjs/operators';

const DEFAULT_FOLDER_TO_SHOW = '-my-';

@Component({
    selector: 'app-files-component',
    templateUrl: './files.component.html',
    styleUrls: ['./files.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [{ provide: FormRenderingService, useClass: ProcessFormRenderingService }]
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

    selectionModes = [
        { value: 'none', viewValue: 'None' },
        { value: 'single', viewValue: 'Single' },
        { value: 'multiple', viewValue: 'Multiple' }
    ];

    // The identifier of a node. You can also use one of these well-known aliases: -my- | -shared- | -root-
    @Input()
    currentFolderId: string = DEFAULT_FOLDER_TO_SHOW;

    @Input()
    sorting = ['name', 'ASC'];

    @Input()
    sortingMode: 'server' | 'client' = 'server';

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

    @ViewChild('documentList', { static: true })
    documentList: DocumentListComponent;

    @ViewChild('standardPagination')
    standardPagination: PaginationComponent;

    permissionsStyle: PermissionStyleModel[] = [];
    stickyHeader: boolean;
    enableMediumTimeFormat = false;
    displayEmptyMetadata = false;

    constructor(
        private notificationService: NotificationService,
        private uploadService: UploadService,
        private contentService: ContentService,
        private dialog: MatDialog,
        private router: Router,
        private preference: UserPreferencesService,
        private preview: PreviewService,
        @Optional() private route: ActivatedRoute,
        private contentMetadataService: ContentMetadataService,
        private dialogAspectListService: DialogAspectListService,
        private nodeService: NodesApiService
    ) {}

    showFile(event) {
        const entry = event.value.entry;
        if (entry?.isFile) {
            this.preview.showResource(entry.id);
        }
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
                this.onFileUploadEvent(value[0]);
            });

        this.uploadService.fileUploadDeleted.pipe(takeUntil(this.onDestroy$)).subscribe((value) => this.onFileUploadEvent(value));

        this.contentService.folderCreated.pipe(takeUntil(this.onDestroy$)).subscribe((value) => this.onFolderCreated(value));

        this.contentService.folderCreate.pipe(takeUntil(this.onDestroy$)).subscribe((value) => this.onFolderAction(value));

        this.contentService.folderEdit.pipe(takeUntil(this.onDestroy$)).subscribe((value) => this.onFolderAction(value));

        this.contentMetadataService.error.pipe(takeUntil(this.onDestroy$)).subscribe((err: { message: string }) => {
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
        if (changes.nodeResult?.currentValue) {
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

    getCurrentDocumentListNode(): NodeEntry[] {
        if (this.documentList.folderNode) {
            return [{ entry: this.documentList.folderNode }];
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
        if (event && event.parentId === this.documentList.currentFolderId) {
            this.documentList.reload();
        }
    }

    onFolderAction(node) {
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
        const showComments = true;
        const allowDownload = this.allowVersionDownload;

        if (this.contentService.hasAllowableOperations(contentEntry, 'update')) {
            this.dialog.open(VersionManagerDialogAdapterComponent, {
                data: { contentEntry, showComments, allowDownload },
                panelClass: 'adf-version-manager-dialog',
                width: '630px'
            });
        } else {
            this.openSnackMessageError('OPERATION.ERROR.PERMISSION');
        }
    }

    onAspectUpdate(event: any) {
        this.dialogAspectListService.openAspectListDialog(event.value.entry.id).subscribe((aspectList) => {
            this.nodeService.updateNode(event.value.entry.id, { aspectNames: [...aspectList] }).subscribe(() => {
                this.openSnackMessageInfo('Node Aspects Updated');
            });
        });
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

    canEditFolder(selection: Array<NodeEntry>): boolean {
        if (selection && selection.length === 1) {
            const entry = selection[0].entry;

            if (entry?.isFolder) {
                return this.contentService.hasAllowableOperations(entry, 'update');
            }
        }
        return false;
    }

    canCreateContent(parentNode: Node): boolean {
        if (parentNode) {
            return this.contentService.hasAllowableOperations(parentNode, 'create');
        }
        return false;
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

    onPrevPage(event: Pagination): void {
        this.pagination.maxItems = event.maxItems;
        this.pagination.skipCount = event.skipCount;
        this.turnedPreviousPage.emit(event);
    }

    onUploadNewVersion(ev) {
        const contentEntry = ev.detail.data.node.entry;
        const showComments = true;
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

    searchResultsHighlight(search: SearchEntry): string {
        if (search?.highlight) {
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
            if (filter.value?.from && filter.value.to) {
                paramValue = `${filter.value.from}||${filter.value.to}`;
            } else {
                paramValue = filter.value;
            }
            objectFromMap[filter.key] = paramValue;
        });

        this.router.navigate([], { relativeTo: this.route, queryParams: objectFromMap });
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
}
