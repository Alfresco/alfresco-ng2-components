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

/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */

import { Injectable } from '@angular/core';
import { CollectionViewer, SelectionChange } from '@angular/cdk/collections';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FlatTreeControl } from '@angular/cdk/tree';
import { TreeBaseNode } from '../models/tree-view.model';
import { NodesApiService } from '@alfresco/adf-core';
import { NodePaging, NodeEntry } from 'alfresco-js-api';

@Injectable()
export class TreeViewDataSource {

    dataChange = new BehaviorSubject<TreeBaseNode[]>([]);

    get data(): TreeBaseNode[] { return this.dataChange.value; }
    set data(value: TreeBaseNode[]) {
        this.treeControl.dataNodes = value;
        this.dataChange.next(value);
    }

    constructor(private treeControl: FlatTreeControl<TreeBaseNode>,
        private nodeApi: NodesApiService) {
    }

    connect(collectionViewer: CollectionViewer): Observable<TreeBaseNode[]> {
        this.treeControl.expansionModel.onChange!.subscribe(change => {
            if ((change as SelectionChange<TreeBaseNode>).added ||
                (change as SelectionChange<TreeBaseNode>).removed) {
                this.handleTreeControl(change as SelectionChange<TreeBaseNode>);
            }
        });

        return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
    }

    handleTreeControl(change: SelectionChange<TreeBaseNode>) {
        if (change.added) {
            change.added.forEach(node => this.toggleNode(node, true));
        }
        if (change.removed) {
            change.removed.slice().reverse().forEach(node => this.toggleNode(node, false));
        }
    }

    toggleNode(node: TreeBaseNode, expand: boolean) {
        this.loadChildrenNode(node.nodeId).subscribe((children) => {

            const index = this.data.indexOf(node);
            if (!children || index < 0) { // If no children, or cannot find the node, no op
                return;
            }
            node.isLoading = true;
            if (expand) {
                const nodes = children.map(actualNode =>
                    new TreeBaseNode(actualNode, node.level + 1));
                this.data.splice(index + 1, 0, ...nodes);
            } else {
                let count = 0;
                for (let i = index + 1; i < this.data.length
                    && this.data[i].level > node.level; i++ , count++) { }
                this.data.splice(index + 1, count);
            }

            // notify the change
            this.dataChange.next(this.data);
            node.isLoading = false;
        });

    }

    loadChildrenNode(nodeId: string): Observable<NodeEntry[]> {
        return this.nodeApi.getNodeChildren(nodeId)
            .pipe(map((node: NodePaging) => node.list.entries)
            );
    }
}
