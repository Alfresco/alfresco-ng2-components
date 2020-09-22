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

import { AlfrescoApiService, AppConfigService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { BaseQueryBuilderService } from '../search/base-query-builder.service';
import { QueryBody } from '@alfresco/js-api';
import { SearchCategory } from '../search';

/**
 * Internal service used by ContentNodeSelector component.
 */
@Injectable({
    providedIn: 'root'
})
export class ContentNodeSelectorService extends BaseQueryBuilderService {

    query: QueryBody;

    customModels: any[] = [];

    constructor(appConfig: AppConfigService, alfrescoApiService: AlfrescoApiService) {
        super(appConfig, alfrescoApiService);
    }

    public isFilterServiceActive(): boolean {
        return true;
    }

    convertModelPropertyIntoSearchFilter(modelProperty: any): SearchCategory {
        let filterSearch: SearchCategory;
        if (modelProperty.dataType === 'd:text') {
            filterSearch = {
                id : modelProperty.prefixedName,
                name: modelProperty.prefixedName,
                expanded: false,
                enabled: true,
                component: {
                    selector: 'text',
                    settings: {
                        pattern: `${modelProperty.prefixedName}:'(.*?)'`,
                        field: `${modelProperty.prefixedName}`,
                        placeholder: `Enter the ${modelProperty.name}`
                    }
                }
            };
        }
        return filterSearch;
    }

    loadConfiguration(): any {
        return [];
    }

    convertCustomModelPropertiesToSearchCategories(customModels: any[]): any[] {
        const searchConfig = [];
        customModels?.forEach( (propertyModel) => {
            searchConfig.push(this.convertModelPropertyIntoSearchFilter(propertyModel));
        });

        return searchConfig;
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
     * @param [showFiles]   shows the files in the dialog search result
     */
    public searchByContent(searchTerm: string, rootNodeId: string = null, skipCount: number = 0, maxItems: number = 25, extraNodeIds?: string[], showFiles?: boolean) {
        this.query = this.createQuery(searchTerm, rootNodeId, skipCount, maxItems, extraNodeIds, showFiles);
        this.execute();
    }

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
                query: `${searchTerm}*`
            },
            include: ['path', 'allowableOperations', 'properties'],
            paging: {
                maxItems: maxItems,
                skipCount: skipCount
            },
            filterQueries: [
                { query: `TYPE:'cm:folder'${ showFiles ? " OR TYPE:'cm:content'" : '' }` },
                { query: 'NOT cm:creator:System' },
                ...parentFiltering
            ]
        };

    }

    buildQuery(): QueryBody {
        return this.query;
    }

}
