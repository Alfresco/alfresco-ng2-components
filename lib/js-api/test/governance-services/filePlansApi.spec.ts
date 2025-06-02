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

import { EcmAuthMock, FilePlansMock } from '../mockObjects';
import { AlfrescoApi, FilePlanRolePaging, FilePlansApi } from '../../src';

describe('FilePlansApi', () => {
    let filePlansApiMock: FilePlansMock;
    let filePlansApi: FilePlansApi;

    beforeEach(async () => {
        const hostEcm = 'https://127.0.0.1:8080';
        const authResponseMock = new EcmAuthMock(hostEcm);
        authResponseMock.get201Response();
        filePlansApiMock = new FilePlansMock(hostEcm);
        const alfrescoApi = new AlfrescoApi({
            hostEcm
        });
        filePlansApi = new FilePlansApi(alfrescoApi);
        await alfrescoApi.login('admin', 'admin');
    });

    describe('getFilePlanRoles', () => {
        let expectedRolePaging: FilePlanRolePaging;

        beforeEach(() => {
            expectedRolePaging = {
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
        });

        it('should get file plan roles', (done) => {
            const filePlanId = 'filePlanId123';
            filePlansApiMock.get200FilePlanRoles(filePlanId);

            filePlansApi.getFilePlanRoles(filePlanId).then((rolePaging) => {
                expect(rolePaging).toEqual(expectedRolePaging);
                done();
            });
        });

        it('should get file plan roles with filtering by capability names', (done) => {
            const filePlanId = 'filePlanId123';
            filePlansApiMock.get200FilePlanRolesWithFilteringByCapabilityNames(filePlanId);

            filePlansApi
                .getFilePlanRoles(filePlanId, {
                    where: {
                        capabilityNames: ['capability1', 'capability2']
                    }
                })
                .then((rolePaging) => {
                    expect(rolePaging).toEqual(expectedRolePaging);
                    done();
                });
        });
    });
});
