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

import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { MinimalNodeEntity } from 'alfresco-js-api';
import { Observable } from 'rxjs/Rx';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { NotificationService } from '../services/notification.service';
import { TranslationService } from '../services/translation.service';

@Directive({
    selector: '[adf-delete]',
    exportAs: 'adfDelete'
})
export class NodeDeleteDirective {
    private nodesApi;

    @Input('adf-delete')
    selection: MinimalNodeEntity[];

    @Input() permanent: boolean = false;

    @Output() delete: EventEmitter<any> = new EventEmitter();

    @HostListener('click')
    onClick() {
        this.process(this.selection);
    }

    constructor(
        private notification: NotificationService,
        private alfrescoApiService: AlfrescoApiService,
        private translation: TranslationService
    ) {
        this.nodesApi = this.alfrescoApiService.getInstance().nodes;
    }

    process(selection: any, isRestore = false) {
        if (!selection.length) {
            return;
        }

        let batch = null;

        if (!isRestore) {
            batch = this.getDeletedNodesBatch(selection);
        } else {
            batch = this.getRestoredNodesBatch(selection);
        }

        Observable.forkJoin(...batch)
            .subscribe((data: any) => {
                const processedItems = this.processStatus(data);

                if (processedItems.someSucceeded) {
                    this.delete.emit();
                }

                this.notify(processedItems, isRestore);
            });
    }

    private getDeletedNodesBatch(selection) {
        return selection.map((node) => this.performAction('delete', node));
    }

    private getRestoredNodesBatch(selection) {
        return selection.map((node) => this.performAction('restore', node));
    }

    private performAction(action, node) {
        let promise: Promise<any> = null;
        // shared nodes support
        const id = node.entry.nodeId || node.entry.id;

        if (action === 'delete') {
            promise = this.nodesApi.deleteNode(id, { permanent: this.permanent });
        }

        if (action === 'restore') {
            promise = this.nodesApi.restoreNode(id);
        }

        return Observable.fromPromise(promise)
            .map(() => ({
                entry: node.entry,
                status: 1
            }))
            .catch((error: any) => {
                return Observable.of({
                    entry: node.entry,
                    status: 0
                });
            });
    }

    private processStatus(data): any {
        const deleteStatus = {
            success: [],
            failed: [],
            get someFailed() {
                return !!(this.failed.length);
            },
            get someSucceeded() {
                return !!(this.success.length);
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

        return data.reduce(
            (acc, next) => {
                if (next.status === 1) {
                    acc.success.push(next);
                } else {
                    acc.failed.push(next);
                }

                return acc;
            },
            deleteStatus
        );
    }

    private notify(status, isRestore) {
        this.getMessage(status, isRestore)
            .subscribe((message) => {
                const action = this.showAction(status, isRestore) ? 'Undo' : '';

                this.notification.openSnackMessageAction(message, action)
                    .onAction()
                    .subscribe(() => {
                        this.process(status.success, true);
                    });
            });
    }

    private getMessage(status, isRestore): Observable<string> {
        if (status.allFailed && !status.oneFailed) {
            return this.translation.get(
                isRestore
                    ? 'CORE.DELETE_NODE.RESTORE_ERROR_PLURAL'
                    : 'CORE.DELETE_NODE.ERROR_PLURAL',
                { number: status.failed.length }
            );
        }

        if (status.allSucceeded && !status.oneSucceeded) {
            return this.translation.get(
                isRestore
                    ? 'CORE.DELETE_NODE.RESTORE_PLURAL'
                    : 'CORE.DELETE_NODE.PLURAL',
                { number: status.success.length  }
            );
        }

        if (status.someFailed && status.someSucceeded && !status.oneSucceeded) {
            return this.translation.get(
                isRestore
                    ? 'CORE.DELETE_NODE.RESTORE_PARTIAL_PLURAL'
                    : 'CORE.DELETE_NODE.PARTIAL_PLURAL',
                {
                    success: status.success.length,
                    failed: status.failed.length
                }
            );
        }

        if (status.someFailed && status.oneSucceeded) {
            return this.translation.get(
                isRestore
                    ? 'CORE.DELETE_NODE.RESTORE_PARTIAL_SINGULAR'
                    : 'CORE.DELETE_NODE.PARTIAL_SINGULAR',
                {
                    success: status.success.length,
                    failed: status.failed.length
                }
            );
        }

        if (status.oneFailed && !status.someSucceeded) {
            return this.translation.get(
                isRestore
                    ? 'CORE.DELETE_NODE.RESTORE_ERROR_SINGULAR'
                    : 'CORE.DELETE_NODE.ERROR_SINGULAR',
                { name: status.failed[0].entry.name }
            );
        }

        if (status.oneSucceeded && !status.someFailed) {
            return this.translation.get(
                isRestore
                    ? 'CORE.DELETE_NODE.RESTORE_SINGULAR'
                    : 'CORE.DELETE_NODE.SINGULAR',
                { name: status.success[0].entry.name }
            );
        }
    }

    private showAction(data, isRestore): boolean {
        return !isRestore && !this.permanent && data.someSucceeded;
    }
}
