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
import { CommonModule } from '@angular/common';

@Component({
    selector: 'adf-trashcan-name-column',
    imports: [CommonModule],
    template: `
        <ng-container *ngIf="!isLibrary">
            <span class="adf-datatable-cell-value" [title]="nodeTooltip()">{{ displayText }}</span>
        </ng-container>
        <ng-container *ngIf="isLibrary">
            <span class="adf-datatable-cell-value" [title]="displayTooltip">{{ displayText }}</span>
        </ng-container>
    `,
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
    displayTooltip: string;
    node: NodeEntry;

    readonly nodeTooltip = computed(() => this.getNodeNameTooltip(this.node));

    ngOnInit() {
        this.node = this.context.row.node;
        const rows: Array<ShareDataRow> = this.context.data.rows || [];

        if (this.node?.entry) {
            this.isLibrary = this.node.entry.nodeType === 'st:site';

            if (this.isLibrary) {
                const { properties } = this.node.entry;

                this.displayText = this.makeLibraryTitle(this.node.entry, rows);
                this.displayTooltip = properties['cm:description'] || properties['cm:title'];
            } else {
                this.displayText = this.node.entry.name || this.node.entry.id;
            }
        }
    }

    private getNodeNameTooltip(node: NodeEntry): string | null {
        if (!node?.entry) {
            return null;
        }

        const {
            entry: { properties, name }
        } = node;

        const title = properties?.['cm:title'];
        const description = properties?.['cm:description'];

        // Build lines array based on available properties
        const lines: string[] = [];

        // Determine first line: title if available and different from name, otherwise name
        if (title && description) {
            lines.push(title, description);
        } else if (title) {
            lines.push(name, title);
        } else if (description) {
            lines.push(name, description);
        } else {
            lines.push(name);
        }

        // Remove case-insensitive duplicates while preserving order
        return this.removeDuplicates(lines).join('\n');
    }

    private removeDuplicates(lines: string[]): string[] {
        const seen = new Set<string>();
        return lines.filter((line) => {
            const lowerLine = line.toLowerCase();
            if (seen.has(lowerLine)) {
                return false;
            }
            seen.add(lowerLine);
            return true;
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    makeLibraryTitle(library: any, rows: Array<ShareDataRow>): string {
        const entries = rows.map((r: ShareDataRow) => r.node.entry);
        const { id } = library;
        const title = library.properties['cm:title'];

        let isDuplicate = false;

        if (entries) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            isDuplicate = entries.some((entry: any) => entry.id !== id && entry.properties['cm:title'] === title);
        }

        return isDuplicate ? `${library.properties['cm:title']} (${library.name})` : `${library.properties['cm:title']}`;
    }
}
