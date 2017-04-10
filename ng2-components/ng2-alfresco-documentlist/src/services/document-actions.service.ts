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
import { ContentActionHandler } from '../models/content-action.model';
import { DocumentListService } from './document-list.service';
import { AlfrescoContentService } from 'ng2-alfresco-core';
import { PermissionModel } from '../models/permissions.model';
import { Subject } from 'rxjs/Rx';

@Injectable()
export class DocumentActionsService {

    permissionEvent: Subject<PermissionModel> = new Subject<PermissionModel>();

    private handlers: { [id: string]: ContentActionHandler; } = {};

    constructor(private documentListService?: DocumentListService,
                private contentService?: AlfrescoContentService) {
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
        return this.documentListService && obj && obj.entry.isFile === true;
    }

    private setupActionHandlers() {
        this.handlers['download'] = this.download.bind(this);
        this.handlers['delete'] = this.deleteNode.bind(this);

        // TODO: for demo purposes only, will be removed during future revisions
        this.handlers['system1'] = this.handleStandardAction1.bind(this);
        this.handlers['system2'] = this.handleStandardAction2.bind(this);
    }

    // TODO: for demo purposes only, will be removed during future revisions
    private handleStandardAction1(obj: any) {
        window.alert('standard document action 1');
    }

    // TODO: for demo purposes only, will be removed during future revisions
    private handleStandardAction2(obj: any) {
        window.alert('standard document action 2');
    }

    private download(obj: any): boolean {
        if (this.canExecuteAction(obj) && this.contentService) {
            let link = document.createElement('a');
            document.body.appendChild(link);
            link.setAttribute('download', 'download');
            link.href = this.contentService.getContentUrl(obj);
            link.click();
            document.body.removeChild(link);
            return true;
        }
        return false;
    }

    private deleteNode(obj: any, target?: any, permission?: string) {
        if (this.canExecuteAction(obj) && obj.entry && obj.entry.id) {
            if (this.hasPermission(obj.entry, permission)) {
                this.documentListService.deleteNode(obj.entry.id).subscribe(() => {
                    if (target && typeof target.reload === 'function') {
                        target.reload();
                    }
                });
            } else {
                this.permissionEvent.next(new PermissionModel({type: 'content', action: 'delete', permission: permission}));
            }
        }
    }

    private hasPermission(node: any, permission: string): boolean {
        if (this.hasPermissions(node)) {
            return node.allowableOperations.find(permision => permision === permission) ? true : false;
        }
        return false;
    }

    private hasPermissions(node: any): boolean {
        return node.allowableOperations ? true : false;
    }
}
