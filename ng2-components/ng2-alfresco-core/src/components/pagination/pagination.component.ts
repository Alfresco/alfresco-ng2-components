/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation
} from '@angular/core';

import { Pagination } from 'alfresco-js-api';

import { UserPreferencesService } from '../../services/user-preferences.service';

@Component({
    selector: 'adf-pagination',
    host: { 'class': 'adf-pagination' },
    templateUrl: './pagination.component.html',
    styleUrls: [ './pagination.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class PaginationComponent {

    @Input()
    pageSizes: number[] = [ 25, 50, 100 ];

    @Input()
    pagination: Pagination = null;

    @Output()
    change: EventEmitter<PaginationQueryParams> = new EventEmitter<PaginationQueryParams>();

    constructor(
        private preferences: UserPreferencesService
    ) {}

    get totalItems(): number {
        if (!this.pagination) { return 0; }
        return this.pagination.totalItems;
    }

    get maxItems(): number {
        if (!this.pagination) { return 0; }
        return this.pagination.maxItems;
    }

    get lastPage(): number {
        const { totalItems, maxItems } = this;

        if (!maxItems) { return 1; }
        return Math.ceil(totalItems / maxItems);
    }

    get skipCount(): number {
        if (!this.pagination) { return 0; }
        return this.pagination.skipCount;
    }

    get currentPage(): number {
        const { maxItems, skipCount } = this;

        if (!maxItems) { return 1; }
        return Math.floor(skipCount / maxItems) + 1;
    }

    get isLastPage(): boolean {
        const { currentPage, lastPage } = this;
        return currentPage === lastPage;
    }

    get isFirstPage(): boolean {
        const { currentPage, lastPage } = this;
        return currentPage === 1;
    }

    get nextPage(): number {
        const { isLastPage, currentPage, lastPage } = this;
        return isLastPage ? currentPage : currentPage + 1;
    }

    get previousPage(): number {
        const { isFirstPage, currentPage } = this;
        return isFirstPage ? 1 : currentPage - 1;
    }

    get range(): number[] {
        let start = 0;
        let end = 0;

        if (this.pagination) {
            const { skipCount, maxItems, totalItems, isLastPage } = this;

            start = skipCount + 1;
            end = isLastPage ? totalItems : skipCount + maxItems;
        }

        return [ start, end ];
    }

    get pages(): number[] {
        return Array(this.lastPage)
            .fill('n')
            .map((item, index) => (index + 1));
    }

    goNext() {
        const { nextPage, maxItems } = this;
        const params: PaginationQueryParams = {
            skipCount: (nextPage - 1) * maxItems,
            maxItems
        };

        this.change.emit(params);
    }

    goPrevious() {
        const { previousPage, maxItems } = this;
        const params: PaginationQueryParams = {
            skipCount: (previousPage - 1) * maxItems,
            maxItems
        };

        this.change.emit(params);
    }

    changePage(pageNumber: number) {
        const { maxItems } = this;
        const params: PaginationQueryParams = {
            skipCount: ((pageNumber - 1) * maxItems),
            maxItems
        };

        this.change.emit(params);
    }

    changePageSize(maxItems: number) {
        const params: PaginationQueryParams = {
            skipCount: 0,
            maxItems
        };

        this.change.emit(params);
    }
}
