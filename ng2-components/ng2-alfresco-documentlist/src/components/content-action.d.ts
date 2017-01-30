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
import { OnInit, OnChanges, EventEmitter } from '@angular/core';
import { ContentActionModel } from './../models/content-action.model';
import { ContentActionList } from './content-action-list';
import { DocumentActionsService } from '../services/document-actions.service';
import { FolderActionsService } from '../services/folder-actions.service';
import { ContentActionHandler } from '../models/content-action.model';
export declare class ContentAction implements OnInit, OnChanges {
    private list;
    private documentActions;
    private folderActions;
    title: string;
    icon: string;
    handler: string;
    target: string;
    execute: EventEmitter<{}>;
    model: ContentActionModel;
    constructor(list: ContentActionList, documentActions: DocumentActionsService, folderActions: FolderActionsService);
    ngOnInit(): void;
    register(): boolean;
    ngOnChanges(changes: any): void;
    getSystemHandler(target: string, name: string): ContentActionHandler;
}
