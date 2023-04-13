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

import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NodesApiService } from '../../../common/services/nodes-api.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { Site, SiteEntry } from '@alfresco/js-api';
import { ShareDataRow } from '../../data/share-data-row.model';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'adf-library-status-column',
    template: `
        <span class="adf-datatable-cell-value" title="{{ (displayText$ | async) | translate }}">
            {{ (displayText$ | async) | translate }}
        </span>
    `,
    host: { class: 'adf-library-status-column adf-datatable-content-cell' }
})
export class LibraryStatusColumnComponent implements OnInit, OnDestroy {
    @Input()
    context: any;

    displayText$ = new BehaviorSubject<string>('');

    private onDestroy$ = new Subject<boolean>();

    constructor(private nodesApiService: NodesApiService) {}

    ngOnInit() {
        this.updateValue();

        this.nodesApiService.nodeUpdated
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(node => {
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
        const node: SiteEntry = this.context.row.node;
        if (node && node.entry) {
            const visibility: string = node.entry.visibility;

            switch (visibility) {
                case Site.VisibilityEnum.PUBLIC:
                    this.displayText$.next('LIBRARY.VISIBILITY.PUBLIC');
                    break;
                case Site.VisibilityEnum.PRIVATE:
                    this.displayText$.next('LIBRARY.VISIBILITY.PRIVATE');
                    break;
                case Site.VisibilityEnum.MODERATED:
                    this.displayText$.next('LIBRARY.VISIBILITY.MODERATED');
                    break;
                default:
                    this.displayText$.next('UNKNOWN');
                    break;
            }
        }
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }
}
