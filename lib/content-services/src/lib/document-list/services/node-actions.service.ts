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

import { Injectable, Output, EventEmitter } from '@angular/core';
import { Node, NodeEntry } from '@alfresco/js-api';
import { Subject } from 'rxjs';
import { AlfrescoApiService, ContentService, NodeDownloadDirective, DownloadService } from '@alfresco/adf-core';
import { MatDialog } from '@angular/material/dialog';

import { DocumentListService } from './document-list.service';
import { ContentNodeDialogService } from '../../content-node-selector/content-node-dialog.service';

@Injectable({
    providedIn: 'root'
})
export class NodeActionsService {

    @Output()
    error = new EventEmitter<any>();

    constructor(private contentDialogService: ContentNodeDialogService,
                public dialogRef: MatDialog,
                public content: ContentService,
                private documentListService?: DocumentListService,
                private apiService?: AlfrescoApiService,
                private dialog?: MatDialog,
                private downloadService?: DownloadService) {}

    downloadNode(node: NodeEntry) {
        new NodeDownloadDirective(this.apiService, this.downloadService, this.dialog)
            .downloadNode(node);
    }

    /**
     * Copy content node
     *
     * @param contentEntry node to copy
     * @param permission permission which is needed to apply the action
     */
    copyContent(contentEntry: Node, permission?: string): Subject<string> {
        return this.doFileOperation('copy', 'content', contentEntry, permission);
    }

    /**
     * Copy folder node
     *
     * @param contentEntry node to copy
     * @param permission permission which is needed to apply the action
     */
    copyFolder(contentEntry: Node, permission?: string): Subject<string> {
        return this.doFileOperation('copy', 'folder', contentEntry, permission);
    }

    /**
     * Move content node
     *
     * @param contentEntry node to move
     * @param permission permission which is needed to apply the action
     */
    moveContent(contentEntry: Node, permission?: string): Subject<string> {
        return this.doFileOperation('move', 'content', contentEntry, permission);
    }

    /**
     * Move folder node
     *
     * @param contentEntry node to move
     * @param permission permission which is needed to apply the action
     */
    moveFolder(contentEntry: Node, permission?: string): Subject<string> {
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
    private doFileOperation(action: string, type: string, contentEntry: Node, permission?: string): Subject<string> {
        const observable = new Subject<string>();

        this.contentDialogService
            .openCopyMoveDialog(action, contentEntry, permission)
            .subscribe((selections: Node[]) => {
                const selection = selections[0];
                this.documentListService[`${action}Node`].call(this.documentListService, contentEntry.id, selection.id)
                    .subscribe(
                    observable.next.bind(observable, `OPERATION.SUCCESS.${type.toUpperCase()}.${action.toUpperCase()}`),
                    observable.error.bind(observable)
                    );
            },
            (error) => {
                observable.error(error);
                return observable;
            });
        return observable;
    }
}
