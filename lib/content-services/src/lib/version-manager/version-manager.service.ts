import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlfrescoApiService, ContentService, NotificationService } from '@alfresco/adf-core';

import { VersionManagerData, UploadNewVersionDialogComponent, UploadNewVersionDialogData } from './upload-new-version.dialog';
import { VersionPaging, VersionsApi } from '@alfresco/js-api';

@Injectable({
    providedIn: 'root'
})
export class VersionManagerService {

    _versionsApi: VersionsApi;
    get versionsApi(): VersionsApi {
        this._versionsApi = this._versionsApi ?? new VersionsApi(this.apiService.getInstance());
        return this._versionsApi;
    }

    constructor(
        private contentService: ContentService,
        private notificationService: NotificationService,
        private apiService: AlfrescoApiService,
        private dialog: MatDialog
    ) { }

    openUploadNewVersionDialog(event: UploadNewVersionDialogData) {
        const { file, node } = event;
        const showComments = true;
        const allowDownload = true;

        return new Promise((resolve)=> {
            if (this.contentService.hasAllowableOperations(node, 'update')) {
                this.versionsApi.listVersionHistory(node.id).then((versionPaging: VersionPaging) => {
                    const dialogRef = this.dialog.open(UploadNewVersionDialogComponent, {
                        data: { file, node, currentVersion: versionPaging.list.entries[0].entry, showComments, allowDownload },
                        panelClass: 'adf-version-manager-dialog',
                        width: '630px'
                    });
                    dialogRef.componentInstance.uploadedNewVersion.subscribe( (newVersionData: VersionManagerData) =>{
                        resolve(newVersionData);
                    });
                });
            } else {
                this.notificationService.showError('OPERATION.ERROR.PERMISSION');
            }
        });

    }
}
