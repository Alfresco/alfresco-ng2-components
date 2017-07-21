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

    private static actions: any = {
        PAGE_SIZE_CHANGE: 'PAGE_SIZE_CHANGE',
        PAGE_CHANGE: 'PAGE_CHANGE',
        PREVIOUS_PAGE: 'PREVIOUS_PAGE',
        NEXT_PAGE: 'NEXT_PAGE'
    };

    @Input()
    pageSizes: number[] = [ 25, 50, 100 ];

    @Input()
    pagination: Pagination = null;

    @Output()
    onPaginationEvent: EventEmitter<Pagination> = new EventEmitter<Pagination>();

    @Output()
    onNextPage: EventEmitter<Pagination> = new EventEmitter<Pagination>();

    @Output()
    onPreviousPage: EventEmitter<Pagination> = new EventEmitter<Pagination>();

    @Output()
    onPageChange: EventEmitter<Pagination> = new EventEmitter<Pagination>();

    @Output()
    onPageSizeChange: EventEmitter<Pagination> = new EventEmitter<Pagination>();

    constructor(private preferences: UserPreferencesService) {}

    get total(): number {
        if (!this.pagination) { return 0; }
        return this.pagination.totalItems;
    }

    get size(): number {
        if (!this.pagination) { return 0; }
        return this.pagination.maxItems;
    }

    get last(): number {
        const { total, size } = this;

        if (!size) { return 1; }
        return Math.ceil(total / size);
    }

    get offset(): number {
        if (!this.pagination) { return 0; }
        return this.pagination.skipCount;
    }

    get current(): number {
        const { size, offset } = this;

        if (!size) { return 1; }
        return Math.floor(offset / size) + 1;
    }

    get isLast(): boolean {
        const { current, last } = this;
        return current === last;
    }

    get isFirst(): boolean {
        const { current, last } = this;
        return current === 1;
    }

    get next(): number {
        const { isLast, current, last } = this;
        return isLast ? current : current + 1;
    }

    get previous(): number {
        const { isFirst, current } = this;
        return isFirst ? 1 : current - 1;
    }

    get range(): number[] {
        if (!this.pagination) { return [ 0, 0 ]; }

        const { offset, size, total, isLast } = this;
        return [ offset + 1, isLast ? total : offset + size ];
    }

    get pages(): number[] {
        return Array(this.last).fill('n')
            .map((item, index) => (index + 1));
    }

    pageSizeChange(size: number) {
        this.handlePaginationEvent(
            { maxItems: size, skipCount: 0 },
            PaginationComponent.actions.PAGE_SIZE_CHANGE
        );
    }

    pageChange(n: number) {
        const { size } = this;
        this.handlePaginationEvent(
            { skipCount: ((n - 1) * size) },
            PaginationComponent.actions.PAGE_CHANGE
        );
    }

    goPrevious() {
        const { previous, size } = this;
        this.handlePaginationEvent(
            { skipCount: (previous - 1) * size },
            PaginationComponent.actions.PREVIOUS_PAGE
        );
    }

    goNext() {
        const { next, size } = this;
        this.handlePaginationEvent(
            { skipCount: (next - 1) * size },
            PaginationComponent.actions.NEXT_PAGE
        );
    }

    handlePaginationEvent(paginationChunk: any, action: string) {
        const {
            NEXT_PAGE,
            PREVIOUS_PAGE,
            PAGE_CHANGE,
            PAGE_SIZE_CHANGE
        } = PaginationComponent.actions;

        const {
            preferences,
            onPageSizeChange,
            onPageChange,
            onNextPage,
            onPreviousPage,
            onPaginationEvent
        } = this;

        const pagination = Object.assign({}, this.pagination, paginationChunk);

        if (action === PAGE_SIZE_CHANGE) {
            preferences.paginationSize = pagination.maxItems;
            onPageSizeChange.emit(pagination);
        }

        if (action === PAGE_CHANGE) {
            onPageChange.emit(pagination);
        }

        if (action === NEXT_PAGE) {
            onNextPage.emit(pagination);
        }

        if (action === PREVIOUS_PAGE) {
            onPreviousPage.emit(pagination);
        }

        onPaginationEvent.emit(pagination);
    }
}
