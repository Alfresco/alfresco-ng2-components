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

import { Injectable } from '@angular/core';
import { SearchCategory } from '../search/models/search-category.interface';

@Injectable({
    providedIn: 'root'
})
export class ContentNodeSelectorPanelService {

    propertyTypes = ['d:text', 'd:date', 'd:datetime'];
    modelPropertyTypeToSearchFilterTypeMap = new Map<string, string> ();
    customModels: any[];

    constructor() {
        this.modelPropertyTypeToSearchFilterTypeMap.set(this.propertyTypes[0], 'text');
        this.modelPropertyTypeToSearchFilterTypeMap.set(this.propertyTypes[1], 'date-range');
        this.modelPropertyTypeToSearchFilterTypeMap.set(this.propertyTypes[2], 'datetime-range');
    }

    convertCustomModelPropertiesToSearchCategories(): SearchCategory[] {
        const searchConfig: SearchCategory[] = [];
        this.customModels?.forEach( (propertyModel) => {
            searchConfig.push(this.convertModelPropertyIntoSearchFilter(propertyModel));
        });

        return searchConfig;
    }

    convertModelPropertyIntoSearchFilter(modelProperty: any): SearchCategory {
        let filterSearch: SearchCategory;
        if (this.isTypeSupported(modelProperty.dataType)) {
            filterSearch = {
                id : modelProperty.prefixedName,
                name: modelProperty.prefixedName,
                expanded: false,
                enabled: true,
                component: {
                    selector: this.modelPropertyTypeToSearchFilterTypeMap.get(modelProperty.dataType),
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

    isTypeSupported(dataType: string): boolean {
        return this.propertyTypes.includes(dataType);
    }

}
