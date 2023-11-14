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
import { AlfrescoApiService, LogService, NotificationService } from '@alfresco/adf-core';
import { MatDialog } from '@angular/material/dialog';
import {
    ContentNodeSelectorComponent,
    ContentNodeSelectorComponentData,
    NodeAction
} from '@alfresco/adf-content-services';
import { Node, NodeEntry, NodesApi } from '@alfresco/js-api';
import { from, Observable, Subject, throwError } from 'rxjs';
import { catchError, map, mapTo } from 'rxjs/operators';
import { DestinationFolderPathModel } from '../models/form-cloud-representation.model';

@Injectable({
    providedIn: 'root'
})
export class ContentCloudNodeSelectorService {

    private _nodesApi: NodesApi;
    get nodesApi(): NodesApi {
        this._nodesApi = this._nodesApi ?? new NodesApi(this.apiService.getInstance());
        return this._nodesApi;
    }

    sourceNodeNotFound = false;

    constructor(
        private apiService: AlfrescoApiService,
        private notificationService: NotificationService,
        private logService: LogService,
        private dialog: MatDialog) {
    }

    openUploadFileDialog(currentFolderId?: string, selectionMode?: string, isAllFileSources?: boolean, restrictRootToCurrentFolderId?: boolean): Observable<Node[]> {
        const select = new Subject<Node[]>();
        select.subscribe({ complete: this.close.bind(this) });
        const data = {
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
        } as ContentNodeSelectorComponentData;
        this.openContentNodeDialog(data, 'adf-content-node-selector-dialog', '66%');
        return select;
    }

    async getNodeIdFromPath(destinationFolderPath: DestinationFolderPathModel): Promise<string> {
        if (destinationFolderPath.alias && destinationFolderPath.path) {
            try {
                return await this.getNodeId(destinationFolderPath.alias, destinationFolderPath.path).toPromise();
            } catch (error) {
                this.logService.error(error);
            }
        }

        return this.getNodeId(destinationFolderPath.alias).toPromise();
    }

    async getNodeIdFromFolderVariableValue(variableValue: string, defaultAlias?: string): Promise<string> {
        const isExistingNode = await this.isExistingNode(variableValue);
        return isExistingNode ? variableValue : this.getNodeId(defaultAlias).toPromise();
    }

    async isExistingNode(nodeId: string): Promise<boolean> {
        let isExistingNode = false;
        if (nodeId) {
            try {
                isExistingNode = await this.getNodeId(nodeId).pipe(mapTo(true)).toPromise();
            } catch (error) {
                this.logService.error(error);
            }
        }
        return isExistingNode;
    }

    private getNodeId(nodeId: string, relativePath?: string): Observable<string> {
        let opts: any;
        if (relativePath) {
            opts = { relativePath };
        }
        return from(this.nodesApi.getNode(nodeId, opts)).pipe(
            map((nodeEntry: NodeEntry) => nodeEntry.entry.id),
            catchError((error) => {
                this.sourceNodeNotFound = true;
                return this.handleError(error);
            })
        );
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
