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
import { ContentActionHandler } from '../models/content-action.model';
import { DocumentListService } from './document-list.service';
import { AlfrescoContentService } from 'ng2-alfresco-core';
import { PermissionModel } from '../models/permissions.model';
import { Subject } from 'rxjs/Rx';
export declare class DocumentActionsService {
    private documentListService;
    private contentService;
    permissionEvent: Subject<PermissionModel>;
    private handlers;
    constructor(documentListService?: DocumentListService, contentService?: AlfrescoContentService);
    getHandler(key: string): ContentActionHandler;
    setHandler(key: string, handler: ContentActionHandler): boolean;
    canExecuteAction(obj: any): boolean;
    private setupActionHandlers();
    private handleStandardAction1(obj);
    private handleStandardAction2(obj);
    private download(obj);
    private deleteNode(obj, target?, permission?);
    private hasPermission(node, permission);
    private hasPermissions(node);
}
