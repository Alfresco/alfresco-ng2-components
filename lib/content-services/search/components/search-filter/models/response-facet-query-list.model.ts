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

import { ResponseFacetQuery } from '../../../facet-query.interface';

export class ResponseFacetQueryList {

    items: ResponseFacetQuery[] = [];
    pageSize: number = 5;
    currentPageSize: number = 5;

    get visibleItems(): ResponseFacetQuery[] {
        return this.items.slice(0, this.currentPageSize);
    }

    get length(): number {
        return this.items.length;
    }

    constructor(items: ResponseFacetQuery[] = [], pageSize: number = 5) {
        this.items = items
            .filter(item => {
                return item.count > 0;
            })
            .map(item => {
                return <ResponseFacetQuery> { ...item };
            });
        this.pageSize = pageSize;
        this.currentPageSize = pageSize;
    }

    hasMoreItems(): boolean {
        return this.items.length > this.currentPageSize;
    }

    showMoreItems() {
        this.currentPageSize += this.pageSize;
    }

    clear() {
        this.currentPageSize = this.pageSize;
        this.items = [];
    }
}
