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

import {
    Component,
    EventEmitter,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    TemplateRef,
    ViewChildren,
    ViewEncapsulation
} from '@angular/core';
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { TreeNode, TreeNodeType } from '../models/tree-node.interface';
import { TreeService } from '../services/tree.service';
import { PaginationModel, UserPreferencesService } from '@alfresco/adf-core';
import { SelectionChange, SelectionModel } from '@angular/cdk/collections';
import { TreeResponse } from '../models/tree-response.interface';
import { MatCheckbox } from '@angular/material/checkbox';
import { TreeContextMenuResult } from '../models/tree-context-menu-result.interface';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'adf-tree',
    templateUrl: './tree.component.html',
    styleUrls: ['./tree.component.scss'],
    host: { class: 'adf-tree' },
    encapsulation: ViewEncapsulation.None
})
export class TreeComponent<T extends TreeNode> implements OnInit, OnDestroy {

    /** TemplateRef to provide empty template when no nodes are loaded */
    @Input()
    public emptyContentTemplate: TemplateRef<any>;

    /** TemplateRef to provide context menu items for context menu displayed on each row*/
    @Input()
    public nodeActionsMenuTemplate: TemplateRef<any>;

    /** Variable defining if tree header should be sticky. By default set to false */
    @Input()
    @HostBinding('class.adf-tree-sticky-header')
    public stickyHeader: boolean = false;

    /** Variable defining if tree nodes should be selectable. By default set to false */
    @Input()
    public selectableNodes: boolean = false;

    /** Tree display name */
    @Input()
    public displayName: string;

    /** Load more suffix for load more button */
    @Input()
    public loadMoreSuffix: string;

    /** Icon shown when node has children and is collapsed. By default set to chevron_right */
    @Input()
    public expandIcon: string = 'chevron_right';

    /** Icon shown when node is expanded. By default set to expand_more */
    @Input()
    public collapseIcon: string = 'expand_more';

    /** Emitted when pagination has been changed */
    @Output()
    public paginationChanged: EventEmitter<PaginationModel> = new EventEmitter();

    /** Emitted when any context menu option is selected */
    @Output()
    public contextMenuOptionSelected = new EventEmitter<TreeContextMenuResult<T>>();

    @ViewChildren(MatCheckbox)
    public nodeCheckboxes: QueryList<MatCheckbox>;

    private loadingRootSource = new BehaviorSubject<boolean>(false);
    private _contextMenuSource: T;
    private _contextMenuOptions: any[];
    private contextMenuOptionsChanged$ = new Subject<void>();
    public loadingRoot$: Observable<boolean>;
    public treeNodesSelection = new SelectionModel<T>(true, [], true, (node1: T, node2: T) => node1.id === node2.id);

    constructor(public treeService: TreeService<T>,
                private userPreferenceService: UserPreferencesService) {}

    set contextMenuSource(contextMenuSource: T) {
        this._contextMenuSource = contextMenuSource;
    }

    /** Array of context menu options which should be displayed for each row. */
    @Input()
    set contextMenuOptions(contextMenuOptions: any[]) {
        this.contextMenuOptionsChanged$.next();
        if (contextMenuOptions) {
            this._contextMenuOptions = contextMenuOptions.map((option) => {
                if (!option.subject) {
                    option = {
                        ...option,
                        subject: new Subject()
                    };
                }
                return option;
            });
            merge(...this.contextMenuOptions.map((option) => option.subject)).pipe(takeUntil(this.contextMenuOptionsChanged$))
                .subscribe((option) => {
                    this.contextMenuOptionSelected.emit({
                        row: this._contextMenuSource,
                        contextMenuOption: option
                    });
                });
        } else {
            this._contextMenuOptions = contextMenuOptions;
        }
    }

    get contextMenuOptions(): any[] {
        return this._contextMenuOptions;
    }

    ngOnInit(): void {
        this.loadingRoot$ = this.loadingRootSource.asObservable();
        this.refreshTree(0, this.userPreferenceService.paginationSize);
        this.treeNodesSelection.changed.subscribe((selectionChange: SelectionChange<T>) => {
            this.onTreeSelectionChange(selectionChange);
        });
    }

    ngOnDestroy() {
        this.contextMenuOptionsChanged$.next();
        this.contextMenuOptionsChanged$.complete();
    }

    /**
     * Checks if node is LoadMoreNode node
     *
     * @param node node to be checked
     * @returns boolean
     */
    public isLoadMoreNode(_: number, node: T): boolean {
        return node.nodeType === TreeNodeType.LoadMoreNode;
    }

    /**
     * Checks if tree is empty
     *
     * @returns boolean
     */
    public isEmpty(): boolean {
        return this.treeService.isEmpty();
    }

    /**
     * Returns action icon based on expanded/collapsed node state.
     *
     * @param node node to be checked
     * @returns collapse or expand icon
     */
    public expandCollapseIconValue(node: T): string {
        return this.treeService.treeControl.isExpanded(node) ? this.collapseIcon : this.expandIcon;
    }

