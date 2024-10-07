/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { DataColumn } from '../../data/data-column.model';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslationService } from '../../../translation';

@Component({
    selector: 'adf-datatable-column-selector',
    standalone: true,
    imports: [CommonModule, TranslateModule, MatButtonModule, MatIconModule, MatDividerModule, ReactiveFormsModule, MatCheckboxModule],
    templateUrl: './columns-selector.component.html',
    styleUrls: ['./columns-selector.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ColumnsSelectorComponent implements OnInit, OnDestroy {
    private translationService = inject(TranslationService);

    @Input()
    columns: DataColumn[] = [];

    @Input()
    mainMenuTrigger: MatMenuTrigger;

    @Input()
    columnsSorting = true;

    @Input()
    maxColumnsVisible?: number;

    @Output()
    submitColumnsVisibility = new EventEmitter<DataColumn[]>();

    onDestroy$ = new Subject();
    columnItems: DataColumn[] = [];
    searchInputControl = new UntypedFormControl('');
    searchQuery = '';

    ngOnInit(): void {
        this.mainMenuTrigger.menuOpened.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
            this.updateColumnItems();
        });

        this.mainMenuTrigger.menuClosed.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
            this.searchInputControl.setValue('');
        });

        this.searchInputControl.valueChanges.pipe(debounceTime(300), takeUntil(this.onDestroy$)).subscribe((searchQuery) => {
            this.searchQuery = searchQuery;
            this.updateColumnItems();
        });
    }

    private updateColumnItems(): void {
        let columns = this.columns.map((column) => ({ ...column }));
        columns = this.filterColumnItems(columns, this.searchQuery);
        columns = this.sortColumns(columns);
        this.columnItems = columns;
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    closeMenu(): void {
        this.mainMenuTrigger.closeMenu();
    }

    private filterString(value: string = '', filterBy: string = ''): string {
        const testResult = filterBy ? value.toLowerCase().indexOf(filterBy.toLowerCase()) > -1 : true;
        return testResult ? value : '';
    }

    private filterColumnItems(columns: DataColumn[], query: string): DataColumn[] {
        const result = [];

        for (const column of columns) {
            if (!column.title) {
                continue;
            }

            if (!query) {
                result.push(column);
                continue;
            }

            const title = this.translationService.instant(column.title);

            if (this.filterString(title, query)) {
                result.push(column);
            }
        }

        return result;
    }

    changeColumnVisibility(column: DataColumn): void {
        column.isHidden = !column.isHidden;
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

    private sortColumns(columns: DataColumn[]): DataColumn[] {
        if (this.columnsSorting) {
            const shownColumns = columns.filter((column) => !column.isHidden);
            const hiddenColumns = columns.filter((column) => column.isHidden);

            return [...shownColumns, ...hiddenColumns];
        }
        return columns;
    }
}
