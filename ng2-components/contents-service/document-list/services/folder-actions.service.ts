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

import { Injectable } from '@angular/core';
import { MinimalNodeEntity } from 'alfresco-js-api';
import { AlfrescoContentService } from 'ng2-alfresco-core';
import { Observable, Subject } from 'rxjs/Rx';
import { ContentActionHandler } from '../models/content-action.model';
import { PermissionModel } from '../models/permissions.model';
import { DocumentListService } from './document-list.service';
import { NodeActionsService } from './node-actions.service';

@Injectable()
export class FolderActionsService {

    permissionEvent: Subject<PermissionModel> = new Subject<PermissionModel>();
    error: Subject<Error> = new Subject<Error>();
    success: Subject<string> = new Subject<string>();

    private handlers: { [id: string]: ContentActionHandler; } = {};

    constructor(private nodeActionsService: NodeActionsService,
                private documentListService: DocumentListService,
                private contentService: AlfrescoContentService) {
        this.setupActionHandlers();
    }

    getHandler(key: string): ContentActionHandler {
        if (key) {
            let lkey = key.toLowerCase();
            return this.handlers[lkey] || null;
        }
        return null;
    }

    setHandler(key: string, handler: ContentActionHandler): boolean {
        if (key) {
            let lkey = key.toLowerCase();
            this.handlers[lkey] = handler;
            return true;
        }
        return false;
    }

    canExecuteAction(obj: any): boolean {
        return this.documentListService && obj && obj.entry.isFolder === true;
    }

    private setupActionHandlers() {
        this.handlers['copy'] = this.copyNode.bind(this);
        this.handlers['move'] = this.moveNode.bind(this);
        this.handlers['delete'] = this.deleteNode.bind(this);
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

    private deleteNode(obj: any, target?: any, permission?: string): Observable<any> {
        let handlerObservable: Observable<any>;

        if (this.canExecuteAction(obj)) {
            if (this.contentService.hasPermission(obj.entry, permission)) {
                handlerObservable = this.documentListService.deleteNode(obj.entry.id);
                handlerObservable.subscribe(() => {
                    if (target && typeof target.reload === 'function') {
                        target.reload();
                    }
                    this.success.next(obj.entry.id);
                });
                return handlerObservable;
            } else {
                this.permissionEvent.next(new PermissionModel({type: 'folder', action: 'delete', permission: permission}));
                return Observable.throw(new Error('No permission to delete'));
            }
        }
    }
}
