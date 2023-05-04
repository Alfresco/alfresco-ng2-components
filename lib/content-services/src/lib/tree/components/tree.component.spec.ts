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

import { TreeComponent } from './tree.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContextMenuDirective, CoreTestingModule, UserPreferencesService } from '@alfresco/adf-core';
import { MatTreeModule } from '@angular/material/tree';
import { TreeNode, TreeNodeType } from '../models/tree-node.interface';
import {
    singleNode,
    treeNodesChildrenMockExpanded,
    treeNodesMock,
    treeNodesMockExpanded,
    treeNodesNoChildrenMock
} from '../mock/tree-node.mock';
import { of, Subject } from 'rxjs';
import { TreeService } from '../services/tree.service';
import { TreeServiceMock } from '../mock/tree-service.service.mock';
import { By } from '@angular/platform-browser';
import { SelectionChange } from '@angular/cdk/collections';
import { DebugElement } from '@angular/core';

describe('TreeComponent', () => {
    let fixture: ComponentFixture<TreeComponent<TreeNode>>;
    let component: TreeComponent<TreeNode>;
    let userPreferenceService: UserPreferencesService;

    const composeNodeSelector = (nodeId: string) => `.mat-tree-node[data-automation-id="node_${nodeId}"]`;

    const getNode = (nodeId: string) => fixture.debugElement.query(By.css(composeNodeSelector(nodeId)));

    const getDisplayNameElement = (nodeId: string) => fixture.nativeElement.querySelector(`${composeNodeSelector(nodeId)} .adf-tree-cell-value`);

    const getDisplayNameValue = (nodeId: string) => getDisplayNameElement(nodeId).innerText.trim();

    const getNodePadding = (nodeId: string) => parseInt(getComputedStyle(getNode(nodeId).nativeElement).paddingLeft, 10);

    const getNodeSpinner = (nodeId: string) => fixture.nativeElement.querySelector(`${composeNodeSelector(nodeId)} .mat-progress-spinner`);

    const getExpandCollapseBtn = (nodeId: string) => fixture.nativeElement.querySelector(`${composeNodeSelector(nodeId)} .adf-icon`);

    const tickCheckbox = (index: number) => {
        const nodeCheckboxes = fixture.debugElement.queryAll(By.css('mat-checkbox'));
        nodeCheckboxes[index].nativeElement.dispatchEvent(new Event('change'));
    };

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

    it('should emit pagination when tree is refreshed', (done) => {
        spyOn(component.treeService, 'getSubNodes').and.returnValue(of({
            pagination: {skipCount: 0, maxItems: userPreferenceService.paginationSize}, entries: []
        }));
        component.paginationChanged.subscribe((pagination) => {
            expect(pagination.skipCount).toBe(0);
            expect(pagination.maxItems).toBe(userPreferenceService.paginationSize);
            done();
        });
        component.refreshTree();
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

    it('when node has more items to load loadMore node should appear', () => {
        component.treeService.treeNodes = Array.from(treeNodesMockExpanded);
        fixture.detectChanges();
        const loadMoreNode = fixture.nativeElement.querySelector('.adf-tree-load-more-row');
        expect(loadMoreNode).not.toBeNull();
    });

    it('should clear the selection and load root nodes on refresh', () => {
        const selectionSpy = spyOn(component.treeNodesSelection, 'clear');
        const getNodesSpy = spyOn(component.treeService, 'getSubNodes').and.callThrough();
        component.refreshTree(0, 25, 'some term');
        expect(selectionSpy).toHaveBeenCalled();
        expect(getNodesSpy).toHaveBeenCalledWith('-root-', 0, 25, 'some term');
    });

    it('should not collapse node when loading', () => {
        component.refreshTree();
        component.treeService.treeNodes[0].isLoading = true;
        fixture.detectChanges();
        const collapseSpy = spyOn(component.treeService, 'collapseNode');
        spyOn(component.treeService.treeControl, 'isExpanded').and.returnValue(true);
        getNodeSpinner(component.treeService.treeNodes[0].id).dispatchEvent(new Event('click'));
        expect(collapseSpy).not.toHaveBeenCalled();
    });

    it('should call correct server method on collapsing node', () => {
        component.refreshTree();
        component.treeService.treeNodes[0].isLoading = false;
        fixture.detectChanges();
        const collapseSpy = spyOn(component.treeService, 'collapseNode');
        spyOn(component.treeService.treeControl, 'isExpanded').and.returnValue(true);
        getExpandCollapseBtn(component.treeService.treeNodes[0].id).dispatchEvent(new Event('click'));
        expect(collapseSpy).toHaveBeenCalledWith(component.treeService.treeNodes[0]);
    });

    it('should not expand node when loading', () => {
        component.refreshTree();
        component.treeService.treeNodes[0].isLoading = true;
        fixture.detectChanges();
        const expandSpy = spyOn(component.treeService, 'expandNode');
        spyOn(component.treeService.treeControl, 'isExpanded').and.returnValue(false);
        getNodeSpinner(component.treeService.treeNodes[0].id).dispatchEvent(new Event('click'));
        expect(expandSpy).not.toHaveBeenCalled();
    });

    it('should call correct server method on expanding node', () => {
        component.refreshTree();
        component.treeService.treeNodes[0].isLoading = false;
        fixture.detectChanges();
        const collapseSpy = spyOn(component.treeService, 'expandNode');
        spyOn(component.treeService.treeControl, 'isExpanded').and.returnValue(false);
        getExpandCollapseBtn(component.treeService.treeNodes[0].id).dispatchEvent(new Event('click'));
        expect(collapseSpy).toHaveBeenCalledWith(component.treeService.treeNodes[0], treeNodesMockExpanded);
    });

    it('should call collapseNode on TreeService when collapsing node by clicking at node label and node has children', () => {
        component.refreshTree();
        fixture.detectChanges();
        spyOn(component.treeService, 'collapseNode');
        spyOn(component.treeService.treeControl, 'isExpanded').and.returnValue(true);
        getDisplayNameElement(component.treeService.treeNodes[0].id).dispatchEvent(new Event('click'));
        expect(component.treeService.collapseNode).toHaveBeenCalledWith(component.treeService.treeNodes[0]);
    });

    it('should call expandNode on TreeService when expanding node by clicking at node label and node has children', () => {
        component.refreshTree();
        fixture.detectChanges();
        spyOn(component.treeService, 'expandNode');
        spyOn(component.treeService.treeControl, 'isExpanded').and.returnValue(false);
        getDisplayNameElement(component.treeService.treeNodes[0].id).dispatchEvent(new Event('click'));
        expect(component.treeService.expandNode).toHaveBeenCalledWith(component.treeService.treeNodes[0], treeNodesMockExpanded);
    });

    it('should not call collapseNode on TreeService when collapsing node and node has not children', () => {
        spyOn(component.treeService, 'getSubNodes').and.returnValue(of({
            pagination: {
                skipCount: 0,
                maxItems: 25
            },
            entries: Array.from(treeNodesNoChildrenMock)
        }));
        component.refreshTree();
        fixture.detectChanges();
        spyOn(component.treeService, 'collapseNode');
        spyOn(component.treeService.treeControl, 'isExpanded').and.returnValue(true);
        getDisplayNameElement(component.treeService.treeNodes[0].id).dispatchEvent(new Event('click'));
        expect(component.treeService.collapseNode).not.toHaveBeenCalled();
    });

    it('should not call expandNode on TreeService when expanding node by clicking at node label and node has not children', () => {
        spyOn(component.treeService, 'getSubNodes').and.returnValue(of({
            pagination: {
                skipCount: 0,
                maxItems: 25
            },
            entries: Array.from(treeNodesNoChildrenMock)
        }));
        component.refreshTree();
        fixture.detectChanges();
        spyOn(component.treeService, 'expandNode');
        spyOn(component.treeService.treeControl, 'isExpanded').and.returnValue(false);
        getDisplayNameElement(component.treeService.treeNodes[0].id).dispatchEvent(new Event('click'));
        expect(component.treeService.expandNode).not.toHaveBeenCalled();
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

    it('should load more subnodes and remove load more button when label of load more button is clicked', () => {
        component.refreshTree();
        fixture.detectChanges();
        spyOn(component.treeService, 'getSubNodes').and.returnValue(of({
            pagination: {},
            entries: Array.from(singleNode)
        }));
        spyOn(component.treeService, 'appendNodes');
        fixture.debugElement.query(By.css('.adf-tree-load-more-row .adf-tree-cell-value')).nativeElement.click();
        fixture.whenStable();
        fixture.detectChanges();
        expect(component.treeService.appendNodes).toHaveBeenCalledWith(component.treeService.treeNodes[0], Array.from(singleNode));
        expect(component.treeService.treeNodes.find((node) => node.nodeType === TreeNodeType.LoadMoreNode))
            .toBeUndefined();
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
            tickCheckbox(0);
            expect(component.treeNodesSelection.isSelected(component.treeService.treeNodes[0])).toBeTrue();
        });

        it('should update selection of each child node when parent node is selected and deselected', () => {
            spyOn(component.treeService, 'getSubNodes').and.returnValue(of({ pagination: {}, entries: Array.from(treeNodesChildrenMockExpanded) }));
            fixture.detectChanges();
            tickCheckbox(0);
            expect(component.treeNodesSelection.isSelected(component.treeService.treeNodes[0])).toBeTrue();
            expect(component.descendantsAllSelected(component.treeService.treeNodes[0])).toBeTrue();

            tickCheckbox(0);
            expect(component.treeNodesSelection.isSelected(component.treeService.treeNodes[0])).toBeFalse();
            expect(component.descendantsPartiallySelected(component.treeService.treeNodes[0])).toBeFalse();
        });

        it('parent node should have intermediate state when not all subnodes are selected', () => {
            spyOn(component.treeService, 'getSubNodes').and.returnValue(of({ pagination: {}, entries: Array.from(treeNodesChildrenMockExpanded) }));
            fixture.detectChanges();
            tickCheckbox(0);
            tickCheckbox(2);
            expect(component.descendantsPartiallySelected(component.treeService.treeNodes[0])).toBeTrue();
            expect(component.descendantsPartiallySelected(component.treeService.treeNodes[1])).toBeTrue();
        });

        it('should select loaded nodes when parent node is selected', (done) => {
            component.refreshTree();
            fixture.detectChanges();
            tickCheckbox(0);
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

    describe('Context menu', () => {
        let contextMenu: ContextMenuDirective;
        let contextMenuOption1: any;
        let contextMenuOption2: any;
        let node: DebugElement;

        const optionTitle1 = 'option 1';
        const optionTitle2 = 'option 2';

        beforeEach(() => {
            fixture.detectChanges();
            node = getNode('testId1');
            contextMenu = node.injector.get(ContextMenuDirective);
            contextMenuOption1 = {
                title: optionTitle1,
                subject: new Subject()
            };
            contextMenuOption2 = {
                title: optionTitle2,
                subject: new Subject()
            };
        });

        it('should have assigned correct value to links property of context menu for row', () => {
            component.contextMenuOptions = [contextMenuOption1, contextMenuOption2];

            fixture.detectChanges();
            expect(contextMenu.links).toEqual(component.contextMenuOptions);
        });

        it('should have assigned default subject to each context menu option', () => {
            contextMenuOption1.subject = undefined;
            contextMenuOption2.subject = undefined;
            component.contextMenuOptions = [contextMenuOption1, contextMenuOption2];

            fixture.detectChanges();
            expect(contextMenu.links).toEqual([{
                title: optionTitle1,
                subject: jasmine.any(Subject)
            }, {
                title: optionTitle2,
                subject: jasmine.any(Subject)
            }]);
        });

        it('should have assigned false to enabled property of context menu for row by default', () => {
            expect(contextMenu.enabled).toBeFalse();
        });

        it('should have assigned true to enabled property of context menu for row if contextMenuOptions is set', () => {
            component.contextMenuOptions = [contextMenuOption1, contextMenuOption2];

            fixture.detectChanges();
            expect(contextMenu.enabled).toBeTrue();
        });

        it('should have assigned false to enabled property of context menu for row if contextMenuOptions is not set', () => {
            component.contextMenuOptions = [contextMenuOption1, contextMenuOption2];
            fixture.detectChanges();
            component.contextMenuOptions = null;

            fixture.detectChanges();
            expect(contextMenu.enabled).toBeFalse();
        });

        it('should emit contextMenuOptionSelected with correct parameters when any context menu option has been selected', () => {
            spyOn(component.contextMenuOptionSelected, 'emit');
            component.contextMenuOptions = [contextMenuOption1, contextMenuOption2];

            const option = component.contextMenuOptions[0];
            component.contextMenuOptions[0].subject.next(option);
            expect(component.contextMenuOptionSelected.emit).toHaveBeenCalledWith({
                contextMenuOption: option,
                row: undefined
            });
        });

        it('should emit contextMenuOptionSelected including row when any context menu option has been selected and contextmenu event has been triggered earlier', () => {
            spyOn(component.contextMenuOptionSelected, 'emit');
            component.contextMenuOptions = [contextMenuOption1, contextMenuOption2];
            fixture.detectChanges();
            node.nativeElement.dispatchEvent(new MouseEvent('contextmenu'));

            const option = component.contextMenuOptions[0];
            component.contextMenuOptions[0].subject.next(option);
            expect(component.contextMenuOptionSelected.emit).toHaveBeenCalledWith({
                contextMenuOption: option,
                row: treeNodesMockExpanded[0]
            });
        });
    });
});
