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

import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { debounceTime } from 'rxjs/operators';
import { DataColumn } from '../../data/data-column.model';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ColumnsSearchFilterPipe } from './columns-search-filter.pipe';

@Component({
    selector: 'adf-datatable-column-selector',
    standalone: true,
    imports: [
        CommonModule,
        TranslatePipe,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        ColumnsSearchFilterPipe
    ],
    templateUrl: './columns-selector.component.html',
    styleUrls: ['./columns-selector.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ColumnsSelectorComponent implements OnInit {
    @Input()
    columns: DataColumn[] = [];

    @Input({ required: true })
    mainMenuTrigger: MatMenuTrigger;

    @Input()
    columnsSorting = true;

    @Input()
    maxColumnsVisible?: number;

    @Output()
    submitColumnsVisibility = new EventEmitter<DataColumn[]>();

    columnItems: DataColumn[] = [];
    searchInputControl = new UntypedFormControl('');
    searchQuery = '';

    private readonly destroyRef = inject(DestroyRef);

    ngOnInit(): void {
        this.mainMenuTrigger.menuOpened.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.updateColumnItems();
        });

        this.mainMenuTrigger.menuClosed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.searchInputControl.setValue('');
        });

        this.searchInputControl.valueChanges.pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef)).subscribe((searchQuery) => {
            this.searchQuery = searchQuery;
        });
    }

    closeMenu(): void {
        this.mainMenuTrigger.closeMenu();
    }

    changeColumnVisibility(dataColumn: DataColumn): void {
        const selectedColumn = this.columnItems.find((column) => column.id === dataColumn.id);
        selectedColumn.isHidden = !selectedColumn.isHidden;
    }

    apply(): void {
        this.submitColumnsVisibility.emit(this.columnItems);
        this.closeMenu();
    }

    isCheckboxDisabled(column: DataColumn): boolean {
        return (
            this.maxColumnsVisible &&
            column.isHidden &&
            this.maxColumnsVisible >= this.columnItems.filter((dataColumn) => !dataColumn.isHidden).length
        );
    }

    private updateColumnItems(): void {
        let columns = this.columns.map((column) => ({ ...column }));
        columns = this.sortColumns(columns);
        this.columnItems = columns;
    }

    private sortColumns(columns: DataColumn[]): DataColumn[] {
        if (this.columnsSorting) {
            const shownColumns = columns.filter((column) => !column.isHidden);
            const hiddenColumns = columns.filter((column) => column.isHidden);

            return [...shownColumns, ...hiddenColumns];
        }
        return columns;
    }
}
