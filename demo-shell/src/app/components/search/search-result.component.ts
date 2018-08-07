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

import { Component, OnInit, Optional, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NodePaging, Pagination } from 'alfresco-js-api';
import { SearchComponent, SearchQueryBuilderService } from '@alfresco/adf-content-services';
import { UserPreferencesService, SearchService, SearchConfigurationService } from '@alfresco/adf-core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-search-result-component',
    templateUrl: './search-result.component.html',
    styleUrls: ['./search-result.component.scss'],
    providers: [SearchService, SearchQueryBuilderService]
})
export class SearchResultComponent implements OnInit, OnDestroy {

    @ViewChild('searchResult')
    searchResult: SearchComponent;

    queryParamName = 'q';
    searchedWord = '';
    resultNodePageList: NodePaging;
    pagination: Pagination;
    maxItems: number;
    skipCount = 0;

    sorting = ['name', 'asc'];

    private subscriptions: Subscription[] = [];

    constructor(public router: Router,
                private preferences: UserPreferencesService,
                private queryBuilder: SearchQueryBuilderService,
                private searchConfiguration: SearchConfigurationService,
                @Optional() private route: ActivatedRoute) {
        this.maxItems = this.preferences.paginationSize;
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
            })
        );

        if (this.route) {
            this.route.params.forEach((params: Params) => {
                this.searchedWord = params.hasOwnProperty(this.queryParamName) ? params[this.queryParamName] : null;
                if (this.searchedWord) {
                    const queryBody = this.searchConfiguration.generateQueryBody(this.searchedWord, 0, 100);

                    this.queryBuilder.userQuery = queryBody.query.query;
                    this.queryBuilder.update();
                }
            });
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }

    onSearchResultLoaded(nodePaging: NodePaging) {
        this.resultNodePageList = nodePaging;
        this.pagination = {...nodePaging.list.pagination };
    }

    onRefreshPagination(pagination: Pagination) {
        this.maxItems = pagination.maxItems;
        this.skipCount = pagination.skipCount;

        this.queryBuilder.paging = {
            maxItems: pagination.maxItems,
            skipCount: pagination.skipCount
        };
        this.queryBuilder.update();
    }

    onDeleteElementSuccess(element: any) {
        this.searchResult.reload();
    }

    private getSorting(): string[] {
        const primary = this.queryBuilder.getPrimarySorting();

        if (primary) {
            return [primary.key, primary.ascending ? 'asc' : 'desc'];
        }

        return ['name', 'asc'];
    }
}
