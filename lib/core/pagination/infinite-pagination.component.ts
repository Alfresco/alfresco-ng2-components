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

@Component({
    selector: 'adf-infinite-pagination',
    host: { 'class': 'infinite-adf-pagination' },
    templateUrl: './infinite-pagination.component.html',
    styleUrls: [ './infinite-pagination.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class InfinitePaginationComponent implements OnInit {

    static DEFAULT_PAGE_SIZE: number = 25;

    static DEFAULT_PAGINATION: Pagination = {
        skipCount: 0,
        hasMoreItems: false
    };

    @Input()
    pagination: Pagination;

    @Input()
    pageSize: number = InfinitePaginationComponent.DEFAULT_PAGE_SIZE;

    @Input('loading')
    isLoading: boolean = false;

    @Output()
    loadMore: EventEmitter<Pagination> = new EventEmitter<Pagination>();

    ngOnInit() {
        if (!this.pagination) {
            this.pagination = InfinitePaginationComponent.DEFAULT_PAGINATION;
        }
    }

    onLoadMore() {
        this.pagination.skipCount += this.pageSize;
        this.loadMore.next(this.pagination);
    }
}
