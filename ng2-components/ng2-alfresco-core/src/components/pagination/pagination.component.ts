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
    OnInit,
    Output,
    ViewEncapsulation
} from '@angular/core';

import { Pagination } from 'alfresco-js-api';
import { TranslationService } from './../../services/translation.service';
import { PaginationQueryParams } from './pagination-query-params.interface';

@Component({
    selector: 'adf-pagination, alfresco-pagination',
    host: { 'class': 'adf-pagination' },
    templateUrl: './pagination.component.html',
    styleUrls: [ './pagination.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class PaginationComponent implements OnInit {

    static DEFAULT_PAGE_SIZE: number = 25;

    static ACTIONS = {
        NEXT_PAGE: 'NEXT_PAGE',
        PREV_PAGE: 'PREV_PAGE',
        CHANGE_PAGE_SIZE: 'CHANGE_PAGE_SIZE',
        CHANGE_PAGE_NUMBER: 'CHANGE_PAGE_NUMBER'
    };

    @Input()
    supportedPageSizes: number[] = [ 25, 50, 100 ];

    /** @deprecated */
    /** "pagination" object already has "maxItems" */
    @Input()
    maxItems: number = PaginationComponent.DEFAULT_PAGE_SIZE;

    @Input()
    pagination: Pagination;

    @Output('change')
    onChange: EventEmitter<PaginationQueryParams> = new EventEmitter<PaginationQueryParams>();

    @Output('changePageNumber')
    onChangePageNumber: EventEmitter<Pagination> = new EventEmitter<Pagination>();

    @Output('changePageSize')
    onChangePageSize: EventEmitter<Pagination> = new EventEmitter<Pagination>();

    @Output('nextPage')
    onNextPage: EventEmitter<Pagination> = new EventEmitter<Pagination>();

    @Output('prevPage')
    onPrevPage: EventEmitter<Pagination> = new EventEmitter<Pagination>();

    constructor(translationService: TranslationService) {
        if (translationService) {
            translationService.addTranslationFolder('ng2-alfresco-core', 'assets/ng2-alfresco-core');
        }
    }

    ngOnInit() {
        this.pagination = {
            skipCount: 0,
            maxItems: PaginationComponent.DEFAULT_PAGE_SIZE,
            totalItems: 0
        };
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
        const { current, lastPage } = this;
        return current === lastPage;
    }

    get isFirstPage(): boolean {
        return this.current === 1;
    }

    get next(): number {
        const { isLastPage, current } = this;
        return isLastPage ? current : current + 1;
    }

    get previous(): number {
        const { isFirstPage, current } = this;
        return isFirstPage ? 1 : current - 1;
    }

    get range(): number[] {
        const { skipCount, maxItems, totalItems } = this.pagination;
        const { isLastPage } = this;

        const start = totalItems ? skipCount + 1 : 0;
        const end = isLastPage ? totalItems : skipCount + maxItems;

        return [ start, end ];
    }

    get pages(): number[] {
        return Array(this.lastPage)
            .fill('n')
            .map((item, index) => (index + 1));
    }

    goNext() {
        const { next, pagination: { maxItems } } = this;

        this.handlePaginationEvent(PaginationComponent.ACTIONS.NEXT_PAGE, {
            skipCount: (next - 1) * maxItems,
            maxItems
        });
    }

    goPrevious() {
        const { previous, pagination: { maxItems } } = this;

        this.handlePaginationEvent(PaginationComponent.ACTIONS.PREV_PAGE, {
            skipCount: (previous - 1) * maxItems,
            maxItems
        });
    }

    changePageNumber(pageNumber: number) {
        const { pagination: { maxItems } } = this;

        this.handlePaginationEvent(PaginationComponent.ACTIONS.CHANGE_PAGE_NUMBER, {
            skipCount: (pageNumber - 1) * maxItems,
            maxItems
        });
    }

    changePageSize(maxItems: number) {
        this.handlePaginationEvent(PaginationComponent.ACTIONS.CHANGE_PAGE_SIZE, {
            skipCount: 0,
            maxItems
        });
    }

    handlePaginationEvent(action: string, params: PaginationQueryParams) {
        const {
            NEXT_PAGE,
            PREV_PAGE,
            CHANGE_PAGE_NUMBER,
            CHANGE_PAGE_SIZE
        } = PaginationComponent.ACTIONS;

        const {
            onChange,
            onChangePageNumber,
            onChangePageSize,
            onNextPage,
            onPrevPage,
            pagination
        } = this;

        const data = Object.assign({}, pagination, params);

        if (action === NEXT_PAGE) {
            onNextPage.emit(data);
        }

        if (action === PREV_PAGE) {
            onPrevPage.emit(data);
        }

        if (action === CHANGE_PAGE_NUMBER) {
            onChangePageNumber.emit(data);
        }

        if (action === CHANGE_PAGE_SIZE) {
            onChangePageSize.emit(data);
        }

        onChange.emit(params);
    }
}
