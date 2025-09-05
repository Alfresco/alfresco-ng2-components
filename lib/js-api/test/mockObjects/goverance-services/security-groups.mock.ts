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

import { th } from 'date-fns/locale';
import { BaseMock } from '../base.mock';
import nock from 'nock';

export class SecurityGroupApiMock extends BaseMock {
    createSecurityGroup200Response(): void {
        this.createNockWithCors()
            .post('/alfresco/api/-default-/public/gs/versions/1/security-groups')
            .reply(200, {
                entry: {
                    groupName: 'Alfresco',
                    groupType: 'HIERARCHICAL',
                    id: 'a0a7b107-84ba-4c3d-b0b7-a8509e8c1c33'
                }
            });
    }

    getSecurityGroups200Response(): void {
        this.createNockWithCors()
            .get('/alfresco/api/-default-/public/gs/versions/1/security-groups')
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
                                groupName: 'Alfresco',
                                groupType: 'HIERARCHICAL',
                                id: 'a0a7b107-84ba-4c3d-b0b7-a8509e8c1c33'
                            }
                        },
                        {
                            entry: {
                                groupName: 'Classification',
                                groupType: 'HIERARCHICAL',
                                id: 'classification'
                            }
                        }
                    ]
                }
            });
    }

    getSecurityGroupInfo200Response(securityGroupId: string): void {
        this.createNockWithCors()
            .get('/alfresco/api/-default-/public/gs/versions/1/security-groups/' + securityGroupId)
            .reply(200, {
                entry: {
                    groupName: 'Alfresco',
                    groupType: 'HIERARCHICAL',
                    id: 'a0a7b107-84ba-4c3d-b0b7-a8509e8c1c33'
                }
            });
    }

    updateSecurityGroup200Response(securityGroupId: string): void {
        this.createNockWithCors()
            .put('/alfresco/api/-default-/public/gs/versions/1/security-groups/' + securityGroupId)
            .reply(200, {
                entry: {
                    groupName: 'Nasa',
                    groupType: 'HIERARCHICAL',
                    id: 'a0a7b107-84ba-4c3d-b0b7-a8509e8c1c33'
                }
            });
    }

    deleteSecurityGroup200Response(securityGroupId: string): void {
        this.createNockWithCors()
            .delete('/alfresco/api/-default-/public/gs/versions/1/security-groups/' + securityGroupId)
            .reply(204);
    }
}
