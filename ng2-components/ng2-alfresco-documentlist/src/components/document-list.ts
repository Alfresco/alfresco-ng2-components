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

import { Component, OnInit, Input, OnChanges, Output, SimpleChanges, EventEmitter, AfterContentInit, TemplateRef, NgZone, ViewChild, HostListener } from '@angular/core';
import { Subject } from 'rxjs/Rx';
import { MinimalNodeEntity, MinimalNodeEntryEntity } from 'alfresco-js-api';
import { AlfrescoTranslateService } from 'ng2-alfresco-core';
import { DataRowEvent, DataTableComponent, ObjectDataColumn } from 'ng2-alfresco-datatable';
import { DocumentListService } from './../services/document-list.service';
import { ContentActionModel } from './../models/content-action.model';
import { ShareDataTableAdapter, ShareDataRow, RowFilter, ImageResolver } from './../data/share-datatable-adapter';

declare var module: any;

@Component({
    moduleId: module.id,
    selector: 'alfresco-document-list',
    styleUrls: ['./document-list.css'],
    templateUrl: './document-list.html'
})
export class DocumentList implements OnInit, OnChanges, AfterContentInit {

    static SINGLE_CLICK_NAVIGATION: string = 'click';
    static DOUBLE_CLICK_NAVIGATION: string = 'dblclick';
    static DEFAULT_PAGE_SIZE: number = 20;

    baseComponentPath = module.id.replace('/components/document-list.js', '');

    @Input()
    fallbackThubnail: string = this.baseComponentPath + '/../assets/images/ft_ic_miscellaneous.svg';

    @Input()
    navigate: boolean = true;

    @Input()
    navigationMode: string = DocumentList.DOUBLE_CLICK_NAVIGATION; // click|dblclick

    @Input()
    thumbnails: boolean = false;

    @Input()
    multiselect: boolean = false;

    @Input()
    contentActions: boolean = false;

    @Input()
    contextMenuActions: boolean = false;

    @Input()
    creationMenuActions: boolean = true;

    @Input()
    pageSize: number = DocumentList.DEFAULT_PAGE_SIZE;

    @Input()
    set rowFilter(value: RowFilter) {
        if (this.data) {
            this.data.setFilter(value);
        }
    };

    @Input()
    set imageResolver(value: ImageResolver) {
        if (this.data) {
            this.data.setImageResolver(value);
        }
    }

    @Output()
    nodeClick: EventEmitter<any> = new EventEmitter();

    @Output()
    nodeDblClick: EventEmitter<any> = new EventEmitter();

    @Output()
    folderChange: EventEmitter<any> = new EventEmitter();

    @Output()
    preview: EventEmitter<any> = new EventEmitter();

    @Output()
    success: EventEmitter<any> = new EventEmitter();

    @Output()
    error: EventEmitter<any> = new EventEmitter();

    @ViewChild(DataTableComponent)
    dataTable: DataTableComponent;

    // The identifier of a node. You can also use one of these well-known aliases: -my- | -shared- | -root-
    @Input()
    currentFolderId: string = null;

    @Input()
    folderNode: MinimalNodeEntryEntity = null;

    errorMessage;
    actions: ContentActionModel[] = [];
    emptyFolderTemplate: TemplateRef<any>;
    contextActionHandler: Subject<any> = new Subject();
    data: ShareDataTableAdapter;

    constructor(
        private documentListService: DocumentListService,
        private ngZone: NgZone,
        private translateService: AlfrescoTranslateService) {

        this.data = new ShareDataTableAdapter(this.documentListService, './..', []);

        if (translateService) {
            translateService.addTranslationFolder('ng2-alfresco-documentlist', 'node_modules/ng2-alfresco-documentlist/src');
        }
    }

    getContextActions(node: MinimalNodeEntity) {
        if (node && node.entry) {
            let actions = this.getNodeActions(node);
            if (actions && actions.length > 0) {
                return actions.map(a => {
                    return {
                        model: a,
                        node: node,
                        subject: this.contextActionHandler
                    };
                });
            }
        }
        return null;
    }

    contextActionCallback(action) {
        if (action) {
            this.executeContentAction(action.node, action.model);
        }
    }

    ngOnInit() {
        this.data.thumbnails = this.thumbnails;
        this.data.maxItems = this.pageSize;
        this.contextActionHandler.subscribe(val => this.contextActionCallback(val));

        // Automatically enforce single-click navigation for mobile browsers
        if (this.isMobile()) {
            this.navigationMode = DocumentList.SINGLE_CLICK_NAVIGATION;
        }

        this.loadFolder();
    }

    ngAfterContentInit() {
        let columns = this.data.getColumns();
        if (!columns || columns.length === 0) {
            this.setupDefaultColumns();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['folderNode'] && changes['folderNode'].currentValue) {
            this.loadFolder();
        } else if (changes['currentFolderId'] && changes['currentFolderId'].currentValue) {
            this.loadFolderByNodeId(changes['currentFolderId'].currentValue);
        }
    }

