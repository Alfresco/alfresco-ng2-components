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
import { EcmAuthMock } from './mockObjects';
import { AlfrescoApi } from '../src';
import { describe, it, beforeEach, afterEach } from 'node:test';

/**
 * Direct unit tests for ContentAuth error handling
 * These tests exercise error paths without going through AlfrescoApi wrapper,
 * avoiding the promise-chain issues that trigger async warnings.
 *
 * Key difference: We test ContentAuth errors directly by accessing alfrescoJsApi.contentAuth
 * instead of testing through alfrescoJsApi.login(), which adds promise wrapping.
 */
describe('ContentAuth - Direct Error Path Tests', () => {
    const ECM_HOST = 'https://127.0.0.1:8080';
    let authResponseEcmMock: EcmAuthMock;
    let alfrescoApi: AlfrescoApi;

    beforeEach(() => {
        authResponseEcmMock = new EcmAuthMock(ECM_HOST);
        alfrescoApi = new AlfrescoApi({
            hostEcm: ECM_HOST
        });
    });

    afterEach(async () => {
        authResponseEcmMock.cleanAll();
        resetGlobalMockAgent();
        alfrescoApi = null as any;
        await flushMicrotasks();
    });

    describe('login error handling', () => {
        it('should return an error with status 403 when wrong credentials are used', async () => {
            authResponseEcmMock.get403Response();

            try {
                // Test ContentAuth directly, not through AlfrescoApi.login()
                await alfrescoApi.contentAuth.login('wrong', 'name');
                assert.fail('Expected login to fail with 403');
            } catch (error: any) {
                assert.equal(error.status, 403);
            }
        });

        it('should return an error with status 401 when unauthorized', async () => {
            authResponseEcmMock.get401Response();

            try {
                await alfrescoApi.contentAuth.login('wrong', 'name');
                assert.fail('Expected login to fail with 401');
            } catch (error: any) {
                assert.equal(error.status, 401);
            }
        });

        it('should capture the error message from the response', async () => {
            authResponseEcmMock.get403Response();

            try {
                await alfrescoApi.contentAuth.login('wrong', 'name');
                assert.fail('Expected login to fail');
            } catch (error: any) {
                assert.equal(error.status, 403);
                assert.ok(error.message, 'Error should have a message');
            }
        });
    });

    describe('successful login', () => {
        it('should successfully login with valid credentials', async () => {
            authResponseEcmMock.get201Response();

            const ticket = await alfrescoApi.contentAuth.login('admin', 'admin');
            assert.equal(ticket, 'TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1');
        });

        it('should set ticket after successful login', async () => {
            authResponseEcmMock.get201Response();

            await alfrescoApi.contentAuth.login('admin', 'admin');
            assert.equal(alfrescoApi.contentAuth.getTicket(), 'TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1');
        });

        it('should emit logged-in event on successful login', async () => {
            authResponseEcmMock.get201Response();

            let loggedInEventFired = false;
            alfrescoApi.contentAuth.on('logged-in', () => {
                loggedInEventFired = true;
            });

            await alfrescoApi.contentAuth.login('admin', 'admin');
            assert.equal(loggedInEventFired, true);
        });
    });
});
