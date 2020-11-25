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

import { ApiService } from './api.service';
import { ResultSetPaging } from '@alfresco/js-api';
import { Logger } from '../utils/logger';
import { ApiUtil } from './api.util';

export class SearchService {
    apiService: ApiService;

    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }

    async isSearchable(name: string): Promise<any> {
        const query = this.createSearchQuery(name);

        const predicate = (result: ResultSetPaging) => {
            return !!result?.list?.entries?.find(({ entry }) => entry.name === name);
        };

        const apiCall = async () => {
            try {
                const path = '/alfresco/api/-default-/public/search/versions/1/search';
                const method = 'POST';

                const queryParams = {},
                    postBody = JSON.parse(query);

                return this.apiService.performECMOperation(path, method, queryParams, postBody);
            } catch (error) {
                Logger.error('Failed to search folder');
            }
        };

        return ApiUtil.waitForApi(apiCall, predicate);
    }

    private createSearchQuery(name: string) {
        return `{
            "query": {
                "query": "${name}*"
            },
            "include": [
                "properties"
            ],
            "paging": {
                "maxItems": 20,
                "skipCount": 0
            },
            "filterQueries": [
                {
                    "query": "TYPE:'cm:folder' OR TYPE:'cm:content'"
                },
                {
                    "query": "NOT cm:creator:System"
                }
            ],
            "scope": {
                "locations": [
                    "nodes"
                ]
            }
        }`;
    }
}
