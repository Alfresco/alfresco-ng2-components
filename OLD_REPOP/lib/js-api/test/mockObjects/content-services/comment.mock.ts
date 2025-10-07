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

'use strict';

import nock from 'nock';
import { BaseMock } from '../base.mock';

const adminUser = {
    aspectNames: ['cm:ownable'],
    firstName: 'Administrator',
    emailNotificationsEnabled: true,
    company: {},
    id: 'admin',
    enabled: true,
    email: 'admin@alfresco.com',
    properties: {
        'cm:homeFolderProvider': 'bootstrapHomeFolderProvider',
        'cm:authorizationStatus': 'AUTHORIZED',
        'cm:homeFolder': '72866d2e-64ee-45a2-ae00-30a5ced96a41',
        'cm:name': '56f78250-37a7-4e22-b35a-64b53ae1e5ca',
        'cm:owner': { id: 'admin', displayName: 'Administrator' },
        'cm:organizationId': ''
    }
};

export class CommentMock extends BaseMock {
    post201Response(): void {
        nock(this.host, { encodedQueryParams: true })
            .post('/alfresco/api/-default-/public/alfresco/versions/1/nodes/74cd8a96-8a21-47e5-9b3b-a1b3e296787d/comments', {
                content: 'This is a comment'
            })
            .reply(201, {
                entry: {
                    createdAt: '2017-04-11T09:31:21.452+0000',
                    createdBy: adminUser,
                    edited: false,
                    modifiedAt: '2017-04-11T09:31:21.452+0000',
                    canEdit: true,
                    modifiedBy: adminUser,
                    canDelete: true,
                    id: 'c294cf79-49c1-483e-ac86-39c8fe3cce8f',
                    content: 'This is a comment'
                }
            });
    }

    get200Response(): void {
        nock(this.host, { encodedQueryParams: true })
            .get('/alfresco/api/-default-/public/alfresco/versions/1/nodes/74cd8a96-8a21-47e5-9b3b-a1b3e296787d/comments')
            .reply(200, {
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
                            entry: {
                                createdAt: '2017-04-11T09:31:21.658+0000',
                                createdBy: adminUser,
                                edited: false,
                                modifiedAt: '2017-04-11T09:31:21.658+0000',
                                canEdit: true,
                                modifiedBy: adminUser,
                                canDelete: true,
                                id: '539fc9b2-7d5b-4966-9e44-fcf433647f25',
                                content: 'This is another comment'
                            }
                        },
                        {
                            entry: {
                                createdAt: '2017-04-11T09:31:21.452+0000',
                                createdBy: adminUser,
                                edited: false,
                                modifiedAt: '2017-04-11T09:31:21.452+0000',
                                canEdit: true,
                                modifiedBy: adminUser,
                                canDelete: true,
                                id: 'c294cf79-49c1-483e-ac86-39c8fe3cce8f',
                                content: 'This is a comment'
                            }
                        }
                    ]
                }
            });
    }
}
