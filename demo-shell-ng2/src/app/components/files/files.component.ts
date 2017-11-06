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

import { Component, Input, OnInit, OnChanges, OnDestroy, ChangeDetectorRef,
        EventEmitter, Optional, ViewChild, SimpleChanges, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MinimalNodeEntity, NodePaging } from 'alfresco-js-api';
import {
    AlfrescoApiService, AlfrescoContentService, AlfrescoTranslationService,
    DownloadZipDialogComponent, FileUploadEvent, FolderCreatedEvent, LogService, NotificationService,
    SiteModel, UploadService
} from 'ng2-alfresco-core';
import { DataColumn, DataRow } from 'ng2-alfresco-datatable';
import { DocumentListComponent, PermissionStyleModel } from 'ng2-alfresco-documentlist';
import { VersionManagerDialogAdapterComponent } from './version-manager-dialog-adapter.component';
import { Subscription } from 'rxjs/Rx';

const DEFAULT_FOLDER_TO_SHOW = '-my-';

@Component({
    selector: 'adf-files-component',
    templateUrl: './files.component.html',
    styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit, OnChanges, OnDestroy {

    errorMessage: string = null;
    fileNodeId: any;
    showViewer: boolean = false;
    showVersions: boolean = false;

    toolbarColor = 'default';

    selectionModes = [
        { value: 'none', viewValue: 'None' },
        { value: 'single', viewValue: 'Single' },
        { value: 'multiple', viewValue: 'Multiple' }
    ];

    @Input()
    // The identifier of a node. You can also use one of these well-known aliases: -my- | -shared- | -root-
    currentFolderId: string = DEFAULT_FOLDER_TO_SHOW;

    @Input()
    selectionMode = 'multiple';

    @Input()
    multiselect = false;

    @Input()
    multipleFileUpload: boolean = false;

    @Input()
    folderUpload: boolean = false;

    @Input()
    acceptedFilesTypeShow: boolean = false;

    @Input()
    maxSizeShow: boolean = false;

    @Input()
    versioning: boolean = false;

    @Input()
    acceptedFilesType: string = '.jpg,.pdf,.js';

    @Input()
    maxFilesSize: number = null;

    @Input()
    enableUpload: boolean = true;

    @Input()
    nodeResult: NodePaging;

    @Output()
    documentListReady: EventEmitter<any> = new EventEmitter();

    @ViewChild(DocumentListComponent)
    documentList: DocumentListComponent;

    permissionsStyle: PermissionStyleModel[] = [];

    private onCreateFolder: Subscription;
    private onEditFolder: Subscription;

    constructor(private changeDetector: ChangeDetectorRef,
                private apiService: AlfrescoApiService,
                private notificationService: NotificationService,
                private uploadService: UploadService,
                private contentService: AlfrescoContentService,
                private dialog: MatDialog,
                private translateService: AlfrescoTranslationService,
                private router: Router,
                @Optional() private route: ActivatedRoute,
                private logService: LogService) {
    }

    showFile(event) {
        const entry = event.value.entry;
        if (entry && entry.isFile) {
            this.router.navigate(['/files', entry.id, 'view']);
        }
    }

    onFolderChange($event) {
        this.currentFolderId = $event.value.id;
        this.router.navigate(['/files', $event.value.id]);
    }

    toggleFolder() {
        this.multipleFileUpload = false;
        this.folderUpload = !this.folderUpload;
        return this.folderUpload;
    }

    ngOnInit() {
        if (this.route) {
            this.route.params.forEach((params: Params) => {
                if (params['id']) {
                    this.currentFolderId = params['id'];
                    this.changeDetector.detectChanges();
                }
            });
        }

        this.uploadService.fileUploadComplete.asObservable().debounceTime(300).subscribe(value => this.onFileUploadEvent(value));
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
        }
    }

    getCurrentDocumentListNode(): MinimalNodeEntity[] {
        if (this.documentList.folderNode) {
            return [{ entry: this.documentList.folderNode }];
        } else {
            return [];
        }
    }

    onNavigationError(err: any) {
        if (err) {
            this.errorMessage = err.message || 'Navigation error';
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

    handlePermissionError(event: any) {
        this.translateService.get('OPERATION.ERROR.NO_PERMISSION_EVENT', {
            permission: event.permission,
            action: event.action,
            type: event.type
        }).subscribe((message) => {
            this.notificationService.openSnackMessage(
                message,
                4000
            );
        })
    }

    handleUploadError(event: any) {
        this.notificationService.openSnackMessage(
            event,
            4000
        );
    }

    emitReadyEvent(event: any) {
        this.documentListReady.emit(event);
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

        this.notificationService.openSnackMessage(translatedErrorMessage.value, 4000);
    }

    onContentActionSuccess(message) {
        let translatedMessage: any = this.translateService.get(message);
        this.notificationService.openSnackMessage(translatedMessage.value, 4000);
    }

    onDeleteActionSuccess(message) {
        this.uploadService.fileDeleted.next(message);
    }

    onManageVersions(event) {
        const contentEntry = event.value.entry;

        if (this.contentService.hasPermission(contentEntry, 'update')) {
            this.dialog.open(VersionManagerDialogAdapterComponent, {
                data: { contentEntry },
                panelClass: 'adf-version-manager-dialog',
                width: '630px'
            });
        } else {
            const translatedErrorMessage: any = this.translateService.get('OPERATION.ERROR.PERMISSION');
            this.notificationService.openSnackMessage(translatedErrorMessage.value, 4000);
        }
    }

    getSiteContent(site: SiteModel) {
        this.currentFolderId = site && site.guid ? site.guid : DEFAULT_FOLDER_TO_SHOW;
    }

    getDocumentListCurrentFolderId() {
        return this.documentList.currentFolderId || DEFAULT_FOLDER_TO_SHOW;
    }

    hasSelection(selection: Array<MinimalNodeEntity>): boolean {
        return selection && selection.length > 0;
    }

    hasOneFileSelected(): boolean {
        const selection: Array<MinimalNodeEntity> = this.documentList.selection;
        const hasOneFileSelected = selection && selection.length === 1 && selection[0].entry.isFile;
        return hasOneFileSelected;
    }

    userHasPermissionToManageVersions(): boolean {
        const selection: Array<MinimalNodeEntity> = this.documentList.selection;
        return this.contentService.hasPermission(selection[0].entry, 'update');
    }

    downloadNodes(selection: Array<MinimalNodeEntity>) {
        if (!selection || selection.length === 0) {
            return;
        }

        if (selection.length === 1) {
            this.downloadNode(selection[0]);
        } else {
            this.downloadZip(selection);
        }
    }

    downloadNode(node: MinimalNodeEntity) {
        if (node && node.entry) {
            const entry = node.entry;

            if (entry.isFile) {
                this.downloadFile(node);
            }

            if (entry.isFolder) {
                this.downloadZip([node]);
            }
        }
    }

    downloadFile(node: MinimalNodeEntity) {
        if (node && node.entry) {
            const contentApi = this.apiService.getInstance().content;

            const url = contentApi.getContentUrl(node.entry.id, true);
            const fileName = node.entry.name;

            this.download(url, fileName);
        }
    }

    downloadZip(selection: Array<MinimalNodeEntity>) {
        if (selection && selection.length > 0) {
            const nodeIds = selection.map(node => node.entry.id);

            const dialogRef = this.dialog.open(DownloadZipDialogComponent, {
                width: '600px',
                data: {
                    nodeIds: nodeIds
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                this.logService.log(result);
            });
        }
    }

    download(url: string, fileName: string) {
        if (url && fileName) {
            const link = document.createElement('a');

            link.style.display = 'none';
            link.download = fileName;
            link.href = url;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
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
}
