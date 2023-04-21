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

import { CoreTestingModule, UserPreferencesService } from '@alfresco/adf-core';
import {
    CategoryBody,
    CategoryEntry,
    CategoryLinkBody,
    CategoryPaging, PathInfo,
    RequestQuery, ResultNode,
    ResultSetPaging,
    ResultSetPagingList, ResultSetRowEntry
} from '@alfresco/js-api';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { CategoryService } from './category.service';

describe('CategoryService', () => {
    let categoryService: CategoryService;
    let userPreferencesService: UserPreferencesService;

    const fakeParentCategoryId = 'testParentId';
    const fakeCategoryId = 'fakeId';
    const fakeNodeId = 'fakeNodeId';
    const fakeCategoriesResponse: CategoryPaging = { list: { pagination: {}, entries: [] }};
    const fakeCategoryEntry: CategoryEntry = { entry: { id: 'testId', name: 'testName' }};
    const fakeCategoryBody: CategoryBody = { name: 'updatedName' };
    const fakeCategoriesLinkBodies: CategoryLinkBody[] = [{ categoryId: fakeCategoryId }];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreTestingModule
            ]
        });

        categoryService = TestBed.inject(CategoryService);
        userPreferencesService = TestBed.inject(UserPreferencesService);
    });

    it('should fetch categories with provided parentId', fakeAsync(() => {
        const getSpy = spyOn(categoryService.categoriesApi, 'getSubcategories').and.returnValue(Promise.resolve(fakeCategoriesResponse));
        categoryService.getSubcategories(fakeParentCategoryId, 0, 100).subscribe(() => {
            expect(getSpy).toHaveBeenCalledOnceWith(fakeParentCategoryId, {skipCount: 0, maxItems: 100});
        });
    }));

    it('should fetch root level categories when parentId not provided', fakeAsync(() => {
        const getSpy = spyOn(categoryService.categoriesApi, 'getSubcategories').and.returnValue(Promise.resolve(fakeCategoriesResponse));
        categoryService.getSubcategories(null, 0, 100).subscribe(() => {
            expect(getSpy).toHaveBeenCalledOnceWith('-root-', {skipCount: 0, maxItems: 100});
        });
    }));

    it('should fetch the category with the provided categoryId', fakeAsync(() => {
        const getSpy = spyOn(categoryService.categoriesApi, 'getCategory').and.returnValue(Promise.resolve(fakeCategoryEntry));
        categoryService.getCategory(fakeParentCategoryId, {include: ['path']}).subscribe(() => {
            expect(getSpy).toHaveBeenCalledOnceWith(fakeParentCategoryId, {include: ['path']});
        });
    }));

    it('should create subcategory', fakeAsync(() => {
        const createSpy = spyOn(categoryService.categoriesApi, 'createSubcategories').and.returnValue(Promise.resolve(fakeCategoryEntry));
        categoryService.createSubcategories(fakeParentCategoryId, [fakeCategoryEntry.entry]).subscribe(() => {
            expect(createSpy).toHaveBeenCalledOnceWith(fakeParentCategoryId, [fakeCategoryEntry.entry], {});
        });
    }));

    it('should update category', fakeAsync(() => {
        const updateSpy = spyOn(categoryService.categoriesApi, 'updateCategory').and.returnValue(Promise.resolve(fakeCategoryEntry));
        categoryService.updateCategory(fakeParentCategoryId, fakeCategoryBody).subscribe(() => {
            expect(updateSpy).toHaveBeenCalledOnceWith(fakeParentCategoryId, fakeCategoryBody, {});
        });
    }));

    it('should delete category', fakeAsync(() => {
        const deleteSpy = spyOn(categoryService.categoriesApi, 'deleteCategory').and.returnValue(Promise.resolve());
        categoryService.deleteCategory(fakeParentCategoryId).subscribe(() => {
            expect(deleteSpy).toHaveBeenCalledOnceWith(fakeParentCategoryId);
        });
    }));

    describe('searchCategories', () => {
        const defaultMaxItems = 25;

        let result: ResultSetPaging;

        beforeEach(() => {
            spyOnProperty(userPreferencesService, 'paginationSize').and.returnValue(defaultMaxItems);
            result = new ResultSetPaging();
            result.list = new ResultSetPagingList();
            const category = new ResultSetRowEntry();
            category.entry = new ResultNode();
            category.entry.name = 'some name';
            category.entry.path = new PathInfo();
            category.entry.path.name = '/categories/General';
            result.list.entries = [category];
            spyOn(categoryService.searchApi, 'search').and.returnValue(Promise.resolve(result));
        });

        it('should call search on searchApi with correct parameters when specified all parameters', () => {
            const name = 'name';
            const skipCount = 10;
            const maxItems = 100;

            categoryService.searchCategories(name, skipCount, maxItems);
            expect(categoryService.searchApi.search).toHaveBeenCalledWith({
                query: {
                    language: RequestQuery.LanguageEnum.Afts,
                    query: `cm:name:"*${name}*" AND TYPE:'cm:category' AND PATH:"/cm:categoryRoot/cm:generalclassifiable//*"`
                },
                paging: {
                    skipCount,
                    maxItems
                },
                include: ['path']
            });
        });

        it('should call search on searchApi with default parameters when skipped optional parameters', () => {
            const name = 'name';

            categoryService.searchCategories(name);
            expect(categoryService.searchApi.search).toHaveBeenCalledWith({
                query: {
                    language: RequestQuery.LanguageEnum.Afts,
                    query: `cm:name:"*${name}*" AND TYPE:'cm:category' AND PATH:"/cm:categoryRoot/cm:generalclassifiable//*"`
                },
                paging: {
                    skipCount: 0,
                    maxItems: defaultMaxItems
                },
                include: ['path']
            });
        });

        it('should return observable which emits paging object for categories', (done) => {
            categoryService.searchCategories('name').subscribe((paging) => {
                expect(paging).toBe(result);
                done();
            });
        });
    });

    it('should fetch categories linked to node with nodeId with path included', fakeAsync(() => {
        const getLinkedCategoriesSpy = spyOn(categoryService.categoriesApi, 'getCategoryLinksForNode').and.returnValue(Promise.resolve(fakeCategoriesResponse));
        categoryService.getCategoryLinksForNode(fakeNodeId).subscribe(() => {
            expect(getLinkedCategoriesSpy).toHaveBeenCalledOnceWith(fakeNodeId, {include: ['path']});
        });
    }));

    it('should unlink categories from node', fakeAsync(() => {
        const unlinkCategoriesSpy = spyOn(categoryService.categoriesApi, 'unlinkNodeFromCategory').and.returnValue(Promise.resolve());
        categoryService.unlinkNodeFromCategory(fakeNodeId, fakeCategoryId).subscribe(() => {
            expect(unlinkCategoriesSpy).toHaveBeenCalledOnceWith(fakeNodeId, fakeCategoryId);
        });
    }));

    it('should link categories to a node with nodeId', fakeAsync(() => {
        const linkCategoriesSpy = spyOn(categoryService.categoriesApi, 'linkNodeToCategory').and.returnValue(Promise.resolve(fakeCategoryEntry));
        categoryService.linkNodeToCategory(fakeNodeId, fakeCategoriesLinkBodies).subscribe(() => {
            expect(linkCategoriesSpy).toHaveBeenCalledOnceWith(fakeNodeId, fakeCategoriesLinkBodies);
        });
    }));
});
