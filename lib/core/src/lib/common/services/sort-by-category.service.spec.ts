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

import { SortableByCategoryItem, SortByCategoryMapperService } from './sort-by-category.service';

interface TestSortableByCategoryItem extends SortableByCategoryItem {
    id: string;
}

describe('SortByCategoryMapperService', () => {
    let mapper: SortByCategoryMapperService<TestSortableByCategoryItem>;

    const DEFAULT_CATEGORIES = [
        '',
        'DefaultCategory1',
        'DefaultCategory2',
        'DefaultCategory3'
    ];

    beforeEach(() => {
        mapper = new SortByCategoryMapperService();
    });

    it('should map items by categories', () => {
        const items: TestSortableByCategoryItem[] = [
            { id: 'id1', name: 'firstCategory_222', category: 'category1' },
            { id: 'id2', name: 'secondCategory_AA', category: 'category2' },
            { id: 'id3', name: 'firstCategory_111', category: 'category1' },
            { id: 'id4', name: 'secondCategory_BB', category: 'category2' },
            { id: 'id5', name: 'Default_a', category: DEFAULT_CATEGORIES[1] },
            { id: 'id6', name: 'Default_b', category: DEFAULT_CATEGORIES[0] }
        ];

        const expectedItemsByCategory = [
            { category: 'category1', items: [items[2], items[0]] },
            { category: 'category2', items: [items[1], items[3]] },
            { category: '', items: [items[4], items[5]] }
        ];

        const result = mapper.mapItems(items, DEFAULT_CATEGORIES);

        expect(result).toEqual(expectedItemsByCategory);
    });

    it('should set all items under default category', () => {
        const defaulValues: TestSortableByCategoryItem[] = [{
            name: 'name-a',
            id: 'id',
            category: DEFAULT_CATEGORIES[1]
        }, {
            name: 'name-b',
            id: 'id2',
            category: DEFAULT_CATEGORIES[2]
        }, {
            name: 'name-c',
            id: 'id3',
            category: DEFAULT_CATEGORIES[0]
        }];

        const result = mapper.mapItems(defaulValues, DEFAULT_CATEGORIES);

        expect(result.length).toBe(1);
        expect(result[0].category).toBe('');
        expect(result[0].items.length).toBe(defaulValues.length);
    });

    it('should work if no items are present', () => {
        const result = mapper.mapItems([], DEFAULT_CATEGORIES);

        expect(result.length).toBe(0);
    });

    it('should work if the default categories are empty', () => {
        const result = mapper.mapItems([{id: 'id', name: 'name', category: ''}], []);

        expect(result.length).toBe(1);
        expect(result[0].category).toBe('');
    });

    it('should set items in ascending order in appropriate category', () => {
        const contents = [
            { id: 'id1', name: 'item-b', category: 'cat1' },
            { id: 'id2', name: 'item2', category: 'cat2' },
            { id: 'id3', name: 'item-a', category: 'cat1' }
        ];

        const result = mapper.mapItems(contents, DEFAULT_CATEGORIES);

        expect(result.length).toBe(2);
        expect(result[0].category).toBe('cat1');
        expect(result[0].items[0]).toEqual({ id: 'id3', name: 'item-a', category: 'cat1' });
        expect(result[0].items[1]).toEqual({ id: 'id1', name: 'item-b', category: 'cat1' });

        expect(result[1].category).toBe('cat2');
        expect(result[1].items[0]).toEqual({ id: 'id2', name: 'item2', category: 'cat2' });
    });
});
