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

import { Injectable } from '@angular/core';
import { NodePaging } from 'alfresco-js-api';
import { SearchOptions, SearchService } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Rx';

/**
 * Internal service used by ContentNodeSelector component.
 */
@Injectable()
export class ContentNodeSelectorService {

    constructor(private searchService: SearchService) {}

    /**
     * Performs a search for content node selection
     *
     * @param searchTerm    The term to search for
     * @param skipCount     From where to start the loading
     * @param rootNodeId    The root is to start the search from
     * @param maxItems      How many items to load
     */
    public search(searchTerm: string, rootNodeId: string, skipCount: number, maxItems: number): Observable<NodePaging> {

        searchTerm = searchTerm + '*';

        let searchOpts: SearchOptions = {
            include: ['path', 'allowableOperations'],
            skipCount,
            rootNodeId,
            nodeType: 'cm:folder',
            maxItems,
            orderBy: null
        };

        return this.searchService.getNodeQueryResults(searchTerm, searchOpts);
    }
}
