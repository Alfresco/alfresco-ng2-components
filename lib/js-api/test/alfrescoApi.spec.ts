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
import { AlfrescoApi } from '../src';
import { BpmAuthMock, EcmAuthMock, OAuthMock } from './mockObjects';
import nock from 'nock';

describe('Basic configuration test', () => {
    describe('config parameter ', () => {
        it('Should basePath have a default value', () => {
            const alfrescoJsApi = new AlfrescoApi({});

            assert.equal(alfrescoJsApi.contentClient.basePath, 'http://127.0.0.1:8080/alfresco/api/-default-/public/alfresco/versions/1');
        });

        it('should be reflected in the client', () => {
            const config = {
                hostEcm: 'https://testServer.com:1616',
                contextRoot: 'strangeContextRoot'
            };

            const alfrescoJsApi = new AlfrescoApi(config);

            assert.equal(
                alfrescoJsApi.contentClient.basePath,
                'https://testServer.com:1616/strangeContextRoot/api/-default-/public/alfresco/versions/1'
            );
        });

        it('should detect invalid ticket and unset it', (done) => {
            const hostEcm = 'https://127.0.0.1:8080';
            const authEcmMock = new EcmAuthMock(hostEcm);

            const config = {
                hostEcm,
                authType: 'BASIC',
                ticketEcm: 'wrong-ticket'
            };

            authEcmMock.get401InvalidTicket();

            const alfrescoApi = new AlfrescoApi(config);

            alfrescoApi.on('ticket_invalidated', () => {
                assert.equal(alfrescoApi.config.ticketEcm, null);
                done();
            });
        });
    });

    describe('ticket mismatch', () => {
        it('should update config ticketEcm on ticket_mismatch event', (done) => {
            // Tickets
            const mockStorageTicket = 'storage-ticket';
            const mockConfigTicket = 'config-ticket';

            // Create a mock storage
            const storageContent = { 'ticket-ECM': mockStorageTicket };
            const mockStorage = { getItem: (key: string) => storageContent[key] };

            // Initialize AlfrescoApi instance (without ticketEcm to prevent validateTicket from being called at this point)
            const alfrescoApi = new AlfrescoApi({ authType: 'BASIC' });

            // Initializes configuration and storage
            alfrescoApi.config.ticketEcm = mockConfigTicket;
            alfrescoApi.contentClient.config.ticketEcm = mockConfigTicket;
            alfrescoApi.contentClient.storage = mockStorage as any;

            // Ensure alfrescoApi and contentClient have the config ticket
            assert.equal(alfrescoApi.config.ticketEcm, mockConfigTicket);
            assert.equal(alfrescoApi.contentClient.config.ticketEcm, mockConfigTicket);

            alfrescoApi.on('ticket_mismatch', () => {
                // As the ticket mismatch event is triggered, the ticketEcm should now be the one from storage
                assert.equal(alfrescoApi.config.ticketEcm, mockStorageTicket);
                assert.equal(alfrescoApi.contentClient.config.ticketEcm, mockStorageTicket);
                done();
            });

            alfrescoApi.contentClient.getAlfTicket(undefined);
        });
    });

    describe('setconfig parameter ', () => {
        it('should be possible change the host in the client', () => {
            const config = {
                hostEcm: 'https://testServer.com:1616',
                contextRoot: 'strangeContextRoot'
            };

            const alfrescoJsApi = new AlfrescoApi(config);

            assert.equal(
                alfrescoJsApi.contentClient.basePath,
                'https://testServer.com:1616/strangeContextRoot/api/-default-/public/alfresco/versions/1'
            );

            const newConfig = {
                hostEcm: 'https://testServer.com:2616',
                contextRoot: 'strangeContextRoot'
            };

            alfrescoJsApi.setConfig(newConfig);

            assert.equal(
                alfrescoJsApi.contentClient.basePath,
                'https://testServer.com:2616/strangeContextRoot/api/-default-/public/alfresco/versions/1'
            );
        });
    });

    describe('CSRF', () => {
        it('should disableCsrf true parameter should be reflected in the clients', () => {
            const config = {
                hostEcm: 'https://testServer.com:1616',
                contextRoot: 'strangeContextRoot',
                disableCsrf: true
            };

            const alfrescoJsApi = new AlfrescoApi(config);

            assert.equal(alfrescoJsApi.contentClient.isCsrfEnabled(), false);
            assert.equal(alfrescoJsApi.processClient.isCsrfEnabled(), false);
        });

        it('should disableCsrf false parameter should be reflected in the clients', () => {
            const config = {
                hostEcm: 'https://testServer.com:1616',
                contextRoot: 'strangeContextRoot',
                disableCsrf: false
            };

            const alfrescoJsApi = new AlfrescoApi(config);

            assert.equal(alfrescoJsApi.contentClient.isCsrfEnabled(), true);
            assert.equal(alfrescoJsApi.processClient.isCsrfEnabled(), true);
        });
    });

    describe('WithCredentials', () => {
        it('should withCredentials true parameter should be reflected in the clients', () => {
            const config = {
                hostEcm: 'https://testServer.com:1616',
                contextRoot: 'strangeContextRoot',
                withCredentials: true
            };
            const alfrescoJsApi = new AlfrescoApi(config);
            assert.equal(alfrescoJsApi.contentClient.isWithCredentials(), true);
            assert.equal(alfrescoJsApi.processClient.isWithCredentials(), true);
        });

        it('should withCredentials true parameter with hostEcm should be reflected in isEcmLoggedIn', () => {
            const hostEcm = 'https://127.0.0.1:8080';
            const alfrescoJsApi = new AlfrescoApi({
                hostEcm,
                provider: 'ECM',
                withCredentials: true
            });

            assert.equal(alfrescoJsApi.isEcmLoggedIn(), true);
        });

        it('should withCredentials true parameter with hostEcm should be reflected in isLoggedIn', () => {
            const hostEcm = 'https://127.0.0.1:8080';
            const alfrescoJsApi = new AlfrescoApi({
                hostEcm,
                provider: 'ECM',
                withCredentials: true
            });

            assert.equal(alfrescoJsApi.isLoggedIn(), true);
        });

        it('should withCredentials true parameter with ALL provider should be reflected in isLoggedIn', () => {
            const hostEcm = 'https://127.0.0.1:8080';
            const alfrescoJsApi = new AlfrescoApi({
                hostEcm,
                provider: 'ALL',
                withCredentials: true
            });

            assert.equal(alfrescoJsApi.isLoggedIn(), true);
        });

        it('should withCredentials false parameter should be reflected in the clients', () => {
            const config = {
                hostEcm: 'https://testServer.com:1616',
                contextRoot: 'strangeContextRoot',
                withCredentials: false
            };
            const alfrescoJsApi = new AlfrescoApi(config);
            assert.equal(alfrescoJsApi.contentClient.isWithCredentials(), false);
            assert.equal(alfrescoJsApi.processClient.isWithCredentials(), false);
        });
    });

    describe('login', () => {
        beforeEach(() => {
            nock.cleanAll();
        });

        it('Should login be rejected if username or password are not provided', async () => {
            const hostEcm = 'https://testServer.com:1616';
            const authEcmMock = new EcmAuthMock(hostEcm); // ✅ HAS MOCK

            const config = {
                hostEcm,
                contextRoot: 'strangeContextRoot',
                withCredentials: true
            };
            const alfrescoJsApi = new AlfrescoApi(config);

            let error;
            authEcmMock.get401InvalidRequest();
            try {
                await alfrescoJsApi.login(undefined, undefined);
            } catch (e) {
                error = e.message;
            }

            assert.equal(error, 'missing username or password');

            error = undefined;

            try {
                await alfrescoJsApi.login('username', undefined);
            } catch (e) {
                error = e.message;
            }

            assert.equal(error, 'missing username or password');

            error = undefined;

            try {
                await alfrescoJsApi.login(undefined, 'password');
            } catch (e) {
                error = e.message;
            }

            assert.equal(error, 'missing username or password');

            error = undefined;

            try {
                await alfrescoJsApi.login('', '');
            } catch (e) {
                error = e.message;
            }

            assert.equal(error, 'missing username or password');

            error = undefined;

            try {
                await alfrescoJsApi.login('username', '');
            } catch (e) {
                error = e.message;
            }

            assert.equal(error, 'missing username or password');

            error = undefined;

            try {
                await alfrescoJsApi.login('', 'password');
            } catch (e) {
                error = e.message;
            }

            assert.equal(error, 'missing username or password');
        });

        it('Should logged-in be emitted when log in ECM', (done) => {
            const hostEcm = 'https://127.0.0.1:8080';

            const authEcmMock = new EcmAuthMock(hostEcm);

            const alfrescoJsApi = new AlfrescoApi({
                hostEcm,
                provider: 'ECM'
            });

            authEcmMock.get201Response();

            alfrescoJsApi.on('logged-in', () => {
                done();
            });

            alfrescoJsApi.login('admin', 'admin');
        });

        it('Should logged-in be emitted when log in BPM', (done) => {
            const hostBpm = 'https://127.0.0.1:9999';
            const authBpmMock = new BpmAuthMock(hostBpm);

            authBpmMock.get200Response();

            const alfrescoJsApi = new AlfrescoApi({
                hostBpm,
                contextRootBpm: 'activiti-app',
                provider: 'BPM'
            });

            alfrescoJsApi.on('logged-in', () => {
                done();
            });

            alfrescoJsApi.login('admin', 'admin');
        });

        it('Should logged-in be emitted when log in OAUTH', (done) => {
            const oauth2Mock = new OAuthMock('https://myOauthUrl:30081');

            oauth2Mock.get200Response();

            const alfrescoJsApi = new AlfrescoApi({
                oauth2: {
                    host: 'https://myOauthUrl:30081/auth/realms/springboot',
                    clientId: 'activiti',
                    scope: 'openid',
                    secret: '',
                    redirectUri: '/',
                    redirectUriLogout: '/logout'
                },
                authType: 'OAUTH'
            });

            alfrescoJsApi.on('logged-in', () => {
                done();
            });

            alfrescoJsApi.login('admin', 'admin');
        });

        it('Should logged-in be emitted when the ticket is in the store', (done) => {
            const hostBpm = 'https://127.0.0.1:9999';
            const authBpmMock = new BpmAuthMock(hostBpm);

            authBpmMock.get200Response();

            const alfrescoJsApi = new AlfrescoApi({
                hostBpm,
                contextRootBpm: 'activiti-app',
                provider: 'BPM'
            });

            alfrescoJsApi.login('admin', 'admin').then(() => {
                alfrescoJsApi.reply('logged-in', () => {
                    done();
                });
            });
        });
    });
});
