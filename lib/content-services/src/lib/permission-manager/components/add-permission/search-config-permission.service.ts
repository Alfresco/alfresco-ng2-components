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

import { SearchRequest } from '@alfresco/js-api';
import { Injectable, Optional, Inject, InjectionToken } from '@angular/core';
import { SearchConfigurationInterface } from '../../../common/interfaces/search-configuration.interface';

export const SEARCH_QUERY_TOKEN = new InjectionToken<QueryProvider>('Alfresco Search Query Token');
export interface QueryProvider {
    query: string;
}

@Injectable()
export class SearchPermissionConfigurationService implements SearchConfigurationInterface {
    constructor(
        @Optional()
        @Inject(SEARCH_QUERY_TOKEN)
        private queryProvider: QueryProvider
    ) {}

    public generateQueryBody(searchTerm: string, maxResults: number, skipCount: number): SearchRequest {
        return {
            query: {
                query: this.getQuery(searchTerm)
            },
            include: ['properties', 'aspectNames'],
            paging: {
                maxItems: maxResults,
                skipCount
            },
            filterQueries: [
                /* eslint-disable-next-line */
                { query: "TYPE:'cm:authority'" }
            ]
        };
    }

    private getQuery(searchTerm: string) {
        let query: string;
        if (this.queryProvider?.query) {
            query = this.queryProvider.query.replace(new RegExp(/\${([^}]+)}/g), searchTerm);
        } else {
            query = `(userName:*${searchTerm}* OR email:*${searchTerm}* OR firstName:*${searchTerm}* OR lastName:*${searchTerm}* OR authorityName:*${searchTerm}* OR authorityDisplayName:*${searchTerm}*) AND PATH:"//cm:APP.DEFAULT/*"`;
        }
        return query;
    }
}
