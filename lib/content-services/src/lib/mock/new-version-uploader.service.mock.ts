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
    newVersion: {
        isFile: true,
        createdByUser: {
            id: 'hruser',
            displayName: 'hruser'
        },
        modifiedAt: '2022-05-23T14:53:16.300Z',
        nodeType: 'cm:content',
        content: {
            mimeType:
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            mimeTypeName: 'Microsoft Word 2007',
            sizeInBytes: 11887,
            encoding: 'UTF-8'
        },
        parentId: '3ee9d581-6f4c-4e94-8766-4a06f6ad82cc',
        aspectNames: [
            'rn:renditioned',
            'cm:versionable',
            'cm:titled',
            'cm:auditable',
            'cm:author',
            'cm:thumbnailModification'
        ],
        createdAt: '2022-05-23T08:32:22.613Z',
        isFolder: false,
        modifiedByUser: {
            id: 'hruser',
            displayName: 'hruser'
        },
        name: 'Test3.docx',
        id: 'bc96a05d-9575-415e-94b6-00bd9446deb0',
        properties: {
            'cm:versionType': 'MINOR',
            'cm:versionLabel': '5.1',
            'cm:author': 'Amedeo Lepore',
            'cm:lastThumbnailModification': ['doclib:1653311050056']
        },
        allowableOperations: ['delete', 'update', 'updatePermissions']
    },
    currentVersion: {
        isFile: true,
        createdByUser: {
            id: 'hruser',
            displayName: 'hruser'
        },
        modifiedAt: '2022-05-23T13:04:10.060Z',
        nodeType: 'cm:content',
        content: {
            mimeType:
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            mimeTypeName: 'Microsoft Word 2007',
            sizeInBytes: 11919,
            encoding: 'UTF-8'
        },
        parentId: '3ee9d581-6f4c-4e94-8766-4a06f6ad82cc',
        aspectNames: [
            'rn:renditioned',
            'cm:versionable',
            'cm:titled',
            'cm:auditable',
            'cm:author',
            'cm:thumbnailModification'
        ],
        createdAt: '2022-05-23T08:32:22.613Z',
        path: {
            name: '/hruser',
            isComplete: false,
            elements: [
                {
                    id: '3ee9d581-6f4c-4e94-8766-4a06f6ad82cc',
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
                    authorityId: 'hruser',
                    name: 'All',
                    accessStatus: 'ALLOWED'
                },
                {
                    authorityId: 'ROLE_OWNER',
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
        name: 'Test4.docx',
        id: 'bc96a05d-9575-415e-94b6-00bd9446deb0',
        properties: {
            'cm:versionType': 'MAJOR',
            'cm:versionLabel': '5.0',
            'cm:author': 'Amedeo Lepore',
            'cm:lastThumbnailModification': ['doclib:1653311050056']
        },
        allowableOperations: ['delete', 'update', 'updatePermissions'],
        isExternal: true
    }
};
