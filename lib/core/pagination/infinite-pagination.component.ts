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

/* tslint:disable:no-input-rename  */

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    OnDestroy,
    ViewEncapsulation
} from '@angular/core';
import { PaginatedComponent } from './paginated-component.interface';
import { PaginationQueryParams } from './pagination-query-params.interface';
import { Pagination } from 'alfresco-js-api';
import { Subscription } from 'rxjs/Subscription';
import { PaginationComponentInterface } from './pagination-component.interface';

@Component({
    selector: 'adf-infinite-pagination',
    host: { 'class': 'infinite-adf-pagination' },
    templateUrl: './infinite-pagination.component.html',
    styleUrls: ['./infinite-pagination.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class InfinitePaginationComponent implements OnInit, OnDestroy, PaginationComponentInterface {

    static DEFAULT_PAGE_SIZE: number = 25;

    static DEFAULT_PAGINATION: Pagination = {
        skipCount: 0,
        hasMoreItems: false,
        merge: true
    };

    /** Pagination object. */
    @Input()
    pagination: Pagination;

    /** Component that provides custom pagination support. */
    @Input()
    target: PaginatedComponent;

    /** Number of items that are added with each "load more" event. */
    @Input()
    pageSize: number = InfinitePaginationComponent.DEFAULT_PAGE_SIZE;

    /** Is a new page loading? */
    @Input('loading')
    isLoading: boolean = false;

    /** Emitted when the "Load More" button is clicked. */
    @Output()
    loadMore: EventEmitter<Pagination> = new EventEmitter<Pagination>();

    private paginationSubscription: Subscription;

    constructor(private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        if (this.target) {
            this.paginationSubscription = this.target.pagination.subscribe(page => {
                this.pagination = page;
                this.pageSize = page.maxItems;
                this.cdr.detectChanges();
            });
        }

        if (!this.pagination) {
            this.pagination = InfinitePaginationComponent.DEFAULT_PAGINATION;
        }
    }

    onLoadMore() {
        this.pagination.skipCount += this.pageSize;
        this.loadMore.next(this.pagination);

        if (this.target) {
            this.target.updatePagination(<PaginationQueryParams> this.pagination);
        }
    }

    ngOnDestroy() {
        if (this.paginationSubscription) {
            this.paginationSubscription.unsubscribe();
        }
    }
}
