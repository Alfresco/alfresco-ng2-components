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
    AfterViewChecked,
    OnChanges,
    TemplateRef
} from 'angular2/core';
import { DatePipe } from 'angular2/common';
import { AlfrescoService } from './../services/alfresco.service';
import { MinimalNodeEntity, NodePaging } from './../models/document-library.model';
import { ContentActionModel } from './../models/content-action.model';
import { ContentColumnModel } from './../models/content-column.model';
import { ColumnSortingModel } from './../models/column-sorting.model';

declare var componentHandler;
declare let __moduleName: string;

@Component({
    moduleId: __moduleName,
    selector: 'alfresco-document-list',
    styleUrls: ['./document-list.css'],
    templateUrl: './document-list.html',
    providers: [AlfrescoService]
})
export class DocumentList implements OnInit, AfterViewChecked, AfterContentInit, OnChanges {

    DEFAULT_ROOT_FOLDER: string = '/Sites/swsdp/documentLibrary';

    __baseUrl = __moduleName.replace('/components/document-list.js', '');

    @Input()
    navigate: boolean = true;

    @Input('navigation-mode')
    navigationMode: string = 'dblclick'; // click|dblclick

    @Input()
    breadcrumb: boolean = false;

    @Input('folder-icon')
    folderIcon: string;

    @Input()
    thumbnails: boolean = false;

    @Output()
    itemClick: EventEmitter<any> = new EventEmitter();

    @Output()
    itemDblClick: EventEmitter<any> = new EventEmitter();

    @Output()
    folderChange: EventEmitter<any> = new EventEmitter();

    @Output()
    preview: EventEmitter<any> = new EventEmitter();

    rootFolder = {
        name: '',
        path: ''
    };

    @Input()
    currentFolderPath: string = '';

    errorMessage;
    route: any[] = [];

