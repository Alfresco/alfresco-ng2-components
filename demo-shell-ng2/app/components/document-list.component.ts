import {Component, OnInit, Input, Output, EventEmitter} from "angular2/core";
import {AlfrescoService} from "./alfresco.service";
import {FolderEntity} from "./core/entities/folder.entity";
import {DocumentEntity} from "./core/entities/document.entity";

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
            
            :host .document-header:hover {
                text-decoration: underline;
            }
            
            :host .download-button {
                color: #777;
                text-decoration: none;
            }
            
            :host .download-button:hover {
                color: #555;
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
            <a href="#" *ngFor="#document of folder.items" (click)="onItemClick(document, $event)" class="list-group-item clearfix">
                <a *ngIf="downloads && !document.isFolder" href="{{getContentUrl(document)}}" (click)="onDownloadClick($event)" class="download-button pull-right" download target="_blank">
                    <i class="fa fa-download fa-2x"></i>
                </a>
                <i *ngIf="thumbnails && document.isFolder" class="folder-icon {{folderIconClass}}"></i>
                <img *ngIf="thumbnails && !document.isFolder" class="file-icon" src="{{getDocumentThumbnailUrl(document)}}">
                <h4 class="list-group-item-heading document-header">
                    {{document.displayName}}
                </h4>
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

    // example: <alfresco-document-list [navigate]="false"></alfresco-document-list>
    @Input() navigate: boolean = true;
    // example: <alfresco-document-list [breadcrumb]="true"></alfresco-document-list>
    @Input() breadcrumb: boolean = false;
    // example: <alfresco-document-list folder-icon-class="fa fa-folder fa-4x"></alfresco-document-list>
    @Input('folder-icon-class') folderIconClass: string = 'fa fa-folder-o fa-4x';
    // example: <alfresco-document-list #list [thumbnails]="false"></alfresco-document-list>
    @Input() thumbnails: boolean = true;
    // example: <alfresco-document-list #list [downloads]="false"></alfresco-document-list>
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

    private displayFolderContent(path) {
        this.currentFolderPath = path;
        this._alfrescoService
            .getFolder(path)
            .subscribe(
                folder => this.folder = folder,
                error => this.errorMessage = <any>error
            );
    }

    onNavigateParentClick($event) {
        if ($event) {
            $event.preventDefault();
        }

        if (this.navigate) {
            this.route.pop();
            var parent = this.route.length > 0 ? this.route[this.route.length - 1] : this.rootFolder;
            if (parent) {
                this.displayFolderContent(parent.path);
            }
        }
    }

    onDownloadClick(event) {
        event.stopPropagation();
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
                var path = this.getItemPath(item);
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
            var idx = this.route.indexOf(r);
            if (idx > -1) {
                this.route.splice(idx + 1);
                this.displayFolderContent(r.path);
            }
        }
    }

    private getItemPath(item: DocumentEntity):string {
        var container = item.location.container;
        var path = item.location.path !== '/' ? (item.location.path + '/' ) : '/';
        var relativePath = container + path + item.fileName;
        return item.location.site + '/' + relativePath;
    }
    
    getContentUrl(document: DocumentEntity) {
        return this._alfrescoService.getContentUrl(document);
    }
    
    getDocumentThumbnailUrl(document:  DocumentEntity) {
        return this._alfrescoService.getDocumentThumbnailUrl(document);
    }
}
