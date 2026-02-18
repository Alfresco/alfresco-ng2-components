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

import { ChangeDetectionStrategy, Component, ViewEncapsulation, Input, computed, inject } from '@angular/core';
import { DataTableCellComponent } from '../datatable-cell/datatable-cell.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditJsonDialogComponent, EditJsonDialogSettings } from '../../../dialogs/edit-json/edit-json.dialog';
import { MatButtonModule } from '@angular/material/button';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'adf-json-cell',
    imports: [MatButtonModule, MatDialogModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        @if (shouldShowButton()) {
            <button mat-button (click)="view()">json</button>
        }
    `,
    styleUrls: ['./json-cell.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-datatable-content-cell' }
})
export class JsonCellComponent extends DataTableCellComponent {
    private dialog = inject(MatDialog);

    /** Editable JSON. */
    @Input()
    editable: boolean = false;

    private readonly jsonValue = toSignal(this.value$);

    readonly shouldShowButton = computed(() => {
        const value = this.jsonValue();
        return !!value || this.editable;
    });

    view() {
        const rawValue = this.data.getValue(this.row, this.column, this.resolverFn);
        const value = typeof rawValue === 'object' ? JSON.stringify(rawValue || {}, null, 2) : String(rawValue ?? '');

        const settings: EditJsonDialogSettings = {
            title: this.column.title,
            editable: this.editable,
            value
        };

        this.dialog
            .open(EditJsonDialogComponent, {
                data: settings,
                minWidth: '50%',
                minHeight: '50%'
            })
            .afterClosed()
            .subscribe();
    }
}
