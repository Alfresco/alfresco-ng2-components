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

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DataTableCellComponent } from '../datatable-cell/datatable-cell.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    imports: [MatIconModule],
    selector: 'adf-icon-cell',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        @if (icon) {
            <mat-icon [title]="title()" aria-hidden="true">{{ icon }}</mat-icon>
        }
    `,
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-datatable-content-cell' }
})
export class IconCellComponent extends DataTableCellComponent implements OnInit {
    protected readonly changeDetectorRef = inject(ChangeDetectorRef);

    icon: string = '';

    ngOnInit(): void {
        super.ngOnInit();
        this.value$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
            const newIcon = this.validateIconValue(value) ? value : '';
            if (this.icon !== newIcon) {
                this.icon = newIcon;
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    private validateIconValue(value: any): boolean {
        return typeof value === 'string';
    }
}
