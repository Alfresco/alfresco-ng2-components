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

import { Component, OnInit, Optional, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NodePaging, Pagination, ResultSetPaging } from 'alfresco-js-api';
import { SearchQueryBuilderService } from '@alfresco/adf-content-services';
import { UserPreferencesService, SearchService, AppConfigService } from '@alfresco/adf-core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-search-result-component',
    templateUrl: './search-result.component.html',
    styleUrls: ['./search-result.component.scss'],
    providers: [SearchService, SearchQueryBuilderService]
})
export class SearchResultComponent implements OnInit, OnDestroy {

    queryParamName = 'q';
    searchedWord = '';
    data: NodePaging;
    pagination: Pagination;
    isLoading = true;

    sorting = ['name', 'asc'];

    private subscriptions: Subscription[] = [];

    constructor(public router: Router,
                private config: AppConfigService,
                private preferences: UserPreferencesService,
                private queryBuilder: SearchQueryBuilderService,
                @Optional() private route: ActivatedRoute) {
        queryBuilder.paging = {
            maxItems: this.preferences.paginationSize,
            skipCount: 0
        };
    }

    ngOnInit() {

        this.sorting = this.getSorting();

        this.subscriptions.push(
            this.queryBuilder.updated.subscribe(() => {
                this.sorting = this.getSorting();
                this.isLoading = true;
            }),

            this.queryBuilder.executed.subscribe((resultSetPaging: ResultSetPaging) => {
                this.queryBuilder.paging.skipCount = 0;

                this.onSearchResultLoaded(resultSetPaging);
                this.isLoading = false;
            })
        );

        if (this.route) {
            this.route.params.forEach((params: Params) => {
                this.searchedWord = params.hasOwnProperty(this.queryParamName) ? params[this.queryParamName] : null;
                const query = this.formatSearchQuery(this.searchedWord);

                if (query) {
                    this.queryBuilder.userQuery = query;
                    this.queryBuilder.update();
                } else {
                    this.queryBuilder.userQuery = null;
                    this.queryBuilder.executed.next(new ResultSetPaging({
                        list: {
                            pagination: { totalItems: 0 },
                            entries: []
                        }
                    }));
                }
            });
        }
    }

    private formatSearchQuery(userInput: string) {
        if (!userInput) {
            return null;
        }

        const fields = this.config.get<string[]>('search.app:fields', ['cm:name']);
        const query = fields.map((field) => `${field}:"${userInput}*"`).join(' OR ');

        return query;
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.subscriptions = [];
    }

    onSearchResultLoaded(resultSetPaging: ResultSetPaging) {
        this.data = resultSetPaging;
        this.pagination = { ...resultSetPaging.list.pagination };
    }

    onRefreshPagination(pagination: Pagination) {
        this.queryBuilder.paging = {
            maxItems: pagination.maxItems,
            skipCount: pagination.skipCount
        };
        this.queryBuilder.update();
    }

    onDeleteElementSuccess() {
        this.queryBuilder.execute();
    }

    private getSorting(): string[] {
        const primary = this.queryBuilder.getPrimarySorting();

        if (primary) {
            return [primary.key, primary.ascending ? 'asc' : 'desc'];
        }

        return ['name', 'asc'];
    }
}
