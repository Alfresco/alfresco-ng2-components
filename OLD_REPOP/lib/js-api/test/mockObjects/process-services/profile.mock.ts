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

import nock from 'nock';
import { BaseMock } from '../base.mock';

export class ProfileMock extends BaseMock {
    get200getProfile(): void {
        nock(this.host, { encodedQueryParams: true })
            .get('/activiti-app/api/enterprise/profile')
            .reply(200, {
                id: 1,
                firstName: null,
                lastName: 'Administrator',
                email: 'admin',
                externalId: null,
                company: null,
                pictureId: null,
                fullname: ' Administrator',
                password: null,
                type: 'enterprise',
                status: 'active',
                created: '2016-10-21T13:32:54.886+0000',
                lastUpdate: '2016-10-23T22:16:48.252+0000',
                tenantId: 1,
                latestSyncTimeStamp: null,
                groups: [
                    {
                        id: 1,
                        name: 'analytics-users',
                        externalId: null,
                        status: 'active',
                        tenantId: 1,
                        type: 0,
                        parentGroupId: null,
                        lastSyncTimeStamp: null,
                        userCount: null,
                        users: null,
                        capabilities: null,
                        groups: null,
                        manager: null
                    },
                    {
                        id: 2,
                        name: 'kickstart-users',
                        externalId: null,
                        status: 'active',
                        tenantId: 1,
                        type: 0,
                        parentGroupId: null,
                        lastSyncTimeStamp: null,
                        userCount: null,
                        users: null,
                        capabilities: null,
                        groups: null,
                        manager: null
                    },
                    {
                        id: 3,
                        name: 'Superusers',
                        externalId: null,
                        status: 'active',
                        tenantId: 1,
                        type: 0,
                        parentGroupId: null,
                        lastSyncTimeStamp: null,
                        userCount: null,
                        users: null,
                        capabilities: null,
                        groups: null,
                        manager: null
                    }
                ],
                capabilities: null,
                apps: [],
                primaryGroup: null,
                tenantPictureId: null,
                tenantName: 'test'
            });
    }

    get401getProfile(): void {
        nock(this.host, { encodedQueryParams: true }).get('/activiti-app/api/enterprise/profile').reply(401);
    }

    get200getProfilePicture(): void {
        nock(this.host, { encodedQueryParams: true }).get('/activiti-app/api/enterprise/profile-picture').reply(200, 'BUFFERSIZE');
    }
}
