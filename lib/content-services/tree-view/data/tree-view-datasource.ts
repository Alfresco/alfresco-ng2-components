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

import { Injectable } from '@angular/core';
import { CollectionViewer, SelectionChange } from '@angular/cdk/collections';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FlatTreeControl } from '@angular/cdk/tree';
import { TreeBaseNode } from '../models/tree-view.model';
import { TreeViewService } from '../services/tree-view.service';

@Injectable()
export class TreeViewDataSource {

    dataChange = new BehaviorSubject<TreeBaseNode[]>([]);

    get data(): TreeBaseNode[] { return this.dataChange.value; }
    set data(value: TreeBaseNode[]) {
        this.treeControl.dataNodes = value;
        this.dataChange.next(value);
    }

    constructor(private treeControl: FlatTreeControl<TreeBaseNode>,
                private treeViewService: TreeViewService) {
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
        this.treeViewService.getTreeNodes(node.nodeId).subscribe((children) => {
            const index = this.data.indexOf(node);
            if (!children || index < 0) {
                node.expandable = false;
                return;
            }
            if (expand) {
                const nodes = children.map(actualNode => {
                    actualNode.level = node.level + 1;
                    return actualNode;
                });
                this.data.splice(index + 1, 0, ...nodes);
            } else {
                let count = 0;
                for (let i = index + 1; i < this.data.length
                    && this.data[i].level > node.level; i++ , count++) { }
                this.data.splice(index + 1, count);
            }

            this.dataChange.next(this.data);
        });
    }

}
