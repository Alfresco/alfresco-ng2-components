/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { DestroyRef, Directive, HostListener, inject, Input, NgZone, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NodeEntry, NodesApi } from '@alfresco/js-api';

import { ShareDialogComponent } from './content-node-share.dialog';
import { from, Observable } from 'rxjs';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
    selector: '[adf-share]',
    exportAs: 'adfShare'
})
export class NodeSharedDirective implements OnChanges {
    isFile: boolean = false;
    isShared: boolean = false;

    /** Node to share. */
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('adf-share')
    node: NodeEntry;

    /** Prefix to add to the generated link. */
    @Input()
    baseShareUrl: string;

    _nodesApi: NodesApi;
    get nodesApi(): NodesApi {
        this._nodesApi = this._nodesApi ?? new NodesApi(this.alfrescoApiService.getInstance());
        return this._nodesApi;
    }

    private readonly destroyRef = inject(DestroyRef);

    constructor(private dialog: MatDialog, private zone: NgZone, private alfrescoApiService: AlfrescoApiService) {}
    shareNode(nodeEntry: NodeEntry) {
        if (nodeEntry?.entry?.isFile) {
            // shared and favorite
            const nodeId = nodeEntry.entry['nodeId'] || nodeEntry.entry['guid'];

            if (nodeId) {
                this.getNodeInfo(nodeId).subscribe((node) => {
                    this.openShareLinkDialog(node);
                });
            } else {
                this.openShareLinkDialog(nodeEntry);
            }
        }
    }

    private getNodeInfo(nodeId: string): Observable<NodeEntry> {
        const options = {
            include: ['allowableOperations']
        };

        return from(this.nodesApi.getNode(nodeId, options));
    }

    private openShareLinkDialog(node: NodeEntry) {
        this.dialog.open(ShareDialogComponent, {
            width: '600px',
            panelClass: 'adf-share-link-dialog',
            data: {
                node,
                baseShareUrl: this.baseShareUrl
            }
        });
    }

    ngOnChanges() {
        this.zone.onStable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            if (this.node?.entry) {
                this.isFile = this.node.entry.isFile;
                this.isShared = this.node.entry.properties ? this.node.entry.properties['qshare:sharedId'] : false;
            }
        });
    }

    @HostListener('click')
    onClick() {
        if (this.node) {
            this.shareNode(this.node);
        }
    }
}
