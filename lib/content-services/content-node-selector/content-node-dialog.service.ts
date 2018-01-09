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

import { MatDialog } from '@angular/material';
import { Injectable } from '@angular/core';
import { ContentService } from '@alfresco/adf-core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { ShareDataRow } from '../document-list/data/share-data-row.model';
import { MinimalNodeEntryEntity, SitePaging } from 'alfresco-js-api';
import { DataColumn, SitesService } from '@alfresco/adf-core';
import { DocumentListService } from '../document-list/services/document-list.service';
import { ContentNodeSelectorComponent } from './content-node-selector.component';
import { ContentNodeSelectorComponentData } from './content-node-selector.component-data.interface';


@Injectable()
export class ContentNodeDialogService {

    constructor(private dialog: MatDialog,
                private contentService: ContentService,
                private documentListService: DocumentListService,
                private siteService: SitesService) { }

    openFileBrowseDialogByFolderId(folderNodeId: string): Observable<MinimalNodeEntryEntity[]> {
        return Observable.fromPromise(this.documentListService.getFolderNode(folderNodeId))
            .switchMap((node: MinimalNodeEntryEntity)=> {
                return this.openUploadFileDialog('Upload', node);
        });
    }

    openFileBrowseDialogBySite(): Observable<MinimalNodeEntryEntity[]> {
       return this.siteService.getSites().switchMap((response: SitePaging) => {
            return this.openFileBrowseDialogByFolderId(response.list.entries[0].entry.guid);
        });
    }

    openCopyMoveDialog(action: string, contentEntry: MinimalNodeEntryEntity, permission?: string): Observable<MinimalNodeEntryEntity[]> {
        if (this.contentService.hasPermission(contentEntry, permission)) {

            const select = new Subject<MinimalNodeEntryEntity[]>();
            select.subscribe({
                complete: this.close.bind(this)
            });

            const data: ContentNodeSelectorComponentData = {
                title: `${action} '${contentEntry.name}' to ...`,
                actionName: action,
                currentFolderId: contentEntry.parentId,
                imageResolver: this.imageResolver.bind(this),
                rowFilter : this.rowFilter.bind(this, contentEntry.id),
                isSelectionValid: this.hasEntityCreatePermission.bind(this),
                select: select
            };

            this.openContentNodeDialog(data, 'adf-content-node-selector-dialog', '630px');

            return select;
        } else {
            return Observable.throw({ statusCode: 403 });
        }
    }

    openUploadFileDialog(action: string, contentEntry: MinimalNodeEntryEntity): Observable<MinimalNodeEntryEntity[]> {
            const select = new Subject<MinimalNodeEntryEntity[]>();
            select.subscribe({
                complete: this.close.bind(this)
            });

            const data: ContentNodeSelectorComponentData = {
                title: `${action} '${contentEntry.name}' to ...`,
                actionName: action,
                currentFolderId: contentEntry.id,
                imageResolver: this.imageResolver.bind(this),
                isSelectionValid: this.isNodeFile.bind(this),
                select: select
            };

            this.openContentNodeDialog(data, 'adf-content-node-selector-dialog', '630px');
            return select;
    }

    private openContentNodeDialog(data: ContentNodeSelectorComponentData, currentPanelClass: string, chosenWidth: string) {
        this.dialog.open(ContentNodeSelectorComponent, { data, panelClass: currentPanelClass, width: chosenWidth });
    }

    private imageResolver(row: ShareDataRow, col: DataColumn): string | null {
        const entry: MinimalNodeEntryEntity = row.node.entry;
        if (!this.contentService.hasPermission(entry, 'create')) {
            return this.documentListService.getMimeTypeIcon('disable/folder');
        }

        return null;
    }

    private rowFilter(currentNodeId, row: ShareDataRow): boolean {
        const node: MinimalNodeEntryEntity = row.node.entry;

        if (node.id === currentNodeId || node.isFile) {
            return false;
        } else {
            return true;
        }
    }

    private isNodeFile(entry: MinimalNodeEntryEntity): boolean {
        return entry.isFile;
    }

    private hasEntityCreatePermission(entry: MinimalNodeEntryEntity): boolean {
        return this.contentService.hasPermission(entry,'create');
    }

    close() {
        this.dialog.closeAll();
    }

}
