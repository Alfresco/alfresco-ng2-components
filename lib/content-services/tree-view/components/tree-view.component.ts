/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnInit } from '@angular/core';
import { TreeBaseNode } from '../models/tree-view.model';
import { TreeViewDataSource } from '../data/tree-view-datasource';
import { NodesApiService } from '@alfresco/adf-core';
import { map } from 'rxjs/operators';
import { NodeEntry, NodePaging } from 'alfresco-js-api';

@Component({
    selector: 'adf-tree-view-list',
    templateUrl: 'tree-view.component.html',
    styleUrls: ['tree-view.component.scss']
})
/*tslint:disable*/
export class TreeViewComponent implements OnInit {

    @Input()
    nodeId: string;

    constructor(private nodeApi: NodesApiService) {
        this.treeControl = new FlatTreeControl<TreeBaseNode>(this.getLevel, this.isExpandable);
        this.dataSource = new TreeViewDataSource(this.treeControl, this.nodeApi);
    }

    ngOnInit() {
        this.loadChildrenNode();
    }

    loadChildrenNode() {
        this.nodeApi.getNodeChildren(this.nodeId)
            .pipe(map((node: NodePaging) => node.list.entries),
                  map((nodes: NodeEntry[]) => nodes.map(node => new TreeBaseNode(node)))
            )
            .subscribe(
                (treeNode: TreeBaseNode[]) => {
                    this.dataSource.data = treeNode;
                });
    }

    treeControl: FlatTreeControl<TreeBaseNode>;

    dataSource: TreeViewDataSource;

    getLevel = (node: TreeBaseNode) => node.level;

    isExpandable = (node: TreeBaseNode) => node.expandable;

    hasChild = (_: number, _nodeData: TreeBaseNode) => _nodeData.expandable;
}
