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

import { ChangeDetectionStrategy, Component, computed, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NodeEntry } from '@alfresco/js-api';
import { ShareDataRow } from '../../data/share-data-row.model';
import { NodeTooltipUtils } from '../../utils/node-tooltip.utils';

@Component({
    selector: 'adf-trashcan-name-column',
    template: `<span class="adf-datatable-cell-value" [title]="tooltip()">{{ displayText }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-datatable-content-cell adf-trashcan-name-column' }
})
export class TrashcanNameColumnComponent implements OnInit {
    @Input({ required: true })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context: any;

    isLibrary = false;
    displayText: string;
    node: NodeEntry;

    readonly tooltip = computed(() => (this.isLibrary ? NodeTooltipUtils.getLibraryTooltip(this.node) : NodeTooltipUtils.getNodeTooltip(this.node)));

    ngOnInit() {
        this.node = this.context.row.node;
        const rows: Array<ShareDataRow> = this.context.data.rows || [];

        if (this.node?.entry) {
            this.isLibrary = this.node.entry.nodeType === 'st:site';

            if (this.isLibrary) {
                const allEntries = rows.map((row) => row.node.entry);
                this.displayText = NodeTooltipUtils.getLibraryTitle(this.node.entry, allEntries);
            } else {
                this.displayText = this.node.entry.name || this.node.entry.id;
            }
        }
    }
}
