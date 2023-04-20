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
import { TreeNodeType, TreeResponse, TreeService } from '../../tree';
import { CategoryNode } from '../models/category-node.interface';
import { CategoryService } from './category.service';
import { CategoryEntry, CategoryPaging } from '@alfresco/js-api';
import { from, Observable } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CategoryTreeDatasourceService extends TreeService<CategoryNode>  {

    constructor(private categoryService: CategoryService) {
        super();
    }

    public getSubNodes(parentNodeId: string, skipCount?: number, maxItems?: number, name?: string): Observable<TreeResponse<CategoryNode>> {
        return !name ? this.categoryService.getSubcategories(parentNodeId, skipCount, maxItems).pipe(map((response: CategoryPaging) => {
            const parentNode: CategoryNode = this.getParentNode(parentNodeId);
            const nodesList: CategoryNode[] = response.list.entries.map((entry: CategoryEntry) => ({
                    id: entry.entry.id,
                    nodeName: entry.entry.name,
                    parentId: entry.entry.parentId,
                    hasChildren: entry.entry.hasChildren,
                    level: parentNode ? parentNode.level + 1 : 0,
                    isLoading: false,
                    nodeType: TreeNodeType.RegularNode
                }));
            if (response.list.pagination.hasMoreItems && parentNode) {
                const loadMoreNode: CategoryNode = {
                    id: 'loadMore',
                    nodeName: '',
                    parentId: parentNode.id,
                    hasChildren: false,
                    level: parentNode.level + 1,
                    isLoading: false,
                    nodeType: TreeNodeType.LoadMoreNode
                };
                nodesList.push(loadMoreNode);
            }
            const treeResponse: TreeResponse<CategoryNode> = {entries: nodesList, pagination: response.list.pagination};
            return treeResponse;
        })) : this.categoryService.searchCategories(name, skipCount, maxItems).pipe(mergeMap((pagingResult) => {
            const nextAfterGeneralPathPartIndex = 3;
            const pathSeparator = '/';
            return from(pagingResult.list.entries).pipe(mergeMap((category) => {
                const path = category.entry.path.name.split(pathSeparator).slice(nextAfterGeneralPathPartIndex)
                    .join(pathSeparator);

                return this.categoryService.getCategory(category.entry.id).pipe(
                    map((res) => {
                        return {
                            id: category.entry.id,
                            nodeName: path ? `${path}/${category.entry.name}` : category.entry.name,
                            parentId: category.entry.parentId,
                            level: 0,
                            nodeType: TreeNodeType.RegularNode,
                            hasChildren: res.entry.hasChildren,
                            isLoading: false
                        };
                    })
                );
            }),
                toArray(),
                map(res =>  ({entries: res, pagination: pagingResult.list.pagination})));
        }));
    }
}
