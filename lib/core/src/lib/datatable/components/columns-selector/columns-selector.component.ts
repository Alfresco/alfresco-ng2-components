/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { DataColumn } from '../../data/data-column.model';
@Component({
    selector: 'adf-datatable-column-selector',
    templateUrl: './columns-selector.component.html',
    styleUrls: ['./columns-selector.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ColumnsSelectorComponent implements OnInit, OnDestroy {
    @Input()
    columns: DataColumn[] = [];

    @Input()
    mainMenuTrigger: MatMenuTrigger;

    @Output()
    submitColumnsVisibility = new EventEmitter<DataColumn[]>();

    onDestroy$ = new Subject();
    columnItems: DataColumn[] = [];
    searchInputControl = new UntypedFormControl('');
    searchQuery = '';

    ngOnInit(): void {
        this.mainMenuTrigger.menuOpened.pipe(
            takeUntil(this.onDestroy$)
        ).subscribe(() => {
            const columns = this.columns.map(column => ({...column}));
            this.columnItems = this.sortColumns(columns);
        });

        this.mainMenuTrigger.menuClosed.pipe(
            takeUntil(this.onDestroy$)
        ).subscribe(() => {
            this.searchInputControl.setValue('');
        });

        this.searchInputControl.valueChanges.pipe(
            debounceTime(300),
            takeUntil(this.onDestroy$)
        ).subscribe((searchQuery) => {
            this.searchQuery = searchQuery;
        });
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    closeMenu(): void {
        this.mainMenuTrigger.closeMenu();
    }

    changeColumnVisibility(column: DataColumn): void {
        column.isHidden = !column.isHidden;
    }

    apply(): void {
        this.submitColumnsVisibility.emit(this.columnItems);
        this.closeMenu();
    }

    private sortColumns(columns: DataColumn[]): DataColumn[] {
        const shownColumns = columns.filter(column => !column.isHidden);
        const hiddenColumns = columns.filter(column => column.isHidden);

        return [...shownColumns, ...hiddenColumns];
    }
}
