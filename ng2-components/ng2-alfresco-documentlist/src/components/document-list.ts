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
    ViewChild
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs/Rx';
import { CONTEXT_MENU_DIRECTIVES } from 'ng2-alfresco-core';

import {
    ALFRESCO_DATATABLE_DIRECTIVES,
    DataSorting,
    DataRowEvent,
    DataTableComponent
} from 'ng2-alfresco-datatable';

import { AlfrescoService } from './../services/alfresco.service';
import { MinimalNodeEntity, NodePaging } from './../models/document-library.model';
import { ContentActionModel } from './../models/content-action.model';
import { ContentColumnModel } from './../models/content-column.model';
import { ColumnSortingModel } from './../models/column-sorting.model';
import { ShareDataTableAdapter, ShareDataRow } from './../data/share-datatable-adapter';

declare var componentHandler;
declare let __moduleName: string;

@Component({
    moduleId: __moduleName,
    selector: 'alfresco-document-list',
    styleUrls: ['./document-list.css'],
    templateUrl: './document-list.html',
    providers: [AlfrescoService],
    directives: [CONTEXT_MENU_DIRECTIVES, ALFRESCO_DATATABLE_DIRECTIVES],
    host: {
        '(contextmenu)': 'onShowContextMenu($event)'
    }
})
export class DocumentList implements OnInit, AfterViewInit, AfterViewChecked, AfterContentInit, OnChanges {

    static SINGLE_CLICK_NAVIGATION: string = 'click';
    static DOUBLE_CLICK_NAVIGATION: string = 'dblclick';

    DEFAULT_ROOT_FOLDER: string = '/';

    baseComponentPath = __moduleName.replace('/components/document-list.js', '');

    @Input()
    navigate: boolean = true;

    @Input('navigation-mode')
    navigationMode: string = 'dblclick'; // click|dblclick

    @Input()
    thumbnails: boolean = false;

    @Input()
    multiselect: boolean = false;

    @Input()
    contentActions: boolean = false;

    @Input()
    contextMenuActions: boolean = false;

    @Output()
    itemClick: EventEmitter<any> = new EventEmitter();

