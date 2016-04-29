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

declare var componentHandler;

@Component({
    selector: 'alfresco-document-list',
    styles: [
        `
            :host .full-width { width: 100%; }
            
            :host .folder-thumbnail {
                font-size: 48px;
                cursor: pointer;
            }
            
            :host .document-thumbnail {
                width: 48px;
                height: 48px;
                cursor: pointer;
            }
            
            :host .content-header {
                font-size: 15px;
            }
           
            :host .content-header:hover {
                text-decoration: underline;
                cursor: pointer;
            }
            
            :host .parent-folder-link { cursor: pointer; }
            :host .parent-folder-link > td { text-align: left; }
            :host .folder-header-cell { cursor: pointer; }
            
            :host .breadcrumb { margin-bottom: 4px; }

            :host .folder-icon {
                float: left;
                margin-right: 10px;
                font-size: 4em;
            }

            :host .file-icon {
                width: 52px;
                height: 52px;
                float: left;
                margin-right: 10px;
            }
            
            :host .document-header {
                font-size: 24px;
                line-height: 32px;
            }
            
            :host .document-header:hover {
                text-decoration: underline;
            }
        `
    ],
    template: `
        <ol *ngIf="breadcrumb" class="breadcrumb">
            <li *ngFor="#r of route; #last = last" [class.active]="last" [ngSwitch]="last">
                <span *ngSwitchWhen="true">{{r.name}}</span>
                <a *ngSwitchDefault href="#" (click)="goToRoute(r, $event)">{{r.name}}</a>
            </li>
        </ol>
        <table *ngIf="folder" class="mdl-data-table mdl-js-data-table mdl-shadow--2dp full-width">
            <thead>
                <tr>
                    <!-- Thumbnails -->
                    <th *ngIf="thumbnails"></th>
                    <!-- Name -->
                    <th class="mdl-data-table__cell--non-numeric full-width">Name</th>
                    <!-- Actions -->
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr class="parent-folder-link" *ngIf="canNavigateParent()" (click)="onNavigateParentClick($event)">
                    <td colspan="3">
                        <button class="mdl-button mdl-js-button mdl-button--icon"
                                (click)="onNavigateParentClick($event)">
                            <i class="material-icons">arrow_upward</i>
                        </button>
                    </td>
                </tr>
                
                <tr *ngFor="#content of folder.items; #idx = index">
                    <!-- Thumbnails: folder -->
                    <td *ngIf="thumbnails && content.isFolder">
                        <i class="material-icons folder-thumbnail" 
                            (click)="onItemClick(content, $event)">{{folderIcon || 'folder_open'}}</i>
                    </td>
                    
                     <!-- Thumbnails: document -->
                    <td *ngIf="thumbnails && !content.isFolder">
                        <img *ngIf="thumbnails" class="document-thumbnail"
                             alt=""
                             src="{{getDocumentThumbnailUrl(content)}}"
                             (click)="onItemClick(content, $event)">
                    </td>
                    
                    <!-- Name: folder -->
                    <td *ngIf="content.isFolder" class="mdl-data-table__cell--non-numeric folder-header-cell" 
                        (click)="onItemClick(content, $event)">
                        <span class="content-header">
                            {{content.displayName}}
                        </span>
                    </td>
                    
                    <!-- Name: document -->
                    <td *ngIf="!content.isFolder" class="mdl-data-table__cell--non-numeric" >
                        <span class="content-header" (click)="onItemClick(content, $event)">
                            {{content.displayName}}
                        </span>
                    </td>
                    
                    
                    <!-- Actions: Folder cell template -->
                    <td *ngIf="content.isFolder">
                        <!-- quick action buttons -->
                        <button class="mdl-button mdl-js-button mdl-button--icon"
                                *ngFor="#action of quickFolderActions"
                                (click)="executeContentAction(content, action)">
                            <i class="material-icons">{{action.icon}}</i>
                        </button>
                        
                        <!-- action menu -->
                        <button [id]="'folder_action_menu_' + idx" class="mdl-button mdl-js-button mdl-button--icon">
                            <i class="material-icons">more_vert</i>
                        </button>
                        <ul class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect"
                            [attr.for]="'folder_action_menu_' + idx">
                            <li class="mdl-menu__item"
                                *ngFor="#action of folderActions"
                                (click)="executeContentAction(content, action)">
                                {{action.title}}
                            </li>
                        </ul>
                    </td>
                    <!-- Actions: Document cell template -->
                    <td *ngIf="!content.isFolder">
                        <!-- quick action buttons -->
                        <button class="mdl-button mdl-js-button mdl-button--icon"
                                *ngFor="#action of quickDocumentActions"
                                (click)="executeContentAction(content, action)">
                            <i class="material-icons">{{action.icon}}</i>
                        </button>
                        
                        <!-- action menu -->
                        <button [id]="'document_action_menu_' + idx" class="mdl-button mdl-js-button mdl-button--icon">
                            <i class="material-icons">more_vert</i>
                        </button>
                        <ul class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect"
                            [attr.for]="'document_action_menu_' + idx">
                            <li class="mdl-menu__item"
                                *ngFor="#action of documentActions"
                                (click)="executeContentAction(content, action)">
                                {{action.title}}
                            </li>
                        </ul>
                    </td>
                </tr>
            </tbody>
        </table>
    `,
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

    documentActions: ContentActionModel[] = [];
    quickDocumentActions: ContentActionModel[] = [];
    folderActions: ContentActionModel[] = [];
    quickFolderActions: ContentActionModel[] = [];

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

    registerDocumentAction(action: ContentActionModel) {
        if (action) {
            this.documentActions.push(action);
        }
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
