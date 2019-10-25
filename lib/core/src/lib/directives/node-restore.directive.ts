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

/* tslint:disable:component-selector no-input-rename */

import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { DeletedNodeEntry, DeletedNodesPaging, PathInfoEntity } from '@alfresco/js-api';
import { Observable, forkJoin, from, of } from 'rxjs';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { TranslationService } from '../services/translation.service';
import { tap, mergeMap, map, catchError } from 'rxjs/operators';

export class RestoreMessageModel {
    message: string;
    path: PathInfoEntity;
    action: string;
}

@Directive({
    selector: '[adf-restore]'
})
export class NodeRestoreDirective {
    private restoreProcessStatus;

    /** Array of deleted nodes to restore. */
    @Input('adf-restore')
    selection: DeletedNodeEntry[];

    /** Emitted when restoration is complete. */
    @Output()
    restore: EventEmitter<RestoreMessageModel> = new EventEmitter();

    @HostListener('click')
    onClick() {
        this.recover(this.selection);
    }

    constructor(private alfrescoApiService: AlfrescoApiService,
                private translation: TranslationService) {
        this.restoreProcessStatus = this.processStatus();
    }

    private recover(selection: any) {
        if (!selection.length) {
            return;
        }

        const nodesWithPath = this.getNodesWithPath(selection);

        if (selection.length && nodesWithPath.length) {

            this.restoreNodesBatch(nodesWithPath).pipe(
                tap((restoredNodes) => {
                    const status = this.processStatus(restoredNodes);

                    this.restoreProcessStatus.fail.push(...status.fail);
                    this.restoreProcessStatus.success.push(...status.success);
                }),
                mergeMap(() => this.getDeletedNodes())
            )
            .subscribe((deletedNodesList) => {
                const { entries: nodeList } = deletedNodesList.list;
                const { fail: restoreErrorNodes } = this.restoreProcessStatus;
                const selectedNodes = this.diff(restoreErrorNodes, selection, false);
                const remainingNodes = this.diff(selectedNodes, nodeList);

                if (!remainingNodes.length) {
                    this.notification();
                } else {
                    this.recover(remainingNodes);
                }
            });
        } else {
            this.restoreProcessStatus.fail.push(...selection);
            this.notification();
            return;
        }
    }

    private restoreNodesBatch(batch: DeletedNodeEntry[]): Observable<DeletedNodeEntry[]> {
        return forkJoin(batch.map((node) => this.restoreNode(node)));
    }

    private getNodesWithPath(selection): DeletedNodeEntry[] {
        return selection.filter((node) => node.entry.path);
    }

    private getDeletedNodes(): Observable<DeletedNodesPaging> {
        const promise = this.alfrescoApiService.getInstance()
            .core.nodesApi.getDeletedNodes({ include: ['path'] });

        return from(promise);
    }

    private restoreNode(node): Observable<any> {
        const { entry } = node;

        const promise = this.alfrescoApiService.getInstance().nodes.restoreNode(entry.id);

        return from(promise).pipe(
            map(() => ({
                status: 1,
                entry
            })),
            catchError((error) => {
                const { statusCode } = (JSON.parse(error.message)).error;

                return of({
                    status: 0,
                    statusCode,
                    entry
                });
            })
        );
    }

    private diff(selection, list, fromList = true): any {
        const ids = selection.map((item) => item.entry.id);

        return list.filter((item) => {
            if (fromList) {
                return ids.includes(item.entry.id) ? item : null;
            } else {
                return !ids.includes(item.entry.id) ? item : null;
            }
        });
    }

    private processStatus(data = []): any {
        const status = {
            fail: [],
            success: [],
            get someFailed() {
                return !!(this.fail.length);
            },
            get someSucceeded() {
                return !!(this.success.length);
            },
            get oneFailed() {
                return this.fail.length === 1;
            },
            get oneSucceeded() {
                return this.success.length === 1;
            },
            get allSucceeded() {
                return this.someSucceeded && !this.someFailed;
            },
            get allFailed() {
                return this.someFailed && !this.someSucceeded;
            },
            reset() {
                this.fail = [];
                this.success = [];
            }
        };

        return data.reduce(
            (acc, node) => {
                if (node.status) {
                    acc.success.push(node);
                } else {
                    acc.fail.push(node);
                }

                return acc;
            },
            status
        );
    }

    private getRestoreMessage(): string | null {
        const { restoreProcessStatus: status } = this;

        if (status.someFailed && !status.oneFailed) {
            return this.translation.instant(
                'CORE.RESTORE_NODE.PARTIAL_PLURAL',
                {
                    number: status.fail.length
                }
            );
        }

        if (status.oneFailed && status.fail[0].statusCode) {
            if (status.fail[0].statusCode === 409) {
                return this.translation.instant(
                    'CORE.RESTORE_NODE.NODE_EXISTS',
                    {
                        name: status.fail[0].entry.name
                    }
                );
            } else {
                return this.translation.instant(
                    'CORE.RESTORE_NODE.GENERIC',
                    {
                        name: status.fail[0].entry.name
                    }
                );
            }
        }

        if (status.oneFailed && !status.fail[0].statusCode) {
            return this.translation.instant(
                'CORE.RESTORE_NODE.LOCATION_MISSING',
                {
                    name: status.fail[0].entry.name
                }
            );
        }

        if (status.allSucceeded && !status.oneSucceeded) {
            return this.translation.instant('CORE.RESTORE_NODE.PLURAL');
        }

        if (status.allSucceeded && status.oneSucceeded) {
            return this.translation.instant(
                'CORE.RESTORE_NODE.SINGULAR',
                {
                    name: status.success[0].entry.name
                }
            );
        }

        return null;
    }

    private notification(): void {
        const status = Object.assign({}, this.restoreProcessStatus);

        const message = this.getRestoreMessage();
        this.reset();

        const action = (status.oneSucceeded && !status.someFailed) ? this.translation.instant('CORE.RESTORE_NODE.VIEW') : '';

        let path;
        if (status.success && status.success.length > 0) {
            path = status.success[0].entry.path;
        }
        this.restore.emit({
            message: message,
            action: action,
            path: path
        });
    }

    private reset(): void {
        this.restoreProcessStatus.reset();
        this.selection = [];
    }
}