    @Output()
    itemDblClick: EventEmitter<any> = new EventEmitter();

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
        }
    }

    errorMessage;

    actions: ContentActionModel[] = [];
    columns: ContentColumnModel[] = [];
    emptyFolderTemplate: TemplateRef<any>;

    private _folder: NodePaging;

    get folder(): NodePaging {
        return this._folder;
    }

    set folder(value: NodePaging) {
        let isChanged = this._folder !== value;
        this._folder = value;
        if (isChanged) {
            this.folderChange.emit({
                value: value,
                path: this.currentFolderPath
            });
        }
    }

    sorting: ColumnSortingModel = {
        key: 'name',
        direction: 'asc'
    };

    contextActionHandler: Subject<any> = new Subject();

    data: ShareDataTableAdapter;

    constructor(
        private alfrescoService: AlfrescoService,
        private ngZone: NgZone) {

        this.setupData();
    }

    getContextActions(node: MinimalNodeEntity) {
        if (node && node.entry) {
            let targetType;

            if (node.entry.isFolder) {
                targetType = 'folder';
            }

            if (node.entry.isFile) {
                targetType = 'document';
            }

            if (targetType) {
                let actions = this.getContentActions(targetType, 'menu');
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
        this.displayFolderContent(this.currentFolderPath);
        this.contextActionHandler.subscribe(val => this.contextActionCallback(val));
    }

    ngOnChanges(change) {
        this.reload();
    }

    ngAfterContentInit() {
        if (!this.columns || this.columns.length === 0) {
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

    /**
     * Get a list of content actions based on target and type.
     * @param target Target to filter actions by.
     * @param type Type to filter actions by.
     * @returns {ContentActionModel[]} List of actions filtered by target and type.
     */
    getContentActions(target: string, type: string): ContentActionModel[] {
        if (target && type) {

            let ltarget = target.toLowerCase();
            let ltype = type.toLowerCase();

            return this.actions.filter(entry => {
                return entry.target.toLowerCase() === ltarget &&
                    entry.type.toLowerCase() === ltype;
            });
        }
        return [];
    }

    getNodeActions(node: MinimalNodeEntity): ContentActionModel[] {
        let target = null;

        if (node.entry.isFile) {
            target = 'document';
        }

        if (node.entry.isFolder) {
            target = 'folder';
        }

        return this.getContentActions(target, 'menu');
    }

    /**
     * Invoked when list row is clicked.
     * @param item Underlying node item
     * @param e DOM event (optional)
     */
    onItemClick(item: MinimalNodeEntity, e?: Event) {
        if (e) {
            e.preventDefault();
        }

        this.itemClick.emit({
            value: item
        });

        if (this.navigate && this.navigationMode === DocumentList.SINGLE_CLICK_NAVIGATION) {
            if (item && item.entry) {
                if (item.entry.isFile) {
                    this.preview.emit({
                        value: item
                    });
                }

                if (item.entry.isFolder) {
                    this.performNavigation(item);
                }
            }
        }
    }

    onItemDblClick(item: MinimalNodeEntity, e?: Event) {
        if (e) {
            e.preventDefault();
        }

        this.itemDblClick.emit({
            value: item
        });

        if (this.navigate && this.navigationMode === DocumentList.DOUBLE_CLICK_NAVIGATION) {
            if (item && item.entry) {
                if (item.entry.isFile) {
                    this.preview.emit({
                        value: item
                    });
                }

                if (item.entry.isFolder) {
                    this.performNavigation(item);
                }
            }
        }
    }

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
     * Gets thumbnail URL for the given node.
     * @param node Node to get URL for.
     * @returns {string} URL address.
     */
    getThumbnailUrl(node: MinimalNodeEntity): string {
        if (node && node.entry) {
            let entry = node.entry;

            if (entry.isFolder) {
                return `${this.baseComponentPath}/img/ft_ic_folder.svg`;
            }

            if (entry.isFile) {
                if (this.thumbnails) {
                    if (this.alfrescoService) {
                        return this.alfrescoService.getDocumentThumbnailUrl(node);
                    }
                    return null;
                }

                if (entry.content && entry.content.mimeType) {
                    let icon = this.alfrescoService.getMimeTypeIcon(entry.content.mimeType);
                    if (icon) {
                        return `${this.baseComponentPath}/img/${icon}`;
                    }
                }
            }

            return `${this.baseComponentPath}/img/ft_ic_miscellaneous.svg`;
        }

        return null;
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
        if (path) {
            this.alfrescoService
                .getFolder(path)
                .subscribe(
                    folder => this.folder = this.sort(folder, this.sorting),
                    error => this.errorMessage = <any>error
                );
            this.data.loadPath(path);
        }
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
     * Gets a value from an object by composed key
     * documentList.getObjectValue({ item: { nodeType: 'cm:folder' }}, 'item.nodeType') ==> 'cm:folder'
     * @param target
     * @param key
     * @returns {string}
     */
    getObjectValue(target: any, key: string): any {
        let keys = key.split('.');
        key = '';

        do {
            key += keys.shift();
            let value = target[key];
            if (value !== undefined && (typeof value === 'object' || !keys.length)) {
                target = value;
                key = '';
            } else if (!keys.length) {
                target = undefined;
            } else {
                key += '.';
            }
        } while (keys.length);

        return target;
    }

    getCellValue(row: MinimalNodeEntity, col: ContentColumnModel): any {
        let value = this.getObjectValueRaw(row.entry, col.source);

        if (col.type === 'date') {
            let datePipe = new DatePipe();
            try {
                return datePipe.transform(value, col.format);
            } catch (err) {
                console.error(`DocumentList: error parsing date ${value} to format ${col.format}`);
            }
        }

        if (col.type === 'image') {

            if (col.source === '$thumbnail') {
                return this.getThumbnailUrl(row);
            }

        }

        return value;
    }

    /**
     * Creates a set of predefined columns.
     */
    setupDefaultColumns(): void {
        let thumbnailCol = new ContentColumnModel();
        thumbnailCol.source = '$thumbnail';
        thumbnailCol.type = 'image';

        let nameCol = new ContentColumnModel();
        nameCol.title = 'Name';
        nameCol.source = 'name';
        nameCol.cssClass = 'full-width name-column';

        this.columns = [
            thumbnailCol,
            nameCol
        ];
    }

    onColumnHeaderClick(column: ContentColumnModel) {
        if (column && this.isSortableColumn(column)) {
            if (this.sorting.key === column.source) {
                this.sorting.direction = this.sorting.direction === 'asc' ? 'desc' : 'asc';
            } else {
                this.sorting = <ColumnSortingModel> {
                    key: column.source,
                    direction: 'asc'
                };
            }
            this.sort(this.folder, this.sorting);
        }
    }

    sort(node: NodePaging, options: ColumnSortingModel) {
        if (this.hasEntries(node)) {
            node.list.entries.sort((a: MinimalNodeEntity, b: MinimalNodeEntity) => {
                if (a.entry.isFolder !== b.entry.isFolder) {
                    return a.entry.isFolder ? -1 : 1;
                }

                let left = this.getObjectValueRaw(a.entry, options.key).toString();
                let right = this.getObjectValueRaw(b.entry, options.key).toString();

                return options.direction === 'asc'
                    ? left.localeCompare(right)
                    : right.localeCompare(left);
            });
        }
        return node;
    }

    onRowClick(event: DataRowEvent) {
        let item = (<ShareDataRow> event.value).node;

        if (this.navigate && this.navigationMode === DocumentList.SINGLE_CLICK_NAVIGATION) {
            if (item && item.entry) {
                if (item.entry.isFile) {
                    this.preview.emit({
                        value: item
                    });
                }

                if (item.entry.isFolder) {
                    this.performNavigation(item);
                }
            }
        }

    }

    onRowDblClick(event?: DataRowEvent) {
        let item = (<ShareDataRow> event.value).node;
        if (this.navigate && this.navigationMode === DocumentList.DOUBLE_CLICK_NAVIGATION) {
            if (item && item.entry) {
                if (item.entry.isFile) {
                    this.preview.emit({
                        value: item
                    });
                }

                if (item.entry.isFolder) {
                    this.performNavigation(item);
                }
            }
        }
    }

    private getObjectValueRaw(target: any, key: string) {
        let val = this.getObjectValue(target, key);

        if (val instanceof Date) {
            val = val.valueOf();
        }

        return val;
    }

    private hasEntries(node: NodePaging): boolean {
        return (node && node.list && node.list.entries && node.list.entries.length > 0);
    }

    private isSortableColumn(column: ContentColumnModel) {
        return column && column.source && !column.source.startsWith('$');
    }

    private setupData() {
        this.data = new ShareDataTableAdapter(
            this.alfrescoService,
            this.baseComponentPath,
            [
                { type: 'image', key: '$thumbnail', title: '', srTitle: 'Thumbnail' },
                { type: 'text', key: 'name', title: 'Name', cssClass: 'full-width', sortable: true },
                { type: 'text', key: 'createdByUser.displayName', title: 'Created by', sortable: true },
                { type: 'date', format: 'medium', key: 'createdAt', title: 'Created on', sortable: true }
            ]
        );

        this.data.setSorting(new DataSorting('id', 'asc'));
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
