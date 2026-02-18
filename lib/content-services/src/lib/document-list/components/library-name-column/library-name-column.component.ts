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

import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NodeEntry } from '@alfresco/js-api';
import { ShareDataRow } from '../../data/share-data-row.model';
import { NodesApiService } from '../../../common/services/nodes-api.service';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NodeTooltipUtils } from '../../utils/node-tooltip.utils';

@Component({
    selector: 'adf-library-name-column',
    imports: [AsyncPipe, TranslatePipe],
    template: `
        <span
            role="link"
            [attr.aria-label]="
                'NAME_COLUMN_LINK.ACCESSIBILITY.ARIA_LABEL'
                    | translate
                        : {
                              name: displayText$ | async
                          }
            "
            class="adf-datatable-cell-value"
            title="{{ displayTooltip$ | async }}"
            (click)="onClick()"
            tabindex="0"
            (keyup.enter)="onClick()"
        >
            {{ displayText$ | async }}
        </span>
    `,
    styleUrls: ['./library-name-column.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'adf-datatable-content-cell adf-datatable-link adf-datatable-library-link adf-library-name-column'
    }
})
export class LibraryNameColumnComponent implements OnInit {
    private element = inject(ElementRef);
    private nodesApiService = inject(NodesApiService);

    @Input({ required: true })
    context: any;

    displayTooltip$ = new BehaviorSubject<string>('');
    displayText$ = new BehaviorSubject<string>('');
    node: NodeEntry;

    private readonly destroyRef = inject(DestroyRef);

    ngOnInit() {
        this.updateValue();

        this.nodesApiService.nodeUpdated.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((node) => {
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
        if (this.node?.entry) {
            const allEntries = rows.map((row: ShareDataRow) => row.node.entry);
            this.displayText$.next(NodeTooltipUtils.getLibraryTitle(this.node.entry, allEntries));
            this.displayTooltip$.next(NodeTooltipUtils.getLibraryTooltip(this.node));
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
}
