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
import { ActivatedRoute } from '@angular/router';
import { NodePaging } from 'alfresco-js-api';
import { AppConfigService, AlfrescoApiService } from '@alfresco/adf-core';
import { SearchConfiguration, SearchQueryBuilder } from '@alfresco/adf-content-services';

@Component({
    selector: 'app-search-result-component',
    templateUrl: './search-result.component.html',
    styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {

    data: NodePaging;
    queryBuilder: SearchQueryBuilder;

    constructor(private route: ActivatedRoute,
                api: AlfrescoApiService,
                appConfig: AppConfigService) {
        const config = appConfig.get<SearchConfiguration>('search');

        this.queryBuilder = new SearchQueryBuilder(config, api);
        this.queryBuilder.updated.subscribe(query => {
            this.queryBuilder.execute();
        });

        this.queryBuilder.executed.subscribe(data => {
            this.onDataLoaded(data);
        });
    }

    async ngOnInit() {
        if (this.route) {
            this.route.params.subscribe(params => {
                const searchTerm = params['q'];
                if (searchTerm) {
                    this.queryBuilder.queryFragments['queryName'] = `cm:name:'${searchTerm}'`;
                    this.queryBuilder.update();
                }
            });
        }
    }

    onDataLoaded(data: any) {
        this.data = data;
    }
}
