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
import { CategoryBody, CategoryEntry, CategoryPaging } from '@alfresco/js-api';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { CategoryService } from 'lib/content-services/src/public-api';

describe('CategoryService', () => {
  let categoryService: CategoryService;
  const fakeParentCategoryId = 'testParentId';
  const fakeCategoriesResponse: CategoryPaging = {list: {pagination: {}, entries: []}};
  const fakeCategoryEntry: CategoryEntry = {entry: {id: 'testId', name: 'testName'}};
  const fakeCategoryBody: CategoryBody = {name: 'updatedName'};

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreTestingModule]
        });

        categoryService = TestBed.inject(CategoryService);
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

    it('should create subcategory', fakeAsync(() => {
        const createSpy = spyOn(categoryService.categoriesApi, 'createSubcategory').and.returnValue(Promise.resolve(fakeCategoryEntry));
        categoryService.createSubcategory(fakeParentCategoryId, fakeCategoryEntry.entry).subscribe(() => {
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
});
