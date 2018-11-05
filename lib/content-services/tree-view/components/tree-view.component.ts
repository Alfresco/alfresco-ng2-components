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
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TreeBaseNode } from '../models/tree-view.model';
import { TreeViewDataSource } from '../data/tree-view-datasource';
import { TreeViewService } from '../services/tree-view.service';

@Component({
    selector: 'adf-tree-view-list',
    templateUrl: 'tree-view.component.html',
    styleUrls: ['tree-view.component.scss']
})
/*tslint:disable*/
export class TreeViewComponent implements OnInit, OnChanges {

    @Input()
    nodeId: string;

    treeControl: FlatTreeControl<TreeBaseNode>;
    dataSource: TreeViewDataSource;

    constructor(private treeViewService: TreeViewService) {
        this.treeControl = new FlatTreeControl<TreeBaseNode>(this.getLevel, this.isExpandable);
        this.dataSource = new TreeViewDataSource(this.treeControl, this.treeViewService);
    }

    ngOnInit() {
        if (this.nodeId) {
            this.loadTreeNode();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['nodeId'].currentValue &&
            changes['nodeId'].currentValue != changes['nodeId'].previousValue) {
            this.loadTreeNode();
        }
    }

    getLevel = (node: TreeBaseNode) => node.level;

    isExpandable = (node: TreeBaseNode) => node.expandable;

    hasChild = (level: number, nodeData: TreeBaseNode) => nodeData.expandable;

    private loadTreeNode() {
        this.treeViewService.getTreeNodes(this.nodeId)
            .subscribe(
                (treeNode: TreeBaseNode[]) => {
                    this.dataSource.data = treeNode;
                });
    }
}
