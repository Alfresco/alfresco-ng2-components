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
import { EventEmitter, Injectable } from '@angular/core';
import { ContentService } from '@alfresco/adf-core';
import { Subject } from 'rxjs/Subject';
import { ShareDataRow } from '../document-list/data/share-data-row.model';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { DataColumn } from '@alfresco/adf-core';
import { DocumentListService } from '../document-list/services/document-list.service';
import { ContentNodeSelectorDialogComponent } from './content-node-selector-dialog.component';
import { ContentNodeSelectorComponentData } from './content-node-selector.component-data.interface';

@Injectable()
export class ContentNodeDialogService {

    select: EventEmitter<MinimalNodeEntryEntity[]>;

    constructor(private dialog: MatDialog,
                private contentService?: ContentService,
                private documentListService?: DocumentListService) { }

    openCopyMoveDialog(action: string, contentEntry: MinimalNodeEntryEntity, permission?: string) {
        if (this.contentService.hasPermission(contentEntry, permission)) {
            const data: ContentNodeSelectorComponentData = {
                title: `${action} '${contentEntry.name}' to ...`,
                actionName: action,
                currentFolderId: contentEntry.parentId,
                rowFilter: this.rowFilter.bind(this, contentEntry.id),
                imageResolver: this.imageResolver.bind(this),
                select: new Subject<MinimalNodeEntryEntity[]>()
            };

            this.dialog.open(ContentNodeSelectorDialogComponent, { data, panelClass: 'adf-content-node-selector-dialog', width: '630px' });
            this.select = new EventEmitter<MinimalNodeEntryEntity[]>();
            this.bubbleSelectDataEvent(data);
        } else {
            this.select.error(new Error(JSON.stringify({ error: { statusCode: 403 } })));
        }
    }

    private bubbleSelectDataEvent(data: ContentNodeSelectorComponentData) {
        data.select.subscribe(
            (nodeList) => {
                this.select.next(nodeList);
            },
            (error) => {
                this.select.error(error);
            },
            () => {
                this.close();
                this.select.complete();
            });
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

    close() {
        this.dialog.closeAll();
    }
}
