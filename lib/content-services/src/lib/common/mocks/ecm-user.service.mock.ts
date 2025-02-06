/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Person } from '@alfresco/js-api';

export const fakeEcmUser: Person = {
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
    statusUpdatedAt: new Date(),
    userStatus: 'active',
    enabled: true,
    emailNotificationsEnabled: true
};
