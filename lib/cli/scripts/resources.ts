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

/* cSpell:disable */
/* eslint-disable @typescript-eslint/naming-convention */

export const ACTIVITI_CLOUD_APPS: any = {
    SUB_PROCESS_APP: {
        name: 'subprocessapp',
        security: [
            { role: 'APPLICATION_MANAGER', groups: [], users: ['manageruser'] },
            { role: 'ACTIVITI_ADMIN', groups: [], users: ['superadminuser'] },
            { role: 'ACTIVITI_USER', groups: ['hr', 'testgroup'], users: ['hruser'] }
        ]
    },
    CANDIDATE_BASE_APP: {
        name: 'candidatebaseapp',
        security: [
            { role: 'APPLICATION_MANAGER', groups: [], users: ['manageruser'] },
            { role: 'ACTIVITI_ADMIN', groups: [], users: ['superadminuser', 'processadminuser'] },
            { role: 'ACTIVITI_USER', groups: ['hr', 'testgroup'], users: ['hruser', 'salesuser'] }
        ],
    },
    SIMPLE_APP: {
        name: 'simpleapp',
        security: [
            { role: 'APPLICATION_MANAGER', groups: [], users: ['manageruser'] },
            { role: 'ACTIVITI_ADMIN', groups: [], users: ['superadminuser', 'processadminuser'] },
            { role: 'ACTIVITI_USER', groups: ['hr', 'sales', 'testgroup'], users: ['hruser'] }
        ],
        infrastructure: { connectors: { restconnector: {} }, bridges: {} },
        enableLocalDevelopment: true
    },
    UAT_BE_DEFAULT_APP: {
        name: 'uat-be-default-app',
        security: [
            { role: 'ACTIVITI_ADMIN', groups: [], users: ['processadminuser'] },
            { role: 'ACTIVITI_USER', groups: [], users: ['hruser', 'salesuser', 'testadmin', 'testuser'] }
        ]
    }
};

export const ACTIVITI_APPS: any = {
    apps: [
        {
            name: 'e2e-Application'
        }
    ]
};

export const ACS_DEFAULT: any = {
    files: [
        {
            name: 'e2e_share_profile_pic.png',
            destination: '-my-',
            action: 'UPLOAD'
        },
        {
            name: 'e2e_share_profile_pic.jpg',
            destination: '-my-',
            action: 'UPLOAD'
        },
        {
            name: 'e2e_lock.png',
            destination: '-my-',
            action: 'LOCK'
        },
        {
            name: 'e2e_second_lock.png',
            destination: '-my-',
            action: 'LOCK'
        },
        {
            name: 'e2e_share_file.jpg',
            destination: '-my-',
            action: 'SHARE'
        },
        {
            name: 'e2e_favorite_file.jpg',
            destination: '-my-',
            action: 'FAVORITE'
        }
    ],

    e2eFolder: {
        name: 'e2e-test-data'
    }
};