    /**
     * Refreshes the tree, root nodes are reloaded, tree selection is cleared.
     *
     * @param skipCount Number of root nodes to skip.
     * @param maxItems Maximum number of nodes returned from Observable.
     * @param searchTerm Specifies if categories should be filtered out by name or not. If not specified then returns categories without filtering.
     */
    public refreshTree(skipCount?: number, maxItems?: number, searchTerm?: string): void {
        this.loadingRootSource.next(true);
        this.treeNodesSelection.clear();
        this.treeService.getSubNodes('-root-', skipCount, maxItems, searchTerm).subscribe((response: TreeResponse<T>) => {
            this.treeService.treeNodes = response.entries;
            this.treeNodesSelection.deselect(...response.entries);
            this.paginationChanged.emit(response.pagination);
            this.loadingRootSource.next(false);
        });
    }

    /**
     * Collapses or expanding the node based on its current state
     *
     * @param node node to be collapsed/expanded
     */
    public expandCollapseNode(node: T): void {
        if (node.hasChildren) {
            if (this.treeService.treeControl.isExpanded(node)) {
                this.treeService.collapseNode(node);
            } else {
                node.isLoading = true;
                this.treeService.getSubNodes(node.id, 0, this.userPreferenceService.paginationSize).subscribe((response: TreeResponse<T>) => {
                    this.treeService.expandNode(node, response.entries);
                    node.isLoading = false;
                    if (this.treeNodesSelection.isSelected(node)) {
                        //timeout used to update nodeCheckboxes query list after new nodes are added so they can be selected
                        setTimeout(() => {
                            this.treeNodesSelection.select(...response.entries);
                        });
                    }
                });
            }
        }
    }

    /**
     * Loads more subnode for a given parent node
     *
     * @param node parent node
     */
    public loadMoreSubnodes(node: T): void {
        node.isLoading = true;
        const parentNode: T = this.treeService.getParentNode(node.parentId);
        this.treeService.removeNode(node);
        const loadedChildren: number = this.treeService.getChildren(parentNode).length;
        this.treeService.getSubNodes(parentNode.id, loadedChildren, this.userPreferenceService.paginationSize).subscribe((response: TreeResponse<T>) => {
            this.treeService.appendNodes(parentNode, response.entries);
            node.isLoading = false;
            if (this.treeNodesSelection.isSelected(parentNode)) {
                //timeout used to update nodeCheckboxes query list after new nodes are added so they can be selected
                setTimeout(() => {
                    this.treeNodesSelection.select(...response.entries);
                });
            }
        });
    }

    /**
     * When node is selected it selects all its descendants
     *
     * @param node selected node
     */
    public onNodeSelected(node: T): void {
        this.treeNodesSelection.toggle(node);
        const descendants: T[] = this.treeService.treeControl.getDescendants(node).filter(this.isRegularNode);
        if (descendants.length > 0) {
            this.treeNodesSelection.isSelected(node) ? this.treeNodesSelection.select(...descendants) : this.treeNodesSelection.deselect(...descendants);
        }
        this.checkParentsSelection(node);
    }

    /**
     * Checks if all descendants of a node are selected
     *
     * @param node selected node
     * @returns boolean
     */
    public descendantsAllSelected(node: T): boolean {
        const descendants: T[] = this.treeService.treeControl.getDescendants(node).filter(this.isRegularNode);
        return descendants.length > 0 && descendants.every((descendant: T) => this.treeNodesSelection.isSelected(descendant));
    }

    /**
     * Checks if some descendants of a node are selected
     *
     * @param node selected node
     * @returns boolean
     */
    public descendantsPartiallySelected(node: T): boolean {
        const descendants: T[] = this.treeService.treeControl.getDescendants(node).filter(this.isRegularNode);
        return descendants.length > 0 && !this.descendantsAllSelected(node) && descendants.some((descendant: T) => this.treeNodesSelection.isSelected(descendant));
    }

    private checkParentsSelection(node: T): void {
        let parent: T = this.treeService.getParentNode(node.parentId);
        while(parent) {
            this.checkRootNodeSelection(parent);
            parent = this.treeService.getParentNode(parent.parentId);
        }
    }

    private checkRootNodeSelection(node: T): void {
        const nodeSelected: boolean = this.treeNodesSelection.isSelected(node);
        const descAllSelected = this.descendantsAllSelected(node);
        if (nodeSelected && !descAllSelected) {
            this.treeNodesSelection.deselect(node);
        } else if (!nodeSelected && descAllSelected) {
            this.treeNodesSelection.select(node);
        }
    }

    private onTreeSelectionChange(selectionChange: SelectionChange<T>): void {
        selectionChange.removed.forEach((unselectedNode: T) => {
            if (this.isRegularNode(unselectedNode)) {
                this.nodeCheckboxes.find((checkbox: MatCheckbox) => checkbox.id === unselectedNode.id).checked = false;
            }
        });
        selectionChange.added.forEach((selectedNode: T) => {
            if (this.isRegularNode(selectedNode)) {
                this.nodeCheckboxes.find((checkbox: MatCheckbox) => checkbox.id === selectedNode.id).checked = true;
            }
        });
    }

    private isRegularNode(node: T): boolean {
        return node.nodeType !== TreeNodeType.LoadMoreNode;
    }
}
