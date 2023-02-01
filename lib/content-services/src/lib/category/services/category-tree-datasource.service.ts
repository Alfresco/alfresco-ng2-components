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
import { TreeNodeType } from '../../tree/models/tree-node.interface';
import { TreeResponse } from '../../tree/models/tree-response.interface';
import { TreeService } from '../../tree/services/tree.service';
import { CategoryNode } from '../models/category-node.interface';
import { CategoryService } from './category.service';
import { CategoryEntry, CategoryPaging } from '@alfresco/js-api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CategoryTreeDatasourceService extends TreeService<CategoryNode>  {

    constructor(private categoryService: CategoryService) {
        super();
    }

    public getSubNodes(parentNodeId: string, skipCount?: number, maxItems?: number): Observable<TreeResponse<CategoryNode>> {
        return this.categoryService.getSubcategories(parentNodeId, skipCount, maxItems).pipe(map((response: CategoryPaging) => {
            const parentNode: CategoryNode = this.getParentNode(parentNodeId);
            const nodesList: CategoryNode[] = response.list.entries.map((entry: CategoryEntry) => {
                return {
                    id: entry.entry.id,
                    nodeName: entry.entry.name,
                    parentId: entry.entry.parentId,
                    hasChildren: entry.entry.hasChildren,
                    level: parentNode ? parentNode.level + 1 : 0,
                    isLoading: false,
                    nodeType: TreeNodeType.RegularNode
                };
            });
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
        }));
    }
}
