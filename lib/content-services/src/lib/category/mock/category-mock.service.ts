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

import { Injectable } from '@angular/core';
import { CategoryEntry, CategoryPaging } from '@alfresco/js-api';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryServiceMock {

    public getSubcategories(parentNodeId: string, skipCount?: number, maxItems?: number): Observable<CategoryPaging> {
        return parentNodeId ? of(this.getChildrenLevelResponse(skipCount, maxItems)) : of(this.getRootLevelResponse(skipCount, maxItems));
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
