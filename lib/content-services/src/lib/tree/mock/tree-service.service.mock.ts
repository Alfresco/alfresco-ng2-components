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
import { Observable, of } from 'rxjs';
import { TreeNode } from '../models/tree-node.interface';
import { TreeResponse } from '../models/tree-response.interface';
import { TreeService } from '../services/tree.service';
import { treeNodesMockExpanded } from './tree-node.mock';

@Injectable({ providedIn: 'root' })
export class TreeServiceMock extends TreeService<TreeNode>  {
    public getSubNodes(parentNodeId: string, skipCount?: number, maxItems?: number): Observable<TreeResponse<TreeNode>> {
        if (parentNodeId) {
            return of({pagination: {skipCount, maxItems}, entries: Array.from(treeNodesMockExpanded)});
        }
        return of();
    }
}
