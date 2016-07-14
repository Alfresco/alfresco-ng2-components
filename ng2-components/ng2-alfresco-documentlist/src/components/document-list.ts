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

import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    AfterContentInit,
    AfterViewInit,
    AfterViewChecked,
    OnChanges,
    TemplateRef,
    NgZone,
    ViewChild,
    HostListener
} from '@angular/core';
import { Subject } from 'rxjs/Rx';
import {
    CONTEXT_MENU_DIRECTIVES,
    AlfrescoTranslationService
} from 'ng2-alfresco-core';

import {
    ALFRESCO_DATATABLE_DIRECTIVES,
    DataRowEvent,
    DataTableComponent,
    ObjectDataColumn
} from 'ng2-alfresco-datatable';

import { DocumentListService } from './../services/document-list.service';
import { MinimalNodeEntity } from './../models/document-library.model';
import { ContentActionModel } from './../models/content-action.model';
import { ShareDataTableAdapter, ShareDataRow } from './../data/share-datatable-adapter';

declare var componentHandler;
declare let __moduleName: string;

@Component({
    moduleId: __moduleName,
    selector: 'alfresco-document-list',
    styleUrls: ['./document-list.css'],
    templateUrl: './document-list.html',
    providers: [DocumentListService],
    directives: [CONTEXT_MENU_DIRECTIVES, ALFRESCO_DATATABLE_DIRECTIVES]
})
export class DocumentList implements OnInit, AfterViewInit, AfterViewChecked, AfterContentInit, OnChanges {

    static SINGLE_CLICK_NAVIGATION: string = 'click';
    static DOUBLE_CLICK_NAVIGATION: string = 'dblclick';
    static DEFAULT_PAGE_SIZE: number = 20;

    DEFAULT_ROOT_FOLDER: string = '/';

    baseComponentPath = __moduleName.replace('/components/document-list.js', '');

    @Input()
    navigate: boolean = true;

    @Input()
    navigationMode: string = 'dblclick'; // click|dblclick

    @Input()
    thumbnails: boolean = false;

    @Input()
    multiselect: boolean = false;

    @Input()
    contentActions: boolean = false;

    @Input()
    contextMenuActions: boolean = false;

    @Input()
    pageSize: number = DocumentList.DEFAULT_PAGE_SIZE;

    @Output()
    nodeClick: EventEmitter<any> = new EventEmitter();

    @Output()
    nodeDblClick: EventEmitter<any> = new EventEmitter();

    @Output()
    folderChange: EventEmitter<any> = new EventEmitter();

    @Output()
    preview: EventEmitter<any> = new EventEmitter();

    @ViewChild(DataTableComponent)
    dataTable: DataTableComponent;

    private _path = this.DEFAULT_ROOT_FOLDER;

    get currentFolderPath(): string {
        return this._path;
    }

    @Input()
    set currentFolderPath(value: string) {
        if (value !== this._path) {
            this._path = value || this.DEFAULT_ROOT_FOLDER;
            this.displayFolderContent(this._path);
            this.folderChange.emit({
                path: this.currentFolderPath
            });
        }
    }

    errorMessage;
    actions: ContentActionModel[] = [];
    emptyFolderTemplate: TemplateRef<any>;
    contextActionHandler: Subject<any> = new Subject();
    data: ShareDataTableAdapter;

    constructor(
        private documentListService: DocumentListService,
        private ngZone: NgZone,
        private translate: AlfrescoTranslationService) {

        this.data = new ShareDataTableAdapter(this.documentListService, this.baseComponentPath, []);

        if (translate) {
            translate.addTranslationFolder('node_modules/ng2-alfresco-documentlist');
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
        this.displayFolderContent(this.currentFolderPath);
        this.contextActionHandler.subscribe(val => this.contextActionCallback(val));
    }

    ngOnChanges() {
        this.reload();
    }

    ngAfterContentInit() {
        let columns = this.data.getColumns();
        if (!columns || columns.length === 0) {
            this.setupDefaultColumns();
        }
    }

    ngAfterViewInit() {
        if (this.dataTable) {
            if (this.emptyFolderTemplate) {
                this.dataTable.noContentTemplate = this.emptyFolderTemplate;
            }

        }
    }

    ngAfterViewChecked() {
        // workaround for MDL issues with dynamic components
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }

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
            this.currentFolderPath = this.getNodePath(node);
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

    displayFolderContent(path: string) {
        this.data.loadPath(path);
    }

    reload() {
        this.ngZone.run(() => {
            if (this.currentFolderPath) {
                this.displayFolderContent(this.currentFolderPath);
            }
        });
    }

    /**
     * Gets a path for a given node.
     * @param node
     * @returns {string}
     */
    getNodePath(node: MinimalNodeEntity): string {
        if (node) {
            let pathWithCompanyHome = node.entry.path.name;
            return pathWithCompanyHome.replace('/Company Home', '') + '/' + node.entry.name;
        }
        return null;
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
}
