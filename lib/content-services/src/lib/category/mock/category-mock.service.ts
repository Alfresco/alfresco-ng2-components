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

import { Injectable } from '@angular/core';
import {
    CategoryEntry,
    CategoryPaging, Pagination, PathInfo, ResultNode,
    ResultSetPaging,
    ResultSetPagingList,
    ResultSetRowEntry
} from '@alfresco/js-api';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryServiceMock {

    public getSubcategories(parentNodeId: string, skipCount?: number, maxItems?: number): Observable<CategoryPaging> {
        return parentNodeId ? of(this.getChildrenLevelResponse(skipCount, maxItems)) : of(this.getRootLevelResponse(skipCount, maxItems));
    }

    public getCategory(): Observable<CategoryEntry> {
        return of({
            entry: {
                name: 'some name',
                id: 'some id',
                hasChildren: true
            }
        });
    }

    public searchCategories(): Observable<ResultSetPaging> {
        const result = new ResultSetPaging();
        result.list = new ResultSetPagingList();
        const category1 = new ResultSetRowEntry();
        category1.entry = new ResultNode();
        category1.entry.name = 'some name';
        category1.entry.id = 'some id 1';
        category1.entry.parentId = 'parent id 1';
        category1.entry.path = new PathInfo();
        category1.entry.path.name = '/categories/General';
        const category2 = new ResultSetRowEntry();
        category2.entry = new ResultNode();
        category2.entry.name = 'some other name';
        category2.entry.id = 'some id 2';
        category2.entry.parentId = 'parent id 2';
        category2.entry.path = new PathInfo();
        category2.entry.path.name = '/categories/General/Language';
        result.list.entries = [category1, category2];
        result.list.pagination = new Pagination();
        result.list.pagination.count = 2;
        return of(result);
    }

    private getRootLevelResponse(skipCount?: number, maxItems?: number): CategoryPaging {
        const rootCategoryEntry: CategoryEntry = {entry: {id: 'testId', name: 'testNode', parentId: '-root-', hasChildren: true}};
        return {list: {pagination: {skipCount, maxItems, hasMoreItems: false}, entries: [rootCategoryEntry]}};
    }

    private getChildrenLevelResponse(skipCount?: number, maxItems?: number): CategoryPaging {
        const childCategoryEntry: CategoryEntry = {entry: {id: 'childId', name: 'childNode', parentId: 'testId', hasChildren: false}};
        return {list: {pagination: {skipCount, maxItems, hasMoreItems: true}, entries: [childCategoryEntry]}};
    }
}
