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

import { BaseMock } from '../base.mock';
import nock from 'nock';
import { FilePlanRolePaging } from '@alfresco/js-api';

export class FilePlansMock extends BaseMock {
    get200FilePlanRoles(filePlanId: string): void {
        this.nock200FilePlanRoles(filePlanId).query({}).reply(200, this.mockFilePlanRolePaging());
    }

    get200FilePlanRolesWithFilteringByCapabilityNames(filePlanId: string): void {
        this.nock200FilePlanRoles(filePlanId)
            .query({
                where: "(capabilityName in ('capability1', 'capability2'))"
            })
            .reply(200, this.mockFilePlanRolePaging());
    }

    get200FilePlanRolesWithFilteringByPersonId(filePlanId: string): void {
        this.nock200FilePlanRoles(filePlanId)
            .query({
                where: "(personId='someUser')"
            })
            .reply(200, this.mockFilePlanRolePaging());
    }

    get200FilePlanRolesWithFilteringByPersonIdAndCapabilityNames(filePlanId: string): void {
        this.nock200FilePlanRoles(filePlanId)
            .query({
                where: "(personId='someUser' and capabilityName in ('capability1', 'capability2'))"
            })
            .reply(200, this.mockFilePlanRolePaging());
    }

    private nock200FilePlanRoles(filePlanId: string): nock.Interceptor {
        return this.createNockWithCors().get(`/alfresco/api/-default-/public/gs/versions/1/file-plans/${filePlanId}/roles`);
    }

    private mockFilePlanRolePaging(): FilePlanRolePaging {
        return {
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
                            displayLabel: 'Role One',
                            groupShortName: 'group short name 1',
                            name: 'role1',
                            roleGroupName: 'role group name 1',
                            capabilities: [
                                {
                                    index: 0,
                                    name: 'capability1',
                                    title: 'Capability One',
                                    group: {
                                        id: 'group1',
                                        title: 'Group One'
                                    }
                                },
                                {
                                    index: 1,
                                    name: 'capability2',
                                    title: 'Capability Two',
                                    group: {
                                        id: 'group2',
                                        title: 'Group Two'
                                    }
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            displayLabel: 'Role Two',
                            groupShortName: 'group short name 2',
                            name: 'role2',
                            roleGroupName: 'role group name 2',
                            capabilities: [
                                {
                                    index: 0,
                                    name: 'capability3',
                                    title: 'Capability Three',
                                    group: {
                                        id: 'group3',
                                        title: 'Group Three'
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        };
    }
}
