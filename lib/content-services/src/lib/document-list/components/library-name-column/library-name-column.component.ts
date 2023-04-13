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

import {
    Component,
    ChangeDetectionStrategy,
    ViewEncapsulation,
    OnInit,
    Input,
    ElementRef,
    OnDestroy
} from '@angular/core';
import { NodeEntry, Site } from '@alfresco/js-api';
import { ShareDataRow } from '../../data/share-data-row.model';
import { NodesApiService } from '../../../common/services/nodes-api.service';

import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'adf-library-name-column',
    template: `
        <span
            role="link"
            [attr.aria-label]="'NAME_COLUMN_LINK.ACCESSIBILITY.ARIA_LABEL' | translate:{
                name:  displayText$ | async
            }"
            class="adf-datatable-cell-value"
            title="{{ displayTooltip$ | async }}"
            (click)="onClick()">

            {{ displayText$ | async }}
        </span>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'adf-datatable-content-cell adf-datatable-link adf-library-name-column'
    }
})
export class LibraryNameColumnComponent implements OnInit, OnDestroy {
    @Input()
    context: any;

    displayTooltip$ = new BehaviorSubject<string>('');
    displayText$ = new BehaviorSubject<string>('');
    node: NodeEntry;

    private onDestroy$ = new Subject<boolean>();

    constructor(
        private element: ElementRef,
        private nodesApiService: NodesApiService
    ) {}

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
        this.node = this.context.row.node;
        const rows: Array<ShareDataRow> = this.context.data.rows || [];
        if (this.node && this.node.entry) {
            this.displayText$.next(
                this.makeLibraryTitle(this.node.entry as any, rows)
            );
            this.displayTooltip$.next(this.makeLibraryTooltip(this.node.entry));
        }
    }

    onClick() {
        this.element.nativeElement.dispatchEvent(
            new CustomEvent('name-click', {
                bubbles: true,
                detail: {
                    node: this.node
                }
            })
        );
    }

    makeLibraryTooltip(library: any): string {
        const { description, title } = library;

        return description || title || '';
    }

    makeLibraryTitle(library: Site, rows: Array<ShareDataRow>): string {
        const entries = rows.map((row: ShareDataRow) => row.node.entry);
        const { title, id } = library;

        let isDuplicate = false;

        if (entries) {
            isDuplicate = entries.some((entry: any) => entry.id !== id && entry.title === title);
        }

        return isDuplicate ? `${title} (${id})` : `${title}`;
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }
}
