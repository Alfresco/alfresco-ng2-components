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

export const userAccessMock = {
    globalAccess: {
        roles: [
            'MOCK_GLOBAL_USER_ROLE'
        ]
    },
    applicationAccess: [
        {
            name: 'mockApp1',
            roles: [
                'MOCK_USER_ROLE_APP_1'
            ]
        },
        {
            name: 'mockApp2',
            roles: [
                'MOCK_USER_ROLE_APP_2'
            ]
        },
        {
            name: 'mockApp3',
            roles: [
                'MOCK_USER_ROLE_APP_3',
                'MOCK_ADMIN_ROLE_APP_3'
            ]
        }
    ]
};
