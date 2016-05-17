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
    AfterViewChecked
} from 'angular2/core';
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
export class DocumentList implements OnInit, AfterViewChecked, AfterContentInit {

    DEFAULT_ROOT_FOLDER: string = '/Sites/swsdp/documentLibrary';

    @Input()
    navigate: boolean = true;

    @Input()
    breadcrumb: boolean = false;

    @Input('folder-icon')
    folderIcon: string;

    @Output()
    itemClick: EventEmitter<any> = new EventEmitter();

    @Output()
    folderClick: EventEmitter<any> = new EventEmitter();

    rootFolder = {
        name: '',
        path: ''
    };

    @Input()
    currentFolderPath: string = '';

    folder: NodePaging;
    errorMessage;

    route: any[] = [];

    actions: ContentActionModel[] = [];
    columns: ContentColumnModel[] = [];

    sorting: ColumnSortingModel = {
        key: 'name',
        direction: 'asc'
    };

    /**
     * Determines whether navigation to parent folder is available.
     * @returns {boolean}
     */
    canNavigateParent(): boolean {
        return this.navigate && !this.breadcrumb &&
            this.currentFolderPath !== this.rootFolder.path;
    }

    constructor(private _alfrescoService: AlfrescoService) {
    }

    _createRootFolder(): any {
        let folderArray =  this.currentFolderPath.split('/');
        let nameFolder = folderArray[folderArray.length - 1];
        return {
            name: nameFolder,
            path: this.currentFolderPath
        };
    }

    ngOnInit() {
        this.currentFolderPath = this.currentFolderPath || this.DEFAULT_ROOT_FOLDER;
        this.rootFolder = this._createRootFolder();
        this.route.push(this.rootFolder);
        this.displayFolderContent(this.rootFolder.path);
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
    onNavigateParentClick(e) {
        if (e) {
            e.preventDefault();
        }

        if (this.navigate) {
            this.route.pop();
            let parent = this.route.length > 0 ? this.route[this.route.length - 1] : this.rootFolder;
            if (parent) {
                this.folderClick.emit({
                    value: parent.path
                });
                this.displayFolderContent(parent.path);
            }
        }
    }

    /**
     * Invoked when list row is clicked.
     * @param item Underlying node item
     * @param e DOM event (optional)
     */
    onItemClick(item: MinimalNodeEntity, e = null) {
        if (e) {
            e.preventDefault();
        }

        this.itemClick.emit({
            value: item
        });

        if (this.navigate && item && item.entry) {
            if (item.entry.isFolder) {
                let path = this.getNodePath(item);

                this.folderClick.emit({
                    value: path
                });

                this.route.push({
                    name: item.entry.name,
                    path: path
                });
                this.displayFolderContent(path);
            }
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
     * Gets thumbnail URL for the given document node.
     * @param node Node to get URL for.
     * @returns {string} URL address.
     */
    getDocumentThumbnailUrl(node: MinimalNodeEntity): string {
        if (this._alfrescoService) {
            return this._alfrescoService.getDocumentThumbnailUrl(node);
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
            action.handler(node);
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

    /**
     * Creates a set of predefined columns.
     */
    setupDefaultColumns(): void {
        let thumbnailCol = new ContentColumnModel();
        thumbnailCol.source = '$thumbnail';

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
        if (column) {
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
                    return options.direction === 'asc'
                        ? (a.entry.isFolder ? -1 : 1)
                        : (a.entry.isFolder ? 1 : -1);
                }

                let left = this.getObjectValue(a.entry, options.key).toString();
                let right = this.getObjectValue(b.entry, options.key).toString();

                return options.direction === 'asc'
                    ? left.localeCompare(right)
                    : right.localeCompare(left);
            });
        }
        return node;
    }

    private _hasEntries(node: NodePaging): boolean {
        return (node && node.list && node.list.entries && node.list.entries.length > 0);
    }
}
