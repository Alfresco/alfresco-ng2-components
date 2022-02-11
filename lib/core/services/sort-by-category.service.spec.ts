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

import { setupTestBed } from '../testing/setup-test-bed';
import { CoreTestingModule } from '../testing/core.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { SortbleByCategoryItem, SortByCategoryMapperService } from './sort-by-category.service';

interface TestSortbleByCategoryItem extends SortbleByCategoryItem {
    id: string;
}

describe('SortByCategoryService', () => {

    let mapper: SortByCategoryMapperService<TestSortbleByCategoryItem>;

    const DEFAULT_CATEGORIES = [
        '',
        'http://bpmn.io/schema/bpmn',
        'http://www.activiti.org/processdef',
        'http://www.activiti.org/test'
      ];

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(() => {
        mapper = new SortByCategoryMapperService();
    });

    it('should map items By categories ', () => {

    const items: TestSortbleByCategoryItem[] = [{ 'id': 'id1',  'name': 'firstCategory_222', 'category': 'category1' },
                                                { 'id': 'id2',  'name': 'secondCategory_AA', 'category': 'category2' },
                                                { 'id': 'id3',  'name': 'firstCategory_111', 'category': 'category1' },
                                                { 'id': 'id4',  'name': 'secondCategory_BB', 'category': 'category2' },
                                                { 'id': 'id5',  'name': 'Default_a', 'category': 'http://bpmn.io/schema/bpmn' },
                                                { 'id': 'id6',  'name': 'Default_b', 'category': '' }];
 
        const expectedContentsByCategory = [{ category: 'category1', items: [items[2], items[0]] },
                                            { category: 'category2', items: [items[1], items[3]] },
                                            { category: '', items: [items[4], items[5]] }];

        const result = mapper.mapItems(items, DEFAULT_CATEGORIES);

        expect(result).toEqual(expectedContentsByCategory);
    });

    it('should display items without category if all of the items have default category', () => {

        const defaulValues: TestSortbleByCategoryItem[] = [{
            'name': 'name-b',
            'id': 'id',
            'category': 'http://bpmn.io/schema/bpmn'
    
        }, {
            'name': 'name-b',
            'id': 'id2',
            'category': 'http://www.activiti.org/test'
        }, { 
            'name': 'name-c',
            'id': 'id3',
            'category': ''
        }]

        const result = mapper.mapItems(defaulValues, DEFAULT_CATEGORIES);

        expect(result.length).toBe(1);
        expect(result[0].category).toBe('');
    });

    it('should display items in ascending order under no category label if there is at least one other category provided', () => {

        const defaulValues: TestSortbleByCategoryItem[] = [{
            'name': 'name-b',
            'id': 'id',
            'category': 'http://bpmn.io/schema/bpmn'
    
        }, {
            'name': 'name-b',
            'id': 'id2',
            'category': 'category1'
        }, { 
            'name': 'name-c',
            'id': 'id3',
            'category': ''
        }, , { 
            'name': 'name-c',
            'id': 'id4',
            'category': 'category2'
        }]

        const result = mapper.mapItems(defaulValues, DEFAULT_CATEGORIES);

        expect(result.length).toBe(3);
        expect(result[0].category).toBe('category1');
        expect(result[1].category).toBe('category2');
        expect(result[2].category).toBe('');
    });

    it('should display items in ascending order under specific category', () => {
       const contents = [{ 'id': 'id1', 'name': 'item-b', 'category': 'cat1' },
                         { 'id': 'id2', 'name': 'item2', 'category': 'cat2' },
                         { 'id': 'id3', 'name': 'item-a', 'category': 'cat1' }];

        const result = mapper.mapItems(contents, DEFAULT_CATEGORIES);        
        expect(result.length).toBe(2);
        expect(result[0].category).toBe('cat1');
        expect(result[0].items[0]).toEqual({ 'id': 'id3', 'name': 'item-a', 'category': 'cat1' });
        expect(result[0].items[1]).toEqual({ 'id': 'id1', 'name': 'item-b', 'category': 'cat1' });

        expect(result[1].category).toBe('cat2');
        expect(result[1].items[0]).toEqual({ 'id': 'id2', 'name': 'item2', 'category': 'cat2' });
        });
});
