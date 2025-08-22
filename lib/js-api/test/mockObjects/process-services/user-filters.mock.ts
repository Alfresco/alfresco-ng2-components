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

export class UserFiltersMock extends BaseMock {
    get200getUserTaskFilters(): void {
        this.createNockWithCors()
            .get('/activiti-app/api/enterprise/filters/tasks')
            .query({ appId: '1' })
            .reply(200, {
                size: 4,
                total: 4,
                start: 0,
                data: [
                    {
                        id: 2,
                        name: 'Involved Tasks',
                        appId: 1,
                        recent: true,
                        icon: 'glyphicon-align-left',
                        filter: { sort: 'created-desc', name: '', state: 'open', assignment: 'involved' }
                    },
                    {
                        id: 4,
                        name: 'My Tasks',
                        appId: 1,
                        recent: false,
                        icon: 'glyphicon-inbox',
                        filter: { sort: 'created-desc', name: '', state: 'open', assignment: 'assignee' }
                    },
                    {
                        id: 1,
                        name: 'Queued Tasks',
                        appId: 1,
                        recent: false,
                        icon: 'glyphicon-record',
                        filter: { sort: 'created-desc', name: '', state: 'open', assignment: 'candidate' }
                    },
                    {
                        id: 3,
                        name: 'Completed Tasks',
                        appId: 1,
                        recent: false,
                        icon: 'glyphicon-ok-sign',
                        filter: { sort: 'created-desc', name: '', state: 'completed', assignment: 'involved' }
                    }
                ]
            });
    }
}
