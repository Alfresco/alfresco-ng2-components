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

import { ContentService, TranslationService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { MinimalNodeEntity } from 'alfresco-js-api';
import { Observable, Subject, throwError } from 'rxjs';
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

    private handlers: { [id: string]: ContentActionHandler; } = {};

    constructor(private nodeActionsService: NodeActionsService,
                private documentListService: DocumentListService,
                private contentService: ContentService,
                private translation: TranslationService) {
        this.setupActionHandlers();
    }

    /**
     * Gets the handler function for an action.
     * @param key Identifier for the action
     * @returns The handler function
     */
    getHandler(key: string): ContentActionHandler {
        if (key) {
            let lKey = key.toLowerCase();
            return this.handlers[lKey] || null;
        }
        return null;
    }

    /**
     * Sets a new handler function for an action.
     * @param key Identifier for the action
     * @param handler The new handler function
     * @returns True if the key was a valid action identifier, false otherwise
     */
    setHandler(key: string, handler: ContentActionHandler): boolean {
        if (key) {
            let lKey = key.toLowerCase();
            this.handlers[lKey] = handler;
            return true;
        }
        return false;
    }

    /**
     * Checks if an action is available for a particular item.
     * @param obj Item to check
     * @returns True if the action is available, false otherwise
     */
    canExecuteAction(obj: any): boolean {
        return this.documentListService && obj && obj.entry.isFolder === true;
    }

    private setupActionHandlers() {
        this.handlers['copy'] = this.copyNode.bind(this);
        this.handlers['move'] = this.moveNode.bind(this);
        this.handlers['delete'] = this.deleteNode.bind(this);
        this.handlers['download'] = this.downloadNode.bind(this);
    }

    private downloadNode(obj: MinimalNodeEntity, target?: any, permission?: string) {
        this.nodeActionsService.downloadNode(obj);
    }

    private copyNode(obj: MinimalNodeEntity, target?: any, permission?: string) {
        const actionObservable = this.nodeActionsService.copyFolder(obj.entry, permission);
        this.prepareHandlers(actionObservable, 'folder', 'copy', target, permission);
        return actionObservable;
    }

    private moveNode(obj: MinimalNodeEntity, target?: any, permission?: string) {
        const actionObservable = this.nodeActionsService.moveFolder(obj.entry, permission);
        this.prepareHandlers(actionObservable, 'folder', 'move', target, permission);
        return actionObservable;
    }

    private prepareHandlers(actionObservable, type: string, action: string, target?: any, permission?: string): void {
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

    private deleteNode(node: MinimalNodeEntity, target?: any, permission?: string): Observable<any> {
        let handlerObservable: Observable<any>;

        if (this.canExecuteAction(node)) {
            if (this.contentService.hasPermission(node.entry, permission)) {
                handlerObservable = this.documentListService.deleteNode(node.entry.id);
                handlerObservable.subscribe(() => {
                    if (target && typeof target.reload === 'function') {
                        target.reload();
                    }

                    let message = this.translation.instant('CORE.DELETE_NODE.SINGULAR', { name: node.entry.name });
                    this.success.next(message);
                }, () => {
                    let message = this.translation.instant('CORE.DELETE_NODE.ERROR_SINGULAR', { name: node.entry.name });
                    this.error.next(message);
                });

                return handlerObservable;
            } else {
                this.permissionEvent.next(new PermissionModel({type: 'folder', action: 'delete', permission: permission}));
                return throwError(new Error('No permission to delete'));
            }
        }
    }
}
