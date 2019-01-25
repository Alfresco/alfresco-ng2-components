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

import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { Subscription, BehaviorSubject } from 'rxjs';
import { Node } from '@alfresco/js-api';
import { ShareDataRow } from '../../data/share-data-row.model';

@Component({
    selector: 'adf-library-status-column',
    template: `
        <span title="{{ (displayText$ | async) | translate }}">
            {{ (displayText$ | async) | translate }}
        </span>
    `,
    host: { class: 'adf-library-status-column' }
})
export class LibraryStatusColumnComponent implements OnInit, OnDestroy {
    @Input()
    context: any;

    displayText$ = new BehaviorSubject<string>('');

    private sub: Subscription;

    constructor(private api: AlfrescoApiService) {}

    ngOnInit() {
        this.updateValue();

        this.sub = this.api.nodeUpdated.subscribe((node: Node) => {
            const row: ShareDataRow = this.context.row;
            if (row) {
                const { entry } = row.node;

                if (entry === node) {
                    row.node = { entry };
                    this.updateValue();
                }
            }
        });
    }

    protected updateValue() {
        const node = this.context.row.node;
        if (node && node.entry) {
            const visibility: string = node.entry.visibility;

            switch (visibility.toUpperCase()) {
                case 'PUBLIC':
                    this.displayText$.next('LIBRARY.VISIBILITY.PUBLIC');
                    break;
                case 'PRIVATE':
                    this.displayText$.next('LIBRARY.VISIBILITY.PRIVATE');
                    break;
                case 'MODERATED':
                    this.displayText$.next('LIBRARY.VISIBILITY.MODERATED');
                    break;
                default:
                    this.displayText$.next('UNKNOWN');
                    break;
            }
        }
    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
            this.sub = null;
        }
    }
}
