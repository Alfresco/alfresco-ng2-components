/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

const DEFAULT_PAGE_SIZE = 5;

export class SearchFilterList<T> implements Iterable<T> {
    private filteredItems: T[] = [];
    private _filterText: string = '';

    items: T[] = [];
    pageSize: number = DEFAULT_PAGE_SIZE;
    currentPageSize: number = DEFAULT_PAGE_SIZE;

    get filterText(): string {
        return this._filterText;
    }

    set filterText(value: string) {
        this._filterText = value;
        this.applyFilter();
    }

    private _filter: (item: T) => boolean = () => true;

    get filter(): (item: T) => boolean {
        return this._filter;
    }

    set filter(value: (item: T) => boolean) {
        this._filter = value;
        this.applyFilter();
    }

    private applyFilter() {
        if (this.filter) {
            this.filteredItems = this.items.filter(this.filter);
        } else {
            this.filteredItems = this.items;
        }
        this.currentPageSize = this.pageSize;
    }

    /**
     * Returns visible portion of the items.
     *
     * @returns list of items
     */
    get visibleItems(): T[] {
        return this.filteredItems.slice(0, this.currentPageSize);
    }

    /**
     * Get items length
     *
     * @returns entire collection length including items not displayed on the page
     */
    get length(): number {
        return this.items.length;
    }

    /**
     * Detect whether more items can be displayed.
     *
     * @returns `true` if can show more items, otherwise `false`
     */
    get canShowMoreItems(): boolean {
        return this.filteredItems.length > this.currentPageSize;
    }

    /**
     * Detect whether less items can be displayed.
     *
     * @returns `true` if can show less items, otherwise `false`
     */
    get canShowLessItems(): boolean {
        return this.currentPageSize > this.pageSize;
    }

    /**
     * Detect whether content fits single page.
     *
     * @returns `true` if content fits single page, otherwise `false`.
     */
    get fitsPage(): boolean {
        return this.pageSize >= this.filteredItems.length;
    }

    constructor(items: T[] = [], pageSize?: number) {
        this.items = items;
        this.filteredItems = items;
        this.pageSize = pageSize || DEFAULT_PAGE_SIZE;
        this.currentPageSize = pageSize || DEFAULT_PAGE_SIZE;
    }

    /** Display more items. */
    showMoreItems() {
        if (this.canShowMoreItems) {
            this.currentPageSize += this.pageSize;
        }
    }

    /** Display less items. */
    showLessItems() {
        if (this.canShowLessItems) {
            this.currentPageSize -= this.pageSize;
        }
    }

    /** Reset entire collection and page settings. */
    clear() {
        this.currentPageSize = this.pageSize;
        this.items = [];
        this.filteredItems = [];
        this.filterText = '';
    }

    addItem(item: T) {
        if (!item) {
            return;
        }
        this.items.push(item);
        this.applyFilter();
    }

    deleteItem(item: T) {
        const removeIndex = this.items.indexOf(item);
        if (removeIndex > -1) {
            this.items.splice(removeIndex, 1);
            this.filteredItems.splice(removeIndex, 1);
        }
    }

    [Symbol.iterator](): Iterator<T> {
        let pointer = 0;
        const items = this.visibleItems;

        return {
            next: (): IteratorResult<T> => {
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
