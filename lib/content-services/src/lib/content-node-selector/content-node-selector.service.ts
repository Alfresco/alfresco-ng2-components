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

/**
 * Internal service used by ContentNodeSelector component.
 */
@Injectable({
    providedIn: 'root'
})
export class ContentNodeSelectorService {

    createQuery(searchTerm: string, rootNodeId: string = null, skipCount: number = 0, maxItems: number = 25, extraNodeIds?: string[], showFiles?: boolean): QueryBody {
        let extraParentFiltering = '';

        if (extraNodeIds && extraNodeIds.length) {
            extraNodeIds
                .filter((id) => id !== rootNodeId)
                .forEach((extraId) => {
                    extraParentFiltering += ` OR ANCESTOR:'workspace://SpacesStore/${extraId}'`;
                });
        }

        const parentFiltering = rootNodeId ? [{ query: `ANCESTOR:'workspace://SpacesStore/${rootNodeId}'${extraParentFiltering}` }] : [];

        return {
            query: {
                query: `${searchTerm}`
            },
            include: ['path', 'allowableOperations', 'properties'],
            paging: {
                maxItems: maxItems,
                skipCount: skipCount
            },
            filterQueries: [
                { query: `TYPE:'cm:folder'${showFiles ? " OR TYPE:'cm:content'" : ''}` },
                { query: 'NOT cm:creator:System' },
                ...parentFiltering
            ],
            scope: {
                locations: 'nodes'
            }
        };

    }
}
