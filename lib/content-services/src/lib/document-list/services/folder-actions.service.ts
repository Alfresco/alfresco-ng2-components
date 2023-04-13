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

import { TranslationService } from '@alfresco/adf-core';
import { ContentService } from '../../common/services/content.service';
import { Injectable } from '@angular/core';
import { NodeEntry } from '@alfresco/js-api';
import { Observable, Subject, throwError, of } from 'rxjs';
import { ContentActionHandler } from '../models/content-action.model';
import { PermissionModel } from '../models/permissions.model';
import { DocumentListService } from './document-list.service';
import { NodeActionsService } from './node-actions.service';

@Injectable({
    providedIn: 'root'
})
export class FolderActionsService {

    permissionEvent: Subject<PermissionModel> = new Subject<PermissionModel>();
    error: Subject<Error> = new Subject<Error>();
    success: Subject<string> = new Subject<string>();

    private handlers: { [id: string]: ContentActionHandler } = {};

    constructor(private nodeActionsService: NodeActionsService,
                private documentListService: DocumentListService,
                private contentService: ContentService,
                private translation: TranslationService) {
        this.setupActionHandlers();
    }

    /**
     * Gets the handler function for an action.
     *
     * @param key Identifier for the action
     * @returns The handler function
     */
    getHandler(key: string): ContentActionHandler {
        if (key) {
            const lKey = key.toLowerCase();
            return this.handlers[lKey] || null;
        }
        return null;
    }

    /**
     * Sets a new handler function for an action.
     *
     * @param key Identifier for the action
     * @param handler The new handler function
     * @returns True if the key was a valid action identifier, false otherwise
     */
    setHandler(key: string, handler: ContentActionHandler): boolean {
        if (key) {
            const lKey = key.toLowerCase();
            this.handlers[lKey] = handler;
            return true;
        }
        return false;
    }

    /**
     * Checks if an action is available for a particular item.
     *
     * @param nodeEntry Item to check
     * @returns True if the action is available, false otherwise
     */
    canExecuteAction(nodeEntry: NodeEntry): boolean {
        return this.documentListService && nodeEntry && nodeEntry.entry.isFolder === true;
    }

    private setupActionHandlers() {
        this.handlers['copy'] = this.copyNode.bind(this);
        this.handlers['move'] = this.moveNode.bind(this);
        this.handlers['delete'] = this.deleteNode.bind(this);
        this.handlers['download'] = this.downloadNode.bind(this);
    }

    private downloadNode(nodeEntry: NodeEntry) {
        this.nodeActionsService.downloadNode(nodeEntry);
    }

    private copyNode(nodeEntry: NodeEntry, target?: any, permission?: string) {
        const actionObservable = this.nodeActionsService.copyFolder(nodeEntry.entry, permission);
        this.prepareHandlers(actionObservable, target);
        return actionObservable;
    }

    private moveNode(nodeEntry: NodeEntry, target?: any, permission?: string) {
        const actionObservable = this.nodeActionsService.moveFolder(nodeEntry.entry, permission);
        this.prepareHandlers(actionObservable, target);
        return actionObservable;
    }

    private prepareHandlers(actionObservable: Observable<any>, target?: any): void {
        actionObservable.subscribe(
            (fileOperationMessage) => {
                if (target && typeof target.reload === 'function') {
                    target.reload();
                }
                this.success.next(fileOperationMessage);
            },
            this.error.next.bind(this.error)
        );
    }

    private deleteNode(node: NodeEntry, target?: any, permission?: string): Observable<any> {
        if (this.canExecuteAction(node)) {
            if (this.contentService.hasAllowableOperations(node.entry, permission)) {
                const handlerObservable = this.documentListService.deleteNode(node.entry.id);
                handlerObservable.subscribe(() => {
                    if (target && typeof target.reload === 'function') {
                        target.reload();
                    }

                    const message = this.translation.instant('CORE.DELETE_NODE.SINGULAR', { name: node.entry.name });
                    this.success.next(message);
                }, () => {
                    const message = this.translation.instant('CORE.DELETE_NODE.ERROR_SINGULAR', { name: node.entry.name });
                    this.error.next(message);
                });

                return handlerObservable;
            } else {
                this.permissionEvent.next(new PermissionModel({type: 'folder', action: 'delete', permission}));
                return throwError(new Error('No permission to delete'));
            }
        }

        return of();
    }
}