    isEmptyTemplateDefined() {
        if (this.dataTable) {
            if (this.emptyFolderTemplate) {
                return true;
            }
        }
        return false;
    }

    isMobile(): boolean {
        return !!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    getNodeActions(node: MinimalNodeEntity): ContentActionModel[] {
        let target = null;

        if (node && node.entry) {
            if (node.entry.isFile) {
                target = 'document';
            }

            if (node.entry.isFolder) {
                target = 'folder';
            }

            if (target) {

                let ltarget = target.toLowerCase();

                return this.actions.filter(entry => {
                    return entry.target.toLowerCase() === ltarget;
                });
            }
        }

        return [];
    }

    @HostListener('contextmenu', ['$event'])
    onShowContextMenu(e?: Event) {
        if (e) {
            e.preventDefault();
        }
    }

    performNavigation(node: MinimalNodeEntity): boolean {
        if (node && node.entry && node.entry.isFolder) {

            this.currentFolderId = node.entry.id;
            this.folderNode = node.entry;

            this.loadFolder();
            this.folderChange.emit({ node: node.entry });
            return true;
        }
        return false;
    }

    /**
     * Invoked when executing content action for a document or folder.
     * @param node Node to be the context of the execution.
     * @param action Action to be executed against the context.
     */
    executeContentAction(node: MinimalNodeEntity, action: ContentActionModel) {
        if (node && node.entry && action) {
            action.handler(node, this);
        }
    }

    loadFolderById(id: string): Promise<any> {
        return this.data.loadById(id);
    }

    reload() {
        this.ngZone.run(() => {
            this.loadFolder();
        });
    }

    loadFolder() {
        let nodeId = this.folderNode ? this.folderNode.id : this.currentFolderId;
        if (nodeId) {
            this.loadFolderById(nodeId)
                .catch(err => this.error.emit(err));
        }
    }

    // gets folder node and its content
    loadFolderByNodeId(nodeId: string) {
        this.documentListService.getFolderNode(nodeId).then(node => {
            this.folderNode = node;
            this.currentFolderId = node.id;
            this.data.loadById(node.id).catch(err => this.error.emit(err));
        });
    }

    /**
     * Creates a set of predefined columns.
     */
    setupDefaultColumns(): void {
        let colThumbnail = new ObjectDataColumn({
            type: 'image',
            key: '$thumbnail',
            title: '',
            srTitle: 'Thumbnail'
        });

        let colName = new ObjectDataColumn({
            type: 'text',
            key: 'name',
            title: 'Name',
            cssClass: 'full-width',
            sortable: true
        });

        this.data.setColumns([colThumbnail, colName]);
    }

    onPreviewFile(node: MinimalNodeEntity) {
        if (node) {
            this.preview.emit({
                value: node
            });
        }
    }

    onNodeClick(node: MinimalNodeEntity) {
        this.nodeClick.emit({
            value: node
        });

        if (this.navigate && this.navigationMode === DocumentList.SINGLE_CLICK_NAVIGATION) {
            if (node && node.entry) {
                if (node.entry.isFile) {
                    this.onPreviewFile(node);
                }

                if (node.entry.isFolder) {
                    this.performNavigation(node);
                }
            }
        }
    }

    onRowClick(event: DataRowEvent) {
        let item = (<ShareDataRow> event.value).node;
        this.onNodeClick(item);
    }

    onNodeDblClick(node: MinimalNodeEntity) {
        this.nodeDblClick.emit({
            value: node
        });

        if (this.navigate && this.navigationMode === DocumentList.DOUBLE_CLICK_NAVIGATION) {
            if (node && node.entry) {
                if (node.entry.isFile) {
                    this.onPreviewFile(node);
                }

                if (node.entry.isFolder) {
                    this.performNavigation(node);
                }
            }
        }
    }

    onRowDblClick(event?: DataRowEvent) {
        let item = (<ShareDataRow> event.value).node;
        this.onNodeDblClick(item);
    }

    onShowRowContextMenu(event) {
        if (this.contextMenuActions) {
            let args = event.args;
            let node = (<ShareDataRow> args.row).node;
            if (node) {
                args.actions = this.getContextActions(node) || [];
            }
        }
    }

    onShowRowActionsMenu(event) {
        if (this.contentActions) {
            let args = event.args;
            let node = (<ShareDataRow> args.row).node;
            if (node) {
                args.actions = this.getNodeActions(node) || [];
            }
        }
    }

    onExecuteRowAction(event) {
        if (this.contentActions) {
            let args = event.args;
            let node = (<ShareDataRow> args.row).node;
            let action = (<ContentActionModel> args.action);
            this.executeContentAction(node, action);
        }
    }

    onActionMenuError(event) {
        this.error.emit(event);
    }

    onActionMenuSuccess(event) {
        this.reload();
        this.success.emit(event);
    }
}
