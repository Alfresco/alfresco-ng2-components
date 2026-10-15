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
import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmDialogComponent, RepeatableRowLabelPipe } from '@alfresco/adf-core';
import { TranslatePipe } from '@ngx-translate/core';
import { LayoutNode, LayoutRoot, SectionRowOptions } from '../../definition/form-definition.model';
import { RowAddress, SignalForm } from '../../state/signal-form';
import { SignalFormFieldComponent } from '../field/signal-form-field.component';

/**
 * Renders a form's layout: tabs, containers, groups and sections with their columns, repeatable sections with their
 * rows, and every field through the widget the registry resolves for it.
 */
@Component({
    selector: 'adf-signal-form',
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
    host: { class: 'adf-signal-form' }
})
export class SignalFormRendererComponent {
    private readonly dialog = inject(MatDialog);

    readonly form = input.required<SignalForm>();

    protected readonly visibleTabs = computed(() => this.form().definition.tabs.filter((tab) => this.form().isTabVisible(tab.id)));

    protected rootsOf(tabId: string): LayoutRoot[] {
        return this.form().definition.layout.filter((root) => root.tabId === tabId);
    }

    protected rowIndexes(sectionId: string): number[] {
        return [...Array(this.form().rowCount(sectionId)).keys()];
    }

    protected rowOptionsOf(sectionId: string): SectionRowOptions | undefined {
        return this.form().definition.sections.find((section) => section.id === sectionId)?.rowOptions;
    }

    protected rowOf(sectionId: string, index: number): RowAddress {
        return { sectionId, index };
    }

    protected columnTemplate(numberOfColumns: number): string {
        return `repeat(${numberOfColumns}, minmax(0, 1fr))`;
    }

    protected isShown(node: LayoutNode): boolean {
        return node.kind === 'field' || this.form().isLayoutElementVisible(node.element);
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
