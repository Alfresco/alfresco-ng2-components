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

import { CommentModel } from '@alfresco/adf-core';
import { EcmCompanyModel } from '../../common/models/ecm-company.model';
import { EcmUserModel } from '../../common/models/ecm-user.model';

export const fakeUser1 = {
    enabled: true,
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'fake-email@dom.com',
    emailNotificationsEnabled: true,
    company: {},
    id: 'fake-email@dom.com',
    avatarId: '123-123-123'
};

export const fakeUser2 = {
    enabled: true,
    firstName: 'some',
    lastName: 'one',
    email: 'some-one@somegroup.com',
    emailNotificationsEnabled: true,
    company: {},
    id: 'fake-email@dom.com',
    avatarId: '001-001-001'
};

export const fakeContentComments = {
    list: {
        pagination: {
            count: 4,
            hasMoreItems: false,
            totalItems: 4,
            skipCount: 0,
            maxItems: 100
        },
        entries: [{
            entry: {
                createdAt: '2018-03-27T10:55:45.725+0000',
                createdBy: fakeUser1,
                edited: false,
                modifiedAt: '2018-03-27T10:55:45.725+0000',
                canEdit: true,
                modifiedBy: fakeUser1,
                canDelete: true,
                id: '35a0cea7-b6d0-4abc-9030-f4e461dd1ac7',
                content: 'fake-message-1'
            }
        }, {
            entry: {
                createdAt: '2018-03-27T10:55:45.725+0000',
                createdBy: fakeUser2,
                edited: false,
                modifiedAt: '2018-03-27T10:55:45.725+0000',
                canEdit: true,
                modifiedBy: fakeUser2,
                canDelete: true,
                id: '35a0cea7-b6d0-4abc-9030-f4e461dd1ac7',
                content: 'fake-message-2'
            }
        }
        ]
    }
};

export const fakeContentComment = {
    entry: {
        createdAt: '2018-03-29T11:49:51.735+0000',
        createdBy: fakeUser1,
        edited: false,
        modifiedAt: '2018-03-29T11:49:51.735+0000',
        canEdit: true,
        modifiedBy: fakeUser1,
        canDelete: true,
        id: '4d07cdc5-f00c-4391-b39d-a842b12478b2',
        content: 'fake-comment-message'
    }
};

const fakeCompany: EcmCompanyModel = {
    organization: '',
    address1: '',
    address2: '',
    address3: '',
    postcode: '',
    telephone: '',
    fax: '',
    email: ''
};

const johnDoe: EcmUserModel = {
    id: '1',
    email: 'john.doe@alfresco.com',
    firstName: 'John',
    lastName: 'Doe',
    company: fakeCompany,
    enabled: true,
    isAdmin: undefined,
    avatarId: '001'
};

const janeEod: EcmUserModel = {
    id: '2',
    email: 'jane.eod@alfresco.com',
    firstName: 'Jane',
    lastName: 'Eod',
    company: fakeCompany,
    enabled: true,
    isAdmin: undefined
};

const robertSmith: EcmUserModel = {
    id: '3',
    email: 'robert.smith@alfresco.com',
    firstName: 'Robert',
    lastName: 'Smith',
    company: fakeCompany,
    enabled: true,
    isAdmin: undefined
};

export const testUser: EcmUserModel = {
    id: '44',
    email: 'test.user@hyland.com',
    firstName: 'Test',
    lastName: 'User',
    company: fakeCompany,
    enabled: true,
    isAdmin: undefined,
    avatarId: '044'
};

export const getDateXMinutesAgo = (minutes: number) => new Date(new Date().getTime() - minutes * 60000);

export const commentsNodeData: CommentModel[] = [
    {
      id: 1,
      message: `I've done this component, is it cool?`,
      created: getDateXMinutesAgo(30),
      createdBy: johnDoe,
      isSelected: false
    },
    {
      id: 2,
      message: 'Yeah',
      created: getDateXMinutesAgo(15),
      createdBy: janeEod,
      isSelected: false
    },
    {
      id: 3,
      message: '+1',
      created: getDateXMinutesAgo(12),
      createdBy: robertSmith,
      isSelected: false
    },
    {
      id: 4,
      message: 'ty',
      created: new Date(),
      createdBy: johnDoe,
      isSelected: false
    }
];

export const commentsTaskData: CommentModel[] = [
    {
      id: 1,
      message: `I've done this task, what's next?`,
      created: getDateXMinutesAgo(30),
      createdBy: johnDoe,
      isSelected: false
    },
    {
      id: 2,
      message: `I've assigned you another one 🤠`,
      created: getDateXMinutesAgo(15),
      createdBy: janeEod,
      isSelected: false
    },
    {
      id: 3,
      message: '+1',
      created: getDateXMinutesAgo(12),
      createdBy: robertSmith,
      isSelected: false
    },
    {
      id: 4,
      message: 'Cheers',
      created: new Date(),
      createdBy: johnDoe,
      isSelected: false
    }
];
