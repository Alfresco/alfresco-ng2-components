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

import { FacetQuery } from './facet-query.interface';
import { SearchFilterList } from './search-filter-list.model';

export class ResponseFacetQueryList extends SearchFilterList<FacetQuery> {
    constructor(items: FacetQuery[] = [], translationService, pageSize: number = 5) {
        super(
            items.filter((item) => item.count > 0),
            pageSize
        );

        this.filter = (query: FacetQuery) => {
            if (this.filterText && query.label) {
                const pattern = (this.filterText || '').toLowerCase();
                const label = translationService.instant(query.label).toLowerCase();
                return label.startsWith(pattern);
            }
            return true;
        };
    }
}
