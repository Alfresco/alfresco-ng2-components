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

import { MatDialog } from '@angular/material';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { ContentService } from '@alfresco/adf-core';
import { Subject, Observable, throwError } from 'rxjs';
import { ShareDataRow } from '../document-list/data/share-data-row.model';
import { MinimalNodeEntryEntity, SitePaging } from 'alfresco-js-api';
import { DataColumn, SitesService, TranslationService, PermissionsEnum } from '@alfresco/adf-core';
import { DocumentListService } from '../document-list/services/document-list.service';
import { ContentNodeSelectorComponent } from './content-node-selector.component';
import { ContentNodeSelectorComponentData } from './content-node-selector.component-data.interface';
import { NodeLockDialogComponent } from '../dialogs/node-lock.dialog';
import { switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ContentNodeDialogService {

    /** Emitted when an error occurs. */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    constructor(private dialog: MatDialog,
                private contentService: ContentService,
                private documentListService: DocumentListService,
                private siteService: SitesService,
                private translation: TranslationService) {
    }

    /**
     * Opens a file browser at a chosen folder location.
     * @param folderNodeId ID of the folder to use
     * @returns Information about the selected file(s)
     */
    openFileBrowseDialogByFolderId(folderNodeId: string): Observable<MinimalNodeEntryEntity[]> {
        return this.documentListService.getFolderNode(folderNodeId).pipe(switchMap((node: MinimalNodeEntryEntity) => {
            return this.openUploadFileDialog('Choose', node);
        }));
    }

    /**
     * Opens a lock node dialog.
     * @param contentEntry Node to lock
     * @returns Error/status message (if any)
     */
    public openLockNodeDialog(contentEntry: MinimalNodeEntryEntity): Subject<string> {
        const observable: Subject<string> = new Subject<string>();

        if (this.contentService.hasPermission(contentEntry, PermissionsEnum.LOCK)) {
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
    openFileBrowseDialogBySite(): Observable<MinimalNodeEntryEntity[]> {
        return this.siteService.getSites().pipe(switchMap((response: SitePaging) => {
            return this.openFileBrowseDialogByFolderId(response.list.entries[0].entry.guid);
        }));
    }

    /**
     * Opens a folder browser at a chosen site location.
     * @returns Information about the selected folder(s)
     */
    openFolderBrowseDialogBySite(): Observable<MinimalNodeEntryEntity[]> {
        return this.siteService.getSites().pipe(switchMap((response: SitePaging) => {
            return this.openFolderBrowseDialogByFolderId(response.list.entries[0].entry.guid);
        }));
    }

    /**
     * Opens a folder browser at a chosen folder location.
     * @param folderNodeId ID of the folder to use
     * @returns Information about the selected folder(s)
     */
    openFolderBrowseDialogByFolderId(folderNodeId: string): Observable<MinimalNodeEntryEntity[]> {
        return this.documentListService.getFolderNode(folderNodeId).pipe(switchMap((node: MinimalNodeEntryEntity) => {
            return this.openUploadFolderDialog('Choose', node);
        }));
    }

    /**
     * Opens a dialog to copy or move an item to a new location.
     * @param action Name of the action (eg, "Copy" or "Move") to show in the title
     * @param contentEntry Item to be copied or moved
     * @param permission Permission for the operation
     * @returns Information about files that were copied/moved
     */
    openCopyMoveDialog(action: string, contentEntry: MinimalNodeEntryEntity, permission?: string): Observable<MinimalNodeEntryEntity[]> {
        if (this.contentService.hasPermission(contentEntry, permission)) {

            const select = new Subject<MinimalNodeEntryEntity[]>();
            select.subscribe({
                complete: this.close.bind(this)
            });

            const title = this.getTitleTranslation(action, contentEntry.name);

            const data: ContentNodeSelectorComponentData = {
                title: title,
                actionName: action,
                currentFolderId: contentEntry.parentId,
                imageResolver: this.imageResolver.bind(this),
                rowFilter: this.rowFilter.bind(this, contentEntry.id),
                isSelectionValid: this.isCopyMoveSelectionValid.bind(this),
                select: select
            };

            this.openContentNodeDialog(data, 'adf-content-node-selector-dialog', '630px');

            return select;
        } else {
            let errors = new Error(JSON.stringify({ error: { statusCode: 403 } }));
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
    openUploadFolderDialog(action: string, contentEntry: MinimalNodeEntryEntity): Observable<MinimalNodeEntryEntity[]> {
        const select = new Subject<MinimalNodeEntryEntity[]>();
        select.subscribe({
            complete: this.close.bind(this)
        });

        const data: ContentNodeSelectorComponentData = {
            title: `${action} '${contentEntry.name}' to ...`,
            actionName: action,
            currentFolderId: contentEntry.id,
            imageResolver: this.imageResolver.bind(this),
            isSelectionValid: this.hasPermissionOnNodeFolder.bind(this),
            rowFilter: this.rowFilter.bind(this, contentEntry.id),
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
    openUploadFileDialog(action: string, contentEntry: MinimalNodeEntryEntity): Observable<MinimalNodeEntryEntity[]> {
        const select = new Subject<MinimalNodeEntryEntity[]>();
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

    private imageResolver(row: ShareDataRow, col: DataColumn): string | null {
        const entry: MinimalNodeEntryEntity = row.node.entry;
        if (!this.contentService.hasPermission(entry, 'create')) {
            return this.documentListService.getMimeTypeIcon('disable/folder');
        }

        return null;
    }

    private rowFilter(currentNodeId, row: ShareDataRow): boolean {
        const node: MinimalNodeEntryEntity = row.node.entry;

        if (node.id === currentNodeId || node.isFile) {
            return false;
        } else {
            return true;
        }
    }

    private isNodeFile(entry: MinimalNodeEntryEntity): boolean {
        return entry.isFile;
    }

    private hasPermissionOnNodeFolder(entry: MinimalNodeEntryEntity): boolean {
        return this.isNodeFolder(entry) && this.contentService.hasPermission(entry, 'create');
    }

    private isNodeFolder(entry: MinimalNodeEntryEntity): boolean {
        return entry.isFolder;
    }

    private isCopyMoveSelectionValid(entry: MinimalNodeEntryEntity): boolean {
        return this.hasEntityCreatePermission(entry) && !this.isSite(entry);
    }

    private hasEntityCreatePermission(entry: MinimalNodeEntryEntity): boolean {
        return this.contentService.hasPermission(entry, 'create');
    }

    private isSite(entry) {
        return !!entry.guid || entry.nodeType === 'st:site' || entry.nodeType === 'st:sites';
    }

    /** Closes the currently open dialog. */
    close() {
        this.dialog.closeAll();
    }

}
