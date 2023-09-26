/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { ThumbnailService, TranslationService } from '@alfresco/adf-core';
import { Subject, Observable, throwError } from 'rxjs';
import { ShareDataRow } from '../document-list/data/share-data-row.model';
import { AllowableOperationsEnum } from '../common/models/allowable-operations.enum';
import { ContentService } from '../common/services/content.service';
import { Node, NodeEntry, SitePaging } from '@alfresco/js-api';
import { DocumentListService } from '../document-list/services/document-list.service';
import { ContentNodeSelectorComponent } from './content-node-selector.component';
import { ContentNodeSelectorComponentData } from './content-node-selector.component-data.interface';
import { NodeAction } from '../document-list/models/node-action.enum';
import { NodeLockDialogComponent } from '../dialogs/node-lock.dialog';
import { switchMap } from 'rxjs/operators';
import { SitesService } from '../common/services/sites.service';

@Injectable({
    providedIn: 'root'
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
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
     * shows files and folders in the dialog search result.
     *
     * @param folderNodeId ID of the folder to use
     * @returns Information about the selected file(s)
     */
    openFileBrowseDialogByFolderId(folderNodeId: string): Observable<Node[]> {
        return this.documentListService.getFolderNode(folderNodeId).pipe(switchMap((nodeEntry: NodeEntry) => this.openUploadFileDialog(NodeAction.CHOOSE, nodeEntry.entry, true)));
    }

    /**
     * Opens a lock node dialog.
     *
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
     * shows files and folders in the dialog search result.
     *
     * @returns Information about the selected file(s)
     */
    openFileBrowseDialogBySite(): Observable<Node[]> {
        return this.siteService.getSites().pipe(switchMap((response: SitePaging) => this.openFileBrowseDialogByFolderId(response.list.entries[0].entry.guid)));
    }

    /**
     * Opens a file browser at a default myFile location.
     * shows files and folders in the dialog search result.
     *
     * @returns Information about the selected file(s)
     */
    openFileBrowseDialogByDefaultLocation(): Observable<Node[]> {
        return this.openFileBrowseDialogByFolderId('-my-');
    }

    /**
     * Opens a folder browser at a chosen site location.
     *
     * @returns Information about the selected folder(s)
     */
    openFolderBrowseDialogBySite(): Observable<Node[]> {
        return this.openFolderBrowseDialogByFolderId('-my-');
    }

    /**
     * Opens a folder browser at a chosen folder location.
     *
     * @param folderNodeId ID of the folder to use
     * @returns Information about the selected folder(s)
     */
    openFolderBrowseDialogByFolderId(folderNodeId: string): Observable<Node[]> {
        return this.documentListService.getFolderNode(folderNodeId).pipe(switchMap((node: NodeEntry) => this.openUploadFolderDialog(NodeAction.CHOOSE, node.entry)));
    }

    /**
     * Opens a dialog to copy or move an item to a new location.
     *
     * @param action Name of the action (eg, "Copy" or "Move") to show in the title
     * @param contentEntry Item to be copied or moved
     * @param permission Permission for the operation
     * @param excludeSiteContent The site content that should be filtered out
     * @returns Information about files that were copied/moved
     */
    openCopyMoveDialog(action: NodeAction, contentEntry: Node, permission?: string, excludeSiteContent?: string[]): Observable<Node[]> {
        if (this.contentService.hasAllowableOperations(contentEntry, permission)) {

            const select = new Subject<Node[]>();

            const data: ContentNodeSelectorComponentData = {
                title: this.getTitleTranslation(action, contentEntry.name),
                actionName: action,
                selectionMode: 'single',
                currentFolderId: contentEntry.parentId,
                imageResolver: this.imageResolver.bind(this),
                where: '(isFolder=true)',
                isSelectionValid: this.isCopyMoveSelectionValid.bind(this),
                excludeSiteContent: excludeSiteContent || ContentNodeDialogService.nonDocumentSiteContent,
                select
            };

            const dialogRef = this.openContentNodeDialog(data, 'adf-content-node-selector-dialog', '630px');
            dialogRef.afterClosed().subscribe({ next: () => select.complete() });

            return select;
        } else {
            const errors = new Error(JSON.stringify({ error: { statusCode: 403 } }));
            return throwError(errors);
        }
    }

    /**
     * Gets the translation of the dialog title.
     *
     * @param action Name of the action to display in the dialog title
     * @param name Name of the item on which the action is being performed
     * @returns Translated version of the title
     */
    getTitleTranslation(action: string, name: string): string {
        return this.translation.instant(`NODE_SELECTOR.${action.toUpperCase()}_ITEM`, { name });
    }

    /**
     * Opens a dialog to choose folders to upload.
     *
     * @param action Name of the action to show in the title
     * @param contentEntry  Item to upload
     * @returns Information about the chosen folder(s)
     */
    openUploadFolderDialog(action: NodeAction, contentEntry: Node): Observable<Node[]> {
        const select = new Subject<Node[]>();

        const data: ContentNodeSelectorComponentData = {
            title: this.getTitleTranslation(action, this.translation.instant('DROPDOWN.MY_FILES_OPTION')),
            actionName: action,
            selectionMode: 'single',
            currentFolderId: contentEntry.id,
            imageResolver: this.imageResolver.bind(this),
            isSelectionValid: this.hasAllowableOperationsOnNodeFolder.bind(this),
            where: '(isFolder=true)',
            select
        };

        const dialogRef = this.openContentNodeDialog(data, 'adf-content-node-selector-dialog', '630px');
        dialogRef.afterClosed().subscribe({ next: () => select.complete() });

        return select;
    }

    /**
     * Opens a dialog to choose a file to upload.
     *
     * @param action Name of the action to show in the title
     * @param contentEntry Item to upload
     * @param showFilesInResult Show files in dialog search result
     * @returns Information about the chosen file(s)
     */
    openUploadFileDialog(action: NodeAction, contentEntry: Node, showFilesInResult = false): Observable<Node[]> {
        const select = new Subject<Node[]>();

        const data: ContentNodeSelectorComponentData = {
            title: this.getTitleTranslation(action, this.translation.instant('DROPDOWN.MY_FILES_OPTION')),
            actionName: action,
            selectionMode: 'single',
            currentFolderId: contentEntry.id,
            imageResolver: this.imageResolver.bind(this),
            isSelectionValid: (entry: Node) => entry.isFile,
            select,
            showFilesInResult
        };

        const dialogRef = this.openContentNodeDialog(data, 'adf-content-node-selector-dialog', '630px');
        dialogRef.afterClosed().subscribe({ next: () => select.complete() });

        return select;
    }

    private openContentNodeDialog(data: ContentNodeSelectorComponentData, panelClass: string, width: string): MatDialogRef<ContentNodeSelectorComponent> {
        return this.dialog.open(ContentNodeSelectorComponent, {
            data,
            panelClass,
            width,
            disableClose: true
        });
    }

    private imageResolver(row: ShareDataRow): string | null {
        const entry: Node = row.node.entry;
        if (!this.contentService.hasAllowableOperations(entry, 'create')) {
            if (this.isNodeFolder(entry)) {
                return this.thumbnailService.getMimeTypeIcon('disable/folder');
            }
        }

        return null;
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

}
