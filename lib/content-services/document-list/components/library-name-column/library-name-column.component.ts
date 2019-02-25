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

import {
    Component,
    ChangeDetectionStrategy,
    ViewEncapsulation,
    OnInit,
    Input,
    ElementRef,
    OnDestroy
} from '@angular/core';
import { NodeEntry, Node, Site } from '@alfresco/js-api';
import { ShareDataRow } from '../../data/share-data-row.model';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
    selector: 'adf-library-name-column',
    template: `
        <span title="{{ displayTooltip$ | async }}" (click)="onClick()">
            {{ displayText$ | async }}
        </span>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'adf-datatable-cell adf-datatable-link adf-library-name-column'
    }
})
export class LibraryNameColumnComponent implements OnInit, OnDestroy {
    @Input()
    context: any;

    displayTooltip$ = new BehaviorSubject<string>('');
    displayText$ = new BehaviorSubject<string>('');
    node: NodeEntry;

    private sub: Subscription;

    constructor(
        private element: ElementRef,
        private alfrescoApiService: AlfrescoApiService
    ) {}

    ngOnInit() {
        this.updateValue();

        this.sub = this.alfrescoApiService.nodeUpdated.subscribe(
            (node: Node) => {
                const row: ShareDataRow = this.context.row;
                if (row) {
                    const { entry } = row.node;

                    if (entry === node) {
                        row.node = { entry };
                        this.updateValue();
                    }
                }
            }
        );
    }

    protected updateValue() {
        this.node = this.context.row.node;
        const rows: Array<ShareDataRow> = this.context.data.rows || [];
        if (this.node && this.node.entry) {
            this.displayText$.next(
                this.makeLibraryTitle(<any> this.node.entry, rows)
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
            isDuplicate = entries.some((entry: any) => {
                return entry.id !== id && entry.title === title;
            });
        }

        return isDuplicate ? `${title} (${id})` : `${title}`;
    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
            this.sub = null;
        }
    }
}
