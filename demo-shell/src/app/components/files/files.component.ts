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

import {
    Component, Input, OnInit, OnChanges, OnDestroy, Optional,
    EventEmitter, ViewChild, SimpleChanges, Output
} from '@angular/core';
import { Location } from '@angular/common';

import { MatDialog } from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MinimalNodeEntity, NodePaging, Pagination, MinimalNodeEntryEntity, SiteEntry } from 'alfresco-js-api';
import {
    AlfrescoApiService, AuthenticationService, AppConfigService, AppConfigValues, ContentService, TranslationService,
    FileUploadEvent, FolderCreatedEvent, LogService, NotificationService,
    UploadService, DataColumn, DataRow, UserPreferencesService,
    PaginationComponent, FormValues, DisplayMode, InfinitePaginationComponent
} from '@alfresco/adf-core';

import {
    DocumentListComponent,
    PermissionStyleModel,
    UploadFilesEvent,
    ConfirmDialogComponent
} from '@alfresco/adf-content-services';

import { SelectAppsDialogComponent } from '@alfresco/adf-process-services';

import { VersionManagerDialogAdapterComponent } from './version-manager-dialog-adapter.component';
import { MetadataDialogAdapterComponent } from './metadata-dialog-adapter.component';
import { Subscription } from 'rxjs';
import { PreviewService } from '../../services/preview.service';
import { debounceTime } from 'rxjs/operators';

const DEFAULT_FOLDER_TO_SHOW = '-my-';

