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

import { EcmCompanyModel } from '../models/ecm-company.model';

export let fakeEcmCompany: EcmCompanyModel = {
    organization: 'company-fake-name',
    address1: 'fake-address-1',
    address2: 'fake-address-2',
    address3: 'fake-address-3',
    postcode: 'fAk1',
    telephone: '00000000',
    fax: '11111111',
    email: 'fakeCompany@fake.com'
};

export let fakeEcmUser = {
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

export let fakeEcmUserNoImage = {
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

export let fakeEcmEditedUser = {
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
