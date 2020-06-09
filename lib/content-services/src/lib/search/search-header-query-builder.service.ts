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

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { QueryBody, ResultSetPaging } from '@alfresco/js-api';
import { AlfrescoApiService, AppConfigService } from '@alfresco/adf-core';
import { SearchConfiguration } from './search-configuration.interface';
import { BaseQueryBuilderService } from './base-query-builder.service';

@Injectable({
    providedIn: 'root'
})
export class SearchHeaderQueryBuilderService extends BaseQueryBuilderService {
    updated = new Subject<QueryBody>();
    executed = new Subject<ResultSetPaging>();

    constructor(appConfig: AppConfigService, alfrescoApiService: AlfrescoApiService) {
        super(appConfig, alfrescoApiService);
    }

    loadConfiguration(): SearchConfiguration {
        return this.appConfig.get<SearchConfiguration>('search-headers');
    }

    getCategoryForColumn(columnName: string) {
        let foundCategory = null;
        if (this.categories !== null) {
            foundCategory = this.categories.find((category) => category.columnKey === columnName);
        }
        return foundCategory;
    }

}
