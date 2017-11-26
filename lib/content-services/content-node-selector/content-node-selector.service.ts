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

import { SearchService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { NodePaging } from 'alfresco-js-api';
import { Observable } from 'rxjs/Observable';

/**
 * Internal service used by ContentNodeSelector component.
 */
@Injectable()
export class ContentNodeSelectorService {

    constructor(private searchService: SearchService) {
    }

    /**
     * Performs a search for content node selection
     *
     * @param searchTerm    The term to search for
     * @param skipCount     From where to start the loading
     * @param rootNodeId    The root is to start the search from
     * @param maxItems      How many items to load
     */
    public search(searchTerm: string, rootNodeId: string, skipCount: number = 0, maxItems: number = 25): Observable<NodePaging> {

        let defaultSearchNode: any = {
            query: {
                query: `${searchTerm}* OR name:${searchTerm}*`
            },
            include: ['path', 'allowableOperations'],
            paging: {
                maxItems: `${maxItems}`,
                skipCount: `${skipCount}`
            },
            filterQueries: [
                { query: "TYPE:'cm:folder'" },
                { query: 'NOT cm:creator:System' }]
        };

        if (rootNodeId) {
            defaultSearchNode.scope = rootNodeId;
        }

        return this.searchService.search(defaultSearchNode);
    }
}
