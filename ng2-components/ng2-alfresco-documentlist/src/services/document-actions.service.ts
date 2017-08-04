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
import { AlfrescoContentService, AlfrescoTranslationService, NotificationService } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Rx';
import { ContentActionHandler } from '../models/content-action.model';
import { PermissionModel } from '../models/permissions.model';
import { DocumentListService } from './document-list.service';
import { NodeActionsService } from './node-actions.service';

@Injectable()
export class DocumentActionsService {

    permissionEvent: Subject<PermissionModel> = new Subject<PermissionModel>();

    private handlers: { [id: string]: ContentActionHandler; } = {};

    constructor(private translateService: AlfrescoTranslationService,
                private notificationService: NotificationService,
                private nodeActionsService: NodeActionsService,
                private documentListService?: DocumentListService,
                private contentService?: AlfrescoContentService) {
        this.setupActionHandlers();
        if (translateService) {
            translateService.addTranslationFolder('ng2-alfresco-documentlist', 'assets/ng2-alfresco-documentlist');
        }
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
        return this.documentListService && obj && obj.entry.isFile === true;
    }

    private setupActionHandlers() {
        this.handlers['download'] = this.download.bind(this);
        this.handlers['copy'] = this.copyNode.bind(this);
        this.handlers['move'] = this.moveNode.bind(this);
        this.handlers['delete'] = this.deleteNode.bind(this);
    }

    private download(obj: any): Observable<boolean> {
        if (this.canExecuteAction(obj) && this.contentService) {
            let link = document.createElement('a');
            document.body.appendChild(link);
            link.setAttribute('download', 'download');
            link.href = this.contentService.getContentUrl(obj);
            link.click();
            document.body.removeChild(link);
            return Observable.of(true);
        }
        return Observable.of(false);
    }

    private copyNode(obj: MinimalNodeEntity, target?: any, permission?: string) {
        const actionObservable = this.nodeActionsService.copyContent(obj.entry, permission);
        this.prepareHandlers(actionObservable, 'content', 'copy', target, permission);
        return actionObservable;
    }

    private moveNode(obj: MinimalNodeEntity, target?: any, permission?: string) {
        const actionObservable = this.nodeActionsService.moveContent(obj.entry, permission);
        this.prepareHandlers(actionObservable, 'content', 'move', target, permission);
        return actionObservable;
    }

    private prepareHandlers(actionObservable, type: string, action: string, target?: any, permission?: string): void {
        actionObservable.subscribe(
            (fileOperationMessage) => {
                this.notificationService.openSnackMessage(fileOperationMessage, 3000);
                if (target && typeof target.reload === 'function') {
                    target.reload();
                }
            },
            (errorStatusCode) => {
                switch (errorStatusCode) {
                    case 403:
                        this.permissionEvent.next(new PermissionModel({type, action, permission}));
                        break;
                    case 409:
                        let conflictError: any = this.translateService.get('OPERATION.ERROR.CONFLICT');
                        this.notificationService.openSnackMessage(conflictError.value, 3000);
                        break;
                    default:
                        let unknownError: any = this.translateService.get('OPERATION.ERROR.UNKNOWN');
                        this.notificationService.openSnackMessage(unknownError.value, 3000);
                }
            }
        );
    }

    private deleteNode(obj: any, target?: any, permission?: string): Observable<any> {
        let handlerObservable;

        if (this.canExecuteAction(obj)) {
            if (this.contentService.hasPermission(obj.entry, permission)) {
                handlerObservable = this.documentListService.deleteNode(obj.entry.id);
                handlerObservable.subscribe(() => {
                    if (target && typeof target.reload === 'function') {
                        target.reload();
                    }
                });
                return handlerObservable;
            } else {
                this.permissionEvent.next(new PermissionModel({type: 'content', action: 'delete', permission: permission}));
                return Observable.throw(new Error('No permission to delete'));
            }
        }
    }
}
