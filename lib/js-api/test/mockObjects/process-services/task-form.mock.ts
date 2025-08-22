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

export class TaskFormMock extends BaseMock {
    get200getTaskFormVariables(): void {
        this.createNockWithCors()
            .get('/activiti-app/api/enterprise/task-forms/5028/variables')
            .reply(
                200,
                [{ id: 'initiator', type: 'string', value: '1001' }],
                [
                    'Server',
                    'Apache-Coyote/1.1',
                    'set-cookie',
                    'ACTIVITI_REMEMBER_ME=NjdOdGwvcUtFTkVEczQyMGh4WFp5QT09OmpUL1UwdFVBTC94QTJMTFFUVFgvdFE9PQ',
                    'X-Content-Type-Options',
                    'nosniff',
                    'X-XSS-Protection',
                    '1; mode=block',
                    'Cache-Control',
                    'no-cache, no-store, max-age=0, must-revalidate',
                    'Pragma',
                    'no-cache',
                    'Expires',
                    '0',
                    'X-Frame-Options',
                    'SAMEORIGIN',
                    'Content-Type',
                    'application/json',
                    'Transfer-Encoding',
                    'chunked',
                    'Date',
                    'Tue, 01 Nov 2016 19:43:36 GMT',
                    'Connection',
                    'close'
                ]
            );
    }
}
