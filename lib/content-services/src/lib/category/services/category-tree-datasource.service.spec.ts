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

import { CoreTestingModule } from '@alfresco/adf-core';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { CategoryService } from '../public-api';
import { CategoryTreeDatasourceService } from './category-tree-datasource.service';
import { CategoryServiceMock } from '../mock/category-mock.service';
import { TreeNodeType, TreeResponse } from '../../tree';
import { CategoryNode } from '../models/category-node.interface';

describe('CategoryTreeDatasourceService', () => {
  let categoryTreeDatasourceService: CategoryTreeDatasourceService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreTestingModule],
            providers: [{provide: CategoryService, useClass: CategoryServiceMock}]
        });

        categoryTreeDatasourceService = TestBed.inject(CategoryTreeDatasourceService);
    });

    it('should get root level categories', fakeAsync(() => {
        spyOn(categoryTreeDatasourceService, 'getParentNode').and.returnValue(undefined);
        categoryTreeDatasourceService.getSubNodes(null, 0 , 100).subscribe((treeResponse: TreeResponse<CategoryNode>) => {
            expect(treeResponse.entries.length).toBe(1);
            expect(treeResponse.entries[0].level).toBe(0);
            expect(treeResponse.entries[0].nodeType).toBe(TreeNodeType.RegularNode);
        });
    }));

    it('should get child level categories and add loadMore node when there are more children to load', fakeAsync(() => {
        const parentNode: CategoryNode = {
            id: 'testId',
            nodeName: 'testNode',
            parentId: '-root-',
            hasChildren: true,
            level: 0,
            isLoading: false,
            nodeType: TreeNodeType.RegularNode
        };
        spyOn(categoryTreeDatasourceService, 'getParentNode').and.returnValue(parentNode);
        categoryTreeDatasourceService.getSubNodes(parentNode.id, 0 , 100).subscribe((treeResponse: TreeResponse<CategoryNode>) => {
            expect(treeResponse.entries.length).toBe(2);
            expect(treeResponse.entries[0].parentId).toBe(parentNode.id);
            expect(treeResponse.entries[0].level).toBe(1);
            expect(treeResponse.entries[0].nodeType).toBe(TreeNodeType.RegularNode);
            expect(treeResponse.entries[1].id).toBe('loadMore');
            expect(treeResponse.entries[1].parentId).toBe(parentNode.id);
            expect(treeResponse.entries[1].nodeType).toBe(TreeNodeType.LoadMoreNode);
        });
    }));
});
