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
import { RequestPaginationModel } from '../models/request-pagination.model';
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
    loadMore: EventEmitter<RequestPaginationModel> = new EventEmitter<RequestPaginationModel>();

    pagination: PaginationModel;

    requestPaginationModel: RequestPaginationModel = {
        skipCount: 0,
        merge: true
    };

    private paginationSubscription: Subscription;

    constructor(private cdr: ChangeDetectorRef, private userPreferencesService: UserPreferencesService) {
    }

    ngOnInit() {
        if (this.target) {
            this.paginationSubscription = this.target.pagination.subscribe((pagination) => {
                this.isLoading = false;
                this.pagination = pagination;

                if (!this.pagination.hasMoreItems) {
                    this.pagination.hasMoreItems = false;
                }

                this.cdr.detectChanges();
            });
        }

        this.userPreferencesService.select(UserPreferenceValues.PaginationSize).subscribe((pagSize) => {
            this.pageSize = this.pageSize || pagSize;
            this.requestPaginationModel.maxItems = this.pageSize;
        });
    }

    onLoadMore() {
        this.requestPaginationModel.skipCount = 0;
        this.requestPaginationModel.merge = false;

        this.requestPaginationModel.maxItems += this.pageSize;

        this.loadMore.next(this.requestPaginationModel);

        if (this.target) {
            this.isLoading = true;
            this.target.updatePagination(<RequestPaginationModel> this.requestPaginationModel);
        }
    }

    reset() {
        this.pagination.skipCount = 0;
        this.pagination.maxItems = this.pageSize;
        this.target.updatePagination(this.pagination);
    }

    ngOnDestroy() {
        if (this.paginationSubscription) {
            this.paginationSubscription.unsubscribe();
        }
    }
}
