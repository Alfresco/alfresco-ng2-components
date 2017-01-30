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
export declare class FolderActionsService {
    private documentListService;
    private handlers;
    constructor(documentListService?: DocumentListService);
    getHandler(key: string): ContentActionHandler;
    setHandler(key: string, handler: ContentActionHandler): boolean;
    canExecuteAction(obj: any): boolean;
    private setupActionHandlers();
    private handleStandardAction1(document);
    private handleStandardAction2(document);
    private deleteNode(obj, target?);
}
