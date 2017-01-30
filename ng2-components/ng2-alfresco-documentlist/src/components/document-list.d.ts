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
import { OnInit, OnChanges, SimpleChanges, EventEmitter, AfterContentInit, TemplateRef, NgZone } from '@angular/core';
import { Subject } from 'rxjs/Rx';
import { MinimalNodeEntity } from 'alfresco-js-api';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { DataRowEvent, DataTableComponent } from 'ng2-alfresco-datatable';
import { DocumentListService } from './../services/document-list.service';
import { ContentActionModel } from './../models/content-action.model';
import { ShareDataTableAdapter, RowFilter, ImageResolver } from './../data/share-datatable-adapter';
export declare class DocumentList implements OnInit, OnChanges, AfterContentInit {
    private documentListService;
    private ngZone;
    private translate;
    static SINGLE_CLICK_NAVIGATION: string;
    static DOUBLE_CLICK_NAVIGATION: string;
    static DEFAULT_PAGE_SIZE: number;
    DEFAULT_FOLDER_PATH: string;
    baseComponentPath: any;
    fallbackThubnail: string;
    rootFolderId: string;
    currentFolderId: string;
    navigate: boolean;
    navigationMode: string;
    thumbnails: boolean;
    multiselect: boolean;
    contentActions: boolean;
    contextMenuActions: boolean;
    creationMenuActions: boolean;
    pageSize: number;
    rowFilter: RowFilter;
    imageResolver: ImageResolver;
    nodeClick: EventEmitter<any>;
    nodeDblClick: EventEmitter<any>;
    folderChange: EventEmitter<any>;
    preview: EventEmitter<any>;
    success: EventEmitter<any>;
    error: EventEmitter<any>;
    dataTable: DataTableComponent;
    private _path;
    currentFolderPath: string;
    errorMessage: any;
    actions: ContentActionModel[];
    emptyFolderTemplate: TemplateRef<any>;
    contextActionHandler: Subject<any>;
    data: ShareDataTableAdapter;
    constructor(documentListService: DocumentListService, ngZone: NgZone, translate: AlfrescoTranslationService);
    getContextActions(node: MinimalNodeEntity): {
        model: ContentActionModel;
        node: MinimalNodeEntity;
        subject: Subject<any>;
    }[];
    contextActionCallback(action: any): void;
    ngOnInit(): void;
    ngAfterContentInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    isEmptyTemplateDefined(): boolean;
    isMobile(): boolean;
    getNodeActions(node: MinimalNodeEntity): ContentActionModel[];
    onShowContextMenu(e?: Event): void;
    performNavigation(node: MinimalNodeEntity): boolean;
    executeContentAction(node: MinimalNodeEntity, action: ContentActionModel): void;
    loadFolderByPath(path: string): Promise<any>;
    loadFolderById(id: string): Promise<any>;
    reload(): void;
    loadFolder(): void;
    getNodePath(node: MinimalNodeEntity): string;
    setupDefaultColumns(): void;
    onPreviewFile(node: MinimalNodeEntity): void;
    onNodeClick(node: MinimalNodeEntity): void;
    onRowClick(event: DataRowEvent): void;
    onNodeDblClick(node: MinimalNodeEntity): void;
    onRowDblClick(event?: DataRowEvent): void;
    onShowRowContextMenu(event: any): void;
    onShowRowActionsMenu(event: any): void;
    onExecuteRowAction(event: any): void;
    onActionMenuError(event: any): void;
    onActionMenuSuccess(event: any): void;
}
