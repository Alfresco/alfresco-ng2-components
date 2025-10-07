/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { NodesApiService } from '../../common/services/nodes-api.service';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TreeBaseNode } from '../models/tree-view.model';
import { NodePaging, NodeEntry } from '@alfresco/js-api';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TreeViewService {
    private nodeApi = inject(NodesApiService);

    getTreeNodes(nodeId: string): Observable<TreeBaseNode[]> {
        return this.nodeApi.getNodeChildren(nodeId).pipe(
            map((nodePage: NodePaging) => nodePage.list.entries.filter((node) => (node.entry.isFolder ? node : null))),
            map((nodes: NodeEntry[]) => nodes.map((node) => new TreeBaseNode(node)))
        );
    }
}
