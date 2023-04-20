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

export const mockNode: any = ({
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

export const mockFile = new File(['fakefake'], 'file-fake.png', { type: 'image/png' });

export const mockNewVersionUploaderData: any = {
    action: 'upload',
    newVersion: {
        value: {
            entry: {
                isFile: true,
                createdByUser: {
                    id: 'hruser',
                    displayName: 'hruser'
                },
                modifiedAt: '2022-05-24T10:19:43.544Z',
                nodeType: 'cm:content',
                content: {
                    mimeType:
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    mimeTypeName: 'Microsoft Word 2007',
                    sizeInBytes: 11887,
                    encoding: 'UTF-8'
                },
                parentId: '422538ca-ea4b-4086-83f9-b36e4521ec7f',
                aspectNames: [
                    'rn:renditioned',
                    'cm:versionable',
                    'cm:titled',
                    'cm:auditable',
                    'cm:author',
                    'cm:thumbnailModification'
                ],
                createdAt: '2022-05-24T07:26:44.429Z',
                isFolder: false,
                modifiedByUser: {
                    id: 'hruser',
                    displayName: 'hruser'
                },
                name: 'Test3.docx',
                id: '42ddb84d-fc96-4b45-aa3c-f24ca997d602',
                properties: {
                    'cm:versionType': 'MINOR',
                    'cm:versionLabel': '1.1',
                    'cm:author': 'Amedeo Lepore',
                    'cm:lastThumbnailModification': ['doclib:1653377205499']
                },
                allowableOperations: ['delete', 'update', 'updatePermissions']
            }
        }
    },
    currentVersion: {
        isFile: true,
        createdByUser: {
            id: 'hruser',
            displayName: 'hruser'
        },
        modifiedAt: '2022-05-24T07:26:45.337Z',
        nodeType: 'cm:content',
        content: {
            mimeType:
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            mimeTypeName: 'Microsoft Word 2007',
            sizeInBytes: 11949,
            encoding: 'UTF-8'
        },
        parentId: '422538ca-ea4b-4086-83f9-b36e4521ec7f',
        aspectNames: [
            'rn:renditioned',
            'cm:versionable',
            'cm:titled',
            'cm:auditable',
            'cm:author',
            'cm:thumbnailModification'
        ],
        createdAt: '2022-05-24T07:26:44.429Z',
        path: {
            name: '/Company Home/User Homes/hruser',
            isComplete: true,
            elements: [
                {
                    id: '4e2284fd-9457-4914-a612-ea844e87f53f',
                    name: 'Company Home',
                    nodeType: 'cm:folder',
                    aspectNames: ['cm:titled', 'cm:auditable', 'app:uifacets']
                },
                {
                    id: '75a5d2d2-6edb-40b6-822e-499f5e8beffb',
                    name: 'User Homes',
                    nodeType: 'cm:folder',
                    aspectNames: ['cm:titled', 'cm:auditable', 'app:uifacets']
                },
                {
                    id: '422538ca-ea4b-4086-83f9-b36e4521ec7f',
                    name: 'hruser',
                    nodeType: 'cm:folder',
                    aspectNames: ['cm:ownable', 'cm:auditable']
                }
            ]
        },
        isFolder: false,
        permissions: {
            inherited: [
                {
                    authorityId: 'ROLE_OWNER',
                    name: 'All',
                    accessStatus: 'ALLOWED'
                },
                {
                    authorityId: 'hruser',
                    name: 'All',
                    accessStatus: 'ALLOWED'
                }
            ],
            settable: [
                'Contributor',
                'Collaborator',
                'Coordinator',
                'Editor',
                'Consumer'
            ],
            isInheritanceEnabled: true
        },
        modifiedByUser: {
            id: 'hruser',
            displayName: 'hruser'
        },
        name: 'Test2.docx',
        id: '42ddb84d-fc96-4b45-aa3c-f24ca997d602',
        properties: {
            'cm:versionType': 'MAJOR',
            'cm:versionLabel': '1.0',
            'cm:author': 'Amedeo Lepore',
            'cm:lastThumbnailModification': ['doclib:1653377205499']
        },
        allowableOperations: ['delete', 'update', 'updatePermissions'],
        isExternal: true
    }
};
