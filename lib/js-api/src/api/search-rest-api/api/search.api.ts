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

import { ResultSetPaging } from '../model/resultSetPaging';
import { SearchRequest } from '../model/searchRequest';
import { throwIfNotDefined } from '../../../assert';
import { ApiClient } from '../../../api-clients/api-client';
import { LegacyHttpClient } from '../../../api-clients/http-client.interface';

/**
 * Search service.
 * @module SearchApi
 */
export class SearchApi extends ApiClient {
    override get apiClient(): LegacyHttpClient {
        return this.httpClient ?? this.alfrescoApi.searchClient;
    }

    /**
     * Searches Alfresco
     *
     * **Note**: this endpoint is available in Alfresco 5.2 and newer versions.
     * @param queryBody Generic query API
     * @returns Promise<ResultSetPaging>
     */
    search(queryBody: SearchRequest): Promise<ResultSetPaging> {
        throwIfNotDefined(queryBody, 'queryBody');

        return this.post({
            path: '/search',
            bodyParam: queryBody,
            returnType: ResultSetPaging
        });
    }
}
