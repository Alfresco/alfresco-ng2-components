/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, model, signal, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmDialogComponent, getFormLayoutColumnWidth, RepeatableRowLabelPipe } from '@alfresco/adf-core';
import { TranslatePipe } from '@ngx-translate/core';
import { ContainerLayoutNode, LayoutNode, LayoutRoot, RepeatableLayoutNode, SectionRowOptions } from '../../definition/form-definition.model';
import { RowAddress, SignalForm } from '../../state/signal-form';
import { SignalFormFieldComponent } from '../field/signal-form-field.component';

const FULL_WIDTH = 100;
/** The narrowest a column of one track gets before it wraps below the others. */
const MIN_TRACK_WIDTH = 240;
const COLUMN_GAP = 8;

interface ColumnPlacement {
    index: number;
    span: number;
    column: LayoutNode[];
}

/**
 * Renders a form's layout: tabs, containers, groups and sections with their columns, repeatable sections with their
 * rows, and every field through the widget the registry resolves for it.
 */
@Component({
    selector: 'adf-signal-form-renderer',
    templateUrl: './signal-form-renderer.component.html',
    styleUrl: './signal-form-renderer.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        NgTemplateOutlet,
        MatButtonModule,
        MatIconModule,
        MatTabsModule,
        MatTooltipModule,
        RepeatableRowLabelPipe,
        TranslatePipe,
        SignalFormFieldComponent
    ],
    host: { class: 'adf-signal-form-renderer' }
})
export class SignalFormRendererComponent {
    private readonly dialog = inject(MatDialog);
    private readonly placements = new WeakMap<ContainerLayoutNode | RepeatableLayoutNode, ColumnPlacement[]>();
    private readonly toggledGroups = signal<Record<string, boolean>>({});

    readonly form = input.required<SignalForm>();

    /** The index of the selected tab among the visible ones. */
    readonly selectedTabIndex = model(0);

    protected rootsOf(tabId: string): LayoutRoot[] {
        return this.form().definition.layout.filter((root) => root.tabId === tabId);
    }

    protected rowOptionsOf(sectionId: string): SectionRowOptions | undefined {
        return this.form().definition.sections.find((section) => section.id === sectionId)?.rowOptions;
    }

    protected rowOf(sectionId: string, index: number): RowAddress {
        return { sectionId, index };
    }

    protected readonly columnGap = COLUMN_GAP;

    /**
     * Returns how a column flexes: it grows in proportion to its span, from the width its span needs at the narrowest
     * readable track. Columns that fit share a row in today's proportions; the others wrap below and fill their row, so
     * a form slides from its authored columns to a single one as it narrows.
     *
     * @param span the column's span, in tracks
     * @returns the CSS `flex` value
     */
    protected columnFlex(span: number): string {
        return `${span} 1 ${span * MIN_TRACK_WIDTH + (span - 1) * COLUMN_GAP}px`;
    }

    /**
     * Places the columns of a container or repeatable section, as wide as today's form makes them: each column spans
     * as many tracks as the largest colspan in it, and a column covered by an earlier field's colspan is left out.
     *
     * @param node the container or repeatable section
     * @returns the columns to render, each with its span
     */
    protected columnPlacements(node: ContainerLayoutNode | RepeatableLayoutNode): ColumnPlacement[] {
        let placements = this.placements.get(node);
        if (!placements) {
            const layoutColumns = node.columns.map((column) => ({
                fields: column.map((child) => ({ colspan: child.kind === 'field' ? child.colspan : 1 }))
            }));
            placements = node.columns
                .map((column, index) => {
                    const width = Number(getFormLayoutColumnWidth(node.numberOfColumns, layoutColumns, index));
                    return { index, column, span: Math.round((width * node.numberOfColumns) / FULL_WIDTH) };
                })
                .filter(({ span }) => span > 0);
            this.placements.set(node, placements);
        }
        return placements;
    }

    /**
     * Whether a group shows its content: open unless it was collapsed, or starts collapsed until it is opened. Only
     * what is shown changes; the fields of a collapsed group are still validated.
     *
     * @param node the group
     * @param row the repeatable section row the group is in, if any
     * @returns `true` when the content is shown
     */
    protected isExpanded(node: ContainerLayoutNode, row?: RowAddress): boolean {
        return this.toggledGroups()[this.groupKey(node, row)] ?? !node.groupHeader?.collapsedByDefault;
    }

    protected toggleGroup(node: ContainerLayoutNode, row?: RowAddress): void {
        const key = this.groupKey(node, row);
        const expanded = this.isExpanded(node, row);
        this.toggledGroups.update((toggled) => ({ ...toggled, [key]: !expanded }));
    }

    protected groupContentId(node: ContainerLayoutNode, row?: RowAddress): string {
        return row ? `${node.element.id}-Row${row.index}-content` : `${node.element.id}-content`;
    }

    private groupKey(node: ContainerLayoutNode, row?: RowAddress): string {
        return row ? `${node.element.id}@${this.form().rowKeys(row.sectionId)[row.index]}` : node.element.id;
    }

    protected isShown(node: LayoutNode, row?: RowAddress): boolean {
        return node.kind === 'field' || this.form().isLayoutElementVisible(node.element, row);
    }

    protected confirmRemoveRow(sectionId: string, index: number): void {
        this.dialog
            .open(ConfirmDialogComponent, {
                data: {
                    title: 'FORM.FORM_RENDERER.REMOVE_ROW_DIALOG.TITLE',
                    message: 'FORM.FORM_RENDERER.REMOVE_ROW_DIALOG.MESSAGE',
                    yesLabel: 'FORM.FORM_RENDERER.REMOVE_ROW_DIALOG.YES_LABEL',
                    noLabel: 'FORM.FORM_RENDERER.REMOVE_ROW_DIALOG.NO_LABEL'
                },
                minWidth: '500px',
                closeOnNavigation: true
            })
            .beforeClosed()
            .subscribe((confirmed) => {
                if (confirmed) {
                    this.form().removeRow(sectionId, index);
                }
            });
    }
}
