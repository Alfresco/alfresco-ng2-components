/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { Component, Optional } from '@angular/core';
import { SEARCH_QUERY_SERVICE_TOKEN, SearchFilterQueryBuilderService } from '@alfresco/adf-content-services';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'app-filtered-search-component',
    templateUrl: './filtered-search.component.html',
    providers: [{ provide: SEARCH_QUERY_SERVICE_TOKEN, useClass: SearchFilterQueryBuilderService}]
})
export class FilteredSearchComponent {

    navigationRoute = '/filtered-search';
    currentFolderId = '-my-';

    queryParams = null;

    constructor(@Optional() private route: ActivatedRoute) {

        if (this.route) {
            this.route.params.forEach((params: Params) => {
                if (params['id'] && this.currentFolderId !== params['id']) {
                    this.currentFolderId = params['id'];
                }
            });

            this.route.queryParamMap.subscribe((queryMap: Params) => {
                this.queryParams = queryMap.params;
            });
        }
    }
}
