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

import { Directive, Input, HostListener, OnChanges, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MinimalNodeEntity } from 'alfresco-js-api';

import { ShareDialogComponent } from './content-node-share.dialog';

@Directive({
    selector: '[adf-share]',
    exportAs: 'adfShare'
})
export class NodeSharedDirective implements OnChanges {

    isFile: boolean = false;
    isShared: boolean = false;

    /** Node to share. */
    // tslint:disable-next-line:no-input-rename
    @Input('adf-share')
    node: MinimalNodeEntity;

    @Input()
    baseShareUrl: string;

    @HostListener('click')
    onClick() {
        if (this.node) {
            this.shareNode(this.node);
        }
    }

    constructor(private dialog: MatDialog, private zone: NgZone) {}

    shareNode(node: MinimalNodeEntity) {
        if (node && node.entry && node.entry.isFile) {
            this.dialog.open(ShareDialogComponent, {
                width: '600px',
                panelClass: 'adf-share-link-dialog',
                data: {
                    node: node,
                    baseShareUrl: this.baseShareUrl
                }
            });
        }
    }

    ngOnChanges() {
        this.zone.onStable.subscribe(() => {
            if (this.node) {
                this.isFile = this.node.entry.isFile;
                this.isShared = this.node.entry.properties['qshare:sharedId'];
            }
        });
    }
}