    actions: ContentActionModel[] = [];
    columns: ContentColumnModel[] = [];
    emptyFolderTemplate: TemplateRef;

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
                absolutePath: this.currentFolderPath,
                relativePath: this.getRelativePath(this.currentFolderPath)
            });
        }
    }

    sorting: ColumnSortingModel = {
        key: 'name',
        direction: 'asc'
    };

    constructor(
        private _alfrescoService: AlfrescoService) {}

    /**
     * Determines whether navigation to parent folder is available.
     * @returns {boolean}
     */
    canNavigateParent(): boolean {
        return this.navigate && !this.breadcrumb &&
            this.currentFolderPath !== this.rootFolder.path;
    }

    ngOnInit() {
        this.changePath(this.currentFolderPath);
    }

    ngOnChanges(change) {
        this.reload();
    }

    ngAfterContentInit() {
        if (!this.columns || this.columns.length === 0) {
            this.setupDefaultColumns();
        }
    }

    ngAfterViewChecked() {
        // workaround for MDL issues with dynamic components
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }
    }

    changePath(path: string) {
        this.currentFolderPath = path || this.DEFAULT_ROOT_FOLDER;
        this.rootFolder = this._createRootFolder(this.currentFolderPath);
        this.route = [this.rootFolder];
        this.displayFolderContent(this.rootFolder.path);
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

    /**
     * Invoked when 'parent folder' element is clicked.
     * @param e DOM event
     */
    onNavigateParentClick(e?: Event) {
        if (e) {
            e.preventDefault();
        }

        if (this.navigate && this.navigationMode === 'click') {
            this.navigateToParent();
        }
    }

    onNavigateParentDblClick(e?: Event) {
        if (e) {
            e.preventDefault();
        }

        if (this.navigate && this.navigationMode === 'dblclick') {
            this.navigateToParent();
        }
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

        if (this.navigate && this.navigationMode === 'click') {
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

        if (this.navigate && this.navigationMode === 'dblclick') {
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

    private performNavigation(node: MinimalNodeEntity) {
        if (node && node.entry && node.entry.isFolder) {
            let path = this.getNodePath(node);
            this.route.push({
                name: node.entry.name,
                path: path
            });
            this.displayFolderContent(path);
        }
    }

    navigateToParent() {
        this.route.pop();
        let parent = this.route.length > 0 ? this.route[this.route.length - 1] : this.rootFolder;
        if (parent) {
            this.displayFolderContent(parent.path);
        }
    }

    /**
     * Invoked when a breadcrumb route is clicked.
     * @param r Route to navigate to
     * @param e DOM event
     */
    goToRoute(r, e) {
        if (e) {
            e.preventDefault();
        }

        if (this.navigate) {
            let idx = this.route.indexOf(r);
            if (idx > -1) {
                this.route.splice(idx + 1);
                this.displayFolderContent(r.path);
            }
        }
    }

    /**
     * Gets content URL for the given node.
     * @param node Node to get URL for.
     * @returns {string} URL address.
     */
    getContentUrl(node: MinimalNodeEntity): string {
        if (this._alfrescoService) {
            return this._alfrescoService.getContentUrl(node);
        }
        return null;
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
                return `${this.__baseUrl}/img/ft_ic_folder.svg`;
            }

            if (entry.isFile) {
                if (this.thumbnails) {
                    if (this._alfrescoService) {
                        return this._alfrescoService.getDocumentThumbnailUrl(node);
                    }
                    return null;
                }

                if (entry.content && entry.content.mimeType) {
                    let icon = this._alfrescoService.getMimeTypeIcon(entry.content.mimeType);
                    return `${this.__baseUrl}/img/${icon}`;
                }
            }

            return `${this.__baseUrl}/img/ft_ic_miscellaneous.svg`;
        }

        return null;
    }

    /**
     * Invoked when executing content action for a document or folder.
     * @param node Node to be the context of the execution.
     * @param action Action to be executed against the context.
     */
    executeContentAction(node: MinimalNodeEntity, action: ContentActionModel) {
        if (action) {
            action.handler(node, this);
        }
    }

    /**
     * Loads and displays folder content
     * @param path Node path
     */
    displayFolderContent(path) {
        if (path !== null) {
            this.currentFolderPath = path;
            this._alfrescoService
                .getFolder(path)
                .subscribe(
                    folder => this.folder = this.sort(folder, this.sorting),
                    error => this.errorMessage = <any>error
                );
        }
    }

    reload() {
        if (this.currentFolderPath) {
            this.displayFolderContent(this.currentFolderPath);
        }
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
        let value = this._getObjectValueRaw(row.entry, col.source);

        if (col.type === 'date') {
            let datePipe = new DatePipe();
            if (datePipe.supports(value)) {
                // TODO: to be changed to plan non-array value post angular2 beta.15
                let pattern = col.format ? [col.format] : [];
                return datePipe.transform(value, pattern);
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
        if (column && this._isSortableColumn(column)) {
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
        if (this._hasEntries(node)) {
            node.list.entries.sort((a: MinimalNodeEntity, b: MinimalNodeEntity) => {
                if (a.entry.isFolder !== b.entry.isFolder) {
                    return a.entry.isFolder ? -1 : 1;
                }

                let left = this._getObjectValueRaw(a.entry, options.key).toString();
                let right = this._getObjectValueRaw(b.entry, options.key).toString();

                return options.direction === 'asc'
                    ? left.localeCompare(right)
                    : right.localeCompare(left);
            });
        }
        return node;
    }

    private _getObjectValueRaw(target: any, key: string) {
        let val = this.getObjectValue(target, key);

        if (val instanceof Date) {
            val = val.valueOf();
        }

        return val;
    }

    private _createRootFolder(path: string): any {
        let parts =  path.split('/');
        let namePart = parts[parts.length - 1];
        return {
            name: namePart,
            path: path
        };
    }

    private _hasEntries(node: NodePaging): boolean {
        return (node && node.list && node.list.entries && node.list.entries.length > 0);
    }

    private _isSortableColumn(column: ContentColumnModel) {
        return column && column.source && !column.source.startsWith('$');
    }

    private getRelativePath(path: string): string {
        if (path.indexOf('/Sites/swsdp/documentLibrary/') !== -1) {
            return path.replace('/Sites/swsdp/documentLibrary/', '');
        } else {
            return path.replace('/Sites/swsdp/documentLibrary', '');
        }
    }
}
