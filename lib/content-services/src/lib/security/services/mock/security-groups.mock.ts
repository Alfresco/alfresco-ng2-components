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

import { SecurityGroupBody, SecurityGroupPaging } from '@alfresco/js-api';

export const fakeGroupsApiResponse: SecurityGroupPaging = {
    list: {
        pagination: {
            count: 4,
            hasMoreItems: false,
            maxItems: 5,
            skipCount: 0,
            totalItems: 4
        },

        entries: [
            {
                entry: {
                    groupName: 'Classification',
                    groupType: 'HIERARCHICAL',
                    id: 'classification',
                    inUse: true,
                    systemGroup: true
                }
            },
            {
                entry: {
                    groupName: 'SG1',
                    groupType: 'USER_REQUIRES_ALL',
                    id: 'd2b11d9f-2707-439f-a7c6-e7872f395553',
                    inUse: true,
                    systemGroup: true
                }
            },
            {
                entry: {
                    groupName: 'SG2',
                    groupType: 'USER_REQUIRES_ALL',
                    id: '1b77a32d-6b8b-4a37-b195-7f2ff2fe4ed3',
                    inUse: true,
                    systemGroup: true
                }
            },
            {
                entry: {
                    groupName: 'SG3',
                    groupType: 'USER_REQUIRES_ALL',
                    id: '709791f8-22dc-428a-82dd-daf3e1aa8a60',
                    inUse: true,
                    systemGroup: true
                }
            }
        ]
    }
};

export const createNewSecurityGroupMock: SecurityGroupBody = {
    groupName: 'TestGroup',
    groupType: 'HIERARCHICAL'
};
