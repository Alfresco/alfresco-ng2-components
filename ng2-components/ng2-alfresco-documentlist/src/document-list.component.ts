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
import {AlfrescoService} from './alfresco.service';
import {FolderEntity} from './core/entities/folder.entity';
import {DocumentEntity} from './core/entities/document.entity';

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
                <i class="fa fa-level-up"></i> ...
            </a>
            <a href="#" *ngFor="#document of folder.items" class="list-group-item clearfix">
                
                <div *ngIf="!document.isFolder" class="btn-group pull-right">
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
                        <!--
                        <li><a href="#">(todo:) Another action</a></li>
                        <li><a href="#">(todo:) Something else here</a></li>
                        <li role="separator" class="divider"></li>
                        <li><a href="#">(todo:) Separated link</a></li>
                        -->
                    </ul>
                </div>
                
                <i *ngIf="thumbnails && document.isFolder" class="folder-icon {{folderIconClass}}"
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
    @Input('folder-icon-class') folderIconClass: string = 'fa fa-folder-o fa-4x';
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
