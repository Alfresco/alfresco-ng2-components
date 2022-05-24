import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AlfrescoApiService, ContentService } from '@alfresco/adf-core';

import { NewVersionUploaderDialogComponent } from './new-version-uploader.dialog';
import { VersionPaging, VersionsApi } from '@alfresco/js-api';
import { NewVersionUploaderData, NewVersionUploaderDialogData } from './models';
import { Observable } from 'rxjs';

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

    openUploadNewVersionDialog(event: NewVersionUploaderDialogData, config?: MatDialogConfig) {
        const { file, node, showVersionsOnly } = event;
        const showComments = true;
        const allowDownload = true;

        return new Observable((observer) => {
            if (this.contentService.hasAllowableOperations(node, 'update')) {
                this.versionsApi.listVersionHistory(node.id).then((versionPaging: VersionPaging) => {
                    const dialogRef = this.dialog.open(NewVersionUploaderDialogComponent, {
                        data: { file, node, currentVersion: versionPaging.list.entries[0].entry, showComments, allowDownload, showVersionsOnly },
                        panelClass: 'adf-new-version-uploader-dialog',
                        width: '630px',
                        ...(config && Object.keys(config).length > 0 && config)
                    });
                    dialogRef.componentInstance.dialogAction.asObservable()
                        .subscribe((newVersionUploaderData: NewVersionUploaderData) => {
                            observer.next(newVersionUploaderData);
                        });
                    dialogRef.componentInstance.uploadError.asObservable().subscribe(error => {
                        observer.error(error);
                    });
                });
            } else {
                observer.error({ value: 'OPERATION.ERROR.PERMISSION' });
            }
        });

    }
}
