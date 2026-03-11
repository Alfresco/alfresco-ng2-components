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

import { ChangeDetectionStrategy, Component, computed, DestroyRef, ElementRef, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NodeEntry } from '@alfresco/js-api';
import { BehaviorSubject } from 'rxjs';
import { NodesApiService } from '../../../common/services/nodes-api.service';
import { ShareDataRow } from '../../data/share-data-row.model';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NodeTooltipUtils } from '../../utils/node-tooltip.utils';

@Component({
    selector: 'adf-name-column',
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
            [title]="tooltip()"
            (click)="onClick()"
            tabindex="0"
            (keyup.enter)="onClick()"
        >
            {{ displayText$ | async }}
        </span>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-datatable-content-cell adf-datatable-link adf-name-column' }
})
export class NameColumnComponent implements OnInit {
    private readonly element = inject(ElementRef);
    private readonly nodesApiService = inject(NodesApiService);

    @Input({ required: true })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context: any;

    @Input()
    key = 'name';

    displayText$ = new BehaviorSubject<string>('');
    node: NodeEntry;

    readonly tooltip = computed(() => NodeTooltipUtils.getNodeTooltip(this.node));

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

        if (this.node?.entry) {
            const displayValue = this.context.row.getValue(this.key);
            this.displayText$.next(displayValue || this.node.entry.id);
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
