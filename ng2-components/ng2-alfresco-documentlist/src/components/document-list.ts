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
    AfterViewChecked
} from 'angular2/core';
import {AlfrescoService} from './../services/alfresco.service';
import {FolderEntity} from './../core/entities/folder.entity';
import {DocumentEntity} from './../core/entities/document.entity';
import {ContentActionModel} from './../models/content-action.model';
import {ContentColumnModel} from './../models/content-column.model';

declare var componentHandler;
declare let __moduleName:string;

@Component({
    moduleId: __moduleName,
    selector: 'alfresco-document-list',
    styleUrls: ['./document-list.css'],
    templateUrl: './document-list.html',
    providers: [AlfrescoService]
})
export class DocumentList implements OnInit, AfterViewChecked {

    @Input() navigate: boolean = true;
    @Input() breadcrumb: boolean = false;
    @Input('folder-icon') folderIcon: string;
    @Input() thumbnails: boolean = true;

    @Output() itemClick: EventEmitter<any> = new EventEmitter();

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
        return this.navigate &&
            !this.breadcrumb &&
            this.currentFolderPath !== this.rootFolder.path;
    }

    constructor (
        private _alfrescoService: AlfrescoService
    ) {}

    ngOnInit() {
        this.route.push(this.rootFolder);
        this.displayFolderContent(this.rootFolder.path);
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

    onItemClick(item: DocumentEntity, $event) {
        if ($event) {
            $event.preventDefault();
        }

        this.itemClick.emit({
            value: item
        });

        if (this.navigate && item) {
            if (item.isFolder) {
                let path = this.getItemPath(item);
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

    getContentUrl(document: DocumentEntity) {
        return this._alfrescoService.getContentUrl(document);
    }

    getDocumentThumbnailUrl(document:  DocumentEntity) {
        return this._alfrescoService.getDocumentThumbnailUrl(document);
    }

    executeContentAction(document:DocumentEntity, action: ContentActionModel) {
        // todo: safety checks
        action.handler(document);
    }

    private getItemPath(item: DocumentEntity):string {
        let container = item.location.container;
        let path = item.location.path !== '/' ? (item.location.path + '/' ) : '/';
        let relativePath = container + path + item.fileName;
        return item.location.site + '/' + relativePath;
    }

    private displayFolderContent(path) {
        this.currentFolderPath = path;
        this._alfrescoService
            .getFolder(path)
            .subscribe(
                folder => this.folder = folder,
                error => this.errorMessage = <any>error
            );
    }
}
