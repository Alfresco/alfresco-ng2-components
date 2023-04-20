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

import { PersonEntry, Person, PersonPaging } from '@alfresco/js-api';

export const fakeEcmUser = {
    id: 'fake-id',
    firstName: 'fake-ecm-first-name',
    lastName: 'fake-ecm-last-name',
    description: 'i am a fake user for test',
    avatarId: 'fake-avatar-id',
    email: 'fakeEcm@ecmUser.com',
    skypeId: 'fake-skype-id',
    googleId: 'fake-googleId-id',
    instantMessageId: 'fake-instantMessageId-id',
    company: null,
    jobTitle: 'job-ecm-test',
    location: 'fake location',
    mobile: '000000000',
    telephone: '11111111',
    statusUpdatedAt: 'fake-date',
    userStatus: 'active',
    enabled: true,
    emailNotificationsEnabled: true
};

export const fakeEcmAdminUser = {
    ...fakeEcmUser,
    capabilities: {
        isAdmin: true
    }
};

export const fakeEcmUser2 = {
    id: 'another-fake-id',
    firstName: 'another-fake-first-name',
    lastName: 'another',
    displayName: 'admin.adf User',
    email: 'admin.adf@alfresco.com',
    company: null,
    enabled: true,
    emailNotificationsEnabled: true
};

export const fakeEcmUserNoImage = {
    id: 'fake-id',
    firstName: 'fake-first-name',
    lastName: 'fake-last-name',
    description: 'i am a fake user for test',
    avatarId: null,
    email: 'fakeEcm@ecmUser.com',
    skypeId: 'fake-skype-id',
    googleId: 'fake-googleId-id',
    instantMessageId: 'fake-instantMessageId-id',
    company: null,
    jobTitle: null,
    location: 'fake location',
    mobile: '000000000',
    telephone: '11111111',
    statusUpdatedAt: 'fake-date',
    userStatus: 'active',
    enabled: true,
    emailNotificationsEnabled: true
};

export const fakeEcmEditedUser = {
    id: 'fake-id',
    firstName: null,
    lastName: 'fake-last-name',
    description: 'i am a fake user for test',
    avatarId: 'fake-avatar-id',
    email: 'fakeEcm@ecmUser.com',
    skypeId: 'fake-skype-id',
    googleId: 'fake-googleId-id',
    instantMessageId: 'fake-instantMessageId-id',
    company: null,
    jobTitle: 'test job',
    location: 'fake location',
    mobile: '000000000',
    telephone: '11111111',
    statusUpdatedAt: 'fake-date',
    userStatus: 'active',
    enabled: true,
    emailNotificationsEnabled: true
};

export const fakeEcmUserList = new PersonPaging({
    list: {
        pagination: {
            count: 2,
            hasMoreItems: false,
            totalItems: 2,
            skipCount: 0,
            maxItems: 100
        },
        entries: [
            {
                entry: fakeEcmUser
            },
            {
                entry: fakeEcmUser2
            }
        ]
    }
});

export const createNewPersonMock = {
    id: 'fake-id',
    firstName: 'fake-ecm-first-name',
    lastName: 'fake-ecm-last-name',
    description: 'i am a fake user for test',
    password: 'fake-avatar-id',
    email: 'fakeEcm@ecmUser.com'
};

export const getFakeUserWithContentAdminCapability = (): PersonEntry => {
    const fakeEcmUserWithAdminCapabilities = {
        ...fakeEcmUser,
        capabilities: {
            isAdmin: true
        }
    };
    const mockPerson = new Person(fakeEcmUserWithAdminCapabilities);
    return { entry: mockPerson };
};

export const getFakeUserWithContentUserCapability = (): PersonEntry => {
    const fakeEcmUserWithAdminCapabilities = {
        ...fakeEcmUser,
        capabilities: {
            isAdmin: false
        }
    };
    const mockPerson = new Person(fakeEcmUserWithAdminCapabilities);
    return { entry: mockPerson };
};
