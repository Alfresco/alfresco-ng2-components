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

import { SearchFilterList } from './components/search-filter/models/search-filter-list.model';
import { FacetFieldBucket } from './facet-field-bucket.interface';

export interface FacetField {
    field: string;
    label: string;
    mincount?: number;
    limit?: number;
    offset?: number;
    prefix?: string;

    buckets?: SearchFilterList<FacetFieldBucket>;
    pageSize?: number;
    currentPageSize?: number;
    checked?: boolean;
}
