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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NodePaging } from 'alfresco-js-api';
import { UserPreferencesService, SearchService, AppConfigService } from '@alfresco/adf-core';

interface FacetConfig {
    id: string;
    name: string;
    enabled: boolean;
    component: FacetComponentConfig;
}

interface FacetComponentConfig {
    selector: string;
    settings: FacetComponentSettingsConfig;
}

interface FacetComponentSettingsConfig {
    field: string;
}

interface SearchConfig {
    facets: Array<FacetConfig>;
}

@Component({
    selector: 'app-search-result-component',
    templateUrl: './search-result.component.html',
    styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {

    data: NodePaging;
    config: SearchConfig;

    facets: Array<FacetConfig> = [];

    constructor(private preferences: UserPreferencesService,
                private route: ActivatedRoute,
                private searchService: SearchService,
                appConfig: AppConfigService) {
        this.config = appConfig.get<SearchConfig>('search');
        this.facets = this.config.facets.filter(f => f.enabled);
    }

    ngOnInit() {
        if (this.route) {
            this.route.params.forEach((params: Params) => {
                const searchedWord = params['q'];

                this.searchService.search(
                    searchedWord,
                    this.preferences.paginationSize.toString(),
                    '0'
                ).subscribe(result => {
                    this.onDataLoaded(result);
                });
            });
        }
    }

    onDataLoaded(data: NodePaging) {
        this.data = data;
    }
}
