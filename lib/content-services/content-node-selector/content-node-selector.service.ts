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
import { Observable } from 'rxjs';

/**
 * Internal service used by ContentNodeSelector component.
 */
@Injectable({
    providedIn: 'root'
})
export class ContentNodeSelectorService {

    constructor(private searchService: SearchService) {
    }

    /**
     * Performs a search for content node selection
     *
     * @param searchTerm    The term to search for
     * @param rootNodeId    The root is to start the search from
     * @param skipCount     From where to start the loading
     * @param maxItems      How many items to load
     * @param [extraNodeIds]  List of extra node ids to search from. This last parameter is necessary when
     * the rootNodeId is one of the supported aliases (e.g. '-my-', '-root-', '-mysites-', etc.)
     * and search is not supported for that alias, but can be performed on its corresponding nodes.
     */
    public search(searchTerm: string, rootNodeId: string = null, skipCount: number = 0, maxItems: number = 25, extraNodeIds?: string[]): Observable<NodePaging> {

        let extraParentFiltering = '';

        if (extraNodeIds && extraNodeIds.length) {
            extraNodeIds
                .filter(id => id !== rootNodeId)
                .forEach(extraId => {
                    extraParentFiltering += ` OR ANCESTOR:'workspace://SpacesStore/${extraId}'`;
                });
        }

        const parentFiltering = rootNodeId ? [{ query: `ANCESTOR:'workspace://SpacesStore/${rootNodeId}'${extraParentFiltering}` }] : [];

        let defaultSearchNode: any = {
            query: {
                query: `${searchTerm}* OR name:${searchTerm}*`
            },
            include: ['path', 'allowableOperations'],
            paging: {
                maxItems: maxItems,
                skipCount: skipCount
            },
            filterQueries: [
                { query: "TYPE:'cm:folder'" },
                { query: 'NOT cm:creator:System' },
                ...parentFiltering
            ],
            scope: {
                locations: ['nodes']
            }
        };

        return this.searchService.searchByQueryBody(defaultSearchNode);
    }
}
