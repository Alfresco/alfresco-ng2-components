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
import { DataSource } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { BehaviorSubject, Observable } from 'rxjs';
import { TreeNode } from '../models/tree-node.interface';
import { TreeResponse } from '../models/tree-response.interface';

@Injectable({ providedIn: 'root' })
export abstract class TreeService<T extends TreeNode> extends DataSource<T>  {
    public readonly treeControl: FlatTreeControl<T>;
    public treeNodesSource = new BehaviorSubject<T[]>([]);

    get treeNodes(): T[] {
        return this.treeControl.dataNodes;
    }

    set treeNodes(nodes: T[]) {
        this.treeControl.dataNodes = nodes;
        this.treeNodesSource.next(nodes);
    }

    constructor() {
        super();
        this.treeControl = new FlatTreeControl<T>(node => node.level, node => node.hasChildren);
        this.treeNodes = [];
    }

    public abstract getSubNodes(parentNodeId: string, skipCount?: number, maxItems?: number, searchTerm?: string): Observable<TreeResponse<T>>;

    /**
     * Expands node applying subnodes to it.
     *
     * @param nodeToExpand Node to be expanded
     * @param subNodes List of nodes that will be added as children of expanded node
     */
    public expandNode(nodeToExpand: T, subNodes: T[]): void {
        if (nodeToExpand != null && subNodes != null && nodeToExpand.hasChildren) {
            const index: number = this.treeNodes.indexOf(nodeToExpand);
            this.treeNodes.splice(index + 1, 0, ...subNodes);
            nodeToExpand.isLoading = false;
            this.treeNodesSource.next(this.treeNodes);
        }
    }

    /**
     * Collapses a node removing all children from it.
     *
     * @param nodeToCollapse Node to be collapsed
     */
    public collapseNode(nodeToCollapse: T): void {
        if (nodeToCollapse != null && nodeToCollapse.hasChildren) {
            const children: T[] = this.treeNodes.filter((node: T) => nodeToCollapse.id === node.parentId);
            children.forEach((child: T) => {
                this.collapseInnerNode(child);
            });
            this.treeNodesSource.next(this.treeNodes);
        }
    }

    /**
     * Append more child nodes to already expanded parent node
     *
     * @param nodeToAppend Expanded parent node
     * @param subNodes List of nodes that will be added as children of expanded node
     */
    public appendNodes(nodeToAppend: T, subNodes: T[]): void {
        if (nodeToAppend != null && subNodes != null) {
            const lastChild: T = this.treeNodes.filter((treeNode: T) => nodeToAppend.id === treeNode.parentId).pop();
            const index: number = this.treeNodes.indexOf(lastChild);
            const children: number = this.treeControl.getDescendants(lastChild).length;
            this.treeNodes.splice(index + children + 1, 0, ...subNodes);
            nodeToAppend.isLoading = false;
            this.treeNodesSource.next(this.treeNodes);
        }
    }

    /**
     * Removes provided node from the tree
     *
     * @param node Node to be removed
     */
    public removeNode(node: T): void {
        this.treeNodes.splice(this.treeNodes.indexOf(node), 1);
    }

    /**
     * Gets children of the node
     *
     * @param parentNode Parent node
     *
     * @returns children of parent node
     */
    public getChildren(parentNode: T): T[] {
        return this.treeNodes.filter((treeNode: T) => treeNode.parentId === parentNode.id);
    }

    /**
     * Checks if tree is empty
     *
     * @returns boolean
     */
    public isEmpty(): boolean {
        return !this.treeNodes.length;
    }

    /**
     * Gets parent node of given node. If node with parentNodeId is not found it returns undefined.
     *
     * @param parentNodeId Id of a parent node to be found
     * @returns parent node or undefined when not found
     */
    public getParentNode(parentNodeId: string): T | undefined {
        return this.treeNodes.find((treeNode: T) => treeNode.id === parentNodeId);
    }

    public connect(): Observable<T[]> {
        return this.treeNodesSource.asObservable();
    }

    public disconnect(): void {}

    private collapseInnerNode(nodeToCollapse: T): void {
        const index: number = this.treeNodes.indexOf(nodeToCollapse);
        this.treeNodes.splice(index, 1);
        if (nodeToCollapse.hasChildren) {
            this.treeNodes
                .filter((node: T) => nodeToCollapse.id === node.parentId)
                .forEach((child: T) => this.collapseInnerNode(child));
        }
    }
}
