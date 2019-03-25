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
import { QueryBody } from '@alfresco/js-api';
import { SearchConfigurationInterface } from '../interface/search-configuration.interface';

@Injectable({
    providedIn: 'root'
})
export class SearchConfigurationService implements SearchConfigurationInterface {

    constructor() {
    }

    /**
     * Generates a QueryBody object with custom search parameters.
     * @param searchTerm Term text to search for
     * @param maxResults Maximum number of search results to show in a page
     * @param skipCount The offset of the start of the page within the results list
     * @returns Query body defined by the parameters
     */
    public generateQueryBody(searchTerm: string, maxResults: number, skipCount: number): QueryBody {
        const defaultQueryBody: QueryBody = {
            query: {
                query: searchTerm ? `'${searchTerm}*' OR name:'${searchTerm}*'` : searchTerm
            },
            include: ['path', 'allowableOperations'],
            paging: {
                maxItems: maxResults,
                skipCount: skipCount
            },
            filterQueries: [
                { query: "TYPE:'cm:folder' OR TYPE:'cm:content'" },
                { query: 'NOT cm:creator:System' }]
        };

        return defaultQueryBody;
    }
}
