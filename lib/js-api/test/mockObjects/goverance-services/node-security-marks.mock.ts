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

export class NodeSecurityMarksApiMock extends BaseMock {
    post200manageSecurityMarkOnNode(nodeId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .post('/alfresco/api/-default-/public/gs/versions/1/secured-nodes/' + nodeId + '/securing-marks')
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
                                groupId: 'securityGroupId1',
                                name: 'SecurityMarkTest1',
                                id: 'Sh1G8vTQ'
                            }
                        },
                        {
                            entry: {
                                groupId: 'securityGroupId2',
                                name: 'SecurityMarkTest2',
                                id: 'Sh1G8vTR'
                            }
                        }
                    ]
                }
            });
    }

    get200SecurityMarkOnNode(nodeId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .get('/alfresco/api/-default-/public/gs/versions/1/secured-nodes/' + nodeId + '/securing-marks')
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
                                groupId: 'securityGroupId1',
                                name: 'SecurityMarkTest1',
                                id: 'Sh1G8vTQ'
                            }
                        },
                        {
                            entry: {
                                groupId: 'securityGroupId2',
                                name: 'SecurityMarkTest2',
                                id: 'Sh1G8vTR'
                            }
                        }
                    ]
                }
            });
    }
}
