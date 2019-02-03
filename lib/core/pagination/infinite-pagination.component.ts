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
/* tslint:disable:rxjs-no-subject-value */

import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter,
    Input, OnInit, Output, OnDestroy, ViewEncapsulation
} from '@angular/core';

import { PaginatedComponent } from './paginated-component.interface';
import { Subscription } from 'rxjs';
import { PaginationComponentInterface } from './pagination-component.interface';
import { PaginationModel } from '../models/pagination.model';
import { UserPreferencesService, UserPreferenceValues } from '../services/user-preferences.service';

@Component({
    selector: 'adf-infinite-pagination',
    host: { 'class': 'infinite-adf-pagination' },
    templateUrl: './infinite-pagination.component.html',
    styleUrls: ['./infinite-pagination.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class InfinitePaginationComponent implements OnInit, OnDestroy, PaginationComponentInterface {

    static DEFAULT_PAGINATION: PaginationModel = {
        skipCount: 0,
        hasMoreItems: false,
        merge: true
    };

    /** Component that provides custom pagination support. */
    @Input()
    target: PaginatedComponent;

    /** Number of items that are added with each "load more" event. */
    @Input()
    pageSize: number;

    /** Is a new page loading? */
    @Input('loading')
    isLoading: boolean = false;

    /** Emitted when the "Load More" button is clicked. */
    @Output()
    loadMore: EventEmitter<PaginationModel> = new EventEmitter<PaginationModel>();

    pagination: PaginationModel;

    private paginationSubscription: Subscription;

    constructor(private cdr: ChangeDetectorRef, private userPreferencesService: UserPreferencesService) {
    }

    ngOnInit() {
        if (this.target) {
            this.paginationSubscription = this.target.pagination.subscribe((pagination) => {
                this.isLoading = false;
                this.pagination = pagination;
                this.cdr.detectChanges();
            });
        }

        this.userPreferencesService.select(UserPreferenceValues.PaginationSize).subscribe((pagSize) => {
            this.pageSize = this.pageSize || pagSize;
        });

        if (!this.pagination) {
            this.pagination = InfinitePaginationComponent.DEFAULT_PAGINATION;
        }
    }

    onLoadMore() {
        this.pagination.skipCount += this.pageSize;
        this.pagination.merge = true;
        this.loadMore.next(this.pagination);

        if (this.pagination.skipCount >= this.pagination.totalItems || !this.pagination.hasMoreItems) {
            this.pagination.hasMoreItems = false;
        }

        if (this.target) {
            this.target.pagination.value.merge = this.pagination.merge;
            this.target.pagination.value.skipCount = this.pagination.skipCount;
            this.isLoading = true;
            this.target.updatePagination(<PaginationModel> this.pagination);
        }
    }

    reset() {
        this.pagination.skipCount = 0;
        this.target.updatePagination(this.pagination);
    }

    ngOnDestroy() {
        if (this.paginationSubscription) {
            this.paginationSubscription.unsubscribe();
        }
    }
}
