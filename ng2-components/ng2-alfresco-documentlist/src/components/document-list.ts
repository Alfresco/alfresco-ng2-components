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
import {Component, OnInit, Input, Output, EventEmitter} from 'angular2/core';
import {AlfrescoService} from './../services/alfresco.service';
import {FolderEntity} from './../core/entities/folder.entity';
import {DocumentEntity} from './../core/entities/document.entity';
import {ContentActionModel} from './../models/content-action.model';

@Component({
    selector: 'alfresco-document-list',
    styles: [
        `
            :host .breadcrumb {
                margin-bottom: 4px;
            }

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
        <div *ngIf="folder" class="list-group">
            <a href="#" *ngIf="canNavigateParent()" (click)="onNavigateParentClick($event)" class="list-group-item">
                <span class="glyphicon glyphicon-level-up"></span> ...
            </a>
            <a href="#" *ngFor="#document of folder.items" class="list-group-item clearfix">
                
                <!-- folder actions -->
                <div *ngIf="document.isFolder && folderActions.length > 0" class="btn-group pull-right">
                    <button type="button" class="btn btn-default"
                            *ngFor="#qfa of quickFolderActions" (click)="executeContentAction(document, qfa)">
                        <span *ngIf="qfa.icon" class="{{qfa.icon}}"></span>
                        <span *ngIf="qfa.title">{{qfa.title}}</span>
                    </button>
                    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" 
                          aria-haspopup="true" aria-expanded="false">
                        Actions <span class="caret"></span>
                    </button>
                    <ul class="dropdown-menu">
                        <li *ngFor="#folderAction of folderActions">
                            <a href="#" (click)="executeContentAction(document, folderAction)">{{folderAction.title}}</a>
                        </li>
                    </ul>
                </div>
                
                <!-- document actions -->
                <div *ngIf="!document.isFolder" class="btn-group pull-right">
                    <button type="button" class="btn btn-default"
                            *ngFor="#qda of quickDocumentActions" (click)="executeContentAction(document, qda)">
                        <span *ngIf="qda.icon" class="{{qda.icon}}"></span>
                        <span *ngIf="qda.title">{{qda.title}}</span>
                    </button>
                    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" 
                          aria-haspopup="true" aria-expanded="false">
                        Actions <span class="caret"></span>
                    </button>
                    <ul class="dropdown-menu">
                        <li>
                            <a *ngIf="downloads && !document.isFolder" 
                                href="{{getContentUrl(document)}}" 
                                download target="_blank">
                                Download
                            </a>
                        </li>
                        <li *ngIf="documentActions.length > 0" role="separator" class="divider"></li>
                        <li *ngFor="#documentAction of documentActions">
                            <a href="#" (click)="executeContentAction(document, documentAction)">{{documentAction.title}}</a>
                        </li>
                    </ul>
                </div>
                
                <i *ngIf="thumbnails && document.isFolder" class="folder-icon {{folderIconClass || 'glyphicon glyphicon-folder-close'}}"
                    (click)="onItemClick(document, $event)">
                </i>
                <img *ngIf="thumbnails && !document.isFolder" class="file-icon"
                    alt=""
                    src="{{getDocumentThumbnailUrl(document)}}"
                    (click)="onItemClick(document, $event)">
                <h1 class="list-group-item-heading document-header" (click)="onItemClick(document, $event)" >
                    {{document.displayName}}
                </h1>
                <p class="list-group-item-text">{{document.description}}</p>
                <small>
                    Modified {{document.modifiedOn}} by {{document.modifiedBy}}
                </small>
            </a>
        </div>
    `,
    providers: [AlfrescoService]
})
export class DocumentList implements OnInit {

    @Input() navigate: boolean = true;
    @Input() breadcrumb: boolean = false;
    @Input('folder-icon') folderIconClass: string;
    @Input() thumbnails: boolean = true;
    @Input() downloads: boolean = true;

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
