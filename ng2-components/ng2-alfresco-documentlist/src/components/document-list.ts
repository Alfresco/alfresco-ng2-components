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

import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    AfterContentInit,
    AfterViewChecked
} from 'angular2/core';
import {AlfrescoService} from './../services/alfresco.service';
import {FolderEntity, DocumentEntity} from './../models/document-library.model';
import {ContentActionModel} from './../models/content-action.model';
import {ContentColumnModel} from './../models/content-column.model';

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

    @Input()
    navigate: boolean = true;

    @Input()
    breadcrumb: boolean = false;

    @Input('folder-icon')
    folderIcon: string;

    @Output()
    itemClick: EventEmitter<any> = new EventEmitter();

    rootFolder = {
        name: 'Document Library',
        path: 'swsdp/documentLibrary'
    };
    currentFolderPath: string = 'swsdp/documentLibrary';
    folder: FolderEntity;
    errorMessage;

    route: any[] = [];

    actions: ContentActionModel[] = [];
    columns: ContentColumnModel[] = [];

    canNavigateParent(): boolean {
        return this.navigate && !this.breadcrumb &&
            this.currentFolderPath !== this.rootFolder.path;
    }

    constructor(private _alfrescoService: AlfrescoService) {
    }

    ngOnInit() {
        this.route.push(this.rootFolder);
        this.displayFolderContent(this.rootFolder.path);
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

    getContentActions(target: string, type: string) {
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

    onNavigateParentClick($event) {
        if ($event) {
            $event.preventDefault();
        }

        if (this.navigate) {
            this.route.pop();
            let parent = this.route.length > 0 ? this.route[this.route.length - 1] : this.rootFolder;
            if (parent) {
                this.displayFolderContent(parent.path);
            }
        }
    }

    onItemClick(item: DocumentEntity, $event = null) {
        if ($event) {
            $event.preventDefault();
        }

        this.itemClick.emit({
            value: item
        });

        if (this.navigate && item) {
            if (item.isFolder) {
                let path = this.getNodePath(item);
                this.route.push({
                    name: item.displayName,
                    path: path
                });
                this.displayFolderContent(path);
            }
        }
    }

    goToRoute(r, $event) {
        if ($event) {
            $event.preventDefault();
        }

        if (this.navigate) {
            let idx = this.route.indexOf(r);
            if (idx > -1) {
                this.route.splice(idx + 1);
                this.displayFolderContent(r.path);
            }
        }
    }

    getContentUrl(node: DocumentEntity) {
        if (this._alfrescoService) {
            return this._alfrescoService.getContentUrl(node);
        }
        return null;
    }

    getDocumentThumbnailUrl(node: DocumentEntity) {
        if (this._alfrescoService) {
            return this._alfrescoService.getDocumentThumbnailUrl(node);
        }
        return null;
    }

    executeContentAction(node: DocumentEntity, action: ContentActionModel) {
        if (action) {
            action.handler(node);
        }
    }

    displayFolderContent(path) {
        if (path) {
            this.currentFolderPath = path;
            this._alfrescoService
                .getFolder(path)
                .subscribe(
                    folder => this.folder = folder,
                    error => this.errorMessage = <any>error
                );
        }
    }

    getNodePath(node: DocumentEntity): string {
        if (node) {
            let container = node.location.container;
            let path = node.location.path !== '/' ? (node.location.path + '/' ) : '/';
            let relativePath = container + path + node.fileName;
            return node.location.site + '/' + relativePath;
        }
        return null;
    }

    setupDefaultColumns(): void {
        let thumbnailCol = new ContentColumnModel();
        thumbnailCol.source = '$thumbnail';

        let nameCol = new ContentColumnModel();
        nameCol.title = 'Name';
        nameCol.source = 'displayName';
        nameCol.cssClass = 'full-width name-column';

        this.columns = [
            thumbnailCol,
            nameCol
        ];
    }
}
