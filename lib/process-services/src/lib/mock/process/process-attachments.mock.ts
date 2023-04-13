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

export const mockProcessAttachments = {
    size: 2,
    total: 2,
    start: 0,
    data: [
        {
            id: 4001,
            name: 'Invoice01.pdf',
            created: '2017-05-12T12:50:05.522+0000',
            createdBy: {
                id: 1,
                firstName: 'Apps',
                lastName: 'Administrator',
                email: 'admin@app.activiti.com',
                company: 'Alfresco.com',
                pictureId: 3003
            },
            relatedContent: true,
            contentAvailable: true,
            link: false,
            mimeType: 'application/pdf',
            simpleType: 'pdf',
            previewStatus: 'created',
            thumbnailStatus: 'created'
        },
        {
            id: 4002,
            name: 'Invoice02.pdf',
            created: '2017-05-12T12:50:05.522+0000',
            createdBy: {
                id: 1,
                firstName: 'Apps',
                lastName: 'Administrator',
                email: 'admin@app.activiti.com',
                company: 'Alfresco.com',
                pictureId: 3003
            },
            relatedContent: true,
            contentAvailable: true,
            link: false,
            mimeType: 'application/pdf',
            simpleType: 'pdf',
            previewStatus: 'created',
            thumbnailStatus: 'created'
        }
    ]
};

export const mockEmittedProcessAttachments = [
    {
        id: 4001,
        name: 'Invoice01.pdf',
        created: '2017-05-12T12:50:05.522+0000',
        createdBy: 'Apps Administrator',
        icon: './assets/images/ft_ic_pdf.svg'
    },
    {
        id: 4002,
        name: 'Invoice02.pdf',
        created: '2017-05-12T12:50:05.522+0000',
        createdBy: 'Apps Administrator',
        icon: './assets/images/ft_ic_pdf.svg'
    }
];
