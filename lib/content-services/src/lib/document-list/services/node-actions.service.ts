/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Injectable, Output, EventEmitter, inject, Injector, runInInjectionContext } from '@angular/core';
import { Node, NodeEntry } from '@alfresco/js-api';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ContentService } from '../../common/services/content.service';
import { NodeDownloadDirective } from '../../directives/node-download.directive';

import { DocumentListService } from './document-list.service';
import { ContentNodeDialogService } from '../../content-node-selector/content-node-dialog.service';
import { NodeAction } from '../models/node-action.enum';

@Injectable({
    providedIn: 'root'
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class NodeActionsService {
    private readonly contentDialogService = inject(ContentNodeDialogService);
    dialogRef = inject(MatDialog);
    content = inject(ContentService);
    private readonly documentListService = inject(DocumentListService);
    private readonly injector = inject(Injector);

    @Output()
    error = new EventEmitter<any>();

    downloadNode(node: NodeEntry) {
        runInInjectionContext(this.injector, () => {
            new NodeDownloadDirective().downloadNode(node);
        });
    }

    /**
     * Copy content node
     *
     * @param contentEntry node to copy
     * @param permission permission which is needed to apply the action
     * @returns operation result
     */
    copyContent(contentEntry: Node, permission?: string): Observable<string> {
        return this.doFileOperation(NodeAction.COPY, 'content', contentEntry, permission);
    }

    /**
     * Copy folder node
     *
     * @param contentEntry node to copy
     * @param permission permission which is needed to apply the action
     * @returns operation result
     */
    copyFolder(contentEntry: Node, permission?: string): Observable<string> {
        return this.doFileOperation(NodeAction.COPY, 'folder', contentEntry, permission);
    }

    /**
     * Move content node
     *
     * @param contentEntry node to move
     * @param permission permission which is needed to apply the action
     * @returns operation result
     */
    moveContent(contentEntry: Node, permission?: string): Observable<string> {
        return this.doFileOperation(NodeAction.MOVE, 'content', contentEntry, permission);
    }

    /**
     * Move folder node
     *
     * @param contentEntry node to move
     * @param permission permission which is needed to apply the action
     * @returns operation result
     */
    moveFolder(contentEntry: Node, permission?: string): Observable<string> {
        return this.doFileOperation(NodeAction.MOVE, 'folder', contentEntry, permission);
    }

    /**
     * General method for performing the given operation (copy|move)
     *
     * @param action the action to perform (copy|move)
     * @param type type of the content (content|folder)
     * @param contentEntry the contentEntry which has to have the action performed on
     * @param permission permission which is needed to apply the action
     * @returns operation result
     */
    private doFileOperation(action: 'COPY' | 'MOVE', type: 'content' | 'folder', contentEntry: Node, permission?: string): Observable<string> {
        return this.contentDialogService.openCopyMoveDialog(action, contentEntry, permission).pipe(
            switchMap((selections) => {
                const selection = selections[0];
                return this.documentListService[`${action.toLowerCase()}Node`]
                    .call(this.documentListService, contentEntry.id, selection.id)
                    .pipe(map(() => `OPERATION.SUCCESS.${type.toUpperCase()}.${action}`));
            })
        );
    }
}
