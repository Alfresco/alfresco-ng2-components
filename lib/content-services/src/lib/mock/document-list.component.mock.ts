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

import { Node, NodePaging, NodeEntry } from '@alfresco/js-api';

export const fakeNodeWithCreatePermission = new Node({
    isFile: false,
    createdByUser: { id: 'admin', displayName: 'Administrator' },
    modifiedAt: '2017-06-08T13:53:46.495Z',
    nodeType: 'cm:folder',
    parentId: '55052317-7e59-4058-8e07-769f41e615e1',
    createdAt: '2017-05-22T11:36:11.270Z',
    path: {
        name: '/Company Home/User Homes',
        isComplete: true,
        elements: [{
            id: '94acfc73-7014-4475-9bd9-93a2162f0f8c',
            name: 'Company Home'
        }, { id: '55052317-7e59-4058-8e07-769f41e615e1', name: 'User Homes' }]
    },
    isFolder: true,
    modifiedByUser: { id: 'Test', displayName: 'Test' },
    name: 'Test',
    id: '70e1cc6a-6918-468a-b84a-1048093b06fd',
    properties: {},
    allowableOperations: ['delete', 'update', 'create']
});

export const fakeNodeWithNoPermission = new Node({
    isFile: false,
    createdByUser: { id: 'admin', displayName: 'Administrator' },
    modifiedAt: '2017-06-08T13:53:46.495Z',
    nodeType: 'cm:folder',
    parentId: '55052317-7e59-4058-8e07-769f41e615e1',
    aspectNames: ['cm:ownable', 'cm:auditable'],
    createdAt: '2017-05-22T11:36:11.270Z',
    path: {
        name: '/Company Home/User Homes',
        isComplete: true,
        elements: [{
            id: '94acfc73-7014-4475-9bd9-93a2162f0f8c',
            name: 'Company Home'
        }, { id: '55052317-7e59-4058-8e07-769f41e615e1', name: 'User Homes' }]
    },
    isFolder: true,
    modifiedByUser: { id: 'Test', displayName: 'Test' },
    name: 'Test',
    id: '70e1cc6a-6918-468a-b84a-1048093b06fd',
    properties: {}
});

export const fakeNodeAnswerWithEntries = {
    list: {
        pagination: {
            count: 4,
            hasMoreItems: false,
            totalItems: 14,
            skipCount: 10,
            maxItems: 10
        },
        entries: [{
            entry: {
                isFile: true,
                createdByUser: { id: 'admin', displayName: 'Administrator' },
                modifiedAt: '2017-05-24T15:08:55.640Z',
                nodeType: 'cm:content',
                content: {
                    mimeType: 'application/rtf',
                    mimeTypeName: 'Rich Text Format',
                    sizeInBytes: 14530,
                    encoding: 'UTF-8'
                },
                parentId: 'd124de26-6ba0-4f40-8d98-4907da2d337a',
                createdAt: '2017-05-24T15:08:55.640Z',
                path: {
                    name: '/Company Home/Guest Home',
                    isComplete: true,
                    elements: [{
                        id: '94acfc73-7014-4475-9bd9-93a2162f0f8c',
                        name: 'Company Home'
                    }, { id: 'd124de26-6ba0-4f40-8d98-4907da2d337a', name: 'Guest Home' }]
                },
                isFolder: false,
                modifiedByUser: { id: 'admin', displayName: 'Administrator' },
                name: 'b_txt_file.rtf',
                id: '67b80f77-dbca-4f58-be6c-71b9dd61ea53',
                properties: { 'cm:versionLabel': '1.0', 'cm:versionType': 'MAJOR' },
                allowableOperations: ['delete', 'update']
            }
        }]
    }
};

export const fakeNodeAnswerWithNOEntries = {
    list: {
        pagination: {
            count: 4,
            hasMoreItems: false,
            totalItems: 14,
            skipCount: 10,
            maxItems: 10
        },
        entries: []
    }
};

export const fakeGetSitesAnswer = {
    list: {
        pagination: {
            count: 3,
            hasMoreItems: false,
            totalItems: 3,
            skipCount: 0,
            maxItems: 20
        },
        entries: [{
            entry: {
                role: 'SiteManager',
                visibility: 'PRIVATE',
                guid: 'ac65fdbe-0c79-4f67-bd6a-b89a2768561b',
                id: 'admin-site',
                preset: 'site-dashboard',
                title: 'Admin Site'
            }
        }, {
            entry: {
                role: 'SiteManager',
                visibility: 'PUBLIC',
                guid: 'b4cff62a-664d-4d45-9302-98723eac1319',
                description: 'This is a Sample Alfresco Team site.',
                id: 'swsdp',
                preset: 'site-dashboard',
                title: 'Sample: Web Site Design Project'
            }
        }, {
            entry: {
                visibility: 'PUBLIC',
                guid: 'af36cf8f-d43c-4a4b-84e6-d1b03e3a2ce5',
                id: 'test-site',
                preset: 'site-dashboard',
                title: 'Test Site'
            }
        }]
    }
};

