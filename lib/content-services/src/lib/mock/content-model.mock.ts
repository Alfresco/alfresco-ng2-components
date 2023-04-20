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

import { SearchCategory } from '../search/models/search-category.interface';

export const mockContentModelTextProperty = {
    name: 'name',
    prefixedName: 'account:name',
    title: 'name',
    description: '',
    dataType: 'd:text',
    multiValued: false,
    mandatory: false,
    defaultValue: '',
    mandatoryEnforced: false,
    indexed: false,
    indexTokenisationMode: '',
    constraints: []
};

export const mockContentModelDateProperty = {
    name: 'creation',
    prefixedName: 'account:creation',
    title: 'creation',
    description: '',
    dataType: 'd:date',
    multiValued: false,
    mandatory: false,
    defaultValue: '',
    mandatoryEnforced: false,
    indexed: false,
    indexTokenisationMode: '',
    constraints: []
};

export const mockConvertedSearchCategoriesFromModels: SearchCategory[] = [
    {
        id: 'account:name',
        name: 'account:name',
        expanded: false,
        enabled: true,
        component: {
            selector: 'text',
            settings: {
                pattern: `account:name:'(.*?)'`,
                field: `account:name`,
                placeholder: `Enter the name`
            }
        }
    },
    {
        id: 'account:creation',
        name: 'account:creation',
        expanded: false,
        enabled: true,
        component: {
            selector: 'date-range',
            settings: {
                pattern: `account:creation:'(.*?)'`,
                field: `account:creation`,
                placeholder: `Enter the creation`
            }
        }
    }
];
