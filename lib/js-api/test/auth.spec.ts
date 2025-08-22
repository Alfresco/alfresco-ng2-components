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
import { EcmAuthMock, BpmAuthMock, NodeMock, ProfileMock } from './mockObjects';
import { NodesApi, UserProfileApi, AlfrescoApi } from '../src';
import nock from 'nock';

const NOOP = () => {
    /* empty */
};
const ECM_HOST = 'https://127.0.0.1:8080';
const BPM_HOST = 'https://127.0.0.1:9999';

describe('Auth', () => {
    describe('ECM Provider config', () => {
        let authResponseEcmMock: EcmAuthMock;
        let nodeMock: NodeMock;
        let nodesApi: NodesApi;

        beforeEach(() => {
            nock.cleanAll();
            authResponseEcmMock = new EcmAuthMock(ECM_HOST);
            nodeMock = new NodeMock(ECM_HOST);
        });

        afterEach(() => {
            authResponseEcmMock.cleanAll();
            nodeMock.cleanAll();
            nock.cleanAll();
        });

        describe('With Authentication', () => {
            let alfrescoJsApi: AlfrescoApi;

            beforeEach(() => {
                alfrescoJsApi = new AlfrescoApi({
                    hostEcm: ECM_HOST
                });

                nodesApi = new NodesApi(alfrescoJsApi);
            });

            describe('login', () => {
                it('should return the Ticket if all is ok', async () => {
                    authResponseEcmMock.get201Response();

                    const data = await alfrescoJsApi.login('admin', 'admin');
                    assert.equal(data, 'TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1');
                });

                it('should return an error if wrong credential are used 403 the login fails', async () => {
                    authResponseEcmMock.get403Response();

                    try {
                        await alfrescoJsApi.login('wrong', 'name');
                    } catch (error) {
                        assert.equal(error.status, 403);
                    }
                });
            });

            describe('isLoggedIn', () => {
                it('should return true if the api is logged in', async () => {
                    authResponseEcmMock.get201Response();

                    await alfrescoJsApi.login('admin', 'admin');
                    assert.equal(alfrescoJsApi.isLoggedIn(), true);
                });

                it('should return false if the api is logged out', async () => {
                    authResponseEcmMock.get201Response();

                    await alfrescoJsApi.login('admin', 'admin').catch(NOOP);

                    authResponseEcmMock.get204ResponseLogout();

                    await alfrescoJsApi.logout();
                    assert.equal(alfrescoJsApi.isLoggedIn(), false);
                });
            });

            describe('Events ', () => {
                it('should login  fire an event if is unauthorized  401', (done) => {
                    authResponseEcmMock.get401Response();

                    const authPromise: any = alfrescoJsApi.login('wrong', 'name');

                    authPromise.catch(NOOP);
                    authPromise.on('unauthorized', () => {
                        done();
                    });
                });

                it('should login fire success event if is all ok 201', (done) => {
                    authResponseEcmMock.get201Response();

                    const authPromise: any = alfrescoJsApi.login('admin', 'admin');

                    authPromise.catch(NOOP);
                    authPromise.on('success', () => {
                        done();
                    });
                });

                it('should login fire logout event if the logout is successfull', (done) => {
                    authResponseEcmMock.get201Response();

                    alfrescoJsApi.login('admin', 'admin');

                    authResponseEcmMock.get204ResponseLogout();

                    const authPromise: any = alfrescoJsApi.logout();

                    authPromise.catch(NOOP);
                    authPromise.on('logout', () => {
                        done();
                    });
                });
            });

            describe('With Ticket Authentication', () => {
                it('should Ticket login be validate against the server if is valid', async () => {
                    const ticket = 'TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1';

                    authResponseEcmMock.get200ValidTicket(ticket);
                    const data = await alfrescoJsApi.loginTicket(ticket, null);

                    assert.equal(alfrescoJsApi.contentAuth.authentications.basicAuth.password, ticket);
                    assert.equal(data, ticket);
                });

                it('should Ticket be present in the client', () => {
                    const api = new AlfrescoApi({
                        ticketEcm: 'TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1',
                        hostEcm: ECM_HOST
                    });

                    assert.equal('TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1', api.contentClient.authentications.basicAuth.password);
                });

                it('should Ticket login be validate against the server is NOT valid', async () => {
                    const ticket = 'TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1';

                    authResponseEcmMock.get400Response();
                    try {
                        await alfrescoJsApi.loginTicket(ticket, null);
                        assert.fail('Expected loginTicket to throw an error');
                    } catch (error) {
                        assert.equal(error.response.data.error.briefSummary, '05160045 Invalid login details.');
                    }
                });
            });

            describe('Logout Api', () => {
                beforeEach(async () => {
                    authResponseEcmMock.get201Response('TICKET_22d7a5a83d78b9cc9666ec4e412475e5455b33bd');
                    await alfrescoJsApi.login('admin', 'admin');
                });

                it('should Ticket be absent in the client and the resolve promise should be called', async () => {
                    authResponseEcmMock.get204ResponseLogout();

                    await alfrescoJsApi.logout();
                    assert.equal(alfrescoJsApi.config.ticket, undefined);
                });

                it('should Logout be rejected if the Ticket is already expired', async () => {
                    authResponseEcmMock.get404ResponseLogout();
                    try {
                        await alfrescoJsApi.logout();
                    } catch (error) {
                        assert.equal(error.response.data.error.briefSummary.toString(), 'Not Found');
                    }
                });
            });

            describe('Unauthorized', () => {
                beforeEach(async () => {
                    authResponseEcmMock.get201Response('TICKET_22d7a5a83d78b9cc9666ec4e412475e5455b33bd');

                    await alfrescoJsApi.login('admin', 'admin');
                });

                it('should 401 invalidate the ticket', async () => {
                    nodeMock.get401CreationFolder();
                    try {
                        await nodesApi.createFolder('newFolder', null, null);
                    } catch {
                        assert.equal(alfrescoJsApi.contentAuth.authentications.basicAuth.password, null);
                    }
                });

                it('should 401 invalidate the session and logout', async () => {
                    nodeMock.get401CreationFolder();
                    try {
                        await nodesApi.createFolder('newFolder', null, null);
                    } catch {
                        assert.equal(alfrescoJsApi.isLoggedIn(), false);
                    }
                });

                it('should emit an error event if a failing call is executed', (done) => {
                    alfrescoJsApi.on('error', () => {
                        done();
                    });

                    nodeMock.get401CreationFolder();

                    nodesApi.createFolder('newFolder', null, null).then(NOOP);
                });
            });
        });
    });

    describe('BPM Provider config', () => {
        let profileMock: ProfileMock;
        let authResponseBpmMock: BpmAuthMock;
        let alfrescoJsApi: AlfrescoApi;
        let profileApi: UserProfileApi;

        beforeEach(() => {
            profileMock = new ProfileMock(BPM_HOST);
            authResponseBpmMock = new BpmAuthMock(BPM_HOST);

            alfrescoJsApi = new AlfrescoApi({
                hostBpm: BPM_HOST,
                provider: 'BPM'
            });

            profileApi = new UserProfileApi(alfrescoJsApi);
        });

        describe('With Authentication', () => {
            describe('login', () => {
                it('should return the Ticket if all is ok', async () => {
                    authResponseBpmMock.get200Response();

                    const data = await alfrescoJsApi.login('admin', 'admin');
                    assert.equal(data, 'Basic YWRtaW46YWRtaW4=');
                });

                it('should return an error if wrong credential are used 401 the login fails', async () => {
                    authResponseBpmMock.get401Response();

                    try {
                        await alfrescoJsApi.login('wrong', 'name');
                    } catch (error) {
                        assert.equal(error.status, 401);
                    }
                });
            });

            describe('isLoggedIn', () => {
                it('should return true if the api is logged in', async () => {
                    authResponseBpmMock.get200Response();

                    await alfrescoJsApi.login('admin', 'admin');
                    assert.equal(alfrescoJsApi.isLoggedIn(), true);
                });

                it('should return false if the api is logged out', async () => {
                    authResponseBpmMock.get200Response();

                    await alfrescoJsApi.login('admin', 'admin');

                    authResponseBpmMock.get200ResponseLogout();

                    await alfrescoJsApi.logout();
                    assert.equal(alfrescoJsApi.isLoggedIn(), false);
                });
            });

            describe('Events ', () => {
                it('should login  fire an event if is unauthorized  401', (done) => {
                    authResponseBpmMock.get401Response();

                    const authPromise: any = alfrescoJsApi.login('wrong', 'name');

                    authPromise.catch(NOOP);

                    authPromise.on('unauthorized', () => {
                        done();
                    });
                });

                it('should the Api fire success event if is all ok 201', (done) => {
                    authResponseBpmMock.get200Response();

                    const authPromise: any = alfrescoJsApi.login('admin', 'admin');

                    authPromise.catch(NOOP);

                    authPromise.on('success', () => {
                        done();
                    });
                });

                it('should the Api fire logout event if the logout is successfull', (done) => {
                    authResponseBpmMock.get200Response();

                    alfrescoJsApi.login('admin', 'admin');

                    authResponseBpmMock.get200ResponseLogout();

                    const authPromise: any = alfrescoJsApi.logout();

                    authPromise.catch(NOOP);
                    authPromise.on('logout', () => {
                        done();
                    });
                });
            });

            describe('Unauthorized', () => {
                beforeEach((done) => {
                    authResponseBpmMock.get200Response();

                    alfrescoJsApi.login('admin', 'admin').then(() => {
                        done();
                    });
                });

                it('should 401 invalidate the ticket', async () => {
                    profileMock.get401getProfile();
                    try {
                        await profileApi.getProfile();
                        assert.fail('Expected getProfile to throw an error');
                    } catch {
                        assert.equal(alfrescoJsApi.processAuth.authentications.basicAuth.ticket, null);
                    }
                });

                it('should 401 invalidate the session and logout', async () => {
                    profileMock.get401getProfile();
                    try {
                        await profileApi.getProfile();
                        assert.fail('Expected getProfile to throw an error');
                    } catch {
                        assert.equal(alfrescoJsApi.isLoggedIn(), false);
                    }
                });
            });
        });
    });

    describe('BPM and ECM Provider config', () => {
        let authResponseEcmMock: EcmAuthMock;
        let authResponseBpmMock: BpmAuthMock;
        let alfrescoJsApi: AlfrescoApi;

        beforeEach(() => {
            authResponseEcmMock = new EcmAuthMock(ECM_HOST);
            authResponseBpmMock = new BpmAuthMock(BPM_HOST);

            authResponseEcmMock.cleanAll();
            authResponseBpmMock.cleanAll();

            alfrescoJsApi = new AlfrescoApi({
                hostEcm: ECM_HOST,
                hostBpm: BPM_HOST,
                provider: 'ALL'
            });
        });

        describe('With Authentication', () => {
            it('should Ticket be present in the client', () => {
                authResponseBpmMock.get200Response();
                authResponseEcmMock.get201Response();

                const api = new AlfrescoApi({
                    ticketEcm: 'TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1',
                    ticketBpm: 'Basic YWRtaW46YWRtaW4=',
                    hostEcm: ECM_HOST,
                    hostBpm: BPM_HOST,
                    provider: 'ALL'
                });

                assert.equal('Basic YWRtaW46YWRtaW4=', api.processClient.authentications.basicAuth.ticket);
                assert.equal('TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1', api.contentClient.authentications.basicAuth.password);
            });

            describe('login', () => {
                it('should return the Ticket if all is ok', async () => {
                    authResponseBpmMock.get200Response();
                    authResponseEcmMock.get201Response();

                    const data = await alfrescoJsApi.login('admin', 'admin');

                    assert.equal(data[0], 'TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1');
                    assert.equal(data[1], 'Basic YWRtaW46YWRtaW4=');
                });

                it('should fail if only ECM fail', async () => {
                    authResponseBpmMock.get200Response();
                    authResponseEcmMock.get401Response();

                    try {
                        await alfrescoJsApi.login('admin', 'admin');
                        assert.fail('Expected login to throw an error');
                    } catch {
                        authResponseEcmMock.cleanAll();
                    }
                });

                it('should fail if only BPM fail', async () => {
                    authResponseBpmMock.get401Response();
                    authResponseEcmMock.get201Response();

                    try {
                        await alfrescoJsApi.login('admin', 'admin');
                        assert.fail('Expected login to throw an error');
                    } catch {
                        authResponseBpmMock.cleanAll();
                    }
                });
            });

            describe('isLoggedIn', () => {
                it('should return false if the api is logged out', async () => {
                    authResponseBpmMock.get200Response();
                    authResponseEcmMock.get201Response();

                    await alfrescoJsApi.login('admin', 'admin');

                    authResponseBpmMock.get200ResponseLogout();
                    authResponseEcmMock.get204ResponseLogout();

                    await alfrescoJsApi.logout();

                    assert.equal(alfrescoJsApi.isLoggedIn(), false);
                });

                it('should return an error if wrong credential are used 401 the login fails', async () => {
                    authResponseBpmMock.get401Response();
                    authResponseEcmMock.get401Response();

                    try {
                        await alfrescoJsApi.login('wrong', 'name');
                        assert.fail('Expected login to throw an error');
                    } catch (error) {
                        assert.equal(error.status, 401);
                    }
                });
            });

            it('should return true if the api is logged in', async () => {
                authResponseBpmMock.get200Response();
                authResponseEcmMock.get201Response();

                await alfrescoJsApi.login('admin', 'admin');
                assert.equal(alfrescoJsApi.isLoggedIn(), true);
            });

            describe('Events ', () => {
                it('should login fire an event if is unauthorized  401', (done) => {
                    authResponseBpmMock.get401Response();
                    authResponseEcmMock.get401Response();

                    const authPromise: any = alfrescoJsApi.login('wrong', 'name');

                    authPromise.catch(NOOP);
                    authPromise.on('unauthorized', () => {
                        done();
                    });
                });

                it('should The Api fire success event if is all ok 201', (done) => {
                    authResponseBpmMock.get200Response();
                    authResponseEcmMock.get201Response();

                    const authPromise: any = alfrescoJsApi.login('admin', 'admin');

                    authPromise.catch(NOOP);
                    authPromise.on('success', () => {
                        done();
                    });
                });

                it('should The Api fire logout event if the logout is successful', (done) => {
                    authResponseBpmMock.get200Response();
                    authResponseEcmMock.get201Response();

                    alfrescoJsApi.login('admin', 'admin');

                    authResponseBpmMock.get200ResponseLogout();
                    authResponseEcmMock.get204ResponseLogout();

                    (alfrescoJsApi.logout() as any).on('logout', () => {
                        done();
                    });
                });
            });
        });
    });
});