export const fakeGetSiteMembership = {
    list: {
        pagination: {
            count: 2,
            hasMoreItems: false,
            totalItems: 2,
            skipCount: 0,
            maxItems: 20
        },
        entries: [{
            entry: {
                site: {
                    role: 'SiteManager',
                    visibility: 'PRIVATE',
                    guid: 'ac65fdbe-0c79-4f67-bd6a-b89a2768561b',
                    id: 'admin-site',
                    preset: 'site-dashboard',
                    title: 'Admin Site'
                }, role: 'SiteManager', guid: 'ac65fdbe-0c79-4f67-bd6a-b89a2768561b', id: 'admin-site'
            }
        }, {
            entry: {
                site: {
                    role: 'SiteManager',
                    visibility: 'PUBLIC',
                    guid: 'b4cff62a-664d-4d45-9302-98723eac1319',
                    description: 'This is a Sample Alfresco Team site.',
                    id: 'swsdp',
                    preset: 'site-dashboard',
                    title: 'Sample: Web Site Design Project'
                }, role: 'SiteManager', guid: 'b4cff62a-664d-4d45-9302-98723eac1319', id: 'swsdp'
            }
        }]
    }
};

export const fakeNodePaging: NodePaging = {
    list: {
        pagination: {
            count: 5,
            hasMoreItems: false,
            totalItems: 5,
            skipCount: 0,
            maxItems: 100
        }, entries: [{
            entry: fakeNodeWithNoPermission
        }, {
            entry: fakeNodeWithNoPermission
        }, {
            entry: fakeNodeWithNoPermission
        }, {
            entry: fakeNodeWithNoPermission
        }, {
            entry: fakeNodeWithNoPermission
        }]
    }
};

export const mockNode1 = new Node({
    isFile: true,
    createdByUser: { id: 'admin', displayName: 'Administrator' },
    modifiedAt: '2017-05-24T15:08:55.640Z',
    nodeType: 'cm:content',
    content: {
        mimeType: 'application/rtf',
        mimeTypeName: 'Rich Text Format',
        sizeInBytes: 14530,
        encoding: 'UTF-8'
    },
    parentId: 'd124de26-6ba0-4f40-8d98-4907da2d337a',
    createdAt: '2017-05-24T15:08:55.640Z',
    path: {
        name: '/Company Home/Guest Home',
        isComplete: true,
        elements: [{
            id: '94acfc73-7014-4475-9bd9-93a2162f0f8c',
            name: 'Company Home'
        }, { id: 'd124de26-6ba0-4f40-8d98-4907da2d337a', name: 'Guest Home' }]
    },
    isFolder: false,
    modifiedByUser: { id: 'admin', displayName: 'Administrator' },
    name: 'b_txt_file.rtf',
    id: '70e1cc6a-6918-468a-b84a-1048093b06fd',
    properties: { 'cm:versionLabel': '1.0', 'cm:versionType': 'MAJOR' },
    allowableOperations: ['delete', 'update']
});

export const mockNode2 = new Node({
    isFile: true,
    createdByUser: { id: 'admin', displayName: 'Administrator' },
    modifiedAt: '2017-05-24T15:08:55.640Z',
    nodeType: 'cm:content',
    content: {
        mimeType: 'application/rtf',
        mimeTypeName: 'Rich Text Format',
        sizeInBytes: 14530,
        encoding: 'UTF-8'
    },
    parentId: 'd124de26-6ba0-4f40-8d98-4907da2d337a',
    createdAt: '2017-05-24T15:08:55.640Z',
    path: {
        name: '/Company Home/Guest Home',
        isComplete: true,
        elements: [{
            id: '94acfc73-7014-4475-9bd9-93a2162f0f8c',
            name: 'Company Home'
        }, { id: 'd124de26-6ba0-4f40-8d98-4907da2d337a', name: 'Guest Home' }]
    },
    isFolder: false,
    modifiedByUser: { id: 'admin', displayName: 'Administrator' },
    name: 'b_txt_file.rtf',
    id: '67b80f77-dbca-4f58-be6c-71b9dd61e554',
    properties: { 'cm:versionLabel': '1.0', 'cm:versionType': 'MAJOR' },
    allowableOperations: ['delete', 'update']
});

export const mockNode3 = new Node({
    isFile: true,
    createdByUser: { id: 'admin', displayName: 'Administrator' },
    modifiedAt: '2017-05-24T15:08:55.640Z',
    nodeType: 'cm:content',
    content: {
        mimeType: 'application/rtf',
        mimeTypeName: 'Rich Text Format',
        sizeInBytes: 14530,
        encoding: 'UTF-8'
    },
    parentId: 'd124de26-6ba0-4f40-8d98-4907da2d337a',
    createdAt: '2017-05-24T15:08:55.640Z',
    path: {
        name: '/Company Home/Guest Home',
        isComplete: true,
        elements: [{
            id: '94acfc73-7014-4475-9bd9-93a2162f0f8c',
            name: 'Company Home'
        }, { id: 'd124de26-6ba0-4f40-8d98-4907da2d337a', name: 'Guest Home' }]
    },
    isFolder: false,
    modifiedByUser: { id: 'admin', displayName: 'Administrator' },
    name: 'c_txt_file.rtf',
    id: '67b80f77-dbca-4f58-be6c-71b9dd61e555',
    properties: { 'cm:versionLabel': '1.0', 'cm:versionType': 'MAJOR' },
    allowableOperations: ['delete', 'update']
});

export const mockPreselectedNodes: NodeEntry[] = [
    {
        entry: mockNode1
    },
    {
        entry: mockNode2
    }
];

export const mockNodePagingWithPreselectedNodes: NodePaging = {
    list: {
        pagination: {
            count: 5,
            hasMoreItems: false,
            totalItems: 5,
            skipCount: 0,
            maxItems: 100
        }, entries: [{
            entry: mockNode1
        }, {
            entry: mockNode2
        }, {
            entry: mockNode3
        }]
    }
};
