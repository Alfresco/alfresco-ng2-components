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

/* tslint:disable:no-input-rename  */

import { Directive, ElementRef, Renderer2, HostListener, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';

import { MinimalNodeEntryEntity } from 'alfresco-js-api';

import { NodeLockDialogComponent } from '../dialogs/node-lock.dialog';
import { ContentService } from '@alfresco/adf-core';

@Directive({
    selector: '[adf-node-lock]'
})
export class NodeLockDirective implements AfterViewInit {
    static DIALOG_WIDTH: number = 400;

    @Input('adf-node-lock')
    node: MinimalNodeEntryEntity;

    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    @HostListener('click', [ '$event' ])
    onClick(event) {
        event.preventDefault();
        if (this.node) {
            this.openDialog();
        }
    }

    constructor(
        public dialogRef: MatDialog,
        public element: ElementRef,
        public content: ContentService,
        private renderer: Renderer2
    ) {}

    ngAfterViewInit() {
        this.renderer.setProperty(this.element.nativeElement, 'disabled', !this.node.isFile);
    }

    private get dialogConfig(): MatDialogConfig {
        const { DIALOG_WIDTH: width } = NodeLockDirective;
        const { node } = this;

        return {
            data: { node },
            width: `${width}px`
        };
    }

    private openDialog(): void {
        const { dialogRef, dialogConfig, content } = this;
        const dialogInstance = dialogRef.open(NodeLockDialogComponent, dialogConfig);

        dialogInstance.componentInstance.error.subscribe((error) => {
            this.error.emit(error);
        });

        dialogInstance.afterClosed().subscribe((node: MinimalNodeEntryEntity) => {
            if (node) {
                content.folderEdit.next(node);
            }
        });
    }
}