@Component({
    selector: 'app-files-component',
    templateUrl: './files.component.html',
    styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit, OnChanges, OnDestroy {

    errorMessage: string = null;
    fileNodeId: any;
    showViewer = false;
    showVersions = false;
    allowDropFiles = true;
    displayMode = DisplayMode.List;
    includeFields = ['isFavorite', 'isLocked', 'aspectNames'];

    baseShareUrl = (
        this.appConfig.get<string>(AppConfigValues.BASESHAREURL) ||
        this.appConfig.get<string>(AppConfigValues.ECMHOST)) + '/preview/s/';

    toolbarColor = 'default';

    selectionModes = [
        { value: 'none', viewValue: 'None' },
        { value: 'single', viewValue: 'Single' },
        { value: 'multiple', viewValue: 'Multiple' }
    ];

    // The identifier of a node. You can also use one of these well-known aliases: -my- | -shared- | -root-
    @Input()
    currentFolderId: string = DEFAULT_FOLDER_TO_SHOW;

    formValues: FormValues = {};

    processId;

    @Input()
    sorting = ['name', 'asc'];

    @Input()
    sortingMode = 'client';

    @Input()
    showRecentFiles = true;

    @Input()
    showSitePicker = true;

    @Input()
    showSettingsPanel = true;

    @Input()
    showHeader = true;

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

    @ViewChild('documentList')
    documentList: DocumentListComponent;

    @ViewChild('standardPagination')
    standardPagination: PaginationComponent;

    @ViewChild(InfinitePaginationComponent)
    infinitePaginationComponent: InfinitePaginationComponent;

    permissionsStyle: PermissionStyleModel[] = [];
    infiniteScrolling: boolean;
    warnOnMultipleUploads = false;
    thumbnails = false;
    enableCustomPermissionMessage = false;
    enableMediumTimeFormat = false;
    displayEmptyMetadata = false;

    private onCreateFolder: Subscription;
    private onEditFolder: Subscription;

    constructor(private notificationService: NotificationService,
                private uploadService: UploadService,
                private contentService: ContentService,
                private dialog: MatDialog,
                private location: Location,
                private translateService: TranslationService,
                private router: Router,
                private logService: LogService,
                private appConfig: AppConfigService,
                private preference: UserPreferencesService,
                private preview: PreviewService,
                @Optional() private route: ActivatedRoute,
                public authenticationService: AuthenticationService,
                public alfrescoApiService: AlfrescoApiService) {

        this.alfrescoApiService.nodeUpdated.subscribe(() => {
            this.documentList.reload();
        });
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
            this.pagination = <Pagination> {
                maxItems: this.preference.paginationSize,
                skipCount: 0
            };
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

        // this.disableDragArea = false;
        this.uploadService.fileUploadComplete.asObservable()
            .pipe(debounceTime(300))
            .subscribe(value => this.onFileUploadEvent(value));
        this.uploadService.fileUploadDeleted.subscribe((value) => this.onFileUploadEvent(value));
        this.contentService.folderCreated.subscribe(value => this.onFolderCreated(value));
        this.onCreateFolder = this.contentService.folderCreate.subscribe(value => this.onFolderAction(value));
        this.onEditFolder = this.contentService.folderEdit.subscribe(value => this.onFolderAction(value));

        // this.permissionsStyle.push(new PermissionStyleModel('document-list__create', PermissionsEnum.CREATE));
        // this.permissionsStyle.push(new PermissionStyleModel('document-list__disable', PermissionsEnum.NOT_CREATE, false, true));
    }

    ngOnDestroy() {
        this.onCreateFolder.unsubscribe();
        this.onEditFolder.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.nodeResult && changes.nodeResult.currentValue) {
            this.nodeResult = <NodePaging> changes.nodeResult.currentValue;
            this.pagination = this.nodeResult.list.pagination;
        }
        if (!this.pagination) {
            this.giveDefaultPaginationWhenNotDefined();
        }
    }

    giveDefaultPaginationWhenNotDefined() {
        this.pagination = <Pagination> {
            maxItems: this.preference.paginationSize,
            skipCount: 0,
            totalItems: 0,
            hasMoreItems: false
        };
    }

    getCurrentDocumentListNode(): MinimalNodeEntity[] {
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

    onFileUploadEvent(event: FileUploadEvent) {
        if (event && event.file.options.parentId === this.documentList.currentFolderId) {
            this.documentList.reload();
        }
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
        this.router.navigate(['/files', $event.value.id, 'display', this.displayMode]);
    }

    handlePermissionError(event: any) {
        this.translateService.get('PERMISSION.LACKOF', {
            permission: event.permission,
            action: event.action,
            type: event.type
        }).subscribe((message) => {
            this.openSnackMessage(message);
        });
    }

    openSnackMessage(event: any) {
        this.notificationService.openSnackMessage(
            event,
            6000
        );
    }

    emitReadyEvent(event: NodePaging) {
        this.documentListReady.emit(event);
    }

    pageIsEmpty(node: NodePaging) {
        return node && node.list && node.list.entries.length === 0;
    }

    onContentActionError(errors) {
        const errorStatusCode = JSON.parse(errors.message).error.statusCode;
        let translatedErrorMessage: any;

        switch (errorStatusCode) {
            case 403:
                translatedErrorMessage = this.translateService.get('OPERATION.ERROR.PERMISSION');
                break;
            case 409:
                translatedErrorMessage = this.translateService.get('OPERATION.ERROR.CONFLICT');
                break;
            default:
                translatedErrorMessage = this.translateService.get('OPERATION.ERROR.UNKNOWN');
        }

        this.openSnackMessage(translatedErrorMessage.value);
    }

    onContentActionSuccess(message) {
        const translatedMessage: any = this.translateService.get(message);
        this.openSnackMessage(translatedMessage.value);
        this.documentList.reload();
    }

    onDeleteActionSuccess(message) {
        this.uploadService.fileDeleted.next(message);
        this.deleteElementSuccess.emit();
        this.documentList.reload();
        this.openSnackMessage(message);
    }

    onPermissionRequested(node) {
        this.router.navigate(['/permissions', node.value.entry.id]);
    }

    onManageVersions(event) {
        const contentEntry = event.value.entry;
        const showComments = this.showVersionComments;
        const allowDownload = this.allowVersionDownload;

        if (this.contentService.hasPermission(contentEntry, 'update')) {
            this.dialog.open(VersionManagerDialogAdapterComponent, {
                data: { contentEntry: contentEntry, showComments: showComments, allowDownload: allowDownload },
                panelClass: 'adf-version-manager-dialog',
                width: '630px'
            });
        } else {
            const translatedErrorMessage: any = this.translateService.get('OPERATION.ERROR.PERMISSION');
            this.openSnackMessage(translatedErrorMessage.value);
        }
    }

    onManageMetadata(event) {
        const contentEntry = event.value.entry;

        if (this.contentService.hasPermission(contentEntry, 'update')) {
            this.dialog.open(MetadataDialogAdapterComponent, {
                data: {
                    contentEntry: contentEntry,
                    displayEmptyMetadata: this.displayEmptyMetadata
                },
                panelClass: 'adf-metadata-manager-dialog',
                width: '630px'
            });
        } else {
            const translatedErrorMessage: any = this.translateService.get('OPERATION.ERROR.PERMISSION');
            this.openSnackMessage(translatedErrorMessage.value);
        }
    }

    onSiteChange(site: SiteEntry) {
        this.currentFolderId = site.entry.guid;
    }

    getDocumentListCurrentFolderId() {
        return this.documentList.currentFolderId || DEFAULT_FOLDER_TO_SHOW;
    }

    hasSelection(selection: Array<MinimalNodeEntity>): boolean {
        return selection && selection.length > 0;
    }

    hasOneFileSelected(): boolean {
        const selection: Array<MinimalNodeEntity> = this.documentList.selection;
        return selection && selection.length === 1 && selection[0].entry.isFile;
    }

    userHasPermissionToManageVersions(): boolean {
        const selection: Array<MinimalNodeEntity> = this.documentList.selection;
        return this.contentService.hasPermission(selection[0].entry, 'update');
    }

    getNodeNameTooltip(row: DataRow, col: DataColumn): string {
        if (row) {
            return row.getValue('name');
        }
        return null;
    }

    canEditFolder(selection: Array<MinimalNodeEntity>): boolean {
        if (selection && selection.length === 1) {
            const entry = selection[0].entry;

            if (entry && entry.isFolder) {
                return this.contentService.hasPermission(entry, 'update');
            }
        }
        return false;
    }

    canCreateContent(parentNode: MinimalNodeEntryEntity): boolean {
        if (parentNode) {
            return this.contentService.hasPermission(parentNode, 'create');
        }
        return false;
    }

    startProcessAction($event) {
        this.formValues['file'] = $event.value.entry;

        const dialogRef = this.dialog.open(SelectAppsDialogComponent, {
            width: '630px',
            panelClass: 'adf-version-manager-dialog'
        });

        dialogRef.afterClosed().subscribe(selectedProcess => {
            this.processId = selectedProcess.id;
        });

    }

    closeStartProcess() {
        this.processId = null;
    }

    onChangePageSize(event: Pagination): void {
        this.preference.paginationSize = event.maxItems;
        this.changedPageSize.emit(event);
    }

    onChangePageNumber(event: Pagination): void {
        this.changedPageNumber.emit(event);
    }

    onNextPage(event: Pagination): void {
        this.turnedNextPage.emit(event);
    }

    loadNextBatch(event: Pagination): void {
        this.loadNext.emit(event);
    }

    onPrevPage(event: Pagination): void {
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
        this.documentList.reload();
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

                dialogRef.afterClosed().subscribe(result => {
                    if (result === true) {
                        event.resumeUpload();
                    }
                });
            }
        }
    }

    isCustomActionDisabled(node: MinimalNodeEntity): boolean {
        if (node && node.entry && node.entry.name === 'custom') {
            return false;
        }
        return true;
    }

    runCustomAction(event) {
        this.logService.log(event);
    }

    getFileFiltering() {
        return this.acceptedFilesTypeShow ? this.acceptedFilesType : '*';
    }
}
