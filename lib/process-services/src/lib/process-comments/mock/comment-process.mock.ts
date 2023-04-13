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

import { EcmUserModel } from '@alfresco/adf-core';

export const fakeUser1 = { id: 1, email: 'fake-email@dom.com', firstName: 'firstName', lastName: 'lastName' };

export const testUser: EcmUserModel = {
    id: '44',
    email: 'test.user@hyland.com',
    firstName: 'Test',
    lastName: 'User',
    company: {
        organization: '',
        address1: '',
        address2: '',
        address3: '',
        postcode: '',
        telephone: '',
        fax: '',
        email: ''
    },
    enabled: true,
    isAdmin: undefined,
    avatarId: '044'
};
