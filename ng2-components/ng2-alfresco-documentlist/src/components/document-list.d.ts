/**
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
import { OnInit, EventEmitter, AfterViewChecked } from 'angular2/core';
import { AlfrescoService } from './../services/alfresco.service';
import { FolderEntity } from './../core/entities/folder.entity';
import { DocumentEntity } from './../core/entities/document.entity';
import { ContentActionModel } from './../models/content-action.model';
import { ContentColumnModel } from './../models/content-column.model';
export declare class DocumentList implements OnInit, AfterViewChecked {
    private _alfrescoService;
    navigate: boolean;
    breadcrumb: boolean;
    folderIcon: string;
    thumbnails: boolean;
    itemClick: EventEmitter<any>;
    rootFolder: {
        name: string;
        path: string;
    };
    currentFolderPath: string;
    folder: FolderEntity;
    errorMessage: any;
    route: any[];
    actions: ContentActionModel[];
    columns: ContentColumnModel[];
    canNavigateParent(): boolean;
    constructor(_alfrescoService: AlfrescoService);
    ngOnInit(): void;
    ngAfterViewChecked(): void;
    getContentActions(target: string, type: string): ContentActionModel[];
    onNavigateParentClick($event: any): void;
    onItemClick(item: DocumentEntity, $event: any): void;
    goToRoute(r: any, $event: any): void;
    getContentUrl(document: DocumentEntity): string;
    getDocumentThumbnailUrl(document: DocumentEntity): string;
    executeContentAction(document: DocumentEntity, action: ContentActionModel): void;
    private getItemPath(item);
    private displayFolderContent(path);
}
