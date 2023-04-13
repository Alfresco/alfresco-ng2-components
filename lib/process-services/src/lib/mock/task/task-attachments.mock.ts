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

export const mockTaskAttachments =  {
    size: 2,
    total: 2,
    start: 0,
    data: [
        {
            id: 8,
            name: 'fake.zip',
            created: 1494595697381,
            createdBy: { id: 2, firstName: 'user1', lastName: 'last1', email: 'user1@user.com' },
            relatedContent: true,
            contentAvailable: true,
            link: false,
            mimeType: 'application/zip',
            simpleType: 'content',
            previewStatus: 'unsupported',
            thumbnailStatus: 'unsupported'
        },
        {
            id: 9,
            name: 'fake.jpg',
            created: 1494595655381,
            createdBy: { id: 2, firstName: 'user2', lastName: 'last2', email: 'user2@user.com' },
            relatedContent: true,
            contentAvailable: true,
            link: false,
            mimeType: 'image/jpeg',
            simpleType: 'image',
            previewStatus: 'unsupported',
            thumbnailStatus: 'unsupported'
        }
    ]
};

export const mockEmittedTaskAttachments = [
    {
        id: 8,
        name: 'fake.zip',
        created: 1494595697381,
        createdBy: 'user1 last1',
        icon: './assets/images/ft_ic_archive.svg'
    },
    {
        id: 9,
        name: 'fake.jpg',
        created: 1494595655381,
        createdBy: 'user2 last2',
        icon: './assets/images/ft_ic_raster_image.svg'
    }
];
