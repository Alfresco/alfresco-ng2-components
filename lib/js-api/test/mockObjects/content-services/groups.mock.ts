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

export class GroupsMock extends BaseMock {
    get200GetGroups(): void {
        nock(this.host, { encodedQueryParams: true })
            .get('/alfresco/api/-default-/public/alfresco/versions/1/groups')
            .reply(200, {
                list: {
                    pagination: {
                        count: 2,
                        hasMoreItems: true,
                        totalItems: 279,
                        skipCount: 0,
                        maxItems: 2
                    },
                    entries: [
                        {
                            entry: {
                                isRoot: true,
                                displayName: 'alfalfb',
                                id: 'GROUP_alfalfa'
                            }
                        },
                        {
                            entry: {
                                isRoot: true,
                                displayName: 'Call CenterAA',
                                id: 'GROUP_CallCenterAA'
                            }
                        }
                    ]
                }
            });
    }

    getDeleteGroupSuccessfulResponse(groupName: string): void {
        nock(this.host, { encodedQueryParams: true })
            .delete('/alfresco/api/-default-/public/alfresco/versions/1/groups/' + groupName)
            .query({ cascade: 'false' })
            .reply(200);
    }

    getDeleteMemberForGroupSuccessfulResponse(groupName: string, memberName: string): void {
        nock(this.host, { encodedQueryParams: true })
            .delete('/alfresco/api/-default-/public/alfresco/versions/1/groups/' + groupName + '/members/' + memberName)
            .reply(200);
    }

    get200CreateGroupResponse(): void {
        nock(this.host, { encodedQueryParams: true })
            .post('/alfresco/api/-default-/public/alfresco/versions/1/groups')
            .reply(200, {
                entry: {
                    isRoot: true,
                    displayName: 'SAMPLE',
                    id: 'GROUP_TEST'
                }
            });
    }

    get200GetSingleGroup(): void {
        nock(this.host, { encodedQueryParams: true })
            .get('/alfresco/api/-default-/public/alfresco/versions/1/groups/GROUP_TEST')
            .reply(200, {
                entry: {
                    isRoot: true,
                    displayName: 'SAMPLE',
                    id: 'GROUP_TEST'
                }
            });
    }

    get200UpdateGroupResponse(): void {
        nock(this.host, { encodedQueryParams: true })
            .put('/alfresco/api/-default-/public/alfresco/versions/1/groups/GROUP_TEST')
            .reply(200, {
                entry: {
                    isRoot: true,
                    displayName: 'CHANGED',
                    id: 'GROUP_TEST'
                }
            });
    }

    get200GetGroupMemberships(): void {
        nock(this.host, { encodedQueryParams: true })
            .get('/alfresco/api/-default-/public/alfresco/versions/1/groups/GROUP_TEST/members')
            .reply(200, {
                list: {
                    pagination: {
                        count: 1,
                        hasMoreItems: false,
                        totalItems: 1,
                        skipCount: 0,
                        maxItems: 100
                    },
                    entries: [
                        {
                            entry: {
                                displayName: 'SAMPLE',
                                id: 'GROUP_SUB_TEST',
                                memberType: 'GROUP'
                            }
                        }
                    ]
                }
            });
    }

    get200AddGroupMembershipResponse(): void {
        nock(this.host, { encodedQueryParams: true })
            .post('/alfresco/api/-default-/public/alfresco/versions/1/groups/GROUP_TEST/members')
            .reply(200, {
                entry: {
                    displayName: 'SAMPLE',
                    id: 'GROUP_SUB_TEST',
                    memberType: 'GROUP'
                }
            });
    }
}
