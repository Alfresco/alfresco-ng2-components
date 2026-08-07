/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

export class ContentMock extends BaseMock {
    getProcessesAndTasksOnContentBatch200(): void {
        this.mock()
            .post('/activiti-app/api/enterprise/document-runtime')
            .reply(200, {
                size: 2,
                total: 2,
                start: 0,
                data: [
                    {
                        sourceId: 'node-1;1.0@site1',
                        processId: '42',
                        taskId: null
                    },
                    {
                        sourceId: 'node-2;1.0@site1',
                        processId: null,
                        taskId: '7'
                    }
                ]
            });
    }
}
