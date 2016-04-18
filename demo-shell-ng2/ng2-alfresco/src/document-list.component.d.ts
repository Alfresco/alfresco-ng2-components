import { OnInit, EventEmitter } from "angular2/core";
import { AlfrescoService } from "./alfresco.service";
import { FolderEntity } from "./core/entities/folder.entity";
import { DocumentEntity } from "./core/entities/document.entity";
export declare class DocumentList implements OnInit {
    private _alfrescoService;
    navigate: boolean;
    breadcrumb: boolean;
    folderIconClass: string;
    thumbnails: boolean;
    downloads: boolean;
    itemClick: EventEmitter<any>;
    rootFolder: {
        name: string;
        path: string;
    };
    currentFolderPath: string;
    folder: FolderEntity;
    errorMessage: any;
    route: any[];
    canNavigateParent(): boolean;
    constructor(_alfrescoService: AlfrescoService);
    ngOnInit(): void;
    private displayFolderContent(path);
    onNavigateParentClick($event: any): void;
    onDownloadClick(event: any): void;
    onItemClick(item: DocumentEntity, $event: any): void;
    goToRoute(r: any, $event: any): void;
    private getItemPath(item);
    getContentUrl(document: DocumentEntity): string;
    getDocumentThumbnailUrl(document: DocumentEntity): string;
}
