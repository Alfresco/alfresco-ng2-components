import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlfrescoApiService, ContentService } from '@alfresco/adf-core';

import { NewVersionUploaderData, NewVersionUploaderDialogComponent, NewVersionUploaderDialogData } from './new-version-uploader.dialog';
import { VersionPaging, VersionsApi } from '@alfresco/js-api';

@Injectable({
    providedIn: 'root'
})
export class NewVersionUploaderService {

    _versionsApi: VersionsApi;
    get versionsApi(): VersionsApi {
        this._versionsApi = this._versionsApi ?? new VersionsApi(this.apiService.getInstance());
        return this._versionsApi;
    }

    constructor(
        private contentService: ContentService,
        private apiService: AlfrescoApiService,
        private dialog: MatDialog
    ) { }

    openUploadNewVersionDialog(event: NewVersionUploaderDialogData) {
        const { file, node } = event;
        const showComments = true;
        const allowDownload = true;

        return new Promise((resolve, reject)=> {
            if (this.contentService.hasAllowableOperations(node, 'update')) {
                this.versionsApi.listVersionHistory(node.id).then((versionPaging: VersionPaging) => {
                    const dialogRef = this.dialog.open(NewVersionUploaderDialogComponent, {
                        data: { file, node, currentVersion: versionPaging.list.entries[0].entry, showComments, allowDownload },
                        panelClass: 'adf-new-version-uploader-dialog',
                        width: '630px'
                    });
                    dialogRef.componentInstance.uploadedNewVersion.subscribe( (newVersionUploaderData: NewVersionUploaderData) =>{
                        resolve(newVersionUploaderData);
                    });
                    dialogRef.componentInstance.uploadError.subscribe(error => reject(error));
                });
            } else {
                reject({value: 'OPERATION.ERROR.PERMISSION'});
            }
        });

    }
}
