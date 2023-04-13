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

import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AlfrescoApiService } from '@alfresco/adf-core';

import { NewVersionUploaderDialogComponent } from './new-version-uploader.dialog';
import { VersionPaging, VersionsApi } from '@alfresco/js-api';
import { NewVersionUploaderData, NewVersionUploaderDialogData } from './models';
import { Observable } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';

@Injectable({
    providedIn: 'root'
})
export class NewVersionUploaderService {

    private _versionsApi: VersionsApi;
    get versionsApi(): VersionsApi {
        this._versionsApi = this._versionsApi ?? new VersionsApi(this.apiService.getInstance());
        return this._versionsApi;
    }

    constructor(
        private apiService: AlfrescoApiService,
        private dialog: MatDialog,
        private overlayContainer: OverlayContainer
    ) { }

    /**
     * Open a dialog NewVersionUploaderDialogComponent to display:
     * - a side by side comparison between the current target node (type, name, icon) and the new file that should update it's version
     * - the new version's minor/major changes and the optional comment of a node and the ability to upload a new file version
     * - if data.showVersionsOnly is set to true, displays the version history of a node, with the ability to restore, delete and view version of the current node
     *
     * @param data data to pass to MatDialog
     * @param config allow to override default MatDialogConfig
     * @param selectorAutoFocusedOnClose element's selector which should be autofocused after closing modal
     * @returns an Observable represents the triggered dialog action or an error in case of an error condition
     */
    openUploadNewVersionDialog(data: NewVersionUploaderDialogData, config?: MatDialogConfig, selectorAutoFocusedOnClose?: string) {
        const { file, node, showVersionsOnly } = data;
        const showComments = true;
        const allowDownload = true;

        return new Observable((observer) => {
            this.versionsApi.listVersionHistory(node.id).then((versionPaging: VersionPaging) => {
                const dialogRef = this.dialog.open(NewVersionUploaderDialogComponent, {
                    data: { file, node, currentVersion: versionPaging.list.entries[0].entry, showComments, allowDownload, showVersionsOnly },
                    panelClass: this.composePanelClass(showVersionsOnly),
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
                dialogRef.afterClosed().subscribe(() => {
                    this.overlayContainer.getContainerElement().setAttribute('role', 'region');
                    NewVersionUploaderService.focusOnClose(selectorAutoFocusedOnClose);
                });
                this.overlayContainer.getContainerElement().setAttribute('role', 'main');
            });
        });

    }

    private composePanelClass(showVersionsOnly: boolean): string | string[] {
        const dialogCssClass = 'adf-new-version-uploader-dialog';
        return [dialogCssClass, `${dialogCssClass}-${showVersionsOnly ? 'list' : 'upload'}`];
    }

    private static focusOnClose(selectorAutoFocusedOnClose: string): void {
        if (selectorAutoFocusedOnClose) {
            document.querySelector<HTMLElement>(selectorAutoFocusedOnClose).focus();
        }
    }
}
