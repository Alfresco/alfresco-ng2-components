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

import { ChangeDetectorRef, Component, Input, OnInit, Optional, ViewChild } from '@angular/core';
import { MdDialog } from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MinimalNodeEntity } from 'alfresco-js-api';
import {
    AlfrescoApiService, AlfrescoContentService, AlfrescoTranslationService, CreateFolderDialogComponent,
    DownloadZipDialogComponent, FileUploadEvent, FolderCreatedEvent, NotificationService,
    SiteModel, UploadService
} from 'ng2-alfresco-core';
import { DataColumn, DataRow } from 'ng2-alfresco-datatable';
import { DocumentListComponent, PermissionStyleModel } from 'ng2-alfresco-documentlist';

import { ViewerService } from 'ng2-alfresco-viewer';

@Component({
    selector: 'adf-files-component',
    templateUrl: './files.component.html',
    styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {
    // The identifier of a node. You can also use one of these well-known aliases: -my- | -shared- | -root-
    currentFolderId: string = '-my-';

    errorMessage: string = null;
    fileNodeId: any;
    showViewer: boolean = false;

    toolbarColor = 'default';
    useDropdownBreadcrumb = false;
    useViewerDialog = true;
    useInlineViewer = false;

    selectionModes = [
        { value: 'none', viewValue: 'None' },
        { value: 'single', viewValue: 'Single' },
        { value: 'multiple', viewValue: 'Multiple' }
    ];

    @Input()
    selectionMode = 'multiple';

    @Input()
    multiselect = false;

    @Input()
    multipleFileUpload: boolean = false;

    @Input()
    disableWithNoPermission: boolean = false;

    @Input()
    folderUpload: boolean = false;

    @Input()
    acceptedFilesTypeShow: boolean = false;

    @Input()
    versioning: boolean = false;

    @Input()
    acceptedFilesType: string = '.jpg,.pdf,.js';

    @Input()
    enableUpload: boolean = true;

    @ViewChild(DocumentListComponent)
    documentList: DocumentListComponent;

    permissionsStyle: PermissionStyleModel[] = [];

    constructor(private changeDetector: ChangeDetectorRef,
                private apiService: AlfrescoApiService,
                private notificationService: NotificationService,
                private uploadService: UploadService,
                private contentService: AlfrescoContentService,
                private dialog: MdDialog,
                private translateService: AlfrescoTranslationService,
                private viewerService: ViewerService,
                private router: Router,
                @Optional() private route: ActivatedRoute) {
    }

    showFile(event) {
        if (this.useViewerDialog) {
            if (event.value.entry.isFile) {
                this.viewerService
                    .showViewerForNode(event.value.entry)
                    .then(result => {
                        console.log(result);
                    });
            }
        } else {
            if (event.value.entry.isFile) {
                this.fileNodeId = event.value.entry.id;
                this.showViewer = true;
            } else {
                this.showViewer = false;
            }
        }
    }

    onFolderChange($event) {
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

        this.uploadService.fileUploadComplete.debounceTime(300).subscribe(value => this.onFileUploadEvent(value));
        this.uploadService.fileUploadDeleted.subscribe((value) => this.onFileUploadEvent(value));
        this.contentService.folderCreated.subscribe(value => this.onFolderCreated(value));

        // this.permissionsStyle.push(new PermissionStyleModel('document-list__create', PermissionsEnum.CREATE));
        // this.permissionsStyle.push(new PermissionStyleModel('document-list__disable', PermissionsEnum.NOT_CREATE, false, true));
    }

    getCurrentDocumentListNode(): MinimalNodeEntity[] {
        if (this.documentList.folderNode) {
            return [ { entry: this.documentList.folderNode } ];
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
        console.log('FOLDER CREATED');
        console.log(event);
        if (event && event.parentId === this.documentList.currentFolderId) {
            this.documentList.reload();
        }
    }

    handlePermissionError(event: any) {
        this.notificationService.openSnackMessage(
            `You don't have the ${event.permission} permission to ${event.action} the ${event.type} `,
            4000
        );
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

    onCreateFolderClicked(event: Event) {
        let dialogRef = this.dialog.open(CreateFolderDialogComponent);
        dialogRef.afterClosed().subscribe(folderName => {
            if (folderName) {
                this.contentService.createFolder('', folderName, this.documentList.currentFolderId).subscribe(
                    node => console.log(node),
                    err => console.log(err)
                );
            }
        });
    }

    getSiteContent(site: SiteModel) {
        this.currentFolderId = site && site.guid ? site.guid : '-my-';
    }

    hasSelection(selection: Array<MinimalNodeEntity>): boolean {
        return selection && selection.length > 0;
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
                console.log(result);
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
}
