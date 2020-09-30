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
import { AlfrescoApiService, AppConfigService } from '@alfresco/adf-core';
import { SearchConfiguration } from './search-configuration.interface';
import { BaseQueryBuilderService } from './base-query-builder.service';
import { SearchCategory } from './search-category.interface';

@Injectable({
    providedIn: 'root'
})
export class SearchPanelQueryBuilderService extends BaseQueryBuilderService {

    customModels: any [] = [];

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

    loadConfiguration(): SearchConfiguration {
        const searchConfig = [];
        this.customModels?.forEach( (propertyModel) => {
            searchConfig.push(this.convertModelPropertyIntoSearchFilter(propertyModel));
        });

        return { categories: searchConfig };
    }

}
