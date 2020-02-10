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

/* tslint:disable:no-input-rename  */

import { Directive, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Node } from '@alfresco/js-api';

import { FolderDialogComponent } from '../dialogs/folder.dialog';
import { ContentService } from '@alfresco/adf-core';

@Directive({
    selector: '[adf-edit-folder]'
})
export class FolderEditDirective {
    static DIALOG_WIDTH: number = 400;

    /** Folder node to edit. */
    @Input('adf-edit-folder')
    folder: Node;

    /** Emitted when an error occurs (eg, a folder with same name already exists). */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    /** Title of folder edit dialog. */
    @Input()
    title: string = null;

    /** Emitted when the folder has been edited successfully. */
    @Output()
    success: EventEmitter<Node> = new EventEmitter<Node>();

    @HostListener('click', [ '$event' ])
    onClick(event) {
        event.preventDefault();
        if (this.folder) {
            this.openDialog();
        }
    }

    constructor(
        public dialogRef: MatDialog,
        public elementRef: ElementRef,
        public content: ContentService
    ) {}

    private get dialogConfig(): MatDialogConfig {
        const { DIALOG_WIDTH: width } = FolderEditDirective;
        const { folder } = this;

        return {
            data: {
                folder,
                editTitle: this.title
            },
            width: `${width}px`
        };
    }

    private openDialog(): void {
        const { dialogRef, dialogConfig, content } = this;
        const dialogInstance = dialogRef.open(FolderDialogComponent, dialogConfig);

        dialogInstance.componentInstance.error.subscribe((error) => {
            this.error.emit(error);
        });

        dialogInstance.componentInstance.success.subscribe((node: Node) => {
            this.success.emit(node);
        });

        dialogInstance.afterClosed().subscribe((node: Node) => {
            if (node) {
                content.folderEdit.next(node);
            }
        });
    }
}
