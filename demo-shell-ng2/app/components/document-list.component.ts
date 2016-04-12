import {Component, OnInit, Input} from "angular2/core";
import {AlfrescoService} from "./alfresco.service";
import {FolderEntity} from "./core/entities/folder.entity";
import {DocumentEntity} from "./core/entities/document.entity";

@Component({
    selector: 'alfresco-document-list',
    template: `
        <div *ngIf="folder" class="list-group">
            <a href="#" *ngIf="canNavigateParent()" (click)="onNavigateParentClick($event)" class="list-group-item">
                <i class="fa fa-level-up"></i> ...
            </a>
            <a href="#" *ngFor="#document of folder.items" (click)="onItemClick(document, $event)" class="list-group-item">
                <i *ngIf="document.isFolder" class="fa fa-folder-o"></i>
                {{document.displayName}}
            </a>
        </div>
    `,
    providers: [AlfrescoService]
})
export class DocumentList implements OnInit {

    // example: <alfresco-document-list [navigate]="false"></alfresco-document-list>
    @Input() navigate: boolean = true;
    
    rootFolderPath: string = 'swsdp/documentLibrary';
    currentFolderPath: string = 'swsdp/documentLibrary';
    folder: FolderEntity;
    errorMessage;

    private route: string[] = [];

    canNavigateParent(): boolean {
        return this.currentFolderPath !== this.rootFolderPath;
    }

    constructor (
        private _alfrescoService: AlfrescoService
    ) {}

    ngOnInit() {
        this.route.push(this.rootFolderPath);
        this.displayFolderContent(this.rootFolderPath);
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
            var parent = this.route.length > 0 ? this.route[this.route.length - 1] : this.rootFolderPath;
            if (parent) {
                this.displayFolderContent(parent);
            }
        }
    }

    onItemClick(item: DocumentEntity, $event) {
        if ($event) {
            $event.preventDefault();
        }

        if (this.navigate && item) {
            if (item.isFolder) {
                var path = this.getItemPath(item);
                this.route.push(path);
                this.displayFolderContent(path);
            }
        }
    }

    private getItemPath(item: DocumentEntity):string {
        var container = item.location.container;
        var path = item.location.path !== '/' ? (item.location.path + '/' ) : '/';
        var relativePath = container + path + item.fileName;
        return item.location.site + '/' + relativePath;
    }
}
