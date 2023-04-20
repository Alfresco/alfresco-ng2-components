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

import { TreeNode, TreeNodeType } from '../models/tree-node.interface';

export const treeNodesMock: TreeNode[] = [
    {
        id: 'testId1',
        nodeName: 'testName1',
        parentId: '-root-',
        level: 0,
        hasChildren: true,
        isLoading: false,
        nodeType: TreeNodeType.RegularNode
    },
    {
        id: 'testId2',
        nodeName: 'testName2',
        parentId: '-root-',
        level: 0,
        hasChildren: true,
        isLoading: false,
        nodeType: TreeNodeType.RegularNode
    }
];

export const treeNodesNoChildrenMock: TreeNode[] = [
    {
        id: 'testId1',
        nodeName: 'testName1',
        parentId: '-root-',
        level: 0,
        hasChildren: false,
        isLoading: false,
        nodeType: TreeNodeType.RegularNode
    },
    {
        id: 'testId2',
        nodeName: 'testName2',
        parentId: '-root-',
        level: 0,
        hasChildren: false,
        isLoading: false,
        nodeType: TreeNodeType.RegularNode
    }
];

export const treeNodesChildrenMock: TreeNode[] = [
    {
        id: 'testId3',
        nodeName: 'testName3',
        parentId: 'testId1',
        level: 1,
        hasChildren: true,
        isLoading: false,
        nodeType: TreeNodeType.RegularNode
    },
    {
        id: 'testId4',
        nodeName: 'testName4',
        parentId: 'testId1',
        level: 1,
        hasChildren: true,
        isLoading: false,
        nodeType: TreeNodeType.RegularNode
    }
];

export const treeNodesChildrenMockExpanded: TreeNode[] = [
    {
        id: 'testId1',
        nodeName: 'testName1',
        parentId: '-root-',
        level: 0,
        hasChildren: true,
        isLoading: false,
        nodeType: TreeNodeType.RegularNode
    },
    {
        id: 'testId3',
        nodeName: 'testName3',
        parentId: 'testId1',
        level: 1,
        hasChildren: true,
        isLoading: false,
        nodeType: TreeNodeType.RegularNode
    },
    {
        id: 'testId5',
        nodeName: 'testName5',
        parentId: 'testId3',
        level: 2,
        hasChildren: false,
        isLoading: false,
        nodeType: TreeNodeType.RegularNode
    },
    {
        id: 'testId6',
        nodeName: 'testName6',
        parentId: 'testId3',
        level: 2,
        hasChildren: false,
        isLoading: false,
        nodeType: TreeNodeType.RegularNode
    },
    {
        id: 'testId4',
        nodeName: 'testName4',
        parentId: 'testId1',
        level: 1,
        hasChildren: true,
        isLoading: false,
        nodeType: TreeNodeType.RegularNode
    },
    {
        id: 'testId2',
        nodeName: 'testName2',
        parentId: '-root-',
        level: 0,
        hasChildren: true,
        isLoading: false,
        nodeType: TreeNodeType.RegularNode
    }
];

export const treeNodesMockExpanded: TreeNode[] = [
    {
        id: 'testId1',
        nodeName: 'testName1',
        parentId: '-root-',
        level: 0,
        hasChildren: true,
        isLoading: false,
        nodeType: TreeNodeType.RegularNode
    },
    {
        id: 'testId3',
        nodeName: 'testName3',
        parentId: 'testId1',
        level: 1,
        hasChildren: true,
        isLoading: false,
        nodeType: TreeNodeType.RegularNode
    },
    {
        id: 'testId4',
        nodeName: 'testName4',
        parentId: 'testId1',
        level: 1,
        hasChildren: true,
        isLoading: false,
        nodeType: TreeNodeType.RegularNode
    },
    {
        id: 'loadMore',
        nodeName: '',
        parentId: 'testId1',
        level: 1,
        hasChildren: false,
        isLoading: false,
        nodeType: TreeNodeType.LoadMoreNode
    },
    {
        id: 'testId2',
        nodeName: 'testName2',
        parentId: '-root-',
        level: 0,
        hasChildren: true,
        isLoading: false,
        nodeType: TreeNodeType.RegularNode
    }
];

export const singleNode: TreeNode[] = [
    {
        id: 'testId10',
        nodeName: 'testName10',
        parentId: 'testId1',
        level: 1,
        hasChildren: false,
        isLoading: false,
        nodeType: TreeNodeType.RegularNode
    }
];
