/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ApiService } from '../../../shared/api/api.service';
import { ResultSetPaging, SearchApi } from '@alfresco/js-api';
import { Logger } from '../utils/logger';
import { ApiUtil } from '../../../shared/api/api.util';
import { UserModel } from '../models/user.model';

export class SearchService {
    apiService: ApiService;
    searchApi: SearchApi;

    constructor(apiService: ApiService) {
        this.apiService = apiService;
        this.searchApi = new SearchApi(this.apiService.getInstance());
    }

    async isSearchable(name: string): Promise<any> {
        const query = this.createSearchQuery(name);
        const predicate = (result: ResultSetPaging) => !!result?.list?.entries?.find(({ entry }) => entry.name === name);

        return this.performSearch(query, predicate, 'Failed to search folder');
    }

    async performSearch(query, predicate, errorMessage): Promise<any> {
        const apiCall = async () => {
            try {
                return this.searchApi.search(query);
            } catch (error) {
                Logger.error(errorMessage);
                return null;
            }
        };

        return ApiUtil.waitForApi(apiCall, predicate);
    }

    async isUserSearchable(user: UserModel): Promise<any> {
        const query = this.createUserSearchQuery(user);

        const predicate = (result: ResultSetPaging) => result.list && result.list.entries.length > 0 && !!result.list.entries.find(({ entry }) => entry.properties['cm:email'] === user.email);

        return this.performSearch(query, predicate, 'Failed to search user');
    }

    private createUserSearchQuery(user: UserModel) {
        return {
            query: {
                query: `email:*${user.email}* OR firstName:*${user.firstName}* OR lastName:*${user.lastName}*`
            },
            include: [
                'aspectNames',
                'properties'
            ],
            paging: {
                maxItems: 1,
                skipCount: 0
            },
            filterQueries: [
                {
                    query: `TYPE:'cm:authority'`
                }
            ]
        };
    }

    private createSearchQuery(name: string) {
        return {
            query: {
                query: `${name}*`
            },
            include: [
                'path',
                'allowableOperations',
                'properties'
            ],
            paging: {
                maxItems: 20,
                skipCount: 0
            },
            filterQueries: [
                {
                    query: `TYPE:'cm:folder' OR TYPE:'cm:content'`
                },
                {
                    query: 'NOT cm:creator:System'
                }
            ],
            scope: {
                locations: [
                    'nodes'
                ]
            }
        };
    }
}
