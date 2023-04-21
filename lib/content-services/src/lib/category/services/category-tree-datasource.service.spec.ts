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

import { CoreTestingModule } from '@alfresco/adf-core';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { CategoryService } from '../services/category.service';
import { CategoryNode, CategoryTreeDatasourceService } from '@alfresco/adf-content-services';
import { CategoryServiceMock } from '../mock/category-mock.service';
import { TreeNodeType, TreeResponse } from '../../tree';
import { EMPTY, of } from 'rxjs';
import { Pagination } from '@alfresco/js-api';

describe('CategoryTreeDatasourceService', () => {
  let categoryTreeDatasourceService: CategoryTreeDatasourceService;
  let categoryService: CategoryService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreTestingModule
            ],
            providers: [
                { provide: CategoryService, useClass: CategoryServiceMock }
            ]
        });

        categoryTreeDatasourceService = TestBed.inject(CategoryTreeDatasourceService);
        categoryService = TestBed.inject(CategoryService);
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

    it('should call searchCategories on CategoryService if value of name parameter is defined', () => {
        spyOn(categoryService, 'searchCategories').and.returnValue(EMPTY);
        const skipCount = 10;
        const maxItems = 100;
        const name = 'name';

        categoryTreeDatasourceService.getSubNodes('id', skipCount, maxItems, name);
        expect(categoryService.searchCategories).toHaveBeenCalledWith(name, skipCount, maxItems);
    });

    it('should call getCategory for every instance if value of name parameter is defined', (done) => {
        spyOn(categoryService, 'getCategory').and.returnValues(of({
                entry: {
                    name: 'name',
                    id: 'some id 1',
                    hasChildren: true
                }
            }),
            of({
                entry: {
                    name: 'Language/some other name',
                    id: 'some id 2',
                    hasChildren: false
                }
            }));
        categoryTreeDatasourceService.getSubNodes('id', undefined, undefined, 'name')
            .subscribe(() => {

                expect(categoryService.getCategory).toHaveBeenCalledWith('some id 1');
                expect(categoryService.getCategory).toHaveBeenCalledWith('some id 2');
                done();
            });
    });

    it('should return observable which emits correct categories', (done) => {
        spyOn(categoryService, 'getCategory').and.returnValues(of({
                entry: {
                    name: 'some name',
                    id: 'some id 1',
                    hasChildren: true
                }
            }),
            of({
                entry: {
                    name: 'Language/some other name',
                    id: 'some id 2',
                    hasChildren: false
                }
            }));
        categoryTreeDatasourceService.getSubNodes('id', undefined, undefined, 'name')
            .subscribe((response) => {
                const pagination = new Pagination();
                pagination.count = 2;
                expect(response).toEqual({
                    pagination,
                    entries: [{
                        id: 'some id 1',
                        nodeName: 'some name',
                        parentId: 'parent id 1',
                        level: 0,
                        nodeType: TreeNodeType.RegularNode,
                        hasChildren: true,
                        isLoading: false
                    }, {
                        id: 'some id 2',
                        nodeName: 'Language/some other name',
                        parentId: 'parent id 2',
                        level: 0,
                        nodeType: TreeNodeType.RegularNode,
                        hasChildren: false,
                        isLoading: false
                    }]
                });
                done();
            });
    });
});
