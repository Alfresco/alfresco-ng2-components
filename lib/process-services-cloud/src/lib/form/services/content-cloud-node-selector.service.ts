/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { AlfrescoApiService, NotificationService } from '@alfresco/adf-core';
import { MatDialog } from '@angular/material/dialog';
import {
    ContentNodeSelectorComponent,
    ContentNodeSelectorComponentData,
    NodeAction
} from '@alfresco/adf-content-services';
import { Node, NodesApi } from '@alfresco/js-api';
import { from, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ContentCloudNodeSelectorService {

    _nodesApi: NodesApi;
    get nodesApi(): NodesApi {
        this._nodesApi = this._nodesApi ?? new NodesApi(this.apiService.getInstance());
        return this._nodesApi;
    }

    sourceNodeNotFound = false;

    constructor(
        private apiService: AlfrescoApiService,
        private notificationService: NotificationService,
        private dialog: MatDialog) {
    }

    openUploadFileDialog(currentFolderId?: string, selectionMode?: string, isAllFileSources?: boolean, restrictRootToCurrentFolderId?: boolean): Observable<Node[]> {
        const select = new Subject<Node[]>();
        select.subscribe({ complete: this.close.bind(this) });
        const data = <ContentNodeSelectorComponentData> {
            title: 'Select a file',
            actionName: NodeAction.ATTACH,
            currentFolderId,
            restrictRootToCurrentFolderId,
            select,
            selectionMode,
            isSelectionValid: (entry: Node) => entry.isFile,
            showFilesInResult: true,
            showDropdownSiteList: false,
            showLocalUploadButton: isAllFileSources
        };
        this.openContentNodeDialog(data, 'adf-content-node-selector-dialog', '66%');
        return select;
    }

    async fetchNodeIdFromRelativePath(alias: string, opts: { relativePath: string }): Promise<string> {
        const relativePathNodeEntry: any = await this.nodesApi
        .getNode(alias, opts)
        .catch((err) => {
            this.sourceNodeNotFound = true;
            return this.handleError(err);
        });
        return relativePathNodeEntry?.entry?.id;
    }

    async fetchAliasNodeId(alias: string): Promise<string> {
        const aliasNodeEntry: any = await this.nodesApi
            .getNode(alias)
            .catch((err) => this.handleError(err));
        return aliasNodeEntry?.entry?.id;
    }

    async isNodeAvailable(nodeId: string): Promise<boolean> {
        return from(this.nodesApi.getNode(nodeId)).pipe(
            map(() =>  true ),
            catchError(() => {
                this.sourceNodeNotFound = true;
                return of(false);
            })
        ).toPromise();
    }

    private openContentNodeDialog(data: ContentNodeSelectorComponentData, currentPanelClass: string, chosenWidth: string) {
        const contentNodeDialog = this.dialog.open(ContentNodeSelectorComponent, { data, panelClass: currentPanelClass, width: chosenWidth });
        contentNodeDialog.afterOpened().subscribe(() => {
            if (this.sourceNodeNotFound) {
                this.notificationService.showWarning('ADF_CLOUD_TASK_FORM.ERROR.DESTINATION_FOLDER_PATH_ERROR');
            }
        });
        contentNodeDialog.afterClosed().subscribe(() => {
            this.sourceNodeNotFound = false;
        });
    }

    close() {
        this.dialog.closeAll();
    }

    private handleError(error: any): Observable<any> {
        return throwError(error || 'Server error');
    }
}
