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

import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation, OnDestroy, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { PaginatedComponent } from './paginated-component.interface';
import { PaginationComponentInterface } from './pagination-component.interface';
import { Subject } from 'rxjs';
import { PaginationModel } from '../models/pagination.model';
import { UserPreferencesService, UserPreferenceValues } from '../common/services/user-preferences.service';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

export type PaginationAction =
    | 'NEXT_PAGE'
    | 'PREV_PAGE'
    | 'CHANGE_PAGE_SIZE'
    | 'CHANGE_PAGE_NUMBER';

export const DEFAULT_PAGINATION: PaginationModel = {
    skipCount: 0,
    maxItems: 25,
    totalItems: 0,
    count: 0,
    hasMoreItems: false
};

@Component({
    selector: 'adf-pagination',
    host: { class: 'adf-pagination' },
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class PaginationComponent implements OnInit, OnDestroy, PaginationComponentInterface {
    private _pagination: PaginationModel;
    private _isEmpty = true;
    private _hasItems = false;

    /** Component that provides custom pagination support. */
    @Input()
    target: PaginatedComponent;

    /** An array of page sizes. */
    @Input()
    supportedPageSizes: number[];

    get pagination(): PaginationModel {
        return this._pagination;
    }

    /** Pagination object. */
    @Input()
    set pagination(value: PaginationModel) {
        value = value || DEFAULT_PAGINATION;

        this._pagination = value;
        this._hasItems = value && value.count > 0;
        this._isEmpty = !this.hasItems;

        // TODO: Angular 10 workaround for HostBinding bug
        if (this._isEmpty) {
            this.renderer.addClass(this.elementRef.nativeElement, 'adf-pagination__empty');
        } else {
            this.renderer.removeClass(this.elementRef.nativeElement, 'adf-pagination__empty');
        }

        this.cdr.detectChanges();
    }

    /** Emitted when pagination changes in any way. */
    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output()
    change = new EventEmitter<PaginationModel>();

    /** Emitted when the page number changes. */
    @Output()
    changePageNumber = new EventEmitter<PaginationModel>();

    /** Emitted when the page size changes. */
    @Output()
    changePageSize = new EventEmitter<PaginationModel>();

    /** Emitted when the next page is requested. */
    @Output()
    nextPage = new EventEmitter<PaginationModel>();

    /** Emitted when the previous page is requested. */
    @Output()
    prevPage = new EventEmitter<PaginationModel>();

    private onDestroy$ = new Subject<boolean>();

    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer2,
        private cdr: ChangeDetectorRef,
        private userPreferencesService: UserPreferencesService,
        private translate: TranslateService) {
    }

    ngOnInit() {
        this.userPreferencesService
            .select(UserPreferenceValues.PaginationSize)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(maxItems => {
                this.pagination = {
                    ...DEFAULT_PAGINATION,
                    ...this.pagination,
                    maxItems
                };
            });

        if (!this.supportedPageSizes) {
            this.supportedPageSizes = this.userPreferencesService.supportedPageSizes;
        }

        if (this.target) {
            this.target.pagination
                .pipe(takeUntil(this.onDestroy$))
                .subscribe(pagination => {
                    if (pagination.count === 0 && !this.isFirstPage) {
                        this.goPrevious();
                    }

                    this.pagination = {
                        ...pagination
                    };
                });
        }

        if (!this.pagination) {
            this.pagination = {
                ...DEFAULT_PAGINATION
            };
        }
    }

    get lastPage(): number {
        const { maxItems, totalItems } = this.pagination;

        return (totalItems && maxItems)
            ? Math.ceil(totalItems / maxItems)
            : 1;
    }

    get current(): number {
        const { maxItems, skipCount } = this.pagination;

        return (skipCount && maxItems)
            ? Math.floor(skipCount / maxItems) + 1
            : 1;
    }

    get isLastPage(): boolean {
        if (!this.pagination.totalItems && this.pagination.hasMoreItems) {
            return false;
        }
        return this.current === this.lastPage;
    }

    get isFirstPage(): boolean {
        return this.current === 1;
    }

    get next(): number {
        return this.isLastPage ? this.current : this.current + 1;
    }

    get previous(): number {
        return this.isFirstPage ? 1 : this.current - 1;
    }

    get hasItems(): boolean {
        return this._hasItems;
    }

    // TODO: not working correctly in Angular 10
    // @HostBinding('class.adf-pagination__empty')
    get isEmpty(): boolean {
        return this._isEmpty;
    }

    get range(): number[] {
        const { skipCount, maxItems, totalItems } = this.pagination;

        let start = 0;
        if (totalItems || totalItems !== 0) {
            start = skipCount + 1;
        }

        const end = this.isLastPage ? totalItems : skipCount + maxItems;

        return [start, end];
    }

    get pages(): number[] {
        return Array(this.lastPage)
            .fill('n')
            .map((_, index) => (index + 1));
    }

    get limitedPages(): number[] {
        if (this.lastPage <= 100) {
            return this.pages;
        }
        const twentyItems = Array.from(Array(20));
        return [
            1,
            ...twentyItems.map((_, i) => this.current - i - 1).reverse(),
            this.current,
            ...twentyItems.map((_, i) => this.current + i + 1),
            this.lastPage
        ].filter((value: number, index: number, array: number[]) => value > 0 && value <= this.lastPage && !array.slice(0, index).includes(value));
    }

    get itemRangeText(): string {
        const rangeString = this.range.join('-');

        let translation = this.translate.instant('CORE.PAGINATION.ITEMS_RANGE', {
            range: rangeString,
            total: this.pagination.totalItems
        });

        if (!this.pagination.totalItems) {
            translation = translation.substr(0, translation.indexOf(rangeString) + rangeString.length);
        }

        return translation;
    }

    goNext() {
        if (this.hasItems) {
            const maxItems = this.pagination.maxItems;
            const skipCount = (this.next - 1) * maxItems;

            this.pagination = {
                ...this.pagination,
                skipCount
            };

            this.handlePaginationEvent('NEXT_PAGE');
        }
    }

    goPrevious() {
        if (this.hasItems) {
            const maxItems = this.pagination.maxItems;
            const skipCount = (this.previous - 1) * maxItems;

            this.pagination = {
                ...this.pagination,
                skipCount
            };

            this.handlePaginationEvent('PREV_PAGE');
        }
    }

    onChangePageNumber(pageNumber: number) {
        if (this.hasItems) {
            const maxItems = this.pagination.maxItems;
            const skipCount = (pageNumber - 1) * maxItems;

            this.pagination = {
                ...this.pagination,
                skipCount
            };

            this.handlePaginationEvent('CHANGE_PAGE_NUMBER');
        }
    }

    onChangePageSize(maxItems: number) {
        this.pagination = {
            ...this.pagination,
            skipCount: 0,
            maxItems
        };

        this.userPreferencesService.paginationSize = maxItems;
        this.handlePaginationEvent('CHANGE_PAGE_SIZE');
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    handlePaginationEvent(action: PaginationAction) {
        const paginationModel = { ...this.pagination };

        if (action === 'NEXT_PAGE') {
            this.nextPage.emit(paginationModel);
        }

        if (action === 'PREV_PAGE') {
            this.prevPage.emit(paginationModel);
        }

        if (action === 'CHANGE_PAGE_NUMBER') {
            this.changePageNumber.emit(paginationModel);
        }

        if (action === 'CHANGE_PAGE_SIZE') {
            this.changePageSize.emit(paginationModel);
        }

        this.change.emit(paginationModel);

        if (this.target) {
            this.target.updatePagination(paginationModel);
        }
    }
}
