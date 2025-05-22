/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable rxjs/no-subject-value */

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    EventEmitter,
    inject,
    Input,
    OnInit,
    Output,
    ViewEncapsulation
} from '@angular/core';

import { PaginatedComponent } from './paginated-component.interface';
import { PaginationComponentInterface } from './pagination-component.interface';
import { RequestPaginationModel } from '../models/request-pagination.model';
import { UserPreferencesService, UserPreferenceValues } from '../common/services/user-preferences.service';
import { PaginationModel } from '../models/pagination.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'adf-infinite-pagination',
    host: { class: 'infinite-adf-pagination' },
    templateUrl: './infinite-pagination.component.html',
    styleUrls: ['./infinite-pagination.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [CommonModule, MatButtonModule, MatProgressBarModule, TranslateModule]
})
export class InfinitePaginationComponent implements OnInit, PaginationComponentInterface {
    static DEFAULT_PAGINATION: PaginationModel = new PaginationModel({
        skipCount: 0,
        maxItems: 25,
        totalItems: 0
    });

    _target: PaginatedComponent;

    /** Component that provides custom pagination support. */
    @Input()
    set target(target: PaginatedComponent) {
        if (target) {
            this._target = target;
            target.pagination.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((pagination) => {
                this.isLoading = false;
                this.pagination = pagination;

                if (!this.pagination.hasMoreItems) {
                    this.pagination.hasMoreItems = false;
                }

                this.cdr.detectChanges();
            });
        }
    }

    get target() {
        return this._target;
    }

    /** Number of items that are added with each "load more" event. */
    @Input()
    pageSize: number;

    /** Is a new page loading? */
    @Input('loading')
    isLoading: boolean = false;

    /** Emitted when the "Load More" button is clicked. */
    @Output()
    loadMore: EventEmitter<RequestPaginationModel> = new EventEmitter<RequestPaginationModel>();

    pagination: PaginationModel = InfinitePaginationComponent.DEFAULT_PAGINATION;

    requestPaginationModel: RequestPaginationModel = {
        skipCount: 0,
        merge: true
    };

    private readonly destroyRef = inject(DestroyRef);

    constructor(private cdr: ChangeDetectorRef, private userPreferencesService: UserPreferencesService) {}

    ngOnInit() {
        this.userPreferencesService
            .select(UserPreferenceValues.PaginationSize)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((pageSize: number) => {
                this.pageSize = this.pageSize || pageSize;
                this.requestPaginationModel.maxItems = this.pageSize;
            });
    }

    onLoadMore() {
        this.requestPaginationModel.skipCount = 0;
        this.requestPaginationModel.merge = true;

        this.requestPaginationModel.maxItems += this.pageSize;

        this.loadMore.next(this.requestPaginationModel);

        if (this._target) {
            this.isLoading = true;
            this._target.updatePagination(this.requestPaginationModel);
        }
    }

    reset() {
        this.pagination.skipCount = 0;
        this.pagination.maxItems = this.pageSize;

        if (this._target) {
            this._target.updatePagination(this.pagination);
        }
    }
}
