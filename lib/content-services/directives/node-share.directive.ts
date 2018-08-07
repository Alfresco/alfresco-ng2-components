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

import { Directive, Input, HostListener, ElementRef, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MinimalNodeEntity } from 'alfresco-js-api';

import { ShareDialogComponent } from '../dialogs/share.dialog';

@Directive({
    selector: '[adf-share]'
})
export class NodeSharedDirective implements OnChanges {

    /** Node to share. */
    // tslint:disable-next-line:no-input-rename
    @Input('adf-share')
    node: MinimalNodeEntity;

    @Input()
    baseShareUrl: string;

    @HostListener('click')
    onClick() {
        this.shareNode(this.node);
    }

    constructor(private dialog: MatDialog,
                private elementRef: ElementRef) {
    }

    shareNode(node: MinimalNodeEntity) {
        if (node && node.entry && node.entry.isFile) {
            this.dialog.open(ShareDialogComponent, {
                width: '600px',
                disableClose: true,
                data: {
                    node: node,
                    baseShareUrl: this.baseShareUrl
                }
            });
        } else {
            this.setDisableAttribute(true);
        }
    }

    ngOnChanges() {
        if (!this.node || this.node.entry.isFolder) {
            this.setDisableAttribute(true);
        } else {
            this.setDisableAttribute(false);
        }
    }

    private setDisableAttribute(disable: boolean) {
        this.elementRef.nativeElement.disabled = disable;
    }

}
