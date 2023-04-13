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

import { SearchFilterList } from './search-filter-list.model';

export class Payload {
    name: string;

    constructor(public id: number) {
        this.name = `Payload_${id}`;
    }
}

describe('SearchFilterList', () => {

    const generateItems = (count: number): Payload[] => Array(count).fill(null).map((_, id) => new Payload(id));

    it('should init with external items', () => {
        const items = [
            new Payload(1),
            new Payload(2)
        ];
        const list = new SearchFilterList<Payload>(items);

        expect(list.length).toBe(2);
        expect(list.items[0]).toBe(items[0]);
        expect(list.items[1]).toBe(items[1]);
    });

    it('should init with default values', () => {
        const list = new SearchFilterList();

        expect(list.items).toEqual([]);
        expect(list.pageSize).toEqual(5);
        expect(list.currentPageSize).toEqual(5);
    });

    it('should init with custom page size', () => {
        const list = new SearchFilterList([], 10);

        expect(list.pageSize).toEqual(10);
        expect(list.currentPageSize).toEqual(10);
    });

    it('should allow showing more items', () => {
        const items = generateItems(6);
        const list = new SearchFilterList(items, 4);

        expect(list.canShowMoreItems).toBeTruthy();
    });

    it('should now allow showing more items', () => {
        const items = generateItems(6);
        const list = new SearchFilterList(items, 6);

        expect(list.canShowMoreItems).toBeFalsy();
    });

    it('should show second page', () => {
        const items = generateItems(6);
        const list = new SearchFilterList(items, 4);

        expect(list.canShowMoreItems).toBeTruthy();
        expect(list.visibleItems.length).toBe(4);

        list.showMoreItems();
        expect(list.currentPageSize).toBe(8);
        expect(list.canShowMoreItems).toBeFalsy();
        expect(list.visibleItems.length).toBe(6);
    });

    it('should detect if content fits single page', () => {
        const items = generateItems(5);
        const list = new SearchFilterList(items, 5);

        expect(list.fitsPage).toBeTruthy();
    });

    it('should detect if content exceeds single page', () => {
        const items = generateItems(5);
        const list = new SearchFilterList(items, 4);

        expect(list.fitsPage).toBeFalsy();
    });

    it('should allow showing less items', () => {
        const items = generateItems(5);
        const list = new SearchFilterList(items, 4);
        list.showMoreItems();

        expect(list.canShowMoreItems).toBeFalsy();
        expect(list.canShowLessItems).toBeTruthy();
    });

    it('should not allow showing less items for single page', () => {
        const items = generateItems(5);
        const list = new SearchFilterList(items, 5);

        expect(list.canShowLessItems).toBeFalsy();
    });

    it('should clear the collection', () => {
        const items = generateItems(5);
        const list = new SearchFilterList(items, 5);
        list.clear();

        expect(list.items.length).toBe(0);
        expect(list.visibleItems.length).toBe(0);
    });

    it('should reset page settings on clear', () => {
        const items = generateItems(5);
        const list = new SearchFilterList(items, 4);
        list.showMoreItems();

        expect(list.pageSize).toBe(4);
        expect(list.currentPageSize).toBe(8);

        list.clear();
        expect(list.pageSize).toEqual(4);
        expect(list.currentPageSize).toEqual(4);
        expect(list.items.length).toBe(0);
    });

    it('should return visible portion of the page 1', () => {
        const items = generateItems(5);
        const list = new SearchFilterList(items, 4);

        expect(list.length).toBe(5);
        expect(list.visibleItems.length).toBe(4);

        expect(list.visibleItems[0].id).toBe(0);
        expect(list.visibleItems[1].id).toBe(1);
        expect(list.visibleItems[2].id).toBe(2);
        expect(list.visibleItems[3].id).toBe(3);

        expect(list.items[4].id).toBe(4);
    });

    it('should use custom filter', () => {
        const items = generateItems(5);
        items[0].name = 'custom';

        const list = new SearchFilterList(items, 5);
        expect(list.visibleItems.length).toBe(5);

        list.filter = (item: Payload): boolean => item.name === 'custom';
        expect(list.visibleItems.length).toBe(1);
    });

    it('should update filtered items on filter text change', () => {
        const items = generateItems(5);
        items[0].name = 'custom';

        const list = new SearchFilterList(items, 5);
        expect(list.visibleItems.length).toBe(5);

        list.filter = (item: Payload): boolean => {
            if (list.filterText) {
                return item.name.startsWith(list.filterText);
            }
            return true;
        };
        expect(list.visibleItems.length).toBe(5);

        list.filterText = 'cus';
        expect(list.visibleItems.length).toBe(1);
        expect(list.visibleItems[0].name).toEqual('custom');

        list.filterText = 'P';
        expect(list.visibleItems.length).toBe(4);
    });

    it('should reset filter text on clear', () => {
        const list = new SearchFilterList([], 5);
        list.filterText = 'test';
        list.clear();

        expect(list.filterText).toBe('');
    });
});
