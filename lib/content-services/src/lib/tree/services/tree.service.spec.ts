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

import { TreeService } from './tree.service';
import { TestBed } from '@angular/core/testing';
import { CoreTestingModule } from '@alfresco/adf-core';
import { TreeNode } from '../models/tree-node.interface';
import {
    treeNodesMock,
    treeNodesChildrenMock,
    treeNodesMockExpanded,
    treeNodesChildrenMockExpanded,
    treeNodesNoChildrenMock,
    singleNode
} from '../mock/tree-node.mock';

describe('TreeService', () => {
    let service: TreeService<TreeNode>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreTestingModule
            ]
        });
        service = TestBed.inject(TreeService);
    });

    it('should emit tree nodes when new are set', () => {
        const nodesSourceSpy = spyOn(service.treeNodesSource, 'next');
        service.treeNodes = Array.from(treeNodesMock);
        expect(nodesSourceSpy).toHaveBeenCalledWith(treeNodesMock);
    });

    it('should expand node containing children', () => {
        const treeNodesMockCopy = Array.from(treeNodesMock);
        service.treeNodes = treeNodesMockCopy;
        const nodesSourceSpy = spyOn(service.treeNodesSource, 'next');
        const treeControlExpandSpy = spyOn(service.treeControl, 'expand');
        service.expandNode(treeNodesMockCopy[0], Array.from(treeNodesChildrenMock));
        expect(nodesSourceSpy).toHaveBeenCalled();
        expect(treeControlExpandSpy).toHaveBeenCalledWith(treeNodesMockCopy[0]);
        expect(service.treeNodes.length).toEqual(treeNodesMockCopy.length);
    });

    it('should collapse node containing children', () => {
        const treeNodesMockExpandedCopy = Array.from(treeNodesMockExpanded);
        service.treeNodes = treeNodesMockExpandedCopy;
        const nodesSourceSpy = spyOn(service.treeNodesSource, 'next');
        const treeControlCollapseSpy = spyOn(service.treeControl, 'collapse');
        service.collapseNode(treeNodesMockExpandedCopy[0]);
        expect(nodesSourceSpy).toHaveBeenCalled();
        expect(treeControlCollapseSpy).toHaveBeenCalledWith(treeNodesMockExpandedCopy[0]);
        expect(service.treeNodes.length).toEqual(treeNodesMock.length);
    });

    it('should collapse node with more levels', () => {
        service.treeNodes = Array.from(treeNodesChildrenMockExpanded);
        const nodesSourceSpy = spyOn(service.treeNodesSource, 'next');
        service.collapseNode(Array.from(treeNodesChildrenMockExpanded)[0]);
        expect(nodesSourceSpy).toHaveBeenCalledOnceWith(treeNodesMock);
        expect(service.treeNodes.length).toEqual(treeNodesMock.length);
    });

    it('should not expand node without children', () => {
        service.treeNodes = Array.from(treeNodesNoChildrenMock);
        const nodesSourceSpy = spyOn(service.treeNodesSource, 'next');
        const treeControlExpandSpy = spyOn(service.treeControl, 'expand');
        service.expandNode(Array.from(treeNodesNoChildrenMock)[0], []);
        expect(nodesSourceSpy).not.toHaveBeenCalled();
        expect(treeControlExpandSpy).not.toHaveBeenCalled();
        expect(service.treeNodes.length).toEqual(treeNodesNoChildrenMock.length);
    });

    it('should not collapse node without children', () => {
        service.treeNodes = Array.from(treeNodesNoChildrenMock);
        const nodesSourceSpy = spyOn(service.treeNodesSource, 'next');
        const treeControlCollapseSpy = spyOn(service.treeControl, 'collapse');
        service.collapseNode(Array.from(treeNodesNoChildrenMock)[0]);
        expect(nodesSourceSpy).not.toHaveBeenCalled();
        expect(treeControlCollapseSpy).not.toHaveBeenCalled();
        expect(service.treeNodes.length).toEqual(treeNodesNoChildrenMock.length);
    });

    it('should not collapse node without children', () => {
        service.treeNodes = Array.from(treeNodesNoChildrenMock);
        const nodesSourceSpy = spyOn(service.treeNodesSource, 'next');
        service.collapseNode(Array.from(treeNodesNoChildrenMock)[0]);
        expect(nodesSourceSpy).not.toHaveBeenCalled();
        expect(service.treeNodes.length).toEqual(treeNodesNoChildrenMock.length);
    });

    it('should append new child node as the last child of parent node', () => {
        service.treeNodes = Array.from(treeNodesMockExpanded);
        const nodesSourceSpy = spyOn(service.treeNodesSource, 'next');
        service.appendNodes(Array.from(treeNodesMockExpanded)[0], singleNode);
        expect(nodesSourceSpy).toHaveBeenCalled();
        expect(service.treeNodes[4].id).toEqual(singleNode[0].id);
    });

    it('should return parent of given node', () => {
        service.treeNodes = treeNodesMockExpanded;
        const parentNode: TreeNode = service.getParentNode(treeNodesMockExpanded[1].parentId);
        expect(parentNode.id).toEqual(treeNodesMockExpanded[0].id);
    });

    it('should return undefined when node has no parent', () => {
        service.treeNodes = treeNodesMockExpanded;
        const parentNode: TreeNode = service.getParentNode(treeNodesMockExpanded[0].parentId);
        expect(parentNode).toBeUndefined();
    });

    it('should return true if tree is empty', () => {
        service.treeNodes = [];
        expect(service.isEmpty()).toBeTrue();
    });

    it('should return false if tree is not empty', () => {
        service.treeNodes = treeNodesMock;
        expect(service.isEmpty()).toBeFalse();
    });

    it('should be able to remove node', () => {
        service.treeNodes = Array.from(treeNodesMock);
        const removedNodeId = service.treeNodes[0].id;
        service.removeNode(service.treeNodes[0]);
        expect(service.treeNodes.length).toEqual(1);
        expect(service.treeNodes[0].id).not.toEqual(removedNodeId);
    });

    it('should return node children', () => {
        service.treeNodes = Array.from(treeNodesMockExpanded);
        const children = service.getChildren(service.treeNodes[0]);
        expect(children.length).toEqual(3);
    });

    it('should return empty array for node without children', () => {
        service.treeNodes = Array.from(treeNodesMock);
        const children = service.getChildren(service.treeNodes[0]);
        expect(children.length).toEqual(0);
    });
});
