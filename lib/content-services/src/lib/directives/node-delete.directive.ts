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

/* eslint-disable @angular-eslint/no-input-rename */

import { Directive, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output } from '@angular/core';
import { NodeEntry, Node, DeletedNodeEntry, DeletedNode, TrashcanApi, NodesApi } from '@alfresco/js-api';
import { Observable, forkJoin, from, of } from 'rxjs';
import { TranslationService } from '@alfresco/adf-core';
import { map, catchError, retry } from 'rxjs/operators';
import { AlfrescoApiService } from '../services/alfresco-api.service';

interface ProcessedNodeData {
    entry: Node | DeletedNode;
    status: number;
}

interface ProcessStatus {
    success: ProcessedNodeData[];
    failed: ProcessedNodeData[];

    someFailed();

    someSucceeded();

    oneFailed();

    oneSucceeded();

    allSucceeded();

    allFailed();
}

@Directive({
    standalone: true,
    selector: '[adf-delete]'
})
export class NodeDeleteDirective implements OnChanges {
    /** Array of nodes to delete. */
    @Input('adf-delete')
    selection: NodeEntry[] | DeletedNodeEntry[];

    /** If true then the nodes are deleted immediately rather than being put in the trash */
    @Input()
    permanent: boolean = false;

    /** Emitted when the nodes have been deleted. */
    @Output()
    delete: EventEmitter<any> = new EventEmitter();

    private _trashcanApi: TrashcanApi;
    get trashcanApi(): TrashcanApi {
        this._trashcanApi = this._trashcanApi ?? new TrashcanApi(this.alfrescoApiService.getInstance());
        return this._trashcanApi;
    }

    private _nodesApi: NodesApi;
    get nodesApi(): NodesApi {
        this._nodesApi = this._nodesApi ?? new NodesApi(this.alfrescoApiService.getInstance());
        return this._nodesApi;
    }

    @HostListener('click')
    onClick() {
        this.process(this.selection);
    }

    constructor(private alfrescoApiService: AlfrescoApiService, private translation: TranslationService, private elementRef: ElementRef) {}

    ngOnChanges() {
        if (!this.selection || (this.selection && this.selection.length === 0)) {
            this.setDisableAttribute(true);
        } else {
            if (!this.elementRef.nativeElement.hasAttribute('adf-check-allowable-operation')) {
                this.setDisableAttribute(false);
            }
        }
    }

    private setDisableAttribute(disable: boolean) {
        this.elementRef.nativeElement.disabled = disable;
    }

    private process(selection: NodeEntry[] | DeletedNodeEntry[]) {
        if (selection?.length) {
            const batch = this.getDeleteNodesBatch(selection);

            forkJoin(...batch).subscribe((data: ProcessedNodeData[]) => {
                const processedItems: ProcessStatus = this.processStatus(data);
                const message = this.getMessage(processedItems);

                if (message) {
                    this.delete.emit(message);
                }
            });
        }
    }

    private getDeleteNodesBatch(selection: NodeEntry[] | DeletedNodeEntry[]): Observable<ProcessedNodeData>[] {
        return selection.map((node) => this.deleteNode(node));
    }

    private deleteNode(node: NodeEntry | DeletedNodeEntry): Observable<ProcessedNodeData> {
        const id = (node.entry as any).nodeId || node.entry.id;

        let promise: Promise<any>;

        if (Object.prototype.hasOwnProperty.call(node.entry, 'archivedAt') && node.entry['archivedAt']) {
            promise = this.trashcanApi.deleteDeletedNode(id);
        } else {
            promise = this.nodesApi.deleteNode(id, { permanent: this.permanent });
        }

        return from(promise).pipe(
            retry(3),
            map(() => ({
                entry: node.entry,
                status: 1
            })),
            catchError(() =>
                of({
                    entry: node.entry,
                    status: 0
                })
            )
        );
    }

    private processStatus(data): ProcessStatus {
        const deleteStatus = {
            success: [],
            failed: [],
            get someFailed() {
                return !!this.failed.length;
            },
            get someSucceeded() {
                return !!this.success.length;
            },
            get oneFailed() {
                return this.failed.length === 1;
            },
            get oneSucceeded() {
                return this.success.length === 1;
            },
            get allSucceeded() {
                return this.someSucceeded && !this.someFailed;
            },
            get allFailed() {
                return this.someFailed && !this.someSucceeded;
            }
        };

        return data.reduce((acc, next) => {
            if (next.status === 1) {
                acc.success.push(next);
            } else {
                acc.failed.push(next);
            }

            return acc;
        }, deleteStatus);
    }

    private getMessage(status: ProcessStatus): string | null {
        if (status.allFailed && !status.oneFailed) {
            return this.translation.instant(
                'CORE.DELETE_NODE.ERROR_PLURAL',
                // eslint-disable-next-line id-blacklist
                { number: status.failed.length }
            );
        }

        if (status.allSucceeded && !status.oneSucceeded) {
            return this.translation.instant(
                'CORE.DELETE_NODE.PLURAL',
                // eslint-disable-next-line id-blacklist
                { number: status.success.length }
            );
        }

        if (status.someFailed && status.someSucceeded && !status.oneSucceeded) {
            return this.translation.instant('CORE.DELETE_NODE.PARTIAL_PLURAL', {
                success: status.success.length,
                failed: status.failed.length
            });
        }

        if (status.someFailed && status.oneSucceeded) {
            return this.translation.instant('CORE.DELETE_NODE.PARTIAL_SINGULAR', {
                success: status.success.length,
                failed: status.failed.length
            });
        }

        if (status.oneFailed && !status.someSucceeded) {
            return this.translation.instant('CORE.DELETE_NODE.ERROR_SINGULAR', { name: status.failed[0].entry.name });
        }

        if (status.oneSucceeded && !status.someFailed) {
            return this.translation.instant('CORE.DELETE_NODE.SINGULAR', { name: status.success[0].entry.name });
        }

        return null;
    }
}
