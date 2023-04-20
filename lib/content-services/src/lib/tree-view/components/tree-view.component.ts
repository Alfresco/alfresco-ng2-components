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

import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { TreeBaseNode } from '../models/tree-view.model';
import { TreeViewDataSource } from '../data/tree-view-datasource';
import { TreeViewService } from '../services/tree-view.service';
import { NodeEntry } from '@alfresco/js-api';

@Component({
    selector: 'adf-tree-view-list',
    templateUrl: './tree-view.component.html',
    styleUrls: ['./tree-view.component.scss']
})

export class TreeViewComponent implements OnChanges {

    /** Identifier of the node to display. */
    @Input()
    nodeId: string;

    /** Emitted when a node in the tree view is clicked. */
    @Output()
    nodeClicked: EventEmitter<NodeEntry> = new EventEmitter();

    /** Emitted when an invalid node id is given. */
    @Output()
    error: EventEmitter<any> = new EventEmitter();

    treeControl: FlatTreeControl<TreeBaseNode>;
    dataSource: TreeViewDataSource;

    constructor(private treeViewService: TreeViewService) {
        this.treeControl = new FlatTreeControl<TreeBaseNode>(this.getLevel, this.isExpandable);
        this.dataSource = new TreeViewDataSource(this.treeControl, this.treeViewService);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['nodeId'] && changes['nodeId'].currentValue &&
            changes['nodeId'].currentValue !== changes['nodeId'].previousValue) {
            this.loadTreeNode();
        } else {
            this.dataSource.data = [];
        }
    }

    onNodeClicked(node: NodeEntry) {
        this.nodeClicked.emit(node);
    }

    getLevel = (node: TreeBaseNode) => node.level;

    isExpandable = (node: TreeBaseNode) => node.expandable;

    hasChild = (_: number, nodeData: TreeBaseNode) => nodeData.expandable;

    private loadTreeNode() {
        this.treeViewService.getTreeNodes(this.nodeId)
            .subscribe(
                (treeNode: TreeBaseNode[]) => {
                    this.dataSource.data = treeNode;
                },
                (error) => this.error.emit(error)
            );
    }
}
