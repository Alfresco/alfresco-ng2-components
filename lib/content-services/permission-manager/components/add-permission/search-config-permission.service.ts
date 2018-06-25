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

import { QueryBody } from 'alfresco-js-api';
import { SearchConfigurationInterface } from '@alfresco/adf-core';

export class SearchPermissionConfigurationService implements SearchConfigurationInterface {

    constructor() {
    }

    public generateQueryBody(searchTerm: string, maxResults: number, skipCount: number): QueryBody {
        const defaultQueryBody: QueryBody = {
            query: {
                query: searchTerm ? `authorityName:${searchTerm}* OR userName:${searchTerm}*` : searchTerm
            },
            include: ['properties', 'aspectNames'],
            paging: {
                maxItems: maxResults,
                skipCount: skipCount
            },
            filterQueries: [
                /*tslint:disable-next-line */
                { query: "TYPE:'cm:authority'" }]
        };

        return defaultQueryBody;
    }
}
