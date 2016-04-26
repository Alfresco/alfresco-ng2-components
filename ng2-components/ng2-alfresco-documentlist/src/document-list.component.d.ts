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
import { OnInit, EventEmitter } from "angular2/core";
import { AlfrescoService } from "./alfresco.service";
import { FolderEntity } from "./core/entities/folder.entity";
import { DocumentEntity } from "./core/entities/document.entity";
export declare class DocumentList implements OnInit {
    private _alfrescoService;
    navigate: boolean;
    breadcrumb: boolean;
    folderIconClass: string;
    thumbnails: boolean;
    downloads: boolean;
    itemClick: EventEmitter<any>;
    rootFolder: {
        name: string;
        path: string;
    };
    currentFolderPath: string;
    folder: FolderEntity;
    errorMessage: any;
    route: any[];
    canNavigateParent(): boolean;
    constructor(_alfrescoService: AlfrescoService);
    ngOnInit(): void;
    private displayFolderContent(path);
    onNavigateParentClick($event: any): void;
    onDownloadClick(event: any): void;
    onItemClick(item: DocumentEntity, $event: any): void;
    goToRoute(r: any, $event: any): void;
    private getItemPath(item);
    getContentUrl(document: DocumentEntity): string;
    getDocumentThumbnailUrl(document: DocumentEntity): string;
}
