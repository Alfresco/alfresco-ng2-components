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

import { TreeComponent } from './tree.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreTestingModule, PaginationModel, UserPreferencesService } from '@alfresco/adf-core';
import { MatTreeModule } from '@angular/material/tree';
import { TreeNode, TreeNodeType } from '../models/tree-node.interface';
import { singleNode, treeNodesChildrenMockExpanded, treeNodesMock, treeNodesMockExpanded } from '../mock/tree-node.mock';
import { of } from 'rxjs';
import { TreeService } from '../services/tree.service';
import { TreeServiceMock } from '../mock/tree-service.service.mock';
import { By } from '@angular/platform-browser';
import { SelectionChange } from '@angular/cdk/collections';

describe('TreeComponent', () => {
    let fixture: ComponentFixture<TreeComponent<TreeNode>>;
    let component: TreeComponent<TreeNode>;
    let userPreferenceService: UserPreferencesService;

    const getDisplayNameValue = (nodeId: string) =>
        fixture.nativeElement.querySelector(`.mat-tree-node[data-automation-id="node_${nodeId}"] .adf-tree-cell-value`).innerText.trim();

    const getNodePadding = (nodeId: string) => {
        const element = fixture.nativeElement.querySelector(`.mat-tree-node[data-automation-id="node_${nodeId}"]`);
        return parseInt(window.getComputedStyle(element).paddingLeft, 10);
    };

    const getNodeSpinner = (nodeId: string) => fixture.nativeElement.querySelector(`.mat-tree-node[data-automation-id="node_${nodeId}"] .mat-progress-spinner`);

    const getExpandCollapseBtn = (nodeId: string) => fixture.nativeElement.querySelector(`.mat-tree-node[data-automation-id="node_${nodeId}"] .adf-icon`);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreTestingModule,
                MatTreeModule
            ],
            declarations: [
                TreeComponent
            ],
            providers: [
                { provide: TreeService, useClass: TreeServiceMock }
            ]
        });

        fixture = TestBed.createComponent(TreeComponent);
        component = fixture.componentInstance;
        userPreferenceService = TestBed.inject(UserPreferencesService);
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should refresh the tree on component initialization', () => {
        const refreshSpy = spyOn(component, 'refreshTree');
        fixture.detectChanges();
        expect(refreshSpy).toHaveBeenCalled();
    });

    it('should show a header title showing displayName property value', () => {
        spyOn(component, 'isEmpty').and.returnValue(false);
        component.displayName = 'test';
        fixture.detectChanges();
        const treeHeaderDisplayName = fixture.nativeElement.querySelector(`[data-automation-id="tree-header-display-name"]`);
        expect(treeHeaderDisplayName.innerText.trim()).toBe('test');
    });

    it('should show a list of nodes', () => {
        component.refreshTree();
        fixture.detectChanges();
        const displayNameCellValueNode1 = getDisplayNameValue('testId1');
        const displayNameCellValueNode2 = getDisplayNameValue('testId2');
        expect(displayNameCellValueNode1).toBe('testName1');
        expect(displayNameCellValueNode2).toBe('testName2');
    });

    it('should pad the tree according to the level of the node', () => {
        component.treeService.treeNodes = Array.from(treeNodesChildrenMockExpanded);
        fixture.detectChanges();
        const nodeLevel0Padding = getNodePadding('testId1');
        const nodeLevel0Padding2 = getNodePadding('testId2');
        const nodeLevel1Padding = getNodePadding('testId3');
        expect(nodeLevel0Padding).toEqual(nodeLevel0Padding2);
        expect(nodeLevel1Padding).toBeGreaterThan(nodeLevel0Padding);
    });

    it('should show a spinner for nodes that are loading subnodes', () => {
        component.treeService.treeNodes = Array.from(treeNodesChildrenMockExpanded);
        fixture.detectChanges();
        component.treeService.treeControl.dataNodes[0].isLoading = true;
        fixture.detectChanges();
        const nodeSpinner = getNodeSpinner('testId1');
        expect(nodeSpinner).not.toBeNull();
    });

    it('should show a spinner while the tree is loading', () => {
        fixture.detectChanges();
        component.loadingRoot$ = of(true);
        fixture.detectChanges();
        const matSpinnerElement = fixture.nativeElement.querySelector('.adf-tree-loading-spinner-container .mat-progress-spinner');
        expect(matSpinnerElement).not.toBeNull();
    });

    it('should show provided expand/collapse icons', () => {
        component.treeService.treeNodes = Array.from(treeNodesMockExpanded);
        component.expandIcon = 'folder';
        component.collapseIcon = 'chevron_left';
        component.treeService.collapseNode(component.treeService.treeNodes[0]);
        fixture.detectChanges();
        let nodeIcons: any = fixture.debugElement.queryAll(By.css('.adf-icon'));
        expect(nodeIcons[0].nativeElement.innerText).toContain('folder');
        spyOn(component.treeService.treeControl, 'isExpanded').and.returnValue(true);
        fixture.detectChanges();
        nodeIcons = fixture.debugElement.queryAll(By.css('.adf-icon'));
        expect(nodeIcons[0].nativeElement.innerText).toContain('chevron_left');
    });

    it('should emit pagination when nodes are loaded', (done) => {
        component.treeService.treeNodes = Array.from(treeNodesMockExpanded);
        component.paginationChanged.subscribe((pagination: PaginationModel) => {
            expect(pagination.skipCount).toBe(0);
            expect(pagination.maxItems).toBe(userPreferenceService.paginationSize);
            done();
        });
        component.expandCollapseNode(component.treeService.treeNodes[0]);
    });

    it('when node has more items to load loadMore node should appear', () => {
        component.treeService.treeNodes = Array.from(treeNodesMockExpanded);
        fixture.detectChanges();
        const loadMoreNode = fixture.nativeElement.querySelector('.adf-tree-load-more-row');
        expect(loadMoreNode).not.toBeNull();
    });

    it('should clear the selection and load root nodes on refresh', () => {
        const selectionSpy = spyOn(component.treeNodesSelection, 'clear');
        const getNodesSpy = spyOn(component.treeService, 'getSubNodes').and.callThrough();
        component.refreshTree(0, 25);
        expect(selectionSpy).toHaveBeenCalled();
        expect(getNodesSpy).toHaveBeenCalledWith('-root-', 0, 25);
    });

    it('should call correct server method on collapsing node', () => {
        component.refreshTree();
        fixture.detectChanges();
        const collapseSpy = spyOn(component.treeService, 'collapseNode');
        spyOn(component.treeService.treeControl, 'isExpanded').and.returnValue(true);
        getExpandCollapseBtn(component.treeService.treeNodes[0].id).dispatchEvent(new Event('click'));
        expect(collapseSpy).toHaveBeenCalledWith(component.treeService.treeNodes[0]);
    });

    it('should call correct server method on expanding node', () => {
        component.refreshTree();
        fixture.detectChanges();
        const collapseSpy = spyOn(component.treeService, 'expandNode');
        spyOn(component.treeService.treeControl, 'isExpanded').and.returnValue(false);
        getExpandCollapseBtn(component.treeService.treeNodes[0].id).dispatchEvent(new Event('click'));
        expect(collapseSpy).toHaveBeenCalledWith(component.treeService.treeNodes[0], treeNodesMockExpanded);
    });

    it('should load more subnodes and remove load more button when load more button is clicked', () => {
        component.refreshTree();
        fixture.detectChanges();
        spyOn(component.treeService, 'getSubNodes').and.returnValue(of({pagination: {}, entries: Array.from(singleNode)}));
        const loadMoreBtn = fixture.debugElement.query(By.css('.adf-tree-load-more-button adf-icon')).nativeElement;
        const appendSpy = spyOn(component.treeService, 'appendNodes').and.callThrough();
        loadMoreBtn.dispatchEvent(new Event('click'));
        fixture.whenStable();
        fixture.detectChanges();
        const loadMoreNodes = component.treeService.treeNodes.find((node: TreeNode) => node.nodeType === TreeNodeType.LoadMoreNode);
        expect(appendSpy).toHaveBeenCalledWith(component.treeService.treeNodes[0], Array.from(singleNode));
        expect(loadMoreNodes).toBeUndefined();
    });

    it('selection should be disabled by default, no checkboxes should be displayed', () => {
        component.refreshTree();
        fixture.detectChanges();
        const nodeCheckboxes = fixture.debugElement.queryAll(By.css('mat-checkbox'));
        expect(nodeCheckboxes.length).toEqual(0);
        expect(component.selectableNodes).toEqual(false);
    });

    describe('Tree nodes selection tests', () => {
        beforeEach(() => {
            component.selectableNodes = true;
        });

        it('should display checkboxes when selection is enabled', () => {
            component.refreshTree();
            fixture.detectChanges();
            const nodeCheckboxes = fixture.debugElement.queryAll(By.css('mat-checkbox'));
            const selectableNodes = component.treeService.treeNodes.filter((node: TreeNode) => node.nodeType !== TreeNodeType.LoadMoreNode);
            expect(nodeCheckboxes.length).toEqual(selectableNodes.length);
        });

        it('should update selection when leaf node is selected', () => {
            spyOn(component.treeService, 'getSubNodes').and.returnValue(of({ pagination: {}, entries: Array.from(treeNodesMock) }));
            fixture.detectChanges();
            const nodeCheckboxes = fixture.debugElement.queryAll(By.css('mat-checkbox'));
            nodeCheckboxes[0].nativeElement.dispatchEvent(new Event('change'));
            expect(component.treeNodesSelection.isSelected(component.treeService.treeNodes[0])).toBeTrue();
        });

        it('should update selection of each child node when parent node is selected and deselected', () => {
            spyOn(component.treeService, 'getSubNodes').and.returnValue(of({ pagination: {}, entries: Array.from(treeNodesChildrenMockExpanded) }));
            fixture.detectChanges();
            const nodeCheckboxes = fixture.debugElement.queryAll(By.css('mat-checkbox'));
            nodeCheckboxes[0].nativeElement.dispatchEvent(new Event('change'));
            expect(component.treeNodesSelection.isSelected(component.treeService.treeNodes[0])).toBeTrue();
            expect(component.descendantsAllSelected(component.treeService.treeNodes[0])).toBeTrue();

            //deselect
            nodeCheckboxes[0].nativeElement.dispatchEvent(new Event('change'));
            expect(component.treeNodesSelection.isSelected(component.treeService.treeNodes[0])).toBeFalse();
            expect(component.descendantsPartiallySelected(component.treeService.treeNodes[0])).toBeFalse();
        });

        it('parent node should have intermediate state when not all subnodes are selected', () => {
            spyOn(component.treeService, 'getSubNodes').and.returnValue(of({ pagination: {}, entries: Array.from(treeNodesChildrenMockExpanded) }));
            fixture.detectChanges();
            const nodeCheckboxes = fixture.debugElement.queryAll(By.css('mat-checkbox'));
            nodeCheckboxes[0].nativeElement.dispatchEvent(new Event('change'));
            nodeCheckboxes[2].nativeElement.dispatchEvent(new Event('change'));
            expect(component.descendantsPartiallySelected(component.treeService.treeNodes[0])).toBeTrue();
            expect(component.descendantsPartiallySelected(component.treeService.treeNodes[1])).toBeTrue();
        });

        it('should select loaded nodes when parent node is selected', (done) => {
            component.refreshTree();
            fixture.detectChanges();
            const nodeCheckboxes = fixture.debugElement.queryAll(By.css('mat-checkbox'));
            nodeCheckboxes[0].nativeElement.dispatchEvent(new Event('change'));
            spyOn(component.treeService, 'getSubNodes').and.returnValue(of({ pagination: {}, entries: Array.from(singleNode) }));
            component.treeNodesSelection.changed.subscribe((selectionChange: SelectionChange<TreeNode>) => {
                expect(selectionChange.added.length).toEqual(1);
                expect(selectionChange.added[0].id).toEqual(singleNode[0].id);
                expect(component.treeNodesSelection.isSelected(singleNode[0]));
                done();
            });
            component.loadMoreSubnodes(component.treeService.treeNodes.find((node: TreeNode) => node.nodeType === TreeNodeType.LoadMoreNode));
            fixture.detectChanges();
        });
    });
});
