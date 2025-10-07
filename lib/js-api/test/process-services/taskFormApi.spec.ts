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

import assert from 'assert';
import { TaskFormsApi, AlfrescoApi } from '../../src';
import { BpmAuthMock, TaskFormMock } from '../mockObjects';

describe('Activiti Task Api', () => {
    let authResponseBpmMock: BpmAuthMock;
    let taskFormMock: TaskFormMock;
    let alfrescoJsApi: AlfrescoApi;
    let taskFormsApi: TaskFormsApi;

    beforeEach(async () => {
        const BPM_HOST = 'https://127.0.0.1:9999';

        authResponseBpmMock = new BpmAuthMock(BPM_HOST);
        taskFormMock = new TaskFormMock(BPM_HOST);

        authResponseBpmMock.get200Response();

        alfrescoJsApi = new AlfrescoApi({
            hostBpm: BPM_HOST,
            provider: 'BPM'
        });

        taskFormsApi = new TaskFormsApi(alfrescoJsApi);

        await alfrescoJsApi.login('admin', 'admin');
    });

    it('get Task Form variables list', async () => {
        taskFormMock.get200getTaskFormVariables();

        const taskId = '5028';
        const data = await taskFormsApi.getTaskFormVariables(taskId);

        assert.equal(data[0].id, 'initiator');
    });
    // eslint-disable-next-line
    xit('Check cookie settings', async () => {
        taskFormMock.get200getTaskFormVariables();

        const taskId = '5028';
        await taskFormsApi.getTaskFormVariables(taskId);
        assert.equal(
            (taskFormsApi.apiClient as any).authentications.cookie,
            'ACTIVITI_REMEMBER_ME=NjdOdGwvcUtFTkVEczQyMGh4WFp5QT09OmpUL1UwdFVBTC94QTJMTFFUVFgvdFE9PQ'
        );
    });
});
