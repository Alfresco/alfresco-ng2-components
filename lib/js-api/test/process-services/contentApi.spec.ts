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

import assert from 'assert';
import { resetGlobalMockAgent } from '../mockObjects/base.mock';
import { BpmAuthMock, ContentMock } from '../mockObjects';
import { AlfrescoApi, ActivitiContentApi } from '../../src';
import { describe, it, beforeEach, afterEach } from 'node:test';

describe('Activiti Content Api', () => {
    let authResponseBpmMock: BpmAuthMock;
    let contentMock: ContentMock;
    let alfrescoJsApi: AlfrescoApi;
    let contentApi: ActivitiContentApi;

    const hostBpm = 'https://127.0.0.1:9999';

    beforeEach(async () => {
        authResponseBpmMock = new BpmAuthMock(hostBpm);
        contentMock = new ContentMock(hostBpm);

        authResponseBpmMock.get200Response();

        alfrescoJsApi = new AlfrescoApi({
            hostBpm,
            provider: 'BPM'
        });

        contentApi = new ActivitiContentApi(alfrescoJsApi);

        await alfrescoJsApi.login('admin', 'admin');
    });

    afterEach(() => {
        resetGlobalMockAgent();
    });

    describe('getProcessesAndTasksOnContentBatch', () => {
        it('should return related processes and tasks for the given source ids', async () => {
            contentMock.getProcessesAndTasksOnContentBatch200();

            const result = await contentApi.getProcessesAndTasksOnContentBatch(['node-1;1.0@site1', 'node-2;1.0@site1'], 'alfresco-1-repoAlfresco');

            assert.equal(result.size, 2);
            assert.equal(result.data[0].sourceId, 'node-1;1.0@site1');
            assert.equal(result.data[0].processId, '42');
            assert.equal(result.data[1].sourceId, 'node-2;1.0@site1');
        });

        it('should throw when sourceIds exceeds DOCUMENT_RUNTIME_BATCH_SIZE_LIMIT', () => {
            const oversizedIds = Array.from({ length: ActivitiContentApi.DOCUMENT_RUNTIME_BATCH_SIZE_LIMIT + 1 }, (_, i) => `node-${i}`);

            assert.throws(
                () => contentApi.getProcessesAndTasksOnContentBatch(oversizedIds, 'alfresco-1-repoAlfresco'),
                (err: Error) => {
                    assert.equal(
                        err.message,
                        `sourceIds length exceeds the maximum batch size of ${ActivitiContentApi.DOCUMENT_RUNTIME_BATCH_SIZE_LIMIT}`
                    );
                    return true;
                }
            );
        });
    });
});
