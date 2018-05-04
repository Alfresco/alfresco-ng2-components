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

export class SearchFilterList<T> implements Iterable<T> {
    items: T[] = [];
    pageSize: number = 5;
    currentPageSize: number = 5;

    get visibleItems(): T[] {
        return this.items.slice(0, this.currentPageSize);
    }

    get length(): number {
        return this.items.length;
    }

    get canShowMoreItems(): boolean {
        return this.items.length > this.currentPageSize;
    }

    get canShowLessItems(): boolean {
        return this.currentPageSize > this.pageSize;
    }

    constructor(items: T[] = [], pageSize: number = 5) {
        this.items = items;
        this.pageSize = pageSize;
        this.currentPageSize = pageSize;
    }

    showMoreItems() {
        if (this.canShowMoreItems) {
            this.currentPageSize += this.pageSize;
        }
    }

    showLessItems() {
        if (this.canShowLessItems) {
            this.currentPageSize -= this.pageSize;
        }
    }

    clear() {
        this.currentPageSize = this.pageSize;
        this.items = [];
    }

    [Symbol.iterator](): Iterator<T> {
        let pointer = 0;
        let items = this.visibleItems;

        return {
            next(): IteratorResult<T> {
                if (pointer < items.length) {
                    return {
                        done: false,
                        value: items[pointer++]
                    };
                } else {
                    return {
                        done: true,
                        value: null
                    };
                }
            }
        };
    }
}
