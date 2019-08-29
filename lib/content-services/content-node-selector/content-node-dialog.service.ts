/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { MatDialog } from '@angular/material';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { ContentService, ThumbnailService } from '@alfresco/adf-core';
import { Subject, Observable, throwError } from 'rxjs';
import { ShareDataRow } from '../document-list/data/share-data-row.model';
import { Node, NodeEntry, SitePaging } from '@alfresco/js-api';
import { SitesService, TranslationService, AllowableOperationsEnum } from '@alfresco/adf-core';
import { DocumentListService } from '../document-list/services/document-list.service';
import { ContentNodeSelectorComponent } from './content-node-selector.component';
import { ContentNodeSelectorComponentData } from './content-node-selector.component-data.interface';
import { NodeLockDialogComponent } from '../dialogs/node-lock.dialog';
import { switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ContentNodeDialogService {
    static nonDocumentSiteContent = [
        'blog',
        'calendar',
        'dataLists',
        'discussions',
        'links',
        'wiki'
    ];

    /** Emitted when an error occurs. */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    constructor(private dialog: MatDialog,
                private contentService: ContentService,
                private documentListService: DocumentListService,
                private siteService: SitesService,
                private translation: TranslationService,
                private thumbnailService: ThumbnailService) {
    }

    /**
     * Opens a file browser at a chosen folder location.
     * @param folderNodeId ID of the folder to use
     * @returns Information about the selected file(s)
     */
    openFileBrowseDialogByFolderId(folderNodeId: string): Observable<Node[]> {
        return this.documentListService.getFolderNode(folderNodeId).pipe(switchMap((nodeEntry: NodeEntry) => {
            return this.openUploadFileDialog('Choose', nodeEntry.entry);
        }));
    }

    /**
     * Opens a lock node dialog.
     * @param contentEntry Node to lock
     * @returns Error/status message (if any)
     */
    public openLockNodeDialog(contentEntry: Node): Subject<string> {
        const observable: Subject<string> = new Subject<string>();

        if (this.contentService.hasAllowableOperations(contentEntry, AllowableOperationsEnum.LOCK)) {
            this.dialog.open(NodeLockDialogComponent, {
                data: {
                    node: contentEntry,
                    onError: (error) => {
                        this.error.emit(error);
                        observable.error(error);
                    }
                },
                width: '400px'
            });
        } else {
            observable.error('OPERATION.FAIL.NODE.NO_PERMISSION');
        }

        return observable;
    }

    /**
     * Opens a file browser at a chosen site location.
     * @returns Information about the selected file(s)
     */
    openFileBrowseDialogBySite(): Observable<Node[]> {
        return this.siteService.getSites().pipe(switchMap((response: SitePaging) => {
            return this.openFileBrowseDialogByFolderId(response.list.entries[0].entry.guid);
        }));
    }

    /**
     * Opens a folder browser at a chosen site location.
     * @returns Information about the selected folder(s)
     */
    openFolderBrowseDialogBySite(): Observable<Node[]> {
        return this.openFolderBrowseDialogByFolderId('-my-');
    }

    /**
     * Opens a folder browser at a chosen folder location.
     * @param folderNodeId ID of the folder to use
     * @returns Information about the selected folder(s)
     */
    openFolderBrowseDialogByFolderId(folderNodeId: string): Observable<Node[]> {
        return this.documentListService.getFolderNode(folderNodeId).pipe(switchMap((node: NodeEntry) => {
            return this.openUploadFolderDialog('Choose', node.entry);
        }));
    }

    /**
     * Opens a dialog to copy or move an item to a new location.
     * @param action Name of the action (eg, "Copy" or "Move") to show in the title
     * @param contentEntry Item to be copied or moved
     * @param permission Permission for the operation
     * @param excludeSiteContent The site content that should be filtered out
     * @returns Information about files that were copied/moved
     */
    openCopyMoveDialog(action: string, contentEntry: Node, permission?: string, excludeSiteContent?: string[]): Observable<Node[]> {
        if (this.contentService.hasAllowableOperations(contentEntry, permission)) {

            const select = new Subject<Node[]>();
            select.subscribe({
                complete: this.close.bind(this)
            });

            const title = this.getTitleTranslation(action, contentEntry.name);

            const data: ContentNodeSelectorComponentData = {
                title: title,
                actionName: action,
                currentFolderId: contentEntry.parentId,
                imageResolver: this.imageResolver.bind(this),
                where: '(isFolder=true)',
                isSelectionValid: this.isCopyMoveSelectionValid.bind(this),
                excludeSiteContent: excludeSiteContent || ContentNodeDialogService.nonDocumentSiteContent,
                select: select
            };

            this.openContentNodeDialog(data, 'adf-content-node-selector-dialog', '630px');

            return select;
        } else {
            const errors = new Error(JSON.stringify({ error: { statusCode: 403 } }));
            return throwError(errors);
        }
    }

    /**
     * Gets the translation of the dialog title.
     * @param action Name of the action to display in the dialog title
     * @param name Name of the item on which the action is being performed
     * @returns Translated version of the title
     */
    getTitleTranslation(action: string, name: string): string {
        return this.translation.instant(`NODE_SELECTOR.${action.toUpperCase()}_ITEM`, { name });
    }

    /**
     * Opens a dialog to choose folders to upload.
     * @param action Name of the action to show in the title
     * @param contentEntry  Item to upload
     * @returns Information about the chosen folder(s)
     */
    openUploadFolderDialog(action: string, contentEntry: Node): Observable<Node[]> {
        const select = new Subject<Node[]>();
        select.subscribe({
            complete: this.close.bind(this)
        });

        const data: ContentNodeSelectorComponentData = {
            title: `${action} '${contentEntry.name}' to ...`,
            actionName: action,
            currentFolderId: contentEntry.id,
            imageResolver: this.imageResolver.bind(this),
            isSelectionValid: this.hasAllowableOperationsOnNodeFolder.bind(this),
            where: '(isFolder=true)',
            select: select
        };

        this.openContentNodeDialog(data, 'adf-content-node-selector-dialog', '630px');
        return select;
    }

    /**
     * Opens a dialog to choose a file to upload.
     * @param action Name of the action to show in the title
     * @param contentEntry Item to upload
     * @returns Information about the chosen file(s)
     */
    openUploadFileDialog(action: string, contentEntry: Node): Observable<Node[]> {
        const select = new Subject<Node[]>();
        select.subscribe({
            complete: this.close.bind(this)
        });

        const data: ContentNodeSelectorComponentData = {
            title: `${action} '${contentEntry.name}' to ...`,
            actionName: action,
            currentFolderId: contentEntry.id,
            imageResolver: this.imageResolver.bind(this),
            isSelectionValid: this.isNodeFile.bind(this),
            select: select
        };

        this.openContentNodeDialog(data, 'adf-content-node-selector-dialog', '630px');
        return select;
    }

    private openContentNodeDialog(data: ContentNodeSelectorComponentData, currentPanelClass: string, chosenWidth: string) {
        this.dialog.open(ContentNodeSelectorComponent, { data, panelClass: currentPanelClass, width: chosenWidth });
    }

    private imageResolver(row: ShareDataRow): string | null {
        const entry: Node = row.node.entry;
        if (!this.contentService.hasAllowableOperations(entry, 'create')) {
            return this.thumbnailService.getMimeTypeIcon('disable/folder');
        }

        return null;
    }

    private isNodeFile(entry: Node): boolean {
        return entry.isFile;
    }

    private hasAllowableOperationsOnNodeFolder(entry: Node): boolean {
        return this.isNodeFolder(entry) && this.contentService.hasAllowableOperations(entry, 'create');
    }

    private isNodeFolder(entry: Node): boolean {
        return entry.isFolder;
    }

    private isCopyMoveSelectionValid(entry: Node): boolean {
        return this.hasEntityCreatePermission(entry) && !this.isSite(entry);
    }

    private hasEntityCreatePermission(entry: Node): boolean {
        return this.contentService.hasAllowableOperations(entry, 'create');
    }

    private isSite(entry) {
        return !!entry.guid || entry.nodeType === 'st:site' || entry.nodeType === 'st:sites';
    }

    /** Closes the currently open dialog. */
    close() {
        this.dialog.closeAll();
    }

}
