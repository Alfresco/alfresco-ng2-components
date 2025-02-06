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

export class CustomModelMock extends BaseMock {
    get200AllCustomModel(): void {
        nock(this.host, { encodedQueryParams: true })
            .get('/alfresco/api/-default-/private/alfresco/versions/1/cmm')
            .reply(200, {
                list: {
                    pagination: {
                        count: 0,
                        hasMoreItems: false,
                        totalItems: 0,
                        skipCount: 0,
                        maxItems: 100
                    },
                    entries: []
                }
            });
    }

    create201CustomModel(): void {
        nock(this.host, { encodedQueryParams: true })
            .post('/alfresco/api/-default-/private/alfresco/versions/1/cmm')
            .reply(201, {
                entry: {
                    author: 'Administrator',
                    name: 'testModel',
                    description: 'Test model description',
                    namespaceUri: 'https://www.alfresco.org/model/testNamespace/1.0',
                    namespacePrefix: 'test',
                    status: 'DRAFT'
                }
            });
    }

    activateCustomModel200(): void {
        nock(this.host, { encodedQueryParams: true })
            .put('/alfresco/api/-default-/private/alfresco/versions/1/cmm/testModel', { status: 'ACTIVE' })
            .query({ select: 'status' })
            .reply(200, {
                entry: {
                    author: 'Administrator',
                    name: 'testModel',
                    description: 'Test model description',
                    namespaceUri: 'https://www.alfresco.org/model/testNamespace/1.0',
                    namespacePrefix: 'test',
                    status: 'ACTIVE'
                }
            });
    }
}
