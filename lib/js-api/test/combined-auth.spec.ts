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
import { EcmAuthMock, BpmAuthMock } from './mockObjects';
import { AlfrescoApi } from '../src';
import { describe, it, beforeEach, afterEach } from 'node:test';

/**
 * Direct unit tests for combined ECM+BPM provider error handling
 * Tests scenarios where one provider succeeds and the other fails, or both fail.
 * These tests avoid the AlfrescoApi.login() promise-chain wrapper issues.
 */
describe('Combined Auth (ECM + BPM) - Direct Error Path Tests', () => {
    const ECM_HOST = 'https://127.0.0.1:8080';
    const BPM_HOST = 'https://127.0.0.1:9999';
    let authResponseEcmMock: EcmAuthMock;
    let authResponseBpmMock: BpmAuthMock;
    let alfrescoApi: AlfrescoApi;

    beforeEach(() => {
        authResponseEcmMock = new EcmAuthMock(ECM_HOST);
        authResponseBpmMock = new BpmAuthMock(BPM_HOST);
        alfrescoApi = new AlfrescoApi({
            hostEcm: ECM_HOST,
            hostBpm: BPM_HOST,
            contextRootBpm: 'activiti-app'
        });
    });

    afterEach(async () => {
        authResponseEcmMock.cleanAll();
        authResponseBpmMock.cleanAll();
        resetGlobalMockAgent();
        alfrescoApi = null as any;
        await flushMicrotasks();
    });

    describe('login error scenarios', () => {
        it('should handle ECM failure independently from BPM', async () => {
            // ECM fails with 401
            authResponseEcmMock.get401Response();

            try {
                await alfrescoApi.contentAuth.login('wrong', 'name');
                assert.fail('Expected ECM login to fail');
            } catch (error: any) {
                assert.equal(error.status, 401);
            }

            // BPM can still succeed independently
            authResponseBpmMock.get200Response();
            const bpmTicket = await alfrescoApi.processAuth.login('admin', 'admin');
            assert.equal(bpmTicket, 'Basic YWRtaW46YWRtaW4=');
        });

        it('should handle BPM failure independently from ECM', async () => {
            // ECM succeeds
            authResponseEcmMock.get201Response();
            const ecmTicket = await alfrescoApi.contentAuth.login('admin', 'admin');
            assert.equal(ecmTicket, 'TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1');

            // BPM fails independently
            authResponseBpmMock.get401Response();
            try {
                await alfrescoApi.processAuth.login('wrong', 'name');
                assert.fail('Expected BPM login to fail');
            } catch (error: any) {
                assert.equal(error.status, 401);
            }
        });
        it('should fail if both ECM and BPM fail with 401', async () => {
            // Both fail independently with 401
            authResponseEcmMock.get401Response();
            authResponseBpmMock.get401Response();

            try {
                await alfrescoApi.contentAuth.login('wrong', 'name');
                assert.fail('Expected ECM login to fail');
            } catch (error: any) {
                assert.equal(error.status, 401);
            }

            // BPM also fails
            try {
                await alfrescoApi.processAuth.login('wrong', 'name');
                assert.fail('Expected BPM login to fail');
            } catch (error: any) {
                assert.equal(error.status, 401);
            }
        });
    });

    describe('successful login with combined providers', () => {
        it('should successfully login to both ECM and BPM when both succeed', async () => {
            authResponseEcmMock.get201Response();
            authResponseBpmMock.get200Response();

            const ecmTicket = await alfrescoApi.contentAuth.login('admin', 'admin');
            assert.equal(ecmTicket, 'TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1');

            const bpmTicket = await alfrescoApi.processAuth.login('admin', 'admin');
            assert.equal(bpmTicket, 'Basic YWRtaW46YWRtaW4=');
        });

        it('should have both tickets available after successful login', async () => {
            authResponseEcmMock.get201Response();
            authResponseBpmMock.get200Response();

            await alfrescoApi.contentAuth.login('admin', 'admin');
            await alfrescoApi.processAuth.login('admin', 'admin');

            assert.equal(alfrescoApi.contentAuth.getTicket(), 'TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1');
            assert.equal(alfrescoApi.processAuth.getTicket(), 'Basic YWRtaW46YWRtaW4=');
        });
    });
});
