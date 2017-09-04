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

import { EventEmitter, Injectable } from '@angular/core';
import { MdDialog } from '@angular/material';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { AlfrescoContentService } from 'ng2-alfresco-core';
import { DataColumn } from 'ng2-alfresco-datatable';
import { Subject } from 'rxjs/Rx';
import { ContentNodeSelectorComponent, ContentNodeSelectorComponentData } from '../components/content-node-selector/content-node-selector.component';
import { ShareDataRow } from '../data/share-datatable-adapter';
import { DocumentListService } from './document-list.service';

@Injectable()
export class NodeActionsService {

    constructor(private dialog: MdDialog,
                private documentListService?: DocumentListService,
                private contentService?: AlfrescoContentService) {}

    /**
     * Copy content node
     *
     * @param contentEntry node to copy
     * @param permission permission which is needed to apply the action
     */
    public copyContent(contentEntry: MinimalNodeEntryEntity, permission?: string): Subject<string> {
        return this.doFileOperation('copy', 'content', contentEntry, permission);
    }

    /**
     * Copy folder node
     *
     * @param contentEntry node to copy
     * @param permission permission which is needed to apply the action
     */
    public copyFolder(contentEntry: MinimalNodeEntryEntity, permission?: string): Subject<string> {
        return this.doFileOperation('copy', 'folder', contentEntry, permission);
    }

    /**
     * Move content node
     *
     * @param contentEntry node to move
     * @param permission permission which is needed to apply the action
     */
    public moveContent(contentEntry: MinimalNodeEntryEntity, permission?: string): Subject<string> {
        return this.doFileOperation('move', 'content', contentEntry, permission);
    }

    /**
     * Move folder node
     *
     * @param contentEntry node to move
     * @param permission permission which is needed to apply the action
     */
    public moveFolder(contentEntry: MinimalNodeEntryEntity, permission?: string): Subject<string> {
        return this.doFileOperation('move', 'folder', contentEntry, permission);
    }

    /**
     * General method for performing the given operation (copy|move)
     *
     * @param action the action to perform (copy|move)
     * @param type type of the content (content|folder)
     * @param contentEntry the contentEntry which has to have the action performed on
     * @param permission permission which is needed to apply the action
     */
    private doFileOperation(action: string, type: string, contentEntry: MinimalNodeEntryEntity, permission?: string): Subject<string> {
        const observable: Subject<string> = new Subject<string>();

        if (this.contentService.hasPermission(contentEntry, permission)) {
            const data: ContentNodeSelectorComponentData = {
                title: `${action} ${contentEntry.name} to ...`,
                currentFolderId: contentEntry.parentId,
                rowFilter: this.rowFilter.bind(this, contentEntry.id),
                imageResolver: this.imageResolver.bind(this),
                select: new EventEmitter<MinimalNodeEntryEntity[]>()
            };

            this.dialog.open(ContentNodeSelectorComponent, { data, panelClass: 'adf-content-node-selector-dialog', width: '630px' });

            data.select.subscribe((selections: MinimalNodeEntryEntity[]) => {
                const selection = selections[0];
                this.documentListService[`${action}Node`].call(this.documentListService, contentEntry.id, selection.id)
                    .subscribe(
                        observable.next.bind(observable, `OPERATION.SUCCES.${type.toUpperCase()}.${action.toUpperCase()}`),
                        observable.error.bind(observable)
                    );
                this.dialog.closeAll();
            });

            return observable;
        } else {
            observable.error(new Error(JSON.stringify({ error: { statusCode: 403 } })));
            return observable;
        }
    }

    private rowFilter(currentNodeId, row: ShareDataRow): boolean {
        const node: MinimalNodeEntryEntity = row.node.entry;

        if (node.id === currentNodeId || node.isFile) {
            return false;
        } else {
            return true;
        }
    }

    private imageResolver(row: ShareDataRow, col: DataColumn): string|null {
        const entry: MinimalNodeEntryEntity = row.node.entry;
        if (!this.contentService.hasPermission(entry, 'update')) {
            return this.documentListService.getMimeTypeIcon('disable/folder');
        }

        return null;
    }
}
