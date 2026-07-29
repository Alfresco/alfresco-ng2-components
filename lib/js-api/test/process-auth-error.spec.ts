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
import { resetGlobalMockAgent, flushMicrotasks } from './mockObjects/base.mock';
import { BpmAuthMock } from './mockObjects';
import { AlfrescoApi } from '../src';
import { describe, it, beforeEach, afterEach } from 'node:test';

/**
 * Direct unit tests for ProcessAuth error handling
 * These tests exercise error paths without going through AlfrescoApi wrapper,
 * avoiding the promise-chain issues that trigger async warnings.
 *
 * Key difference: We test ProcessAuth errors directly by accessing alfrescoJsApi.processAuth
 * instead of testing through alfrescoJsApi.login(), which adds promise wrapping.
 */
describe('ProcessAuth - Direct Error Path Tests', () => {
    const BPM_HOST = 'https://127.0.0.1:9999';
    let authResponseBpmMock: BpmAuthMock;
    let alfrescoApi: AlfrescoApi;

    beforeEach(() => {
        authResponseBpmMock = new BpmAuthMock(BPM_HOST);
        alfrescoApi = new AlfrescoApi({
            hostBpm: BPM_HOST,
            contextRootBpm: 'activiti-app'
        });
    });

    afterEach(async () => {
        authResponseBpmMock.cleanAll();
        resetGlobalMockAgent();
        alfrescoApi = null as any;
        await flushMicrotasks();
    });

    describe('login error handling', () => {
        it('should return an error with status 401 when unauthorized', async () => {
            authResponseBpmMock.get401Response();

            try {
                // Test ProcessAuth directly, not through AlfrescoApi.login()
                await alfrescoApi.processAuth.login('wrong', 'name');
                assert.fail('Expected login to fail with 401');
            } catch (error: any) {
                assert.equal(error.status, 401);
            }
        });

        it('should capture the error message from the response', async () => {
            authResponseBpmMock.get401Response();

            try {
                await alfrescoApi.processAuth.login('wrong', 'name');
                assert.fail('Expected login to fail');
            } catch (error: any) {
                assert.equal(error.status, 401);
                assert.ok(error.message, 'Error should have a message');
            }
        });
    });

    describe('successful login', () => {
        it('should successfully login with valid credentials', async () => {
            authResponseBpmMock.get200Response();

            const ticket = await alfrescoApi.processAuth.login('admin', 'admin');
            assert.equal(ticket, 'Basic YWRtaW46YWRtaW4=');
        });

        it('should set ticket after successful login', async () => {
            authResponseBpmMock.get200Response();

            await alfrescoApi.processAuth.login('admin', 'admin');
            assert.equal(alfrescoApi.processAuth.getTicket(), 'Basic YWRtaW46YWRtaW4=');
        });
    });
});
