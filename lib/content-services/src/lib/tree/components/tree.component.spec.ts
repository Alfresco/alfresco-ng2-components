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

import { TreeComponent } from './tree.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContextMenuDirective, UnitTestingUtils, UserPreferencesService } from '@alfresco/adf-core';
import { TreeNode, TreeNodeType } from '../models/tree-node.interface';
import { TreeResponse } from '../models/tree-response.interface';
import { singleNode, treeNodesChildrenMockExpanded, treeNodesMock, treeNodesMockExpanded, treeNodesNoChildrenMock } from '../mock/tree-node.mock';
import { of, Subject } from 'rxjs';
import { TreeService } from '../services/tree.service';
import { TreeServiceMock } from '../mock/tree-service.service.mock';
import { By } from '@angular/platform-browser';
import { SelectionChange } from '@angular/cdk/collections';
import { DebugElement } from '@angular/core';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { TranslateService } from '@ngx-translate/core';

describe('TreeComponent', () => {
    let fixture: ComponentFixture<TreeComponent<TreeNode>>;
    let component: TreeComponent<TreeNode>;
    let userPreferenceService: UserPreferencesService;
    let loader: HarnessLoader;
    let testingUtils: UnitTestingUtils;

    const composeNodeSelector = (nodeId: string) => `[data-automation-id="node_${nodeId}"]`;
    const getNode = (nodeId: string) => testingUtils.getByCSS(composeNodeSelector(nodeId));

    const clickDisplayNameElement = (nodeId: string) => testingUtils.clickByCSS(`${composeNodeSelector(nodeId)} .adf-tree-cell-value`);

    const getDisplayNameValue = (nodeId: string) => testingUtils.getInnerTextByCSS(`${composeNodeSelector(nodeId)} .adf-tree-cell-value`);

    const getNodePadding = (nodeId: string) => parseInt(getComputedStyle(getNode(nodeId).nativeElement).paddingLeft, 10);

    const getNodeSpinner = async (nodeId: string) => testingUtils.getMatProgressSpinnerWithAncestorByDataAutomationId(`node_${nodeId}`);

    const clickExpandCollapseBtn = (nodeId: string) => testingUtils.clickByCSS(`${composeNodeSelector(nodeId)} .adf-tree-expand-collapse-button`);

    const tickCheckbox = (index: number) => {
        const selector = `[data-automation-id="${index === 0 ? 'has-children-node-checkbox' : 'no-children-node-checkbox'}"]`;
        const nodeCheckboxes = testingUtils.getAllByCSS(selector);
        nodeCheckboxes[index].nativeElement.dispatchEvent(new Event('change'));
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TreeComponent],
            providers: [UserPreferencesService, { provide: TreeService, useClass: TreeServiceMock }]
        });

        fixture = TestBed.createComponent(TreeComponent);
        loader = TestbedHarnessEnvironment.loader(fixture);
        component = fixture.componentInstance;
        userPreferenceService = TestBed.inject(UserPreferencesService);
        testingUtils = new UnitTestingUtils(fixture.debugElement, loader);
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
        spyOn(component.treeService, 'getSubNodes').and.returnValue(
            of({
                pagination: { skipCount: 0, maxItems: userPreferenceService.paginationSize },
                entries: []
            })
        );
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
        const treeHeaderDisplayName = testingUtils.getByDataAutomationId('tree-header-display-name');
        expect(treeHeaderDisplayName.nativeElement.innerText.trim()).toBe('test');
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

    it('should show a spinner for nodes that are loading subnodes', async () => {
        component.treeService.treeNodes = Array.from(treeNodesChildrenMockExpanded);
        fixture.detectChanges();
        component.treeService.treeControl.dataNodes[0].isLoading = true;
        fixture.detectChanges();
        const nodeSpinner = await getNodeSpinner('testId1');
        expect(nodeSpinner).not.toBeNull();
    });

    it('should show a spinner while the tree is loading', async () => {
        fixture.detectChanges();
        component.loadingRoot$ = of(true);
        fixture.detectChanges();

        const matSpinnerElement = await testingUtils.getMatProgressSpinnerWithAncestorByCSS('.adf-tree-loading-spinner-container');
        expect(await matSpinnerElement.getMode()).toBe('indeterminate');
    });

    it('should show provided expand/collapse icons', async () => {
        component.treeService.treeNodes = Array.from(treeNodesMockExpanded);
        component.expandIcon = 'folder';
        component.collapseIcon = 'chevron_left';
        component.treeService.collapseNode(component.treeService.treeNodes[0]);
        fixture.detectChanges();
        const icon = await testingUtils.getMatIconWithAncestorByCSS('.adf-tree-expand-collapse-button');
        expect(await icon.getName()).toContain('folder');
        spyOn(component.treeService.treeControl, 'isExpanded').and.returnValue(true);
        fixture.detectChanges();
        expect(await icon.getName()).toContain('chevron_left');
    });

    it('when node has more items to load loadMore node should appear', () => {
        component.treeService.treeNodes = Array.from(treeNodesMockExpanded);
        fixture.detectChanges();
        const loadMoreNode = testingUtils.getByCSS('.adf-tree-load-more-row');
        expect(loadMoreNode).not.toBeNull();
    });

    it('should clear the selection and load root nodes on refresh', () => {
        const selectionSpy = spyOn(component.treeNodesSelection, 'clear');
        const getNodesSpy = spyOn(component.treeService, 'getSubNodes').and.callThrough();
        component.refreshTree(0, 25, 'some term');
        expect(selectionSpy).toHaveBeenCalled();
        expect(getNodesSpy).toHaveBeenCalledWith('-root-', 0, 25, 'some term');
    });

    it('should not collapse node when loading', async () => {
        component.refreshTree();
        component.treeService.treeNodes[0].isLoading = true;
        fixture.detectChanges();
        const collapseSpy = spyOn(component.treeService, 'collapseNode');
        spyOn(component.treeService.treeControl, 'isExpanded').and.returnValue(true);
        await (await (await getNodeSpinner(component.treeService.treeNodes[0].id)).host()).click();
        expect(collapseSpy).not.toHaveBeenCalled();
    });

    it('should call correct server method on collapsing node', () => {
        component.refreshTree();
        component.treeService.treeNodes[0].isLoading = false;
        fixture.detectChanges();
        component.treeService.treeControl.expand(component.treeService.treeNodes[0]);
        const collapseSpy = spyOn(component.treeService, 'collapseNode');
        spyOn(component.treeService.treeControl, 'isExpanded').and.returnValue(true);
        clickExpandCollapseBtn(component.treeService.treeNodes[0].id);
        expect(collapseSpy).toHaveBeenCalledWith(component.treeService.treeNodes[0]);
    });

    it('should not expand node when loading', async () => {
        component.refreshTree();
        component.treeService.treeNodes[0].isLoading = true;
        fixture.detectChanges();
        const expandSpy = spyOn(component.treeService, 'expandNode');
        spyOn(component.treeService.treeControl, 'isExpanded').and.returnValue(false);
        await (await (await getNodeSpinner(component.treeService.treeNodes[0].id)).host()).click();
        expect(expandSpy).not.toHaveBeenCalled();
    });

    it('should call correct server method on expanding node', () => {
        component.refreshTree();
        component.treeService.treeNodes[0].isLoading = false;
        fixture.detectChanges();
        component.treeService.treeNodes = Array.from(treeNodesMock);
        component.treeService.treeNodes[0].isLoading = false;
        fixture.detectChanges();
        const expandSpy = spyOn(component.treeService, 'expandNode');
        clickExpandCollapseBtn(component.treeService.treeNodes[0].id);
        expect(expandSpy).toHaveBeenCalledWith(component.treeService.treeNodes[0], treeNodesMockExpanded);
    });

    it('should call collapseNode on TreeService when collapsing node by clicking at node label and node has children', () => {
        component.refreshTree();
        fixture.detectChanges();
        component.treeService.treeControl.expand(component.treeService.treeNodes[0]);
        spyOn(component.treeService, 'collapseNode');
        spyOn(component.treeService.treeControl, 'isExpanded').and.returnValue(true);
        clickDisplayNameElement(component.treeService.treeNodes[0].id);
        expect(component.treeService.collapseNode).toHaveBeenCalledWith(component.treeService.treeNodes[0]);
    });

    it('should call expandNode on TreeService when expanding node by clicking at node label and node has children', () => {
        component.refreshTree();
        fixture.detectChanges();
        component.treeService.treeNodes = Array.from(treeNodesMock);
        component.treeService.treeNodes[0].isLoading = false;
        fixture.detectChanges();
        spyOn(component.treeService, 'expandNode');
        clickDisplayNameElement(component.treeService.treeNodes[0].id);
        expect(component.treeService.expandNode).toHaveBeenCalledWith(component.treeService.treeNodes[0], treeNodesMockExpanded);
    });

    it('should not call collapseNode on TreeService when collapsing node and node has not children', () => {
        spyOn(component.treeService, 'getSubNodes').and.returnValue(
            of({
                pagination: {
                    skipCount: 0,
                    maxItems: 25
                },
                entries: Array.from(treeNodesNoChildrenMock)
            })
        );
        component.refreshTree();
        fixture.detectChanges();
        spyOn(component.treeService, 'collapseNode');
        spyOn(component.treeService.treeControl, 'isExpanded').and.returnValue(true);
        clickDisplayNameElement(component.treeService.treeNodes[0].id);
        expect(component.treeService.collapseNode).not.toHaveBeenCalled();
    });

    it('should not call expandNode on TreeService when expanding node by clicking at node label and node has not children', () => {
        spyOn(component.treeService, 'getSubNodes').and.returnValue(
            of({
                pagination: {
                    skipCount: 0,
                    maxItems: 25
                },
                entries: Array.from(treeNodesNoChildrenMock)
            })
        );
        component.refreshTree();
        fixture.detectChanges();
        spyOn(component.treeService, 'expandNode');
        spyOn(component.treeService.treeControl, 'isExpanded').and.returnValue(false);
        clickDisplayNameElement(component.treeService.treeNodes[0].id);
        expect(component.treeService.expandNode).not.toHaveBeenCalled();
    });

    it('should load more subnodes and remove load more button when load more button is clicked', () => {
        component.refreshTree();
        fixture.detectChanges();
        spyOn(component.treeService, 'getSubNodes').and.returnValue(of({ pagination: {}, entries: Array.from(singleNode) }));
        const loadMoreBtn = fixture.debugElement.query(By.css('.adf-tree-load-more-button')).nativeElement;
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
        spyOn(component.treeService, 'getSubNodes').and.returnValue(
            of({
                pagination: {},
                entries: Array.from(singleNode)
            })
        );
        spyOn(component.treeService, 'appendNodes');
        fixture.debugElement.query(By.css('.adf-tree-load-more-row .adf-tree-cell-value')).nativeElement.click();
        fixture.whenStable();
        fixture.detectChanges();
        expect(component.treeService.appendNodes).toHaveBeenCalledWith(component.treeService.treeNodes[0], Array.from(singleNode));
        expect(component.treeService.treeNodes.find((node) => node.nodeType === TreeNodeType.LoadMoreNode)).toBeUndefined();
    });

    it('selection should be disabled by default, no checkboxes should be displayed', async () => {
        component.refreshTree();
        fixture.detectChanges();
        const nodeCheckboxes = await loader.getAllHarnesses(MatCheckboxHarness);

        expect(nodeCheckboxes.length).toEqual(0);
        expect(component.selectableNodes).toEqual(false);
    });

    describe('Tree nodes selection tests', () => {
        beforeEach(() => {
            component.selectableNodes = true;
        });

        it('should display checkboxes when selection is enabled', async () => {
            component.refreshTree();
            fixture.detectChanges();
            const nodeCheckboxes = await loader.getAllHarnesses(MatCheckboxHarness);
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
            tickCheckbox(1);
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

        describe('announcement', () => {
            let translateSpy: jasmine.Spy<TranslateService['instant']>;

            beforeEach(() => {
                fixture.detectChanges();
                translateSpy = spyOn(TestBed.inject(TranslateService), 'instant');
            });

            it('should use selected key when node is selected', () => {
                component.onNodeSelected(component.treeService.treeNodes[0]);
                expect(translateSpy).toHaveBeenCalledWith('ADF-TREE.ARIA.SELECTED', { name: 'testName1' });
            });

            it('should use deselected key when node is deselected', () => {
                component.treeNodesSelection.select(component.treeService.treeNodes[0]);
                component.onNodeSelected(component.treeService.treeNodes[0]);
                expect(translateSpy).toHaveBeenCalledWith('ADF-TREE.ARIA.DESELECTED', { name: 'testName1' });
            });
        });
    });

    describe('expansionModel.changed subscription', () => {
        it('should load and expand node when expansionModel fires added event', () => {
            fixture.detectChanges();
            component.treeService.treeNodes = Array.from(treeNodesMock);
            component.treeService.treeNodes[0].isLoading = false;
            const expandSpy = spyOn(component.treeService, 'expandNode');
            component.treeService.treeControl.expand(component.treeService.treeNodes[0]);
            expect(expandSpy).toHaveBeenCalledWith(component.treeService.treeNodes[0], treeNodesMockExpanded);
        });

        it('should collapse node when expansionModel fires removed event', () => {
            fixture.detectChanges();
            component.treeService.treeControl.expand(component.treeService.treeNodes[0]);
            const collapseSpy = spyOn(component.treeService, 'collapseNode');
            component.treeService.treeControl.collapse(component.treeService.treeNodes[0]);
            expect(collapseSpy).toHaveBeenCalledWith(component.treeService.treeNodes[0]);
        });

        it('should not expand node when expansionModel fires added event and node is already loading', () => {
            fixture.detectChanges();
            component.treeService.treeNodes[0].isLoading = true;
            const expandSpy = spyOn(component.treeService, 'expandNode');
            component.treeService.treeControl.expand(component.treeService.treeNodes[0]);
            expect(expandSpy).not.toHaveBeenCalled();
        });

        it('should not collapse node when expansionModel fires removed event and node is loading', () => {
            fixture.detectChanges();
            component.treeService.treeControl.expand(component.treeService.treeNodes[0]);
            component.treeService.treeNodes[0].isLoading = true;
            const collapseSpy = spyOn(component.treeService, 'collapseNode');
            component.treeService.treeControl.collapse(component.treeService.treeNodes[0]);
            expect(collapseSpy).not.toHaveBeenCalled();
        });

        it('should not load children when node is expanded but children are already loaded', () => {
            fixture.detectChanges();
            const expandSpy = spyOn(component.treeService, 'expandNode');
            component.treeService.treeControl.expand(component.treeService.treeNodes[0]);
            expect(expandSpy).not.toHaveBeenCalled();
        });

        it('should reset isLoading and collapse node when getSubNodes fails during expansion', () => {
            fixture.detectChanges();
            component.treeService.treeNodes = Array.from(treeNodesMock);
            component.treeService.treeNodes[0].isLoading = false;

            const subject = new Subject<TreeResponse<TreeNode>>();
            spyOn(component.treeService, 'getSubNodes').and.returnValue(subject.asObservable());

            component.treeService.treeControl.expand(component.treeService.treeNodes[0]);
            expect(component.treeService.treeNodes[0].isLoading).toBeTrue();

            subject.error(new Error('error'));

            expect(component.treeService.treeNodes[0].isLoading).toBeFalse();
            expect(component.treeService.treeControl.isExpanded(component.treeService.treeNodes[0])).toBeFalse();
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
                model: {
                    icon: 'label'
                },
                subject: new Subject()
            };
            contextMenuOption2 = {
                title: optionTitle2,
                model: {
                    icon: 'edit'
                },
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
            expect(contextMenu.links).toEqual([
                {
                    title: optionTitle1,
                    model: {
                        icon: 'label'
                    },
                    subject: jasmine.any(Subject)
                },
                {
                    title: optionTitle2,
                    model: {
                        icon: 'edit'
                    },
                    subject: jasmine.any(Subject)
                }
            ]);
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

        it('should display set of context menu options when tree actions button is clicked', async () => {
            component.contextMenuOptions = [contextMenuOption1, contextMenuOption2];
            fixture.detectChanges();

            const menu = await testingUtils.getMatMenuByCSS('#action_menu_right_testId1');
            await menu.open();
            expect(await menu.isOpen()).toBeTrue();
            expect(component.contextMenuOptions.length).toEqual(2);
            const menuItems = await menu.getItems();
            expect(menuItems.length).toEqual(2);
            expect(await menuItems[0].getText()).toEqual(`${contextMenuOption1.model.icon}${optionTitle1}`);
            expect(await menuItems[1].getText()).toEqual(`${contextMenuOption2.model.icon}${optionTitle2}`);
        });
    });
});
